import { motion } from 'framer-motion';
import PortfolioSummary from '@/components/Portfolio/PortfolioSummary';
import Watchlist from '@/components/Watchlist/Watchlist';
import { MOTION } from '@/constants/theme';

/**
 * Trang Portfolio - quản lý danh mục đầu tư cá nhân
 */
const Portfolio = () => {
    return (
        <motion.div {...MOTION.pageTransition}>
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Danh mục đầu tư</h1>
                <p className="text-text-secondary text-sm mt-1">
                    Quản lý và theo dõi hiệu suất tài khoản đầu tư của bạn
                </p>
            </div>

            <PortfolioSummary />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Watchlist />
            </div>
        </motion.div>
    );
};

export default Portfolio;