import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                <nav className="space-x-3">
                    <NavLink to="/admin" className="text-sm text-primary">Tổng quan</NavLink>
                    <NavLink to="/admin/users" className="text-sm">Người dùng</NavLink>
                    <NavLink to="/admin/stocks" className="text-sm">Cổ phiếu</NavLink>
                    <NavLink to="/admin/simulation" className="text-sm">Simulation</NavLink>
                </nav>
            </div>

            <div className="bg-bg-surface p-4 rounded-card">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
