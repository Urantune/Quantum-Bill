import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, KeyRound, User, AlertCircle, Loader2 } from 'lucide-react';

const RegisterCompany = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registrationUsername = username.trim();

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

        const result = await register(fullName.trim(), email.trim(), registrationUsername, password, 'INVESTOR');

        if (result.success) {
            navigate('/auth/login', {
                replace: true,
                state: { message: 'Đăng ký công ty thành công. Vui lòng chờ Admin duyệt trước khi đăng nhập.' },
            });
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
            {/* Tiêu đề */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">Đăng ký Công ty Niêm yết</h2>
                </div>
                <p className="text-sm text-text-secondary">
                    Đăng ký tài khoản doanh nghiệp để niêm yết cổ phiếu và quản lý giao dịch trên sàn.
                </p>
            </div>

            {/* Thông báo */}
            <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl text-xs text-text-secondary space-y-1">
                <p className="font-semibold text-text-primary">Lưu ý dành cho Công ty niêm yết:</p>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                    <li>Tên đăng nhập nên đặt theo mã cổ phiếu của công ty (VD: <code className="text-primary bg-primary/10 px-1 rounded">fpt</code>)</li>
                    <li>Sau khi đăng ký, tài khoản cần được <strong>Admin duyệt</strong> mới có thể đăng nhập</li>
                    <li>Sau khi được duyệt, bạn có thể đăng ký niêm yết cổ phiếu và duyệt lệnh giao dịch</li>
                </ul>
            </div>

            {/* Khối hiển thị lỗi */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên công ty */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary" htmlFor="fullName">
                        Tên công ty
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                        <input
                            id="fullName"
                            type="text"
                            placeholder="Công ty Cổ phần ABC"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isSubmitting}
                            className="input-base w-full pl-11 text-sm bg-bg-surface border-border-subtle"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary" htmlFor="email">
                        Địa chỉ Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                        <input
                            id="email"
                            type="email"
                            placeholder="company@domain.com"
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
                            placeholder="Ví dụ: fpt"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isSubmitting}
                            className="input-base w-full pl-11 text-sm bg-bg-surface border-border-subtle"
                            required
                        />
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

                {/* Nhập lại mật khẩu */}
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
                            Đang xử lý...
                        </>
                    ) : (
                        'Đăng ký Công ty niêm yết'
                    )}
                </button>
            </form>

            {/* Links */}
            <div className="text-center text-sm text-text-secondary pt-2 space-y-2">
                <p>
                    Đăng ký với tư cách Nhà đầu tư?{' '}
                    <Link
                        to="/auth/register"
                        className="font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                        Đăng ký OWNER
                    </Link>
                </p>
                <p>
                    Đã có tài khoản?{' '}
                    <Link
                        to="/auth/login"
                        className="font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default RegisterCompany;
