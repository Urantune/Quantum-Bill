import { motion } from 'framer-motion';
import Watchlist from '@/components/Watchlist/Watchlist';
import { MOTION } from '@/constants/theme';

/**
 * Trang Watchlist độc lập - phiên bản đầy đủ chiều rộng của danh sách theo dõi
 * (khác với widget Watchlist thu nhỏ hiển thị trong Dashboard)
 */
const WatchlistPage = () => {
    return (
        <motion.div {...MOTION.pageTransition}>
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Theo dõi</h1>
                <p className="text-text-secondary text-sm mt-1">
                    Danh sách các mã cổ phiếu bạn đang quan tâm và theo dõi biến động giá
                </p>
            </div>

            <div className="max-w-3xl">
                <Watchlist />
            </div>
        </motion.div>
    );
};

export default WatchlistPage;