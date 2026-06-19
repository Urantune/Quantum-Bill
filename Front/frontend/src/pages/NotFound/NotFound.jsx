import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import { MOTION } from '@/constants/theme';

/**
 * Trang 404 - hiển thị khi người dùng truy cập route không tồn tại
 */
const NotFound = () => {
    return (
        <motion.div
            {...MOTION.fadeIn}
            className="flex flex-col items-center justify-center text-center py-24 px-6"
        >
            <div className="w-20 h-20 rounded-full bg-danger-bg flex items-center justify-center mb-6">
                <SearchX className="w-9 h-9 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-extrabold text-text-primary mb-2">404</h1>
            <p className="text-text-secondary text-base mb-8 max-w-sm">
                Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            </p>
            <Link to="/" className="btn-primary flex items-center gap-2">
                <Home className="w-4 h-4" />
                Về trang chủ
            </Link>
        </motion.div>
    );
};

export default NotFound;