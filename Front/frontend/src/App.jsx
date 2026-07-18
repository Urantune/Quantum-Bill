import AppRoutes from '@/routes/AppRoutes';
import { AuthProvider } from '@/context/AuthContext';

/**
 * Root component của ứng dụng StockPro Elite.
 * Bọc bằng AuthProvider để toàn bộ các Route đều truy cập được trạng thái Auth.
 */
function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;