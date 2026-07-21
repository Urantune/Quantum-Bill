import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, KeyRound, Briefcase, AlertCircle, Loader2 } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('OWNER');

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registrationUsername = username.trim();

        // Validation cơ bản
        if (!fullName.trim() || !email.trim() || !registrationUsername || !password.trim()) {
            setError('Vui lòng điền đầy đủ tất cả các trường.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp.');
            return;
        }

        if (!/^[a-z0-9_]{2,30}$/.test(registrationUsername)) {
            setError('Tên đăng nhập chỉ gồm chữ thường không dấu, số hoặc dấu gạch dưới, từ 2 đến 30 ký tự.');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        const result = await register(fullName.trim(), email.trim(), registrationUsername, password, role);

        if (result.success) {
            if (result.pending) {
                navigate('/auth/login', {
                    replace: true,
                    state: { message: 'Đăng ký công ty thành công. Vui lòng chờ Admin duyệt trước khi đăng nhập.' },
                });
            } else {
                navigate('/app', { replace: true });
            }
        } else {
            setError(result.error || 'Đăng ký tài khoản thất bại.');
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
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Đăng ký tài khoản mới</h2>
                <p className="text-sm text-text-secondary">
                    Bắt đầu hành trình giả lập giao dịch của bạn hôm nay.
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

            {/* Form Đăng ký */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Họ tên đầy đủ */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary" htmlFor="fullName">
                        {role === 'INVESTOR' ? 'Tên công ty' : 'Họ và tên'}
                    </label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                        <input
                            id="fullName"
                            type="text"
                            placeholder={role === 'INVESTOR' ? 'Công ty Cổ phần ABC' : 'Nguyễn Văn A'}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isSubmitting}
                            className="input-base w-full pl-11 text-sm bg-bg-surface border-border-subtle"
                            required
                        />
                    </div>
                </div>

                {/* Địa chỉ Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary" htmlFor="email">
                        Địa chỉ Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                        <input
                            id="email"
                            type="email"
                            placeholder="username@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            className="input-base w-full pl-11 text-sm bg-bg-surface border-border-subtle"
                            required
                        />
                    </div>
                </div>

                {/* Tên đăng nhập */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary" htmlFor="username">
                        Tên đăng nhập (Username)
                    </label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                        <input
                            id="username"
                            type="text"
                            placeholder={role === 'INVESTOR' ? 'Ví dụ: fpt' : 'viet_tuan_123'}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isSubmitting}
                            className="input-base w-full pl-11 text-sm bg-bg-surface border-border-subtle"
                            required
                        />
                    </div>
                </div>

                {/* Vai trò / Phân quyền */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary" htmlFor="role">
                        Vai trò tham gia
                    </label>
                    <div className="relative">
                        <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={isSubmitting}
                            className="input-base w-full pl-11 text-sm bg-bg-surface border-border-subtle appearance-none cursor-pointer"
                            required
                        >
                            <option value="OWNER">OWNER (Người đầu tư)</option>
                            <option value="INVESTOR">INVESTOR (Công ty niêm yết)</option>
                        </select>
                        <div className="absolute right-3.5 top-3.5 pointer-events-none text-text-secondary">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Mật khẩu */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary" htmlFor="password">
                        Mật khẩu
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                        <input
                            id="password"
                            type="password"
                            placeholder="Tối thiểu 6 ký tự"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                            className="input-base w-full pl-11 text-sm bg-bg-surface border-border-subtle"
                            required
                        />
                    </div>
                </div>

                {/* Nhập lại Mật khẩu */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary" htmlFor="confirmPassword">
                        Xác nhận Mật khẩu
                    </label>
                    <div className="relative">
                        <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isSubmitting}
                            className="input-base w-full pl-11 text-sm bg-bg-surface border-border-subtle"
                            required
                        />
                    </div>
                </div>

                {/* Nút Đăng ký */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang xử lý tài khoản...
                        </>
                    ) : (
                        'Đăng ký tài khoản'
                    )}
                </button>
            </form>

            {/* Trở lại đăng nhập */}
            <div className="text-center text-sm text-text-secondary pt-2">
                Đã có tài khoản?{' '}
                <Link
                    to="/auth/login"
                    className="font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                    Đăng nhập
                </Link>
            </div>
        </motion.div>
    );
};

export default Register;
