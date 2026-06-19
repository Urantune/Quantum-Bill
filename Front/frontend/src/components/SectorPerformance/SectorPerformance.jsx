import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SectionHeader from '@/components/common/SectionHeader';
import ErrorState from '@/components/common/ErrorState';
import Skeleton from '@/components/common/Skeleton';
import { useFetch } from '@/hooks/useFetch';
import { marketService } from '@/services/marketService';
import { formatPercent, formatCompactNumber } from '@/utils/formatters';
import { cn } from '@/utils/cn';

/**
 * Tooltip tùy chỉnh riêng cho biểu đồ ngành
 */
const SectorTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    return (
        <div className="panel px-3.5 py-2.5 text-xs">
            <p className="font-semibold text-text-primary mb-1">{item.name}</p>
            <p className="text-text-secondary">
                Vốn hóa: <span className="text-text-primary font-financial">{formatCompactNumber(item.marketCap * 1_000_000_000)} đ</span>
            </p>
        </div>
    );
};

/**
 * Section "Sector Performance" - hiển thị hiệu suất theo ngành
 * Kết hợp Bar Chart (Recharts) ở trên và Progress Bar chi tiết ở dưới
 */
const SectorPerformance = () => {
    const { data: sectors, isLoading, error, refetch } = useFetch(
        () => marketService.getSectorPerformance(),
        []
    );

    const maxAbsChange = sectors ? Math.max(...sectors.map((s) => Math.abs(s.changePercent))) : 1;

    return (
        <section className="panel p-5 md:p-6 mb-8">
            <SectionHeader title="Hiệu suất theo ngành" subtitle="Mức tăng/giảm trung bình của từng nhóm ngành trong phiên" />

            {isLoading && <Skeleton className="w-full h-72" />}

            {!isLoading && error && <ErrorState onRetry={refetch} description={error} />}

            {!isLoading && !error && sectors?.length > 0 && (
                <>
                    {/* Bar Chart */}
                    <div className="h-56 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sectors} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                <XAxis dataKey="name" stroke="#6B6F80" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#6B6F80"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `${v}%`}
                                />
                                <Tooltip content={<SectorTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                <Bar dataKey="changePercent" radius={[6, 6, 6, 6]} animationDuration={600} animationEasing="ease-out">
                                    {sectors.map((sector) => (
                                        <Cell key={sector.id} fill={sector.changePercent >= 0 ? '#16C784' : '#FF3B30'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Progress Bars chi tiết */}
                    <div className="space-y-4">
                        {sectors.map((sector, i) => {
                            const widthPercent = (Math.abs(sector.changePercent) / maxAbsChange) * 100;
                            const isUp = sector.changePercent >= 0;

                            return (
                                <div key={sector.id}>
                                    <div className="flex items-center justify-between mb-1.5 text-sm">
                                        <span className="font-medium text-text-primary">{sector.name}</span>
                                        <span className={cn('font-financial font-semibold', isUp ? 'text-success' : 'text-danger')}>
                      {formatPercent(sector.changePercent)}
                    </span>
                                    </div>
                                    <div className="w-full h-2 bg-bg-elevated rounded-pill overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${widthPercent}%` }}
                                            transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.08 }}
                                            className={cn('h-full rounded-pill', isUp ? 'bg-success' : 'bg-danger')}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </section>
    );
};

export default SectorPerformance;