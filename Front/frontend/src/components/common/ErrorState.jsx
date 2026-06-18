import { motion } from 'framer-motion';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { MOTION } from '@/constants/theme';

/**
 * Component hiển thị trạng thái lỗi khi gọi API thất bại
 * Cung cấp nút "Thử lại" để gọi lại hàm refetch từ hook useFetch
 */
const ErrorState = ({
                        title = 'Đã có lỗi xảy ra',
                        description = 'Không thể tải dữ liệu lúc này. Vui lòng kiểm tra kết nối và thử lại.',
                        onRetry = null,
                    }) => {
    return (
        <motion.div
            {...MOTION.fadeIn}
            className="flex flex-col items-center justify-center text-center py-16 px-6"
        >
            <div className="w-16 h-16 rounded-full bg-danger-bg flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-danger" strokeWidth={1.5} />
            </div>
            <h3 className="text-text-primary font-semibold text-base mb-1.5">{title}</h3>
            <p className="text-text-secondary text-sm max-w-sm mb-5">{description}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover
            bg-danger-bg hover:bg-danger-bg/80 px-4 py-2 rounded-pill transition-colors duration-200"
                >
                    <RotateCw className="w-4 h-4" />
                    Thử lại
                </button>
            )}
        </motion.div>
    );
};

export default ErrorState;