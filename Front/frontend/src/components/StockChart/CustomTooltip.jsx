import { formatCurrency, formatCompactNumber } from '@/utils/formatters';

/**
 * Tooltip tùy chỉnh cho biểu đồ giá, hiển thị giá và khối lượng tại điểm đang hover
 */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const price = payload.find((p) => p.dataKey === 'price')?.value;
    const volume = payload.find((p) => p.dataKey === 'volume')?.value;

    return (
        <div className="panel px-3.5 py-2.5 shadow-elevated border border-border text-xs min-w-[140px]">
            <p className="text-text-muted mb-1.5">{label}</p>
            {price !== undefined && (
                <div className="flex items-center justify-between gap-3">
                    <span className="text-text-secondary">Giá</span>
                    <span className="font-financial font-semibold text-text-primary">
            {formatCurrency(price)}
          </span>
                </div>
            )}
            {volume !== undefined && (
                <div className="flex items-center justify-between gap-3 mt-1">
                    <span className="text-text-secondary">KL</span>
                    <span className="font-financial font-semibold text-text-primary">
            {formatCompactNumber(volume)}
          </span>
                </div>
            )}
        </div>
    );
};

export default CustomTooltip;