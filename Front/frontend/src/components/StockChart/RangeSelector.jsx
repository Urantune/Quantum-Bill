import { motion } from 'framer-motion';
import { CHART_RANGES } from '@/data/chartData';
import { cn } from '@/utils/cn';

/**
 * Bộ chọn khung thời gian cho biểu đồ (1D, 1W, 1M, 3M, 6M, 1Y, ALL)
 * Có hiệu ứng pill trượt mượt giữa các lựa chọn bằng layoutId của Framer Motion
 */
const RangeSelector = ({ activeRange, onChange }) => {
    return (
        <div className="flex items-center gap-1 bg-bg-elevated rounded-pill p-1 overflow-x-auto">
            {CHART_RANGES.map((range) => (
                <button
                    key={range}
                    onClick={() => onChange(range)}
                    className={cn(
                        'relative px-3.5 py-1.5 text-xs font-semibold rounded-pill transition-colors duration-200 shrink-0',
                        activeRange === range ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                    )}
                >
                    {activeRange === range && (
                        <motion.span
                            layoutId="range-selector-pill"
                            className="absolute inset-0 bg-primary rounded-pill"
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        />
                    )}
                    <span className="relative z-10">{range}</span>
                </button>
            ))}
        </div>
    );
};

export default RangeSelector;