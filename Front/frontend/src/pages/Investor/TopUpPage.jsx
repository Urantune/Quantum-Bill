import { useState } from 'react';
import { useParams } from 'react-router-dom';
import investorService from '@/services/investorService.js';
import { formatCurrency } from '@/utils/formatters.js';

const TopUpPage = () => {
    const { token } = useParams();
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const completeTopUp = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await investorService.completeTopUp(token);
            setWallet(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Link nạp tiền không hợp lệ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Nạp tiền ảo</h1>
                <p className="text-sm text-text-secondary mt-1">Link này chỉ dùng được một lần.</p>
            </div>

            <div className="panel p-6 space-y-4">
                {wallet ? (
                    <div className="space-y-2">
                        <p className="text-success font-semibold">Nạp tiền thành công.</p>
                        <p className="text-sm text-text-secondary">Số dư mới</p>
                        <p className="text-3xl font-bold text-text-primary">{formatCurrency(wallet.balance)}</p>
                    </div>
                ) : (
                    <>
                        {error && <p className="text-danger text-sm">{error}</p>}
                        <button
                            onClick={completeTopUp}
                            disabled={loading}
                            className="btn-primary px-4 py-2"
                        >
                            {loading ? 'Đang nạp...' : 'Nạp tiền vào tài khoản'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TopUpPage;
