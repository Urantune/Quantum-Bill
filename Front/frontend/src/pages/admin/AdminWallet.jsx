import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import adminApi from '@/services/adminApi';
import apiClient from '@/services/api';
import { MOTION } from '@/constants/theme';

const AdminWallet = () => {
  const [investors, setInvestors] = useState([]);
  const [loadingInvestors, setLoadingInvestors] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [adjustType, setAdjustType] = useState('CREDIT'); // CREDIT or DEBIT
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('Nạp tiền hệ thống');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Load all users to filter investors
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingInvestors(true);
        const res = await adminApi.getUsers();
        const users = res.data || res || [];
        // Filter users who are investors
        const filtered = users.filter(u => 
          (u.roles || []).some(role => ['INVESTOR', 'ROLE_INVESTOR'].includes(role.toUpperCase()))
        );
        setInvestors(filtered);
      } catch (err) {
        console.error('Failed to load investors', err);
      } finally {
        setLoadingInvestors(false);
      }
    };
    loadUsers();
  }, []);

  // Fetch balance when investor changes
  useEffect(() => {
    if (!selectedInvestor) {
      setCurrentBalance(null);
      return;
    }

    const fetchWallet = async () => {
      try {
        setLoadingBalance(true);
        const res = await apiClient.get(`/api/trading/wallet/${selectedInvestor.id}`);
        if (res.data) {
          setCurrentBalance(res.data.balance);
        }
      } catch (err) {
        console.error('Failed to fetch wallet balance', err);
        setCurrentBalance(0); // fallback or error state
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchWallet();
  }, [selectedInvestor]);

  const handleSelectInvestor = (inv) => {
    setSelectedInvestor(inv);
    setSearchQuery(`${inv.fullName} (${inv.username})`);
    setShowDropdown(false);
    setMessage(null);
  };

  const getFilteredInvestors = () => {
    if (!searchQuery || selectedInvestor) return investors.slice(0, 5);
    return investors.filter(inv => 
      `${inv.fullName} ${inv.username} ${inv.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const quickAmounts = {
    CREDIT: [1000000, 5000000, 10000000, 50000000, 100000000],
    DEBIT: [1000000, 5000000, 10000000, 25000000, 50000000]
  };

  const handleQuickAmount = (val) => {
    setAmount(val.toString());
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedInvestor) {
      setMessage({ type: 'error', text: 'Vui lòng chọn một nhà đầu tư' });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setMessage({ type: 'error', text: 'Vui lòng nhập số tiền lớn hơn 0' });
      return;
    }

    try {
      setSubmitting(true);
      // If debit, pass negative amount
      const finalAmount = adjustType === 'DEBIT' ? -numericAmount : numericAmount;
      
      const res = await adminApi.adjustWallet(selectedInvestor.id, finalAmount, reason);
      const data = res.data || res;
      
      setMessage({ 
        type: 'success', 
        text: `Đã điều chỉnh số dư thành công! Số dư mới: ${(data.balance || 0).toLocaleString()} VND`
      });

      // Update current balance state
      setCurrentBalance(data.balance);
      setAmount('');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Điều chỉnh số dư thất bại';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate projected balance
  const projectedBalance = (() => {
    if (currentBalance == null) return null;
    const numericAmount = parseFloat(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) return currentBalance;
    return adjustType === 'CREDIT' ? currentBalance + numericAmount : currentBalance - numericAmount;
  })();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Adjustment Terminal Form */}
        <div className="lg:col-span-2 panel p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
            <Wallet className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-text-primary">Bảng điều chỉnh số dư</h3>
          </div>

          <form onSubmit={submit} className="space-y-4">
            
            {/* Search Investor selection */}
            <div className="relative">
              <label className="text-xs font-semibold text-text-secondary uppercase">Chọn nhà đầu tư (Investor)</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (selectedInvestor) setSelectedInvestor(null);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Nhập tên, username hoặc email nhà đầu tư..."
                  className="input-base pl-9.5 w-full text-sm"
                  required
                />
                
                {selectedInvestor && (
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedInvestor(null);
                      setSearchQuery('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:underline"
                  >
                    Xóa chọn
                  </button>
                )}
              </div>

              {/* Dropdown search suggestions */}
              {showDropdown && !loadingInvestors && (
                <div className="absolute left-0 right-0 mt-1 bg-bg-elevated border border-border-subtle rounded-lg shadow-elevated z-20 max-h-48 overflow-y-auto divide-y divide-border-subtle">
                  {getFilteredInvestors().map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => handleSelectInvestor(inv)}
                      className="p-3 cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-center text-sm"
                    >
                      <div>
                        <div className="font-semibold text-text-primary">{inv.fullName}</div>
                        <div className="text-xs text-text-secondary mt-0.5">{inv.username}</div>
                      </div>
                      <span className="text-[10px] text-text-muted font-financial">ID: {inv.id}</span>
                    </div>
                  ))}
                  {getFilteredInvestors().length === 0 && (
                    <div className="p-3 text-xs text-text-secondary text-center">Không tìm thấy nhà đầu tư</div>
                  )}
                </div>
              )}
            </div>

            {/* Type selector (Credit / Debit) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Phương thức điều chỉnh</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAdjustType('CREDIT');
                    setReason('Nạp tiền hệ thống');
                  }}
                  className={`py-2.5 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    adjustType === 'CREDIT'
                      ? 'bg-success-bg text-success border-success/40 shadow-sm'
                      : 'bg-white/5 text-text-secondary border-border-subtle hover:bg-white/10 hover:text-text-primary'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Nạp tiền (Credit)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAdjustType('DEBIT');
                    setReason('Thu hồi số dư hệ thống');
                  }}
                  className={`py-2.5 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    adjustType === 'DEBIT'
                      ? 'bg-danger-bg text-danger border-danger/40 shadow-sm'
                      : 'bg-white/5 text-text-secondary border-border-subtle hover:bg-white/10 hover:text-text-primary'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                  Khấu trừ (Debit)
                </button>
              </div>
            </div>

            {/* Amount input */}
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase">Số tiền (VND)</label>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ví dụ: 10,000,000"
                className="input-base mt-1 w-full text-sm font-financial font-semibold"
                required
              />
            </div>

            {/* Quick amount suggest list */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-muted uppercase">Gợi ý nhanh</span>
              <div className="flex gap-2 flex-wrap">
                {quickAmounts[adjustType].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    className="px-3 py-1 rounded bg-white/5 border border-border-subtle text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all text-text-secondary hover:text-primary font-financial"
                  >
                    {adjustType === 'DEBIT' ? '-' : '+'}{val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase">Lý do điều chỉnh</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do nạp/trừ tiền..."
                className="input-base mt-1 w-full text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-lg text-sm font-extrabold text-white flex items-center justify-center gap-2 transition-all shadow-glow ${
                adjustType === 'CREDIT' 
                  ? 'bg-success hover:bg-success/90 hover:shadow-glow-success' 
                  : 'bg-danger hover:bg-danger/90'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang thực hiện giao dịch...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>Xác nhận điều chỉnh ví</span>
                </>
              )}
            </button>

            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-3 border text-sm mt-3 ${
                message.type === 'success' 
                  ? 'bg-success-bg text-success border-success/20' 
                  : 'bg-danger-bg text-danger border-danger/20'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Wallet state previews */}
        <div className="panel p-6 flex flex-col justify-between space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h3 className="text-sm font-extrabold text-text-secondary uppercase tracking-wider">Thông tin ví xem trước</h3>
          </div>

          {!selectedInvestor ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-text-muted">
              <Wallet className="w-12 h-12 stroke-[1.5] mb-3" />
              <p className="text-xs">Chọn nhà đầu tư ở bảng bên để xem trước biến động số dư ví.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* Investor Profile Summary */}
              <div className="space-y-3">
                <div className="text-xs text-text-secondary font-semibold">Tài khoản chọn</div>
                <div className="p-3 bg-white/5 border border-border-subtle rounded-lg">
                  <div className="font-bold text-text-primary">{selectedInvestor.fullName}</div>
                  <div className="text-xs text-text-secondary mt-0.5">Username: @{selectedInvestor.username}</div>
                  <div className="text-xs text-text-muted mt-0.5">Email: {selectedInvestor.email}</div>
                </div>
              </div>

              {/* Balance flow indicators */}
              <div className="space-y-4">
                
                {/* Current Balance */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Số dư hiện tại:</span>
                  <span className="font-financial font-extrabold text-text-primary text-sm">
                    {loadingBalance ? (
                      <Loader2 className="w-4 h-4 animate-spin inline-block text-primary" />
                    ) : (
                      `${(currentBalance || 0).toLocaleString()} VND`
                    )}
                  </span>
                </div>

                {/* Adjust flow */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Lượng thay đổi:</span>
                  {amount && !Number.isNaN(parseFloat(amount)) ? (
                    <span className={`font-financial font-extrabold flex items-center gap-1 text-sm ${
                      adjustType === 'CREDIT' ? 'text-success' : 'text-danger'
                    }`}>
                      {adjustType === 'CREDIT' ? (
                        <>
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+{parseFloat(amount).toLocaleString()} VND</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>-{parseFloat(amount).toLocaleString()} VND</span>
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-text-muted font-financial">—</span>
                  )}
                </div>

                {/* Direction arrow line indicator */}
                <div className="flex items-center justify-center py-2">
                  <ArrowRight className="w-5 h-5 text-text-muted rotate-90 lg:rotate-0" />
                </div>

                {/* Projected Balance */}
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex justify-between items-center">
                  <span className="text-xs font-bold text-primary">Số dư dự kiến:</span>
                  <span className="font-financial font-extrabold text-sm text-text-primary">
                    {loadingBalance ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : projectedBalance != null ? (
                      `${projectedBalance.toLocaleString()} VND`
                    ) : (
                      '—'
                    )}
                  </span>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminWallet;
