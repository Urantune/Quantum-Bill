import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { investorService } from '@/services/investorService';
import { getCurrentUserId } from '@/services/session.js';
import apiClient from '@/services/api.js';

const RegisterStock = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const isEdit = !!editId;

    const [formData, setFormData] = useState({
        symbol: '',
        companyName: '',
        industry: '',
        description: '',
        currentPrice: '',
        createdById: getCurrentUserId()
    });
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [loadingStock, setLoadingStock] = useState(false);
    const [newAccount, setNewAccount] = useState({ fullName: '', username: '', email: '', password: '' });

    useEffect(() => {
        if (editId) {
            setLoadingStock(true);
            // Fetch stock details for editing
            fetch(`/api/stocks/${editId}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        symbol: data.symbol || '',
                        companyName: data.companyName || '',
                        industry: data.industry || '',
                        description: data.description || '',
                        currentPrice: data.currentPrice || '',
                        createdById: getCurrentUserId()
                    });
                })
                .catch(() => setNotification({ type: 'error', message: 'Không tải được thông tin cổ phiếu.' }))
                .finally(() => setLoadingStock(false));
        }
    }, [editId]);

    if (loadingStock) {
        return <div className="p-6 text-text-secondary text-sm">Đang tải thông tin...</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEdit && (!newAccount.username || !newAccount.email || !newAccount.password)) {
            setNotification({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin tài khoản công ty.' });
            return;
        }
        if (!isEdit && !/^[a-z0-9_]{2,30}$/.test(newAccount.username)) {
            setNotification({ type: 'error', message: 'Username chỉ gồm chữ thường, số, gạch dưới, 2-30 ký tự.' });
            return;
        }
        if (!isEdit && newAccount.password.length < 6) {
            setNotification({ type: 'error', message: 'Mật khẩu tối thiểu 6 ký tự.' });
            return;
        }
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
            if (isEdit) {
                await investorService.updateStock(Number(editId), formData);
                setNotification({ type: 'success', message: 'Cập nhật thông tin chứng khoán thành công!' });
            } else {
                await apiClient.post('/api/auth/register/company-listing', {
                    companyName: formData.companyName.trim(),
                    email: newAccount.email.trim(),
                    username: newAccount.username.trim(),
                    password: newAccount.password,
                    symbol: formData.symbol.trim(),
                    industry: formData.industry.trim(),
                    description: formData.description.trim(),
                    initialPrice: Number(formData.currentPrice),
                });
                setNotification({ type: 'success', message: 'Đã gửi tài khoản và hồ sơ niêm yết. Vui lòng chờ Admin phê duyệt.' });
            }
            setTimeout(() => navigate(isEdit ? '/investor' : '/auth/login'), 1500);
        } catch (err) {
            let errorMessage = '';
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
            setNotification({ type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto space-y-6 p-6"
        >
            {/* Back button */}
            <button
                onClick={() => navigate(isEdit ? '/investor' : '/auth/login')}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Quay lại Dashboard
            </button>

            <div>
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                    {isEdit ? `Cập nhật: ${formData.symbol}` : 'Đăng ký niêm yết Cổ phiếu mới'}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                    {isEdit
                        ? 'Chỉnh sửa thông tin cổ phiếu đã niêm yết.'
                        : 'Tạo tài khoản công ty và gửi hồ sơ cổ phiếu lên Admin trong một lần.'}
                </p>
            </div>

            {notification.message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
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

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isEdit && (
                    <div className="space-y-4 pb-5 border-b border-border-subtle">
                        <h3 className="text-sm font-semibold text-text-primary">Thông tin tài khoản công ty</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Username *</label>
                                <input type="text" required disabled={loading} value={newAccount.username}
                                    onChange={e => setNewAccount({ ...newAccount, username: e.target.value.toLowerCase() })}
                                    className="input-base w-full text-sm" placeholder="vd: fpt" />
                            </div>
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Email công ty *</label>
                                <input type="email" required disabled={loading} value={newAccount.email}
                                    onChange={e => setNewAccount({ ...newAccount, email: e.target.value })}
                                    className="input-base w-full text-sm" placeholder="contact@company.vn" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Mật khẩu *</label>
                            <input type="password" required minLength="6" disabled={loading} value={newAccount.password}
                                onChange={e => setNewAccount({ ...newAccount, password: e.target.value })}
                                className="input-base w-full text-sm" placeholder="Tối thiểu 6 ký tự" />
                        </div>
                        <h3 className="text-sm font-semibold text-text-primary pt-2">Thông tin niêm yết</h3>
                    </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className="block text-xs text-text-secondary mb-1">Mã Cổ Phiếu *</label>
                        <input
                            type="text" required disabled={isEdit || loading}
                            value={formData.symbol}
                            onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                            className="input-base w-full text-sm uppercase font-mono disabled:opacity-50"
                            placeholder="e.g. QUB"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs text-text-secondary mb-1">Giá Chào Sàn (VNĐ) *</label>
                        <input
                            type="number" required step="0.01" disabled={loading}
                            value={formData.currentPrice}
                            onChange={e => setFormData({ ...formData, currentPrice: e.target.value })}
                            className="input-base w-full text-sm font-mono"
                            placeholder="e.g. 15000"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-text-secondary mb-1">Tên Công Ty *</label>
                    <input
                        type="text" required disabled={loading}
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        className="input-base w-full text-sm"
                        placeholder="Công ty Cổ phần Đầu tư Quantum"
                    />
                </div>

                <div>
                    <label className="block text-xs text-text-secondary mb-1">Nhóm Ngành</label>
                    <input
                        type="text" disabled={loading}
                        value={formData.industry}
                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                        className="input-base w-full text-sm"
                        placeholder="Công nghệ / Tài chính"
                    />
                </div>

                <div>
                    <label className="block text-xs text-text-secondary mb-1">Mô tả doanh nghiệp</label>
                    <textarea
                        rows="3" disabled={loading}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="input-base w-full text-sm resize-none"
                        placeholder="Tóm tắt thông tin hoạt động..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate(isEdit ? '/investor' : '/auth/login')}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-text-secondary bg-transparent hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isEdit ? 'Cập nhật' : 'Gửi duyệt'}
                    </button>
                </div>
            </form>

        </motion.div>
    );
};

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default RegisterStock;
