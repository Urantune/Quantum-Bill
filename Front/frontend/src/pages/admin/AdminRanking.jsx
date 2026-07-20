import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Search, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Loader2, 
  AlertCircle,
  Medal,
  Award
} from 'lucide-react';
import adminApi from '@/services/adminApi';
import { MOTION } from '@/constants/theme';

const AdminRanking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadRanking = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getInvestorRanking();
      const data = res.data || res || [];
      
      // Sort descending by total assets
      const sorted = (Array.isArray(data) ? data : []).sort((a, b) => 
        Number(b.totalAssets || 0) - Number(a.totalAssets || 0)
      );
      setRanking(sorted);
    } catch (err) {
      console.error('Failed to load ranking:', err);
      setError(err.message || 'Không thể tải bảng xếp hạng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRanking();
  }, []);

  const formatAmount = (val) => {
    if (val == null) return '—';
    const n = Number(val);
    if (Number.isNaN(n)) return String(val);
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Filter ranking based on search query
  const filteredRanking = ranking.filter(r => {
    const searchString = `${r.username || ''} ${r.fullName || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Top 3 Podium spots
  const top1 = ranking[0] || null;
  const top2 = ranking[1] || null;
  const top3 = ranking[2] || null;

  return (
    <div className="space-y-6">
      {/* Header and search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-text-primary">Bảng xếp hạng Nhà đầu tư</h2>
        
        <div className="flex items-center gap-3 w-full md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên hoặc username..."
              className="input-base pl-9.5 w-full text-sm"
            />
          </div>
          
          <button
            onClick={loadRanking}
            disabled={loading}
            className="p-2.5 bg-white/5 border border-border-subtle hover:bg-white/10 rounded-lg text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
            title="Tải lại bảng xếp hạng"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-card bg-danger-bg border border-danger/20 text-danger">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-text-secondary font-medium">Đang tải dữ liệu xếp hạng...</p>
        </div>
      ) : ranking.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border-subtle rounded-card bg-bg-surface/30">
          <Trophy className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary font-medium">Chưa có dữ liệu xếp hạng nhà đầu tư</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Podium Highlights for Top 3 (Only visible when no search filter active) */}
          {!searchTerm && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-6 max-w-4xl mx-auto">
              
              {/* Rank 2 (Silver Medal) */}
              {top2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="panel p-5 bg-gradient-to-t from-slate-400/5 to-slate-400/10 border-slate-400/20 text-center flex flex-col items-center order-2 md:order-1 h-72 justify-between"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-400/10 border border-slate-400/30 flex items-center justify-center text-slate-300 mb-3 shadow-sm relative">
                      <Medal className="w-6 h-6" />
                      <span className="absolute -bottom-1 bg-slate-400 text-bg-base text-[10px] font-black px-1.5 py-0.2 rounded-full">2</span>
                    </div>
                    <div className="font-extrabold text-sm text-text-primary line-clamp-1">{top2.fullName}</div>
                    <div className="text-xs text-text-muted mt-0.5">@{top2.username}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase text-text-muted font-semibold">Tổng tài sản</div>
                    <div className="font-financial font-extrabold text-slate-300 text-sm">{formatAmount(top2.totalAssets)} VND</div>
                  </div>
                </motion.div>
              )}

              {/* Rank 1 (Gold Cup) - Main Center card */}
              {top1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="panel p-6 bg-gradient-to-t from-yellow-500/5 to-yellow-500/15 border-yellow-500/30 text-center flex flex-col items-center order-1 md:order-2 h-80 justify-between shadow-glow"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mb-3 shadow-md relative">
                      <Trophy className="w-7 h-7" />
                      <span className="absolute -bottom-1 bg-yellow-500 text-bg-base text-xs font-black px-2 py-0.5 rounded-full">1</span>
                    </div>
                    <div className="font-black text-base text-text-primary line-clamp-1">{top1.fullName}</div>
                    <div className="text-xs text-yellow-400/80 font-bold mt-0.5">@{top1.username}</div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase text-yellow-500/80 font-bold">Tổng tài sản</div>
                    <div className="font-financial font-black text-yellow-400 text-lg">{formatAmount(top1.totalAssets)} VND</div>
                  </div>
                </motion.div>
              )}

              {/* Rank 3 (Bronze Medal) */}
              {top3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="panel p-5 bg-gradient-to-t from-amber-600/5 to-amber-600/10 border-amber-600/20 text-center flex flex-col items-center order-3 h-64 justify-between"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-600/10 border border-amber-600/30 flex items-center justify-center text-amber-500 mb-3 shadow-sm relative">
                      <Award className="w-5 h-5" />
                      <span className="absolute -bottom-1 bg-amber-600 text-bg-base text-[9px] font-black px-1.5 py-0.2 rounded-full">3</span>
                    </div>
                    <div className="font-extrabold text-sm text-text-primary line-clamp-1">{top3.fullName}</div>
                    <div className="text-xs text-text-muted mt-0.5">@{top3.username}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] uppercase text-text-muted font-semibold">Tổng tài sản</div>
                    <div className="font-financial font-extrabold text-amber-500 text-sm">{formatAmount(top3.totalAssets)} VND</div>
                  </div>
                </motion.div>
              )}

            </div>
          )}

          {/* Full ranking list table */}
          <div className="overflow-x-auto rounded-card border border-border-subtle bg-bg-surface shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-white/5 text-xs text-text-secondary uppercase font-semibold">
                  <th className="p-4 w-20">Thứ hạng</th>
                  <th className="p-4">Nhà đầu tư</th>
                  <th className="p-4">Tổng tài sản</th>
                  <th className="p-4 text-right">Lợi nhuận/Thua lỗ (P/L)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {filteredRanking.map((r, i) => {
                  const isPositive = r.profitLoss && Number(r.profitLoss) >= 0;
                  const originalRank = ranking.findIndex(item => item.userId === r.userId) + 1;

                  return (
                    <tr key={r.userId || i} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-financial font-extrabold">
                          {originalRank === 1 ? (
                            <Trophy className="w-4 h-4 text-yellow-400" />
                          ) : originalRank === 2 ? (
                            <Medal className="w-4 h-4 text-slate-300" />
                          ) : originalRank === 3 ? (
                            <Award className="w-4 h-4 text-amber-600" />
                          ) : null}
                          <span className={`${originalRank <= 3 ? 'text-primary font-black' : 'text-text-secondary font-semibold'}`}>
                            #{originalRank}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-text-primary">{r.fullName || 'Nhà đầu tư'}</div>
                        <div className="text-xs text-text-secondary mt-0.5">@{r.username}</div>
                      </td>
                      <td className="p-4 font-financial font-extrabold text-text-primary">
                        {formatAmount(r.totalAssets)} <span className="text-[10px] text-text-muted">VND</span>
                      </td>
                      <td className="p-4 text-right">
                        {r.profitLoss != null ? (
                          <span className={`inline-flex items-center gap-1 font-financial font-black ${
                            isPositive ? 'text-success' : 'text-danger'
                          }`}>
                            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span>{isPositive ? '+' : ''}{formatAmount(r.profitLoss)} VND</span>
                          </span>
                        ) : (
                          <span className="text-text-muted font-financial">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminRanking;
