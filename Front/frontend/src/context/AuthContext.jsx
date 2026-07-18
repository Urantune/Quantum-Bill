import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import apiClient from '@/services/api';

const AuthContext = createContext(null);

// Hàm giải mã JWT token ở client-side
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Failed to decode JWT token:', e);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Hàm Đăng xuất (khai báo trước useEffect để tránh lỗi Temporal Dead Zone)
    const logout = useCallback(async () => {
        try {
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                // Gọi API logout để invalidate token trên server
                await apiClient.post('/auth/logout', { token: currentToken });
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            // Luôn xóa state ở client dù API call thành hay bại
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete apiClient.defaults.headers.common['Authorization'];
        }
    }, []);

    // Khi khởi chạy, khôi phục session từ localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Gắn token vào axios defaults
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setIsLoading(false);

        // Biến quản lý hàng đợi và trạng thái làm mới token
        let isRefreshing = false;
        let failedQueue = [];

        const processQueue = (error, token = null) => {
            failedQueue.forEach((prom) => {
                if (error) {
                    prom.reject(error);
                } else {
                    prom.resolve(token);
                }
            });
            failedQueue = [];
        };

        const responseInterceptor = apiClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Nếu là lỗi 401 (Unauthorized) và request chưa được thử lại
                if (error.response?.status === 401 && !originalRequest._retry) {
                    // Tránh vòng lặp vô hạn khi chính request refresh token hoặc login bị 401
                    if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
                        return Promise.reject(error);
                    }

                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                            .then((token) => {
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                                return apiClient(originalRequest);
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    const currentToken = localStorage.getItem('token');
                    if (!currentToken) {
                        isRefreshing = false;
                        return Promise.reject(error);
                    }

                    return new Promise((resolve, reject) => {
                        // Gọi axios trực tiếp đến endpoint refresh để bỏ qua interceptor
                        axios.post('/api/auth/refresh', { token: currentToken })
                            .then((res) => {
                                const authResult = res.data.result;
                                if (authResult && authResult.token) {
                                    const newToken = authResult.token;

                                    // Cập nhật token trong localStorage và State
                                    localStorage.setItem('token', newToken);
                                    setToken(newToken);

                                    // Cập nhật Authorization header cho các request tương lai và hiện tại
                                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                                    processQueue(null, newToken);
                                    resolve(apiClient(originalRequest));
                                } else {
                                    throw new Error('Mã xác thực mới không hợp lệ');
                                }
                            })
                            .catch((err) => {
                                processQueue(err, null);
                                // Âm thầm đăng xuất khi refresh token thất bại hoàn toàn
                                logout();
                                reject(err);
                            })
                            .finally(() => {
                                isRefreshing = false;
                            });
                    });
                }

                // Chuyển đổi lỗi axios thông thường sang Error có message rõ ràng để hiển thị
                const message = error.response?.data?.message || error.message || 'Đã xảy ra lỗi không xác định';
                return Promise.reject(new Error(message));
            }
        );

        // Hủy đăng ký interceptor khi Provider unmount
        return () => {
            apiClient.interceptors.response.eject(responseInterceptor);
        };
    }, [logout]);

    // Hàm Đăng nhập
    const login = async (username, password) => {
        try {
            setIsLoading(true);
            const response = await apiClient.post('/auth/login', { username, password });

            // Format trả về của Spring Boot: ApiResponse<AuthenticationResponse>
            const authResult = response.data.result;
            if (authResult && authResult.token) {
                const jwtToken = authResult.token;
                const payload = decodeToken(jwtToken);

                if (payload) {
                    const authenticatedUser = {
                        id: payload.id,
                        username: payload.sub,
                        roles: payload.roles || [],
                        fullName: payload.sub, // Fallback do JWT không chứa fullName
                    };

                    setToken(jwtToken);
                    setUser(authenticatedUser);

                    localStorage.setItem('token', jwtToken);
                    localStorage.setItem('user', JSON.stringify(authenticatedUser));

                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
                    return { success: true };
                }
            }
            throw new Error('Mã xác thực không hợp lệ');
        } catch (error) {
            console.error('Login error:', error);
            const errMsg = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
            return { success: false, error: errMsg };
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm Đăng ký
    const register = async (fullName, email, username, password, role) => {
        try {
            setIsLoading(true);
            // API: /auth/register
            await apiClient.post('/auth/register', {
                fullName,
                email,
                username,
                password,
                role,
            });

            // Sau khi đăng ký thành công, thực hiện tự động đăng nhập
            return await login(username, password);
        } catch (error) {
            console.error('Register error:', error);
            const errMsg = error.response?.data?.message || error.message || 'Đăng ký thất bại';
            return { success: false, error: errMsg };
        } finally {
            setIsLoading(false);
        }
    };



    // Hàm Quên mật khẩu
    const forgotPassword = async (email) => {
        try {
            setIsLoading(true);
            await apiClient.post('/auth/forgot-password', { email });
            return { success: true };
        } catch (error) {
            console.error('Forgot password error:', error);
            const errMsg = error.response?.data?.message || error.message || 'Gửi yêu cầu thất bại';
            return { success: false, error: errMsg };
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
