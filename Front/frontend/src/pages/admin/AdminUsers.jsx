import { useEffect, useState } from 'react';
import adminApi from '@/services/adminApi.js';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers();
      // Backend returns a JSON array of users
      setUsers(res.data || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleApprove = async (id) => {
    await adminApi.approveOwner(id);
    fetchUsers();
  };

  const handleToggleLock = async (id, status) => {
    const shouldLock = (status || '').toUpperCase() !== 'LOCKED';
    await adminApi.toggleLockUser(id, shouldLock);
    fetchUsers();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Danh sách người dùng</h2>
      {loading ? <p>Đang tải...</p> : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="py-2">{u.id}</td>
                <td className="py-2">{u.username || u.email}</td>
                <td className="py-2">{(u.roles || []).join(', ')}</td>
                <td className="py-2">{(u.status || '').toUpperCase() === 'LOCKED' ? 'Đã khóa' : (u.status || '—')}</td>
                <td className="py-2 space-x-2">
                  {(u.status || '').toUpperCase() === 'PENDING' && !(u.roles || []).includes('INVESTOR') && (
                    <button onClick={() => handleApprove(u.id)} className="btn btn-sm">Duyệt công ty</button>
                  )}
                  <button onClick={() => handleToggleLock(u.id, u.status)} className="btn btn-sm">
                    {(u.status || '').toUpperCase() === 'LOCKED' ? 'Mở khoá' : 'Khóa'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
