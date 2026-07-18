import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import PrivateRoute from '@/components/common/PrivateRoute';

// Các trang Dashboard chính
import Dashboard from '@/pages/Dashboard/Dashboard';
import Markets from '@/pages/Markets/Markets';
import Portfolio from '@/pages/Portfolio/Portfolio';
import News from '@/pages/News/News';
import Settings from '@/pages/Settings/Settings';
import WatchlistPage from '@/pages/WatchlistPage/WatchlistPage';
import Analytics from '@/pages/Analytics/Analytics';
import PricingPage from '@/pages/PricingPage/PricingPage';
import NotFound from '@/pages/NotFound/NotFound';
import OwnerDashboard from "@/pages/Owner/OwnerDashboard.jsx";

// Các trang Auth
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';

/**
 * Cấu hình route tập trung cho toàn bộ ứng dụng.
 * - Các tuyến đường Auth nằm ngoài và sử dụng AuthLayout.
 * - Các tuyến đường Dashboard được bảo vệ bởi PrivateRoute và sử dụng MainLayout làm App Shell.
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* Cấu hình các tuyến đường xác thực công khai */}
            <Route element={<AuthLayout />}>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Các tuyến đường sử dụng MainLayout */}
            <Route element={<MainLayout />}>
                {/* Các tuyến đường công khai */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/news" element={<News />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/pricing" element={<PricingPage />} />

                {/* Các tuyến đường ứng dụng được bảo vệ */}
                <Route element={<PrivateRoute />}>
                    <Route path="/watchlist" element={<WatchlistPage />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
                <Route path="/owner-test" element={<OwnerDashboard />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;