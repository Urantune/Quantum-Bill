import { useEffect, useState } from 'react';
import timeService from '@/services/timeService.js';

const SetTime = () => {
    const [form, setForm] = useState({ openTime: '10:00', closeTime: '18:00' });
    const [marketOpen, setMarketOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        timeService.getTradingTime()
            .then((data) => {
                setForm({ openTime: data.openTime, closeTime: data.closeTime });
                setMarketOpen(Boolean(data.marketOpen));
            })
            .catch((error) => setMessage(error.response?.data?.message || 'Không tải được giờ giao dịch.'))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        try {
            const data = await timeService.updateTradingTime(form);
            setForm({ openTime: data.openTime, closeTime: data.closeTime });
            setMarketOpen(Boolean(data.marketOpen));
            setMessage('Đã cập nhật giờ giao dịch.');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Cập nhật thất bại.');
        }
    };

    if (loading) {
        return <div className="p-6 text-text-secondary">Đang tải giờ giao dịch...</div>;
    }

    return (
        <div className="max-w-xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Cài đặt giờ giao dịch</h1>
                <p className="text-sm text-text-secondary mt-1">Áp dụng ngay cho mua/bán và job random giá cổ phiếu.</p>
            </div>

            <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
                <div>
                    <label className="text-xs font-semibold text-text-secondary">Giờ mở cửa</label>
                    <input
                        type="time"
                        value={form.openTime}
                        onChange={(event) => setForm((prev) => ({ ...prev, openTime: event.target.value }))}
                        className="input-base w-full mt-1"
                        required
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-text-secondary">Giờ đóng cửa</label>
                    <input
                        type="time"
                        value={form.closeTime}
                        onChange={(event) => setForm((prev) => ({ ...prev, closeTime: event.target.value }))}
                        className="input-base w-full mt-1"
                        required
                    />
                </div>

                <div className="text-sm text-text-secondary">
                    Trạng thái hiện tại: <span className={marketOpen ? 'text-success' : 'text-warning'}>{marketOpen ? 'Đang mở' : 'Đang đóng'}</span>
                </div>

                {message && <div className="text-sm text-primary">{message}</div>}

                <button type="submit" className="btn-primary px-4 py-2">Lưu giờ giao dịch</button>
            </form>
        </div>
    );
};

export default SetTime;
