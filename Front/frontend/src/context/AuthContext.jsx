import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '@/services/api';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'quantum_bill_user';
const TOKEN_STORAGE_KEY = 'quantum_bill_token';

function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        const base64Url = payload.replace(/-/g, '+').replace(/_/g, '/');
        const base64 = base64Url.padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, '=');
        return JSON.parse(window.atob(base64));
    } catch {
        return null;
    }
}

function normalizeUser(user) {
    if (!user) return null;
    const username = user.username || user.sub;
    return {
        id: user.id,
        fullName: user.fullName || username,
        email: user.email,
        username,
        status: user.status || 'ACTIVE',
        roles: Array.isArray(user.roles) ? user.roles : [],
        createdAt: user.createdAt,
    };
}

function userFromAuthResponse(data) {
    if (data?.result?.token) {
        const payload = decodeToken(data.result.token);
        return {
            token: data.result.token,
            user: normalizeUser(payload),
        };
    }

    if (data?.token) {
        const payload = decodeToken(data.token);
        return {
            token: data.token,
            user: normalizeUser(payload),
        };
    }

    return {
        token: null,
        user: normalizeUser(data?.result || data),
    };
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedUser) {
            try {
                setUser(normalizeUser(JSON.parse(storedUser)));
            } catch {
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        }
        if (storedToken) {
            setToken(storedToken);
            apiClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        }
        setIsLoading(false);
    }, []);

    const persistSession = useCallback((nextUser, nextToken = null) => {
        const normalized = normalizeUser(nextUser);
        setUser(normalized);
        setToken(nextToken);

        if (normalized) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalized));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }

        if (nextToken) {
            localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
            apiClient.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
        } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            delete apiClient.defaults.headers.common.Authorization;
        }

        return normalized;
    }, []);

    const login = useCallback(async (username, password) => {
        try {
            setIsLoading(true);
            const response = await apiClient.post('/api/auth/login', { username, password });
            const { user: responseUser, token: responseToken } = userFromAuthResponse(response.data);
            if (!responseUser) {
                throw new Error('Backend không trả thông tin đăng nhập hợp lệ.');
            }
            const loggedInUser = persistSession(responseUser, responseToken);
            return { success: true, user: loggedInUser };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Đăng nhập thất bại',
            };
        } finally {
            setIsLoading(false);
        }
    }, [persistSession]);

    const register = useCallback(async (fullName, email, username, password, role) => {
        try {
            setIsLoading(true);
            const response = await apiClient.post('/api/auth/register', {
                fullName,
                email,
                username,
                password,
                role,
            });
            const { user: responseUser, token: responseToken } = userFromAuthResponse(response.data);
            if (!responseUser) {
                throw new Error('Backend không trả thông tin đăng ký hợp lệ.');
            }
            const registeredUser = persistSession(responseUser, responseToken);
            return { success: true, user: registeredUser };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Đăng ký thất bại',
            };
        } finally {
            setIsLoading(false);
        }
    }, [persistSession]);

    const logout = useCallback(() => {
        persistSession(null);
    }, [persistSession]);

    const forgotPassword = useCallback(async () => {
        return {
            success: false,
            error: 'Chức năng quên mật khẩu chưa nằm trong scope backend hiện tại.',
        };
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
    }), [forgotPassword, isLoading, login, logout, register, token, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
