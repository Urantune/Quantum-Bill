import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            navigate('/auth/login?error=' + error, { replace: true });
            return;
        }

        if (token) {
            // Decode and persist
            try {
                const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
                const paddedPayload = encodedPayload.padEnd(encodedPayload.length + (4 - encodedPayload.length % 4) % 4, '=');
                const payload = JSON.parse(atob(paddedPayload));
                const user = {
                    id: payload.id,
                    fullName: payload.fullName || payload.sub,
                    email: payload.email,
                    username: payload.sub,
                    status: 'ACTIVE',
                    roles: payload.roles || [],
                };
                localStorage.setItem('quantum_bill_user', JSON.stringify(user));
                localStorage.setItem('quantum_bill_token', token);
                window.location.replace('/app');
            } catch {
                navigate('/auth/login?error=invalid_token', { replace: true });
            }
        } else {
            navigate('/auth/login?error=no_token', { replace: true });
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-text-secondary text-sm">Đang xử lý đăng nhập...</p>
        </div>
    );
};

export default OAuthCallback;
