import SectionHeader from '@/components/common/SectionHeader';
import MarketCard from './MarketCard';
import { MarketCardSkeleton } from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { useFetch } from '@/hooks/useFetch';
import { BarChart2 } from 'lucide-react';
import ownerService from '@/services/ownerService.js';

/**
 * Section "Market Overview" - hiển thị danh sách card chỉ số thị trường
 * Tự xử lý đầy đủ 4 trạng thái: loading (skeleton), error, empty, success
 */
const MarketOverview = () => {
    const { data: indices, isLoading, error, refetch } = useFetch(
        async () => {
            const response = await ownerService.getStocks();
            return (Array.isArray(response.data) ? response.data : []).slice(0, 3).map((stock, index) => {
                const seed = Number(stock.id || index + 1);
                const changePercent = ((seed % 7) - 3) / 100;
                const change = Number(stock.currentPrice || 0) * changePercent;
                return {
                    id: stock.id,
                    name: stock.symbol,
                    fullName: stock.companyName || stock.industry || 'Cổ phiếu niêm yết',
                    value: Number(stock.currentPrice || 0),
                    change,
                    changePercent,
                    volume: `${(50 + seed * 7.3).toFixed(1)}M`,
                    isUp: change >= 0,
                    path: `/owner/stocks/${stock.id}`,
                };
            });
        },
        []
    );

    return (
        <section className="mb-8">
            <SectionHeader title="Tổng quan thị trường" subtitle="Các cổ phiếu active lấy từ backend, bấm card để xem chi tiết" />

            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <MarketCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {!isLoading && error && <ErrorState onRetry={refetch} description={error} />}

            {!isLoading && !error && indices?.length === 0 && (
                <EmptyState
                    icon={BarChart2}
                    title="Chưa có dữ liệu chỉ số"
                    description="Dữ liệu chỉ số thị trường hiện chưa khả dụng. Vui lòng quay lại sau."
                />
            )}

            {!isLoading && !error && indices?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                    {indices.map((index, i) => (
                        <MarketCard key={index.id} index={index} delay={i * 0.08} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default MarketOverview;
