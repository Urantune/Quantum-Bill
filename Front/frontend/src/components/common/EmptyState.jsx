import {motion} from 'framer-motion';
import {Inbox} from 'lucide-react';
import {MOTION} from '@/constants/theme';

/**
 * Component hiển thị trạng thái "không có dữ liệu" (Empty State)
 * Dùng khi danh sách watchlist, kết quả tìm kiếm, hoặc danh mục đầu tư trống
 */
const EmptyState = ({
                        icon: Icon = Inbox,
                        title = 'Không có dữ liệu',
                        description = 'Hiện chưa có thông tin nào để hiển thị ở đây.',
                        action = null,
                    }) => {
    return (
        <motion.div
            {...MOTION.fadeIn}
            className="flex flex-col items-center justify-center text-center py-16 px-6"
        >
            <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-text-muted" strokeWidth={1.5}/>
            </div>
            <h3 className="text-text-primary font-semibold text-base mb-1.5">{title}</h3>
            <p className="text-text-secondary text-sm max-w-sm">{description}</p>
            {action && <div className="mt-5">{action}</div>}
        </motion.div>
    );
};

export default EmptyState;