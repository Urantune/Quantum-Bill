import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '@/services/api';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'quantum_bill_user';

function normalizeUser(user) {
    if (!user) return null;
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        status: user.status,
        roles: Array.isArray(user.roles) ? user.roles : [],
        createdAt: user.createdAt,
    };
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
            try {
                setUser(normalizeUser(JSON.parse(storedUser)));
            } catch {
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    const persistUser = useCallback((nextUser) => {
        const normalized = normalizeUser(nextUser);
        setUser(normalized);
        if (normalized) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalized));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
        return normalized;
    }, []);

    const login = useCallback(async (username, password) => {
        try {
            setIsLoading(true);
            const response = await apiClient.post('/api/auth/login', { username, password });
            const loggedInUser = persistUser(response.data);
            return { success: true, user: loggedInUser };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Đăng nhập thất bại',
            };
        } finally {
            setIsLoading(false);
        }
    }, [persistUser]);

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
            const registeredUser = persistUser(response.data);
            return { success: true, user: registeredUser };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Đăng ký thất bại',
            };
        } finally {
            setIsLoading(false);
        }
    }, [persistUser]);

    const logout = useCallback(() => {
        persistUser(null);
    }, [persistUser]);

    const forgotPassword = useCallback(async () => {
        return {
            success: false,
            error: 'Chức năng quên mật khẩu chưa nằm trong scope backend hiện tại.',
        };
    }, []);

    const value = useMemo(() => ({
        user,
        token: null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
    }), [forgotPassword, isLoading, login, logout, register, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
