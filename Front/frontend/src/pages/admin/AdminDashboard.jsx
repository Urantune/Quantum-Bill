import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  Play, 
  Wallet, 
  Star, 
  ArrowRight,
  ShieldCheck,
  Server
} from 'lucide-react';
import adminApi from '@/services/adminApi';
import { MOTION } from '@/constants/theme';

const AdminDashboard = () => {
  const [usersPending, setUsersPending] = useState(null);
  const [stocksPending, setStocksPending] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
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
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải thông tin hệ thống');
      setUsersPending(0);
      setStocksPending(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const statCards = [
    {
      title: 'Tài khoản chờ duyệt',
      value: usersPending,
      desc: 'Owner cần cấp quyền doanh nghiệp',
      icon: Users,
      color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400',
    },
    {
      title: 'Cổ phiếu chờ duyệt',
      value: stocksPending,
      desc: 'Mã niêm yết mới của doanh nghiệp',
      icon: TrendingUp,
      color: 'from-primary/20 to-red-500/20 border-primary/30 text-primary',
    },
    {
      title: 'Trạng thái máy chủ',
      value: 'Online',
      desc: 'Hệ thống hoạt động bình thường',
      icon: Server,
      color: 'from-success/20 to-emerald-500/20 border-success/30 text-success',
      isPulse: true,
    }
  ];

  const shortcuts = [
    {
      title: 'Quản lý người dùng',
      desc: 'Duyệt tài khoản Owner mới đăng ký, thực hiện khóa hoặc mở tài khoản người dùng vi phạm.',
      icon: Users,
      path: '/admin/users',
      badge: usersPending > 0 ? `${usersPending} chờ duyệt` : null,
    },
    {
      title: 'Duyệt niêm yết',
      desc: 'Xem chi tiết thông tin và phê duyệt hoặc từ chối các mã cổ phiếu mới được đề xuất bởi Owner.',
      icon: TrendingUp,
      path: '/admin/stocks',
      badge: stocksPending > 0 ? `${stocksPending} yêu cầu` : null,
    },
    {
      title: 'Giả lập thị trường',
      desc: 'Kích hoạt chạy simulation cập nhật giá ngẫu nhiên và theo dõi kết quả tăng giảm giá ngay lập tức.',
      icon: Play,
      path: '/admin/simulation',
    },
    {
      title: 'Quản lý ví tiền',
      desc: 'Nạp thêm tiền hoặc trừ bớt số dư trong ví nhà đầu tư kèm lý do điều chỉnh cụ thể.',
      icon: Wallet,
      path: '/admin/wallet',
    },
    {
      title: 'Bảng xếp hạng',
      desc: 'Theo dõi xếp hạng hiệu quả đầu tư và tổng tài sản nắm giữ của các investor trong hệ thống.',
      icon: Star,
      path: '/admin/ranking',
    },
  ];

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-card bg-danger-bg border border-danger/20 text-danger-hover">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Grid Statistics Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={MOTION.scaleIn}
              className={`relative overflow-hidden p-6 rounded-card border bg-gradient-to-br ${card.color} shadow-sm flex flex-col justify-between h-40`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-text-secondary text-sm font-semibold">{card.title}</span>
                  <p className="text-xs text-text-muted mt-1">{card.desc}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-financial tracking-tight">
                  {loading ? '—' : card.value ?? '...'}
                </span>
                {card.isPulse && (
                  <span className="relative flex h-3 w-3 mb-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Grid Features Shortcuts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">Tính năng quản trị nhanh</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shortcuts.map((sc, i) => {
            const Icon = sc.icon;
            return (
              <motion.div
                key={sc.path}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(sc.path)}
                className="group relative cursor-pointer panel p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow flex flex-col justify-between h-56"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    {sc.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white animate-pulse">
                        {sc.badge}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors duration-300 mb-2">
                    {sc.title}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
                    {sc.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
