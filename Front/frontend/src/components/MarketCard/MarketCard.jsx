import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPercent, formatChange } from '@/utils/formatters';
import { cn } from '@/utils/cn';

/**
 * Card hiển thị một chỉ số thị trường (VNINDEX, HNXINDEX, UPCOM...)
 * Bao gồm: tên chỉ số, giá trị hiện tại, thay đổi tuyệt đối, phần trăm, icon xu hướng
 */
const MarketCard = ({ index, delay = 0 }) => {
    const { name, fullName, value, change, changePercent, volume, isUp } = index;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={cn(
                'panel p-5 cursor-pointer transition-shadow duration-300',
                isUp ? 'hover:shadow-glow-success' : 'hover:shadow-glow'
            )}
        >
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="font-bold text-text-primary text-sm">{name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{fullName}</p>
                </div>
                <div
                    className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center',
                        isUp ? 'bg-success-bg' : 'bg-danger-bg'
                    )}
                >
                    {isUp ? (
                        <TrendingUp className="w-[18px] h-[18px] text-success" />
                    ) : (
                        <TrendingDown className="w-[18px] h-[18px] text-danger" />
                    )}
                </div>
            </div>

            <p className="font-financial font-extrabold text-2xl text-text-primary tracking-tight">
                {value.toLocaleString('vi-VN')}
            </p>

            <div className="flex items-center justify-between mt-2.5">
        <span className={cn('badge-financial font-financial text-xs font-semibold', isUp ? 'text-success' : 'text-danger')}>
          {formatChange(change)} ({formatPercent(changePercent)})
        </span>
                <span className="text-xs text-text-muted">KL: {volume}</span>
            </div>
        </motion.div>
    );
};

export default MarketCard;