import { Link } from 'react-router-dom';
import SectionHeader from '@/components/common/SectionHeader';
import WatchlistRow from './WatchlistRow';
import { WatchlistRowSkeleton } from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { useFetch } from '@/hooks/useFetch';
import { marketService } from '@/services/marketService';
import { Star, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * Section "Watchlist" - danh sách cổ phiếu người dùng theo dõi
 */
const Watchlist = () => {
    const { isAuthenticated } = useAuth();
    const { data: stocks, isLoading, error, refetch } = useFetch(
        () => (isAuthenticated ? marketService.getWatchlist() : Promise.resolve([])),
        [isAuthenticated]
    );

    return (
        <section className="panel p-5">
            <SectionHeader title="Danh sách theo dõi" subtitle="Các mã cổ phiếu bạn đang quan tâm" />

            {!isAuthenticated ? (
                <div className="relative overflow-hidden rounded-card border border-border-subtle bg-bg-surface/30 backdrop-blur-md p-6 flex flex-col items-center text-center max-w-sm mx-auto my-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                        <Lock className="w-5 h-5 text-primary" />
                    </div>
                    
                    <h3 className="text-sm font-bold text-text-primary mb-1">Đăng nhập để xem danh sách</h3>
                    <p className="text-text-secondary text-xs leading-relaxed mb-4">
                        Theo dõi biến động và nhận cảnh báo giá của các mã cổ phiếu yêu thích.
                    </p>
                    
                    <Link to="/auth/login" className="btn-primary py-1.5 px-4 rounded-pill text-xs font-semibold">
                        Đăng nhập ngay
                    </Link>
                </div>
            ) : (
                <>
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
                </>
            )}
        </section>
    );
};

export default Watchlist;