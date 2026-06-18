import { motion } from 'framer-motion';
import StockChart from '@/components/StockChart/StockChart';
import SectorPerformance from '@/components/SectorPerformance/SectorPerformance';
import Statistics from '@/components/Statistics/Statistics';
import { MOTION } from '@/constants/theme';

/**
 * Trang Analytics - tổng hợp các công cụ phân tích kỹ thuật và vĩ mô thị trường
 */
const Analytics = () => {
    return (
        <motion.div {...MOTION.pageTransition}>
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Phân tích</h1>
                <p className="text-text-secondary text-sm mt-1">
                    Công cụ phân tích kỹ thuật và đánh giá toàn cảnh thị trường
                </p>
            </div>

            <StockChart />
            <div className="h-8" />
            <Statistics />
            <SectorPerformance />
        </motion.div>
    );
};

export default Analytics;