import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
    const { forgotPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Vui lòng nhập địa chỉ email.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        const result = await forgotPassword(email);

        if (result.success) {
            setIsSuccess(true);
        } else {
            setError(result.error || 'Gửi yêu cầu khôi phục thất bại. Vui lòng thử lại.');
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-6 text-center"
            >
                <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">Yêu cầu đã được gửi!</h2>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                        Chúng tôi đã gửi một mật khẩu tạm thời mới đến địa chỉ email <strong className="text-text-primary">{email}</strong>. Vui lòng kiểm tra hộp thư đến (hoặc thư rác) của bạn.
                    </p>
                </div>

                <div className="pt-4">
                    <Link
                        to="/auth/login"
                        className="btn-primary w-full py-3 inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại Đăng nhập
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-6"
        >
            {/* Tiêu đề & Giới thiệu */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Khôi phục mật khẩu</h2>
                <p className="text-sm text-text-secondary">
                    Nhập email đã đăng ký của bạn. Hệ thống sẽ tự động tạo mật khẩu tạm thời và gửi về email đó.
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Trường email */}
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

                {/* Nút gửi */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang xử lý yêu cầu...
                        </>
                    ) : (
                        'Gửi yêu cầu'
                    )}
                </button>
            </form>

            {/* Quay lại Đăng nhập */}
            <div className="text-center text-sm text-text-secondary pt-2">
                Nhớ mật khẩu của bạn?{' '}
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

export default ForgotPassword;
