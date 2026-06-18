import { motion } from 'framer-motion';
import MarketOverview from '@/components/MarketCard/MarketCardOverview';
import StockChart from '@/components/StockChart/StockChart';
import TopMovers from '@/components/MarketCard/TopMovers';
import SectorPerformance from '@/components/SectorPerformance/SectorPerformance';
import { MOTION } from '@/constants/theme';

/**
 * Trang Markets - tổng hợp chi tiết về thị trường: chỉ số, biểu đồ, top tăng/giảm, hiệu suất ngành
 */
const Markets = () => {
    return (
        <motion.div {...MOTION.pageTransition}>
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Thị trường</h1>
                <p className="text-text-secondary text-sm mt-1">
                    Theo dõi toàn diện diễn biến thị trường chứng khoán Việt Nam
                </p>
            </div>

            <MarketOverview />
            <StockChart />
            <div className="h-8" />
            <TopMovers />
            <SectorPerformance />
        </motion.div>
    );
};

export default Markets;