import { motion } from 'framer-motion';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { cn } from '@/utils/cn';

/**
 * Component tái sử dụng để hiển thị danh sách cổ phiếu xếp hạng (Top Gainers / Top Losers)
 * Tránh lặp code giữa 2 section có cấu trúc giống nhau, chỉ khác màu sắc và dữ liệu
 */
const RankedStockList = ({ stocks, variant = 'up' }) => {
    const isUp = variant === 'up';

    return (
        <div className="space-y-1">
            {stocks.map((stock, i) => (
                <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.04 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-5 text-xs font-semibold text-text-muted">{i + 1}</span>
                        <div>
                            <p className="font-bold text-text-primary text-sm">{stock.symbol}</p>
                            <p className="text-xs text-text-secondary truncate max-w-[140px]">{stock.name}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-financial text-sm text-text-primary">{formatCurrency(stock.price)}</p>
                        <span className={cn('font-financial text-xs font-bold', isUp ? 'text-success' : 'text-danger')}>
              {formatPercent(stock.changePercent)}
            </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default RankedStockList;