import SectionHeader from '@/components/common/SectionHeader';
import MarketCard from './MarketCard';
import { MarketCardSkeleton } from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { useFetch } from '@/hooks/useFetch';
import { marketService } from '@/services/marketService';
import { BarChart2 } from 'lucide-react';

/**
 * Section "Market Overview" - hiển thị danh sách card chỉ số thị trường
 * Tự xử lý đầy đủ 4 trạng thái: loading (skeleton), error, empty, success
 */
const MarketOverview = () => {
    const { data: indices, isLoading, error, refetch } = useFetch(
        () => marketService.getMarketIndices(),
        []
    );

    return (
        <section className="mb-8">
            <SectionHeader title="Tổng quan thị trường" subtitle="Diễn biến các chỉ số chính trong phiên hôm nay" />

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