import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { formatCompactNumber } from '@/utils/formatters';

/**
 * Một ô số liệu thống kê với hiệu ứng đếm tăng dần (count-up)
 * Animation chỉ kích hoạt khi element xuất hiện trong viewport
 */
const StatCounter = ({ stat, delay = 0 }) => {
    const [ref, isInView] = useInView({ threshold: 0.3 });
    const count = useCountUp(stat.value, 1800, isInView);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut', delay }}
            className="panel p-6 text-center"
        >
            <p className="font-financial font-extrabold text-3xl md:text-4xl text-primary tracking-tight">
                {formatCompactNumber(count)}
            </p>
            <p className="text-text-secondary text-xs mt-1.5">{stat.unit}</p>
            <p className="text-text-primary text-sm font-medium mt-2">{stat.label}</p>
        </motion.div>
    );
};

export default StatCounter;