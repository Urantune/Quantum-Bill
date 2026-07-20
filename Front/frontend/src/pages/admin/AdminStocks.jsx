import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  HelpCircle, 
  Loader2, 
  AlertCircle,
  Briefcase
} from 'lucide-react';
import adminApi from '@/services/adminApi.js';
import { MOTION } from '@/constants/theme';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING'); // PENDING, ACTIVE, REJECTED, ALL

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getStocksPage(0, 200);
      const items = res.data?.content || res.data || [];
      setStocks(items);
    } catch (err) {
      console.error('Failed to fetch stocks:', err);
      const errMsg = err.response?.data?.message || err.message || 'Không thể tải danh sách cổ phiếu';
      setError(errMsg);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoadingId({ id, type: 'approve' });
      await adminApi.approveStock(id);
      await fetchStocks();
    } catch (err) {
      console.error('Approve failed:', err);
      alert(err.response?.data?.message || err.message || 'Phê duyệt cổ phiếu thất bại');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoadingId({ id, type: 'reject' });
      await adminApi.rejectStock(id);
      await fetchStocks();
    } catch (err) {
      console.error('Reject failed:', err);
      alert(err.response?.data?.message || err.message || 'Từ chối cổ phiếu thất bại');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter stocks based on search query & status filter tab
  const filteredStocks = stocks.filter(s => {
    const searchString = `${s.symbol || ''} ${s.companyName || ''} ${s.industry || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const status = (s.status || '').toUpperCase();

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'PENDING') {
      // Pending are stocks that are neither ACTIVE nor REJECTED
      return matchesSearch && status !== 'ACTIVE' && status !== 'REJECTED';
    }
    return matchesSearch && status === statusFilter;
  });

  const getStatusBadge = (status) => {
    const st = (status || '').toUpperCase();
    if (st === 'ACTIVE') {
      return (
        <span className="badge-up flex items-center gap-1 w-max">
          <CheckCircle className="w-3.5 h-3.5" />
          Đang giao dịch
        </span>
      );
    }
    if (st === 'REJECTED') {
      return (
        <span className="badge-down flex items-center gap-1 w-max">
          <XCircle className="w-3.5 h-3.5" />
          Đã từ chối
        </span>
      );
    }
    return (
      <span className="text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 w-max">
        <HelpCircle className="w-3.5 h-3.5" />
        Chờ phê duyệt
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-text-primary">Duyệt niêm yết cổ phiếu</h2>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã, tên công ty, ngành..."
            className="input-base pl-10 w-full text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-subtle pb-3 overflow-x-auto">
        {[
          { key: 'PENDING', label: 'Chờ phê duyệt' },
          { key: 'ACTIVE', label: 'Đang hoạt động' },
          { key: 'REJECTED', label: 'Đã từ chối' },
          { key: 'ALL', label: 'Tất cả cổ phiếu' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              statusFilter === tab.key
                ? 'bg-primary text-white shadow-glow'
                : 'bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-card bg-danger-bg border border-danger/20 text-danger">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-text-secondary">Đang tải danh sách cổ phiếu...</p>
        </div>
      ) : filteredStocks.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-subtle rounded-card bg-bg-surface/30">
          <TrendingUp className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary font-medium">Không tìm thấy cổ phiếu nào phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredStocks.map((s) => {
              const isPending = (s.status || '').toUpperCase() !== 'ACTIVE' && (s.status || '').toUpperCase() !== 'REJECTED';
              
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="panel p-5 relative overflow-hidden transition-all duration-300 hover:border-white/20 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Symbol & Status */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xl text-primary font-financial tracking-wide">{s.symbol}</span>
                          <span className="text-[10px] uppercase font-semibold text-text-muted px-2 py-0.5 rounded bg-white/5 border border-border-subtle flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-purple-400" />
                            {s.industry || 'Chưa phân ngành'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-text-primary mt-1 line-clamp-1">{s.companyName}</h3>
                      </div>
                      {getStatusBadge(s.status)}
                    </div>

                    {/* Body: Description */}
                    <p className="text-text-secondary text-xs leading-relaxed line-clamp-3 min-h-[54px]">
                      {s.description || 'Không có mô tả chi tiết cho cổ phiếu này.'}
                    </p>

                    {/* Price Info */}
                    <div className="flex justify-between items-center bg-white/5 border border-border-subtle rounded-lg p-3">
                      <span className="text-xs text-text-secondary">Giá khởi điểm / Hiện tại</span>
                      <span className="font-financial font-extrabold text-sm text-text-primary">
                        {typeof s.currentPrice !== 'undefined' && s.currentPrice !== null 
                          ? Number(s.currentPrice).toLocaleString() 
                          : '—'}{' '}
                        VND
                      </span>
                    </div>
                  </div>

                  {/* Actions (Only for pending) */}
                  {isPending && (
                    <div className="flex gap-3 mt-5">
                      <button
                        disabled={actionLoadingId !== null}
                        onClick={() => handleApprove(s.id)}
                        className="flex-1 py-2 rounded-lg text-xs font-bold bg-success hover:bg-success/90 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {actionLoadingId?.id === s.id && actionLoadingId?.type === 'approve' ? (
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span>Phê duyệt</span>
                      </button>

                      <button
                        disabled={actionLoadingId !== null}
                        onClick={() => handleReject(s.id)}
                        className="flex-1 py-2 rounded-lg text-xs font-bold bg-danger/20 text-danger hover:bg-danger hover:text-white border border-danger/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {actionLoadingId?.id === s.id && actionLoadingId?.type === 'reject' ? (
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>Từ chối</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Stocks;
