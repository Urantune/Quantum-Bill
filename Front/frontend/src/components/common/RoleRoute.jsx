import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RoleRoute = ({ roles = [], allowPendingOwner = false }) => {
    const { user } = useAuth();
    const userRoles = user?.roles || [];
    const allowedByRole = roles.some((role) => userRoles.includes(role));
    const allowedPendingOwner = allowPendingOwner && user?.status === 'PENDING';

    if (allowedByRole || allowedPendingOwner) {
        return <Outlet />;
    }

    return <Navigate to="/app" replace />;
};

export default RoleRoute;
