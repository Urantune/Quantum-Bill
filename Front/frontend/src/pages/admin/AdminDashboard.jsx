import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import adminApi from '@/services/adminApi';

const AdminDashboard = () => {
  const [usersPending, setUsersPending] = useState(null);
  const [stocksPending, setStocksPending] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [uRes, sRes] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getStocksPage(0, 200),
        ]);

        const users = uRes.data || [];
        // Count users with non-ACTIVE status as "pending"
        const uPending = users.filter(u => (u.status || '').toUpperCase() !== 'ACTIVE').length;
        setUsersPending(uPending);

        const items = sRes.data?.content || sRes.data || [];
        const sPending = items.filter(s => {
          const st = (s.status || '').toUpperCase();
          return st !== 'ACTIVE' && st !== 'REJECTED';
        }).length;
        setStocksPending(sPending);

        // Simulation: backend has no public admin endpoint for last result; leave null
        setSimResult(null);
      } catch (err) {
        console.error('Failed to load admin dashboard data', err);
        setUsersPending(0);
        setStocksPending(0);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-card bg-white/5">Người dùng chờ duyệt: <strong>{usersPending ?? '—'}</strong></div>
        <div className="p-4 rounded-card bg-white/5">Cổ phiếu chờ duyệt: <strong>{stocksPending ?? '—'}</strong></div>
        <div className="p-4 rounded-card bg-white/5">Kết quả simulation: <strong>{simResult ?? '—'}</strong></div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => navigate('/admin/users')} className="btn">Quản lý người dùng</button>
        <button onClick={() => navigate('/admin/stocks')} className="btn">Quản lý cổ phiếu</button>
        <button onClick={() => navigate('/admin/simulation')} className="btn">Chạy simulation</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
