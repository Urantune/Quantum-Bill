import { useEffect, useState } from 'react';
import adminApi from '@/services/adminApi.js';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStocksPage(0, 200);
      const items = res.data?.content || res.data || [];
      // show stocks that are not ACTIVE (pending/created)
      const pending = items.filter(s => (s.status || '').toUpperCase() !== 'ACTIVE' && (s.status || '').toUpperCase() !== 'REJECTED');
      setStocks(pending);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchStocks(); }, []);

  const handleApprove = async (id) => { await adminApi.approveStock(id); fetchStocks(); };
  const handleReject = async (id) => { await adminApi.rejectStock(id); fetchStocks(); };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Duyệt cổ phiếu</h2>
      {loading ? <p>Đang tải...</p> : (
        <div className="space-y-3">
          {stocks.map(s => (
            <div key={s.id} className="p-3 rounded-card border">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{s.symbol} — {s.companyName}</div>
                  <div className="text-xs text-text-secondary">Trạng thái: {s.status || '—'}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleApprove(s.id)} className="btn btn-sm">Duyệt</button>
                  <button onClick={() => handleReject(s.id)} className="btn btn-sm">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stocks;
