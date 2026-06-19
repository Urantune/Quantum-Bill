import SectionHeader from '@/components/common/SectionHeader';
import RankedStockList from './RankedStockList';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import Skeleton from '@/components/common/Skeleton';
import { useFetch } from '@/hooks/useFetch';
import { marketService } from '@/services/marketService';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Section gộp "Top Gainers" và "Top Losers" hiển thị song song trên 2 cột
 */
const TopMovers = () => {
    const gainers = useFetch(() => marketService.getTopGainers(), []);
    const losers = useFetch(() => marketService.getTopLosers(), []);

    const renderPanel = (title, icon, hookResult, variant) => {
        const { data, isLoading, error, refetch } = hookResult;

        return (
            <div className="panel p-5">
                <SectionHeader title={title} action={icon} />

                {isLoading && (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between px-3">
                                <Skeleton className="w-28 h-4" variant="text" />
                                <Skeleton className="w-16 h-4" variant="text" />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && error && <ErrorState onRetry={refetch} description={error} />}

                {!isLoading && !error && data?.length === 0 && (
                    <EmptyState title="Chưa có dữ liệu" description="Danh sách hiện chưa có cổ phiếu nào." />
                )}

                {!isLoading && !error && data?.length > 0 && <RankedStockList stocks={data} variant={variant} />}
            </div>
        );
    };

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {renderPanel(
                'Top tăng giá',
                <TrendingUp className="w-5 h-5 text-success" />,
                gainers,
                'up'
            )}
            {renderPanel(
                'Top giảm giá',
                <TrendingDown className="w-5 h-5 text-danger" />,
                losers,
                'down'
            )}
        </section>
    );
};

export default TopMovers;