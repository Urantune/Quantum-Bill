import { motion } from 'framer-motion';
import { MOTION } from '@/constants/theme';

/**
 * Header tiêu đề dùng chung cho các section trong Dashboard
 * (Market Overview, Watchlist, Top Gainers, News, v.v.)
 */
const SectionHeader = ({ title, subtitle = null, action = null }) => {
    return (
        <motion.div {...MOTION.fadeUp} className="flex items-end justify-between mb-5 flex-wrap gap-3">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">{title}</h2>
                {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </motion.div>
    );
};

export default SectionHeader;