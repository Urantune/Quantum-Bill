import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getCurrentUserId } from '@/services/session.js';

const StockFormModal = ({ isOpen, onClose, onSubmitSuccess, initialData = null }) => {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState({
        symbol: initialData?.symbol || '',
        companyName: initialData?.companyName || '',
        industry: initialData?.industry || '',
        description: initialData?.description || '',
        currentPrice: initialData?.currentPrice || '',
        status: initialData?.status || 'PENDING',
        createdById: getCurrentUserId()
    });

    const [notification, setNotification] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                symbol: initialData?.symbol || '',
                companyName: initialData?.companyName || '',
                industry: initialData?.industry || '',
                description: initialData?.description || '',
                currentPrice: initialData?.currentPrice || '',
                status: initialData?.status || 'PENDING',
                createdById: initialData?.createdById || getCurrentUserId()
            });
            setNotification({ type: '', message: '' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.symbol.length < 2 || formData.symbol.length > 20) {
            setNotification({ type: 'error', message: 'Mã cổ phiếu phải từ 2 đến 20 ký tự' });
            return;
        }
        if (Number(formData.currentPrice) <= 0) {
            setNotification({ type: 'error', message: 'Giá chào sàn phải lớn hơn 0' });
            return;
        }

        setLoading(true);
        setNotification({ type: '', message: '' });
        try {
            await onSubmitSuccess(formData);
            setNotification({
                type: 'success',
                message: isEdit ? 'Cập nhật thông tin chứng khoán thành công!' : 'Đăng ký niêm yết thành công! Đang chờ phê duyệt.'
            });
            setTimeout(() => { onClose(); }, 1200);
        } catch (err) {
            let errorMessage = "";

            if (typeof err === 'string') {
                errorMessage = err;
            } else if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.message) {
                errorMessage = err.message;
            }

            if (!errorMessage || errorMessage.includes("Uncategorized") || errorMessage.includes("status code 400")) {
                errorMessage = "Mã chứng khoán này đã tồn tại trên hệ thống! Vui lòng chọn mã khác.";
            }

            setNotification({
                type: 'error',
                message: errorMessage
            });
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
                className="bg-bg-elevated border border-border-subtle w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            >
                <div className="flex items-center justify-between p-5 border-b border-border-subtle">
                    <h3 className="text-lg font-bold text-text-primary">
                        {isEdit ? `Cập nhật thông tin ${formData.symbol}` : 'Đăng ký niêm yết Cổ phiếu mới'}
                    </h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <AnimatePresence mode="wait">
                        {notification.message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={cn(
                                    "flex items-start gap-3 text-xs p-3.5 rounded-xl border font-medium",
                                    notification.type === 'error' && "text-danger bg-danger-bg/10 border-danger/20",
                                    notification.type === 'success' && "text-success bg-success/10 border-success/20"
                                )}
                            >
                                {notification.type === 'error' ? (
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                )}
                                <span>{notification.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-xs text-text-secondary mb-1">Mã Cổ Phiếu *</label>
                            <input
                                type="text" required disabled={isEdit || loading}
                                value={formData.symbol} onChange={e => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                                className="input-base w-full text-sm uppercase font-mono disabled:opacity-50" placeholder="e.g. QUB"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs text-text-secondary mb-1">Giá Chào Sàn (VNĐ) *</label>
                            <input
                                type="number" required step="0.01" disabled={loading}
                                value={formData.currentPrice} onChange={e => setFormData({...formData, currentPrice: e.target.value})}
                                className="input-base w-full text-sm font-mono" placeholder="e.g. 15000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Tên Công Ty *</label>
                        <input
                            type="text" required disabled={loading}
                            value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}
                            className="input-base w-full text-sm" placeholder="Công ty Cổ phần Đầu tư Quantum"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Nhóm Ngành</label>
                        <input
                            type="text" disabled={loading}
                            value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}
                            className="input-base w-full text-sm" placeholder="Công nghệ / Tài chính"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Mô tả doanh nghiệp</label>
                        <textarea
                            rows="3" disabled={loading}
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                            className="input-base w-full text-sm resize-none" placeholder="Tóm tắt thông tin hoạt động..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-medium text-text-secondary bg-transparent hover:bg-white/5 rounded-lg transition-colors">
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary text-sm px-5 py-2">
                            {loading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Gửi duyệt'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default StockFormModal;
