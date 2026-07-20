import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Utility to decode JWT payload safely
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const AdminRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null; // show nothing while auth initializing

    // 1) Check roles from user object
    const roles = user?.roles || [];
    const isAdminFromUser = roles.includes('ROLE_ADMIN') || roles.includes('ADMIN') || roles.includes('ADMINISTRATOR');
    if (isAdminFromUser) return <Outlet />;

    // 2) Fallback: try to decode token from localStorage if available
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = decodeToken(token);
            const tokenRoles = payload?.roles || payload?.role || [];
            const tokenRolesArray = Array.isArray(tokenRoles) ? tokenRoles : [tokenRoles];
            const isAdminFromToken = tokenRolesArray.some(r => ['ROLE_ADMIN','ADMIN','ADMINISTRATOR'].includes((r || '').toUpperCase()));
            if (isAdminFromToken) return <Outlet />;
        }
    } catch (e) {
        // ignore and fallthrough to redirect
    }

    // Not admin -> redirect to home
    return <Navigate to="/" replace />;
};

export default AdminRoute;
