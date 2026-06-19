import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Markets from '@/pages/Markets/Markets';
import Portfolio from '@/pages/Portfolio/Portfolio';
import News from '@/pages/News/News';
import Settings from '@/pages/Settings/Settings';
import WatchlistPage from '@/pages/WatchlistPage/WatchlistPage';
import Analytics from '@/pages/Analytics/Analytics';
import PricingPage from '@/pages/PricingPage/PricingPage';
import NotFound from '@/pages/NotFound/NotFound';

/**
 * Cấu hình route tập trung cho toàn bộ ứng dụng.
 * Tất cả các trang con đều nằm trong MainLayout (Sidebar + Navbar + Footer cố định).
 */
const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/news" element={<News />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;