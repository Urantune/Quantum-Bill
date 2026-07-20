import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, Lock, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        const result = await login(username, password);
        
        if (result.success) {
            navigate('/', { replace: true });
        } else {
            setError(result.error || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-6"
        >
            {/* Tiêu đề & Giới thiệu */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Chào mừng quay trở lại</h2>
                <p className="text-sm text-text-secondary">
                    Đăng nhập để quản lý danh mục và giao dịch cổ phiếu giả lập.
                </p>
            </div>

            {/* Khối hiển thị lỗi nếu có */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger flex items-start gap-2.5 text-sm"
                >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </motion.div>
            )}

            {/* Form Đăng nhập */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Trường Tên đăng nhập */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary" htmlFor="username">
                        Tên đăng nhập
                    </label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                        <input
                            id="username"
                            type="text"
                            placeholder="Nhập tên đăng nhập của bạn"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isSubmitting}
                            className="input-base w-full pl-11 text-sm bg-bg-surface border-border-subtle"
                            autoComplete="username"
                            required
                        />
                    </div>
                </div>

                {/* Trường Mật khẩu */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-text-secondary" htmlFor="password">
                            Mật khẩu
                        </label>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                            className="input-base w-full pl-11 pr-11 text-sm bg-bg-surface border-border-subtle"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3.5 top-3.5 text-text-secondary hover:text-text-primary focus:outline-none transition-colors"
                            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Nút Đăng nhập */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang xác thực...
                        </>
                    ) : (
                        'Đăng nhập'
                    )}
                </button>
            </form>

            {/* Đăng ký tài khoản mới */}
            <div className="text-center text-sm text-text-secondary pt-2">
                Chưa có tài khoản?{' '}
                <Link
                    to="/auth/register"
                    className="font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                    Đăng ký ngay
                </Link>
            </div>
        </motion.div>
    );
};

export default Login;
