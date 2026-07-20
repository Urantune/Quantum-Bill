import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getEffectiveRole } from '@/utils/roleRedirect.js';

const RoleRoute = ({ roles = [], allowPendingOwner = false }) => {
    const { user } = useAuth();
    const effectiveRole = getEffectiveRole(user);
    const allowedByRole = roles.includes(effectiveRole);
    const allowedPendingOwner = allowPendingOwner && user?.status === 'PENDING';

    if (allowedByRole || allowedPendingOwner) {
        return <Outlet />;
    }

    return <Navigate to="/app" replace />;
};

export default RoleRoute;
