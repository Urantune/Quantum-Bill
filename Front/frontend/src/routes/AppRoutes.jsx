import {Routes, Route, Navigate} from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import PrivateRoute from '@/components/common/PrivateRoute';
import RoleRoute from '@/components/common/RoleRoute';
import { useAuth } from '@/context/AuthContext';
import { getRoleHomePath } from '@/utils/roleRedirect.js';
import InvestorDashboard from '@/pages/Investor/Dashboard';
import Wallet from '@/pages/Investor/Wallet';
import StockList from '@/pages/Investor/StockList';
import BuyStock from '@/pages/Investor/BuyStock';
import SellStock from '@/pages/Investor/SellStock';
import InvestorPortfolio from '@/pages/Investor/Portfolio';
import TransactionHistory from '@/pages/Investor/TransactionHistory';
import Ranking from '@/pages/Investor/Ranking';
import StockDetail from "@/pages/Investor/StockDetail";
import TopUpPage from '@/pages/Investor/TopUpPage';

// Các trang Dashboard chính
import Dashboard from '@/pages/Dashboard/Dashboard';
import NotFound from '@/pages/NotFound/NotFound';
import OwnerDashboard from "@/pages/Owner/OwnerDashboard.jsx";
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminStocks from '@/pages/admin/AdminStocks';
import AdminSimulation from '@/pages/admin/AdminSimulation';
import SetTime from '@/pages/SetTime/SetTime';

// Các trang Admin
import AdminRoute from '@/components/common/AdminRoute';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminStocks from '@/pages/admin/AdminStocks';
import AdminSimulation from '@/pages/admin/AdminSimulation';
import AdminWallet from '@/pages/admin/AdminWallet';
import AdminRanking from '@/pages/admin/AdminRanking';

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
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/investor/topup/:token" element={<TopUpPage/>}/>
                <Route path="/owner/topup/:token" element={<TopUpPage/>}/>

                {/* Các tuyến đường ứng dụng được bảo vệ */}
                <Route element={<PrivateRoute/>}>
                    <Route path="/app" element={<RoleHome/>}/>

                    <Route element={<RoleRoute roles={['INVESTOR']} allowPendingOwner/>}>
                        <Route path="/investor" element={<OwnerDashboard/>}/>
                        <Route path="/investor/stocks/:id" element={<StockDetail/>}/>
                    </Route>

                    <Route element={<RoleRoute roles={['OWNER']}/>}>
                        <Route path="/owner" element={<InvestorDashboard/>}/>
                        <Route path="/owner/wallet" element={<Wallet/>}/>
                        <Route path="/owner/stocks" element={<StockList/>}/>
                        <Route path="/owner/buy" element={<BuyStock/>}/>
                        <Route path="/owner/sell" element={<SellStock/>}/>
                        <Route path="/owner/stocks/:id" element={<StockDetail/>}/>
                        <Route path="/owner/portfolio" element={<InvestorPortfolio/>}/>
                        <Route path="/owner/transactions" element={<TransactionHistory/>}/>
                        <Route path="/owner/ranking" element={<Ranking/>}/>
                    </Route>

                    <Route element={<RoleRoute roles={['ADMIN']}/>}>
                        <Route path="/admin" element={<AdminLayout/>}>
                            <Route index element={<AdminDashboard/>}/>
                            <Route path="users" element={<AdminUsers/>}/>
                            <Route path="stocks" element={<AdminStocks/>}/>
                            <Route path="simulation" element={<AdminSimulation/>}/>
                            <Route path="settime" element={<SetTime/>}/>
                        </Route>
                    </Route>
                </Route>

                {/* Các tuyến đường Admin */}
                <Route element={<AdminRoute/>}>
                    <Route path="/admin" element={<AdminDashboard/>}/>
                    <Route path="/admin/users" element={<AdminUsers/>}/>
                    <Route path="/admin/stocks" element={<AdminStocks/>}/>
                    <Route path="/admin/simulation" element={<AdminSimulation/>}/>
                    <Route path="/admin/wallet" element={<AdminWallet/>}/>
                    <Route path="/admin/ranking" element={<AdminRanking/>}/>
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

    return <Navigate to={getRoleHomePath(user)} replace />;
};

export default AppRoutes;
