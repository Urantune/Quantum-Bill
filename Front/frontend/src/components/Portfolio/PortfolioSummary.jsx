import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Banknote, Briefcase } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import ErrorState from '@/components/common/ErrorState';
import Skeleton from '@/components/common/Skeleton';
import { useFetch } from '@/hooks/useFetch';
import { marketService } from '@/services/marketService';
import { formatCurrency, formatPercent, getChangeColorClass } from '@/utils/formatters';
import { cn } from '@/utils/cn';

/**
 * Section "Portfolio Summary" - mô phỏng tổng quan tài khoản nhà đầu tư
 */
const PortfolioSummary = () => {
    const { data: portfolio, isLoading, error, refetch } = useFetch(
        () => marketService.getPortfolioSummary(),
        []
    );

    const summaryCards = portfolio
        ? [
            { label: 'Tổng tài sản', value: portfolio.totalAssets, icon: Wallet, isAmount: true },
            {
                label: 'Lãi/Lỗ',
                value: portfolio.profitLoss,
                percent: portfolio.profitLossPercent,
                icon: TrendingUp,
                isAmount: true,
                isProfit: true,
            },
            { label: 'Tiền mặt', value: portfolio.cashBalance, icon: Banknote, isAmount: true },
            { label: 'Số mã đang giữ', value: portfolio.holdings?.length, icon: Briefcase, isAmount: false },
        ]
        : [];

    return (
        <section className="panel p-5 md:p-6 mb-8">
            <SectionHeader title="Danh mục đầu tư" subtitle="Tổng quan tài khoản giao dịch của bạn" />

            {isLoading && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="w-full h-24" />
                    ))}
                </div>
            )}

            {!isLoading && error && <ErrorState onRetry={refetch} description={error} />}

            {!isLoading && !error && portfolio && (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {summaryCards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={card.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.08 }}
                                    className="bg-bg-elevated rounded-card p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-text-secondary">{card.label}</span>
                                        <Icon className="w-4 h-4 text-text-muted" />
                                    </div>
                                    <p
                                        className={cn(
                                            'font-financial font-bold text-lg',
                                            card.isProfit ? getChangeColorClass(card.value) : 'text-text-primary'
                                        )}
                                    >
                                        {card.isAmount ? formatCurrency(card.value, true) : card.value}
                                    </p>
                                    {card.percent !== undefined && (
                                        <p className={cn('font-financial text-xs font-semibold mt-0.5', getChangeColorClass(card.percent))}>
                                            {formatPercent(card.percent)}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Bảng danh mục cổ phiếu đang giữ */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-left text-xs text-text-muted border-b border-border-subtle">
                                <th className="pb-3 font-medium">Mã CP</th>
                                <th className="pb-3 font-medium text-right">Khối lượng</th>
                                <th className="pb-3 font-medium text-right">Giá vốn</th>
                                <th className="pb-3 font-medium text-right">Giá hiện tại</th>
                                <th className="pb-3 font-medium text-right">Giá trị</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                            {portfolio.holdings.map((holding) => (
                                <tr key={holding.symbol} className="hover:bg-white/5 transition-colors">
                                    <td className="py-3 font-bold text-text-primary">{holding.symbol}</td>
                                    <td className="py-3 text-right font-financial text-text-secondary">
                                        {holding.quantity.toLocaleString('vi-VN')}
                                    </td>
                                    <td className="py-3 text-right font-financial text-text-secondary">
                                        {formatCurrency(holding.avgPrice)}
                                    </td>
                                    <td className="py-3 text-right font-financial text-text-primary">
                                        {formatCurrency(holding.currentPrice)}
                                    </td>
                                    <td className="py-3 text-right font-financial font-semibold text-text-primary">
                                        {formatCurrency(holding.value, true)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
};

export default PortfolioSummary;