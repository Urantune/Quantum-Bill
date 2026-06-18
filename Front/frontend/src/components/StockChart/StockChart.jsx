import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ComposedChart,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import RangeSelector from './RangeSelector';
import CustomTooltip from './CustomTooltip';
import { ChartSkeleton } from '@/components/common/Skeleton';
import ErrorState from '@/components/common/ErrorState';
import { useFetch } from '@/hooks/useFetch';
import { marketService } from '@/services/marketService';
import { CHART_COLORS } from '@/constants/theme';
import { formatCurrency, formatChange, formatPercent, getChangeColorClass } from '@/utils/formatters';
import { cn } from '@/utils/cn';

/**
 * Biểu đồ giá cổ phiếu chính của Dashboard.
 * Sử dụng Recharts ComposedChart để kết hợp Area (giá) và Bar (khối lượng) trên cùng một biểu đồ.
 * Có animation chuyển đổi mượt khi đổi khung thời gian (key thay đổi -> remount với fade).
 */
const StockChart = () => {
    const [activeRange, setActiveRange] = useState('1M');

    const { data, isLoading, error, refetch } = useFetch(
        () => marketService.getStockChart(undefined, activeRange),
        [activeRange]
    );

    const meta = data?.meta;
    const series = data?.series || [];

    const maxVolume = useMemo(() => {
        if (series.length === 0) return 0;
        return Math.max(...series.map((d) => d.volume));
    }, [series]);

    if (isLoading) return <ChartSkeleton />;
    if (error) return <ErrorState onRetry={refetch} description={error} />;

    return (
        <div className="panel p-5 md:p-6">
            {/* Header: thông tin mã cổ phiếu + chọn khung thời gian */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-text-primary text-lg">{meta?.symbol}</h3>
                        <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-md">
              {meta?.exchange}
            </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{meta?.name}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-financial font-extrabold text-xl text-text-primary">
                            {formatCurrency(meta?.currentPrice)}
                        </p>
                        <p className={cn('font-financial text-xs font-semibold', getChangeColorClass(meta?.change))}>
                            {formatChange(meta?.change)} ({formatPercent(meta?.changePercent)})
                        </p>
                    </div>
                    <RangeSelector activeRange={activeRange} onChange={setActiveRange} />
                </div>
            </div>

            {/* Thông tin OHLC nhanh */}
            <div className="grid grid-cols-4 gap-3 mb-5 text-xs">
                {[
                    { label: 'Mở', value: meta?.open },
                    { label: 'Cao', value: meta?.high },
                    { label: 'Thấp', value: meta?.low },
                    { label: 'Tham chiếu', value: meta?.prevClose },
                ].map((item) => (
                    <div key={item.label} className="bg-bg-elevated rounded-lg px-3 py-2">
                        <p className="text-text-muted mb-0.5">{item.label}</p>
                        <p className="font-financial font-semibold text-text-primary">{formatCurrency(item.value)}</p>
                    </div>
                ))}
            </div>

            {/* Biểu đồ */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeRange}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="h-[320px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={CHART_COLORS.lineGradientStart} />
                                    <stop offset="100%" stopColor={CHART_COLORS.lineGradientEnd} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                            <XAxis
                                dataKey="time"
                                stroke={CHART_COLORS.axis}
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={24}
                            />
                            <YAxis
                                yAxisId="price"
                                orientation="right"
                                stroke={CHART_COLORS.axis}
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                                width={42}
                            />
                            <YAxis yAxisId="volume" orientation="left" hide domain={[0, maxVolume * 4]} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: CHART_COLORS.axis, strokeDasharray: '3 3' }} />
                            <Bar
                                yAxisId="volume"
                                dataKey="volume"
                                fill={CHART_COLORS.grid}
                                radius={[2, 2, 0, 0]}
                                maxBarSize={14}
                            />
                            <Area
                                yAxisId="price"
                                type="monotone"
                                dataKey="price"
                                stroke={CHART_COLORS.line}
                                strokeWidth={2}
                                fill="url(#priceGradient)"
                                animationDuration={500}
                                animationEasing="ease-out"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default StockChart;