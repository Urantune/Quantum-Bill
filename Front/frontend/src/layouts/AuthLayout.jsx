import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { LineChart, Shield, Zap, Target, ArrowLeft } from 'lucide-react';

const AuthLayout = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Nếu đã đăng nhập, chuyển hướng thẳng về dashboard
    if (isAuthenticated && !isLoading) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-bg-base flex flex-col lg:flex-row relative overflow-hidden select-none">
            {/* Vệt sáng Decor nền */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />

            {/* Cột trái: Form xác thực */}
            <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-between p-6 md:p-10 lg:p-12 z-10 bg-bg-base/30 backdrop-blur-md border-r border-border-subtle min-h-screen">
                {/* Header: Logo & nút quay lại trang chủ */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow transition-transform group-hover:scale-105">
                            <LineChart className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-extrabold text-lg text-text-primary tracking-tight">
                            StockPro <span className="text-primary">Elite</span>
                        </span>
                    </Link>
                    
                    <Link 
                        to="/" 
                        className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors py-1.5 px-3 rounded-pill bg-white/5 border border-border-subtle"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Trang chủ
                    </Link>
                </div>

                {/* Phần chứa Form (Login / Register / Forgot Password) */}
                <div className="flex-1 flex items-center justify-center my-8">
                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>
                </div>

                {/* Footer chân trang Auth */}
                <div className="text-center lg:text-left text-xs text-text-muted">
                    <p>&copy; {new Date().getFullYear()} StockPro Elite. Bảo lưu mọi quyền.</p>
                </div>
            </div>

            {/* Cột phải: Đồ họa/Visual thương hiệu cao cấp (Chỉ hiển thị trên desktop >= 1024px) */}
            <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] bg-bg-surface relative flex-col justify-center p-12 overflow-hidden border-l border-border-subtle">
                {/* Lưới grid decor */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,59,48,0.1),rgba(255,255,255,0))]" />
                <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{
                        backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-4"
                    >
                        <span className="px-3 py-1 rounded-pill bg-primary/10 border border-primary/20 text-xs font-semibold text-primary inline-flex items-center gap-1.5 uppercase tracking-wider">
                            <Zap className="w-3.5 h-3.5" />
                            Hệ thống mô phỏng thông minh
                        </span>
                        
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
                            Nâng tầm đầu tư với dữ liệu thời gian thực và phân tích chuyên sâu
                        </h1>
                        
                        <p className="text-text-secondary text-base leading-relaxed">
                            Trải nghiệm giao dịch cổ phiếu giả lập hoàn hảo nhất. Học hỏi, thực hành và tinh chỉnh chiến lược đầu tư mà không có bất kỳ rủi ro tài chính nào.
                        </p>
                    </motion.div>

                    {/* Khối biểu đồ chuyển động minh họa */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                        className="panel p-6 shadow-elevated bg-bg-base/40 border-white/5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center text-success">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-text-primary">Danh mục của bạn</h4>
                                    <p className="text-xs text-text-secondary">Tỷ suất lợi nhuận giả lập</p>
                                </div>
                            </div>
                            <span className="badge-up">+32.4%</span>
                        </div>

                        {/* Giả lập một đường biểu đồ đẹp mắt bằng SVG vẽ tay */}
                        <div className="h-32 w-full flex items-end">
                            <svg viewBox="0 0 400 120" className="w-full h-full text-success overflow-visible">
                                <defs>
                                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#16C784" stopOpacity="0.25"/>
                                        <stop offset="100%" stopColor="#16C784" stopOpacity="0.00"/>
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: 'easeInOut' }}
                                    d="M 0 100 Q 50 80 100 90 T 200 40 T 300 60 T 400 10"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M 0 100 Q 50 80 100 90 T 200 40 T 300 60 T 400 10 L 400 120 L 0 120 Z"
                                    fill="url(#chartGrad)"
                                />
                                {/* Điểm nhấp nháy ở cuối đồ thị */}
                                <circle cx="400" cy="10" r="4" className="fill-success animate-pulse" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Các tính năng nổi bật */}
                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-primary">
                                <Shield className="w-4 h-4" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-text-primary">An toàn Tuyệt đối</h5>
                                <p className="text-xs text-text-secondary leading-relaxed mt-0.5">Không rủi ro tiền thật, thử nghiệm chiến thuật an tâm.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-primary">
                                <Target className="w-4 h-4" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-text-primary">Chính xác Cao</h5>
                                <p className="text-xs text-text-secondary leading-relaxed mt-0.5">Dữ liệu thị trường giả lập mô phỏng trực quan thực tế.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
