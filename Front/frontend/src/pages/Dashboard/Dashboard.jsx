import { motion } from 'framer-motion';
import Hero from '@/components/Hero/Hero';
import MarketOverview from '@/components/MarketCard/MarketCardOverview';
import StockChart from '@/components/StockChart/StockChart';
import Watchlist from '@/components/Watchlist/Watchlist';
import TopMovers from '@/components/MarketCard/TopMovers';
import NewsList from '@/components/News/NewsList';
import Statistics from '@/components/Statistics/Statistics';
import SectorPerformance from '@/components/SectorPerformance/SectorPerformance';
import PortfolioSummary from '@/components/Portfolio/PortfolioSummary';
import Pricing from '@/components/Pricing/Pricing';
import Testimonials from '@/components/Testimonials/Testimonials';
import FAQ from '@/components/FAQ/FAQ';
import { MOTION } from '@/constants/theme';

/**
 * Trang Dashboard - trang chủ của ứng dụng, gộp toàn bộ 14 section theo yêu cầu:
 * Hero, Market Overview, Stock Chart, Watchlist, Top Gainers/Losers, News,
 * Statistics, Sector Performance, Portfolio Summary, Pricing, Testimonials, FAQ
 */
const Dashboard = () => {
    return (
        <motion.div {...MOTION.pageTransition}>
            <Hero />
            <MarketOverview />

            {/* Stock Chart + Watchlist hiển thị song song trên desktop, xếp chồng trên mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
                <div className="lg:col-span-2">
                    <StockChart />
                </div>
                <div className="lg:col-span-1">
                    <Watchlist />
                </div>
            </div>

            <TopMovers />
            <NewsList />
            <Statistics />
            <SectorPerformance />
            <PortfolioSummary />
            <Pricing />
            <Testimonials />
            <FAQ />
        </motion.div>
    );
};

export default Dashboard;