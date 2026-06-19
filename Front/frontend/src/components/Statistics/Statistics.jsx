import SectionHeader from '@/components/common/SectionHeader';
import StatCounter from './StatCounter';
import Skeleton from '@/components/common/Skeleton';
import ErrorState from '@/components/common/ErrorState';
import { useFetch } from '@/hooks/useFetch';
import { marketService } from '@/services/marketService';

/**
 * Section "Statistics" - các số liệu tổng quan thị trường với animation counter
 */
const Statistics = () => {
    const { data: stats, isLoading, error, refetch } = useFetch(
        () => marketService.getMarketStatistics(),
        []
    );

    return (
        <section className="mb-8">
            <SectionHeader title="Số liệu thị trường" subtitle="Tổng quan quy mô và thanh khoản thị trường" />

            {isLoading && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="panel p-6 text-center space-y-2">
                            <Skeleton className="w-20 h-8 mx-auto" variant="text" />
                            <Skeleton className="w-16 h-3 mx-auto" variant="text" />
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && error && <ErrorState onRetry={refetch} description={error} />}

            {!isLoading && !error && stats?.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <StatCounter key={stat.id} stat={stat} delay={i * 0.1} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Statistics;