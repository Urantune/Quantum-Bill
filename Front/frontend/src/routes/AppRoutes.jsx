import {Routes, Route, Navigate} from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import PrivateRoute from '@/components/common/PrivateRoute';
import { useAuth } from '@/context/AuthContext';
import InvestorDashboard from '@/pages/Investor/Dashboard';
import Wallet from '@/pages/Investor/Wallet';
import StockList from '@/pages/Investor/StockList';
import BuyStock from '@/pages/Investor/BuyStock';
import SellStock from '@/pages/Investor/SellStock';
import InvestorPortfolio from '@/pages/Investor/Portfolio';
import TransactionHistory from '@/pages/Investor/TransactionHistory';
import Ranking from '@/pages/Investor/Ranking';
import StockDetail from "@/pages/Investor/StockDetail";

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
            <Route element={<AuthLayout/>}>
                <Route path="/auth/login" element={<Login/>}/>
                <Route path="/auth/register" element={<Register/>}/>
                <Route path="/auth/forgot-password" element={<ForgotPassword/>}/>
            </Route>

            {/* Các tuyến đường sử dụng MainLayout */}
            <Route element={<MainLayout/>}>
                <Route path="/" element={<RoleHome/>}/>

                {/* Các tuyến đường ứng dụng được bảo vệ */}
                <Route element={<PrivateRoute/>}>
                    <Route path="/owner" element={<OwnerDashboard/>}/>

                    <Route path="/investor" element={<InvestorDashboard/>}/>

                    <Route path="/investor/wallet" element={<Wallet/>}/>

                    <Route path="/investor/stocks" element={<StockList/>}/>

                    <Route path="/investor/buy" element={<BuyStock/>}/>

                    <Route path="/investor/sell" element={<SellStock/>}/>

                    <Route path="/investor/stocks/:id" element={<StockDetail/>}/>

                    <Route
                        path="/investor/portfolio"
                        element={<InvestorPortfolio/>}
                    />

                    <Route
                        path="/investor/transactions"
                        element={<TransactionHistory/>}
                    />

                    <Route
                        path="/investor/ranking"
                        element={<Ranking/>}
                    />
                </Route>

                <Route path="*" element={<NotFound/>}/>
            </Route>

        </Routes>

    );
};

const RoleHome = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-6 text-text-secondary">Đang tải phiên đăng nhập...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (user?.status === 'PENDING') {
        return <Navigate to="/owner" replace />;
    }

    if (user?.roles?.includes('OWNER')) {
        return <Navigate to="/owner" replace />;
    }

    if (user?.roles?.includes('INVESTOR')) {
        return <Navigate to="/investor" replace />;
    }

    return <Navigate to="/investor/ranking" replace />;
};

export default AppRoutes;
