import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Skeleton from '@/components/common/Skeleton';

const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
                <div className="w-full max-w-4xl space-y-6">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                    <Skeleton className="h-48 w-full rounded-card" />
                    <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-24 w-full rounded-card" />
                        <Skeleton className="h-24 w-full rounded-card" />
                        <Skeleton className="h-24 w-full rounded-card" />
                    </div>
                </div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
