import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign
} from 'lucide-react';
import adminApi from '@/services/adminApi.js';
import { MOTION } from '@/constants/theme';

const Simulation = () => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const runSimulation = async () => {
    try {
      setRunning(true);
      setError(null);
      setResult(null);
      const res = await adminApi.runRandomSimulation(true);
      const data = res.data || res || [];
      setResult(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Chạy giả lập thị trường thất bại');
    } finally {
      setRunning(false);
    }
  };

  const formatAmount = (val) => {
    if (val == null) return '—';
    const n = Number(val);
    if (Number.isNaN(n)) return String(val);
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const upCount = (arr) => arr.filter(i => (i.direction || '').toUpperCase() === 'UP').length;
  const downCount = (arr) => arr.filter(i => (i.direction || '').toUpperCase() === 'DOWN').length;

  // Find biggest gainers / losers
  const getExtremeMovers = (arr) => {
    if (!arr || arr.length === 0) return { topGainer: null, topLoser: null };
    
    let topGainer = null;
    let topLoser = null;

    arr.forEach(item => {
      const pct = Number(item.changePercent || item.changePercentValue || 0);
      const dir = (item.direction || '').toUpperCase();
      
      if (dir === 'UP') {
        if (!topGainer || pct > Number(topGainer.changePercent || topGainer.changePercentValue || 0)) {
          topGainer = item;
        }
      } else if (dir === 'DOWN') {
        // changePercent is absolute or negative? Let's check magnitude of percentage
        if (!topLoser || pct > Number(topLoser.changePercent || topLoser.changePercentValue || 0)) {
          topLoser = item;
        }
      }
    });

    return { topGainer, topLoser };
  };

  const { topGainer, topLoser } = getExtremeMovers(result || []);

  const filteredResult = (result || []).filter(r => {
    const symbol = (r.symbol || r.stockSymbol || '').toLowerCase();
    return symbol.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Simulation Trigger Console */}
      <div className="panel p-6 bg-gradient-to-r from-bg-surface to-bg-elevated border-border-subtle relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-lg space-y-2">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Play className="w-5 h-5 text-primary fill-primary/10" />
            Giả lập phiên giao dịch ngẫu nhiên
          </h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            Hệ thống sẽ cập nhật ngẫu nhiên giá của tất cả các cổ phiếu đang hoạt động (ACTIVE) trong biên độ tối đa ±9% mỗi ngày. Lịch sử thay đổi giá sẽ được ghi nhận chi tiết tại MongoDB.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={running}
          className={`relative shrink-0 px-8 py-3 rounded-pill text-sm font-extrabold text-white flex items-center gap-2 transition-all duration-300 shadow-glow hover:shadow-glow-success hover:scale-[1.02] active:scale-[0.98] ${
            running 
              ? 'bg-text-muted cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-hover'
          }`}
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang tính toán giá...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Kích hoạt Simulation</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-card bg-danger-bg border border-danger/20 text-danger">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Results Overview Panels */}
      {result && result.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            <div className="panel p-4 bg-bg-surface border-border-subtle flex flex-col justify-between h-28">
              <span className="text-text-secondary text-xs font-semibold">Tăng giá (UP)</span>
              <div className="flex justify-between items-center mt-2">
                <span className="text-2xl font-extrabold text-success font-financial">{upCount(result)}</span>
                <span className="p-1.5 rounded bg-success-bg text-success border border-success/15">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="panel p-4 bg-bg-surface border-border-subtle flex flex-col justify-between h-28">
              <span className="text-text-secondary text-xs font-semibold">Giảm giá (DOWN)</span>
              <div className="flex justify-between items-center mt-2">
                <span className="text-2xl font-extrabold text-danger font-financial">{downCount(result)}</span>
                <span className="p-1.5 rounded bg-danger-bg text-danger border border-danger/15">
                  <ArrowDownLeft className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="panel p-4 bg-bg-surface border-border-subtle flex flex-col justify-between h-28">
              <span className="text-text-secondary text-xs font-semibold">Tổng mã xử lý</span>
              <div className="flex justify-between items-center mt-2">
                <span className="text-2xl font-extrabold text-text-primary font-financial">{result.length}</span>
                <span className="p-1.5 rounded bg-white/5 text-text-secondary border border-border-subtle">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Top Gainer summary */}
            <div className="panel p-4 bg-gradient-to-br from-success-bg to-transparent border-success/20 flex flex-col justify-between h-28 lg:col-span-1">
              <span className="text-success text-xs font-bold">🚀 Tăng mạnh nhất</span>
              {topGainer ? (
                <div className="mt-1">
                  <div className="font-financial font-extrabold text-text-primary">{topGainer.symbol || topGainer.stockSymbol}</div>
                  <div className="text-xs text-success font-bold mt-0.5">+{Number(topGainer.changePercent || topGainer.changePercentValue || 0).toFixed(2)}%</div>
                </div>
              ) : (
                <span className="text-xs text-text-muted">Không có</span>
              )}
            </div>

            {/* Top Loser summary */}
            <div className="panel p-4 bg-gradient-to-br from-danger-bg to-transparent border-danger/20 flex flex-col justify-between h-28 lg:col-span-1">
              <span className="text-danger text-xs font-bold">📉 Giảm sâu nhất</span>
              {topLoser ? (
                <div className="mt-1">
                  <div className="font-financial font-extrabold text-text-primary">{topLoser.symbol || topLoser.stockSymbol}</div>
                  <div className="text-xs text-danger font-bold mt-0.5">-{Number(topLoser.changePercent || topLoser.changePercentValue || 0).toFixed(2)}%</div>
                </div>
              ) : (
                <span className="text-xs text-text-muted">Không có</span>
              )}
            </div>
          </div>

          {/* Result details table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h4 className="text-base font-bold text-text-primary">Bảng theo dõi biến động chi tiết</h4>
              
              {/* Search Result */}
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Lọc mã cổ phiếu..."
                  className="input-base pl-9.5 py-1.5 w-full text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-card border border-border-subtle bg-bg-surface shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-white/5 text-xs text-text-secondary uppercase font-semibold">
                    <th className="p-4">Mã CP</th>
                    <th className="p-4">Giá cũ</th>
                    <th className="p-4">Giá mới</th>
                    <th className="p-4">Mức biến động</th>
                    <th className="p-4">% Thay đổi</th>
                    <th className="p-4 text-right">Xu hướng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-sm">
                  {filteredResult.map((r, idx) => {
                    const isUp = (r.direction || '').toUpperCase() === 'UP';
                    const changeVal = Math.abs(Number(r.changeAmount || r.change || 0));
                    const percentVal = Math.abs(Number(r.changePercent || r.changePercentValue || 0));

                    return (
                      <tr key={r.symbol || r.stockSymbol || idx} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 font-financial font-extrabold text-text-primary">{r.symbol || r.stockSymbol || '—'}</td>
                        <td className="p-4 font-financial text-text-secondary">{formatAmount(r.oldPrice)} VND</td>
                        <td className="p-4 font-financial font-semibold text-text-primary">{formatAmount(r.newPrice)} VND</td>
                        <td className={`p-4 font-financial font-semibold ${isUp ? 'text-success' : 'text-danger'}`}>
                          {isUp ? '+' : '-'}{formatAmount(changeVal)}
                        </td>
                        <td className={`p-4 font-financial font-extrabold ${isUp ? 'text-success' : 'text-danger'}`}>
                          {isUp ? '+' : '-'}{percentVal.toFixed(2)}%
                        </td>
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold ${
                            isUp 
                              ? 'bg-success-bg text-success border border-success/15' 
                              : 'bg-danger-bg text-danger border border-danger/15'
                          }`}>
                            {isUp ? (
                              <>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span>TĂNG</span>
                              </>
                            ) : (
                              <>
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                                <span>GIẢM</span>
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {result && result.length === 0 && (
        <div className="flex items-center gap-3 p-4 rounded-card bg-yellow-600/10 border border-yellow-500/20 text-yellow-300">
          <HelpCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Giả lập hoàn thành nhưng không có cổ phiếu nào được cập nhật (Vui lòng phê duyệt cổ phiếu ACTIVE trước).</span>
        </div>
      )}
    </div>
  );
};

export default Simulation;
