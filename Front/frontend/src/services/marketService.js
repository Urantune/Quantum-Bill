import {
    MARKET_INDICES,
    WATCHLIST_STOCKS,
    TOP_GAINERS,
    TOP_LOSERS,
    SECTOR_PERFORMANCE,
    MARKET_STATISTICS,
    PORTFOLIO_SUMMARY,
} from '@/data/marketData';
import { STOCK_CHART_DATA, DEFAULT_CHART_SYMBOL } from '@/data/chartData';
import { MARKET_NEWS } from '@/data/newsData';

// Lớp service mô phỏng việc gọi API thật.
// Khi backend sẵn sàng, chỉ cần thay nội dung từng hàm bằng apiClient.get(...)
// mà không cần thay đổi cách các component/hook gọi service này.

const simulateDelay = (data, ms = 600) =>
    new Promise((resolve) => {
        setTimeout(() => resolve(data), ms);
    });

export const marketService = {
    getMarketIndices: () => simulateDelay(MARKET_INDICES, 500),

    getWatchlist: () => simulateDelay(WATCHLIST_STOCKS, 500),

    getTopGainers: () => simulateDelay(TOP_GAINERS, 500),

    getTopLosers: () => simulateDelay(TOP_LOSERS, 500),

    getSectorPerformance: () => simulateDelay(SECTOR_PERFORMANCE, 500),

    getMarketStatistics: () => simulateDelay(MARKET_STATISTICS, 500),

    getPortfolioSummary: () => simulateDelay(PORTFOLIO_SUMMARY, 500),

    getStockChart: (symbol, range) =>
        simulateDelay(
            {
                symbol: symbol || DEFAULT_CHART_SYMBOL.symbol,
                meta: DEFAULT_CHART_SYMBOL,
                series: STOCK_CHART_DATA[range] || STOCK_CHART_DATA['1M'],
            },
            400
        ),

    getMarketNews: () => simulateDelay(MARKET_NEWS, 500),
};

export default marketService;