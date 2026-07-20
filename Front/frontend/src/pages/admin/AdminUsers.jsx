import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UserCheck, 
  Lock, 
  Unlock, 
  Shield, 
  User, 
  TrendingUp, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import adminApi from '@/services/adminApi.js';
import { MOTION } from '@/constants/theme';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // ALL, ADMIN, OWNER, INVESTOR

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getUsers();
      setUsers(res.data || res || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      const errMsg = err.response?.data?.message || err.message || 'Không thể tải danh sách người dùng';
      setError(errMsg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoadingId({ id, type: 'approve' });
      await adminApi.approveOwner(id);
      await fetchUsers();
    } catch (err) {
      console.error('Approve failed:', err);
      alert(err.response?.data?.message || err.message || 'Duyệt Owner thất bại');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleLock = async (id, status) => {
    try {
      const isLocked = (status || '').toUpperCase() === 'LOCKED';
      setActionLoadingId({ id, type: 'lock' });
      await adminApi.toggleLockUser(id, !isLocked);
      await fetchUsers();
    } catch (err) {
      console.error('Toggle lock failed:', err);
      alert(err.response?.data?.message || err.message || 'Thay đổi trạng thái khóa thất bại');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter users based on search term & role filter
  const filteredUsers = users.filter(u => {
    const searchString = `${u.username || ''} ${u.email || ''} ${u.fullName || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    
    if (roleFilter === 'ALL') return matchesSearch;
    const matchesRole = (u.roles || []).some(role => role.toUpperCase() === roleFilter.toUpperCase());
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (roles) => {
    const rArray = roles || [];
    if (rArray.includes('ADMIN') || rArray.includes('ROLE_ADMIN')) {
      return <Shield className="w-4 h-4 text-primary shrink-0" />;
    }
    if (rArray.includes('OWNER')) {
      return <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />;
    }
    return <User className="w-4 h-4 text-blue-400 shrink-0" />;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-text-primary">Quản lý người dùng</h2>
        
        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo username, tên, email..."
            className="input-base pl-10 w-full text-sm"
          />
        </div>
      </div>

      {/* Role filter tabs */}
      <div className="flex gap-2 border-b border-border-subtle pb-3 overflow-x-auto">
        {['ALL', 'INVESTOR', 'OWNER', 'ADMIN'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              roleFilter === role
                ? 'bg-primary text-white shadow-glow'
                : 'bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10'
            }`}
          >
            {role === 'ALL' ? 'Tất cả' : role}
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
          <p className="text-sm text-text-secondary">Đang tải danh sách người dùng...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-subtle rounded-card bg-bg-surface/30">
          <User className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary font-medium">Không tìm thấy người dùng phù hợp</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border-subtle bg-bg-surface shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-white/5 text-xs text-text-secondary uppercase font-semibold">
                <th className="p-4 w-16">ID</th>
                <th className="p-4">Thông tin tài khoản</th>
                <th className="p-4">Vai trò (Role)</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-sm">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((u) => {
                  const isLocked = (u.status || '').toUpperCase() === 'LOCKED';
                  const isPending = (u.status || '').toUpperCase() === 'PENDING';
                  const hasOwnerRole = (u.roles || []).includes('OWNER');

                  return (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 font-financial font-medium text-text-secondary">{u.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-text-primary">{u.fullName || 'Chưa cập nhật'}</div>
                        <div className="text-xs text-text-secondary mt-0.5">{u.username || u.email}</div>
                        <div className="text-[10px] text-text-muted mt-0.5">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {getRoleIcon(u.roles)}
                          <span className="font-semibold text-xs text-text-primary">
                            {(u.roles || []).join(', ') || 'USER'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {isLocked ? (
                          <span className="badge-down flex items-center gap-1 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                            Đã khóa (Locked)
                          </span>
                        ) : isPending ? (
                          <span className="text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Chờ duyệt
                          </span>
                        ) : (
                          <span className="badge-up flex items-center gap-1 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            Hoạt động (Active)
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Approve Owner action */}
                          {!hasOwnerRole && (
                            <button
                              disabled={actionLoadingId !== null}
                              onClick={() => handleApprove(u.id)}
                              className="px-3 py-1.5 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white border border-purple-500/30 transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {actionLoadingId?.id === u.id && actionLoadingId?.type === 'approve' ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5" />
                              )}
                              <span>Duyệt Owner</span>
                            </button>
                          )}

                          {/* Lock/Unlock action */}
                          <button
                            disabled={actionLoadingId !== null}
                            onClick={() => handleToggleLock(u.id, u.status)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5 border ${
                              isLocked
                                ? 'bg-success/20 text-success border-success/30 hover:bg-success hover:text-white'
                                : 'bg-danger/20 text-danger border-danger/30 hover:bg-danger hover:text-white'
                            }`}
                          >
                            {actionLoadingId?.id === u.id && actionLoadingId?.type === 'lock' ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : isLocked ? (
                              <Unlock className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                            <span>{isLocked ? 'Mở khóa' : 'Khóa tài khoản'}</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
