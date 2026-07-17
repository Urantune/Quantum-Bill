import { motion } from 'framer-motion';
import { Clock, Building2, ArrowRightLeft } from 'lucide-react';
import { MOTION } from '@/constants/theme';

const PendingApproval = ({ companyName, symbol }) => {
    return (
        <motion.div
            {...MOTION.pageTransition}
            className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6"
        >
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-warning/10 flex items-center justify-center text-warning animate-pulse">
                    <Clock className="w-12 h-12" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-text-secondary" />
                </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                Hồ sơ đang được thẩm định
            </h1>

            <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
                Hệ thống đang tiến hành xét duyệt mã niêm yết <span className="text-primary font-mono font-bold">{symbol}</span> thuộc doanh nghiệp <span className="text-text-primary font-semibold">{companyName}</span>.
            </p>

            <div className="mt-8 p-4 bg-bg-elevated rounded-xl border border-border-subtle text-left max-w-md w-full space-y-3">
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    <span>Trạng thái: <strong>PENDING approval</strong></span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <span className="w-2 h-2 rounded-full bg-text-muted" />
                    <span>Tiến độ: Đang kiểm tra hồ sơ pháp lý & vốn điều lệ</span>
                </div>
            </div>

            <p className="text-xs text-text-muted mt-6 max-w-xs">
                Toàn bộ các phân hệ dashboard doanh nghiệp sẽ tự động kích hoạt ngay sau khi Admin phê duyệt thành công.
            </p>
        </motion.div>
    );
};

export default PendingApproval;