import SectionHeader from '@/components/common/SectionHeader';
import WatchlistRow from './WatchlistRow';
import { WatchlistRowSkeleton } from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { useFetch } from '@/hooks/useFetch';
import { marketService } from '@/services/marketService';
import { Star } from 'lucide-react';

/**
 * Section "Watchlist" - danh sách cổ phiếu người dùng theo dõi
 */
const Watchlist = () => {
    const { data: stocks, isLoading, error, refetch } = useFetch(
        () => marketService.getWatchlist(),
        []
    );

    return (
        <section className="panel p-5">
            <SectionHeader title="Danh sách theo dõi" subtitle="Các mã cổ phiếu bạn đang quan tâm" />

            {isLoading && (
                <div className="divide-y divide-border-subtle">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <WatchlistRowSkeleton key={i} />
                    ))}
                </div>
            )}

            {!isLoading && error && <ErrorState onRetry={refetch} description={error} />}

            {!isLoading && !error && stocks?.length === 0 && (
                <EmptyState
                    icon={Star}
                    title="Danh sách theo dõi trống"
                    description="Thêm mã cổ phiếu vào danh sách theo dõi để cập nhật biến động giá nhanh chóng."
                />
            )}

            {!isLoading && !error && stocks?.length > 0 && (
                <div className="divide-y divide-border-subtle -mx-1">
                    {stocks.map((stock, i) => (
                        <WatchlistRow key={stock.symbol} stock={stock} delay={i * 0.05} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Watchlist;