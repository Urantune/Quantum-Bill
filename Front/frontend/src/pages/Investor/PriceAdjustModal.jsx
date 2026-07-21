import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { investorService } from '@/services/investorService';
import { formatCurrency } from '@/utils/formatters';

const DAILY_LIMIT = 0.09;

const PriceAdjustModal = ({ isOpen, onClose, stock, onSuccess }) => {
    const [targetPrice, setTargetPrice] = useState('');
    const [executeAt, setExecuteAt] = useState('');
    const [reference, setReference] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingRef, setLoadingRef] = useState(false);

    useEffect(() => {
        if (isOpen && stock) {
            setTargetPrice('');
            setExecuteAt('');
            setError('');
            setLoadingRef(true);
            investorService.getReferencePrice(stock.id)
                .then(data => setReference(data))
                .catch(() => setReference(null))
                .finally(() => setLoadingRef(false));
        }
    }, [isOpen, stock]);

    if (!isOpen || !stock) return null;

    const currentPrice = Number(stock.currentPrice);
    const refPrice = reference ? Number(reference.referencePrice) : currentPrice;
    const maxPrice = refPrice * (1 + DAILY_LIMIT);
    const minPrice = refPrice * (1 - DAILY_LIMIT);
    const target = Number(targetPrice);
    const isValid = targetPrice && target > 0 && target >= minPrice && target <= maxPrice;
    const changePercent = targetPrice ? (((target - currentPrice) / currentPrice) * 100).toFixed(2) : '0';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) {
            setError(`Giá phải nằm trong khoảng ${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)} (±9% so với giá tham chiếu ${formatCurrency(refPrice)})`);
            return;
        }
        setLoading(true);
        setError('');
        try {
            await investorService.setStockPrice(stock.id, Math.round(target * 100) / 100);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không thể cập nhật giá.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-bg-elevated border border-border-subtle w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            >
                <div className="flex items-center justify-between p-5 border-b border-border-subtle">
                    <h3 className="text-lg font-bold text-text-primary">
                        Điều chỉnh giá: <span className="text-primary font-mono">{stock.symbol}</span>
                    </h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Reference info */}
                    <div className="p-3 bg-bg-surface rounded-lg border border-border-subtle text-xs space-y-1.5">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Giá hiện tại:</span>
                            <span className="font-mono font-semibold text-text-primary">{formatCurrency(currentPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Giá tham chiếu (0h):</span>
                            <span className="font-mono font-semibold text-text-primary">
                                {loadingRef ? 'Đang tải...' : formatCurrency(refPrice)}
                            </span>
                        </div>
                        <div className="flex justify-between text-text-muted">
                            <span>Giới hạn ngày (±9%):</span>
                            <span className="font-mono">{formatCurrency(minPrice)} - {formatCurrency(maxPrice)}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger flex items-start gap-2 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1">Giá mục tiêu (VNĐ)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={targetPrice}
                            onChange={e => { setTargetPrice(e.target.value); setError(''); }}
                            className="input-base w-full text-sm font-mono"
                            placeholder={formatCurrency(currentPrice)}
                        />
                        {targetPrice && (
                            <p className={`text-xs mt-1 font-semibold ${Number(changePercent) >= 0 ? 'text-success' : 'text-danger'}`}>
                                {Number(changePercent) >= 0 ? '+' : ''}{changePercent}% {isValid ? '✓ Hợp lệ' : '✗ Vượt giới hạn ±9%'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1">
                            Thời gian thực hiện <span className="text-text-muted font-normal">(tùy chọn)</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={executeAt}
                            onChange={e => setExecuteAt(e.target.value)}
                            className="input-base w-full text-sm"
                        />
                        <p className="text-xs text-text-muted mt-1">
                            {executeAt
                                ? `Lệnh sẽ được thực hiện vào ${new Date(executeAt).toLocaleString()}`
                                : 'Để trống để thực hiện ngay lập tức'}
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/5 rounded-lg transition-colors">
                            Hủy
                        </button>
                        <button type="submit" disabled={loading || !isValid}
                            className="btn-primary text-sm px-5 py-2 flex items-center gap-2 disabled:opacity-50">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {executeAt ? 'Đặt lịch' : 'Cập nhật ngay'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PriceAdjustModal;
