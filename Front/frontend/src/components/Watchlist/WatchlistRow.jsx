import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import MiniChart from './MiniChart';
import { formatCurrency, formatPercent, formatChange, getChangeColorClass } from '@/utils/formatters';
import { cn } from '@/utils/cn';

/**
 * Một dòng trong danh sách Watchlist: mã CP, tên, giá, % thay đổi, mini chart
 */
const WatchlistRow = ({ stock, delay = 0 }) => {
    const { symbol, name, exchange, price, change, changePercent, isUp, miniChartData } = stock;

    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            className="flex items-center justify-between py-3 px-4 rounded-lg cursor-pointer transition-colors"
        >
            <div className="flex items-center gap-3 min-w-[140px]">
                <button
                    className="text-text-muted hover:text-primary transition-colors"
                    aria-label={`Bỏ theo dõi ${symbol}`}
                >
                    <Star className="w-4 h-4 fill-current" />
                </button>
                <div>
                    <div className="flex items-center gap-1.5">
                        <p className="font-bold text-text-primary text-sm">{symbol}</p>
                        <span className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded">
              {exchange}
            </span>
                    </div>
                    <p className="text-xs text-text-secondary truncate max-w-[120px]">{name}</p>
                </div>
            </div>

            <MiniChart data={miniChartData} isUp={isUp} />

            <div className="text-right min-w-[100px]">
                <p className="font-financial font-semibold text-text-primary text-sm">{formatCurrency(price)}</p>
                <p className={cn('font-financial text-xs font-medium', getChangeColorClass(change))}>
                    {formatChange(change)} ({formatPercent(changePercent)})
                </p>
            </div>
        </motion.div>
    );
};

export default WatchlistRow;