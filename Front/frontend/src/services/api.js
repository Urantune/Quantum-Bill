import axios from 'axios';

// Cấu hình instance Axios dùng chung cho toàn bộ ứng dụng
// Khi tích hợp API thật, chỉ cần cập nhật biến môi trường VITE_API_BASE_URL
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor request - nơi gắn token xác thực khi cần trong tương lai
apiClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Interceptor response - xử lý lỗi tập trung
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.data) {
            const serverMessage = error.response.data.message;
            if (serverMessage) {
                error.message = serverMessage;
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;