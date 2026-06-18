import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    TrendingUp,
    Star,
    Wallet,
    Newspaper,
    BarChart3,
    CreditCard,
    Settings,
    X,
    LineChart,
} from 'lucide-react';
import { NAV_ITEMS } from '@/constants/navigation';
import { cn } from '@/utils/cn';

// Map tên icon (string) sang component Lucide thực tế
const ICON_MAP = {
    LayoutDashboard,
    TrendingUp,
    Star,
    Wallet,
    Newspaper,
    BarChart3,
    CreditCard,
    Settings,
};

/**
 * Sidebar chính của ứng dụng.
 * - Desktop (>=1200px): hiển thị cố định bên trái, có thể thu gọn (collapsed)
 * - Mobile/Tablet (<1200px): ẩn mặc định, hiện dạng Drawer trượt từ trái khi isOpen=true
 */
const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
    const navContent = (
        <>
            {/* Logo */}
            <div
                className={cn(
                    'flex items-center gap-2.5 px-5 h-16 border-b border-border-subtle shrink-0',
                    isCollapsed && 'justify-center px-0'
                )}
            >
                <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                    <LineChart className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                {!isCollapsed && (
                    <span className="font-extrabold text-lg text-text-primary tracking-tight whitespace-nowrap">
            StockPro <span className="text-primary">Elite</span>
          </span>
                )}
                <button
                    onClick={onClose}
                    className="ml-auto lg:hidden p-1.5 rounded-md hover:bg-white/5 text-text-secondary"
                    aria-label="Đóng menu"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Menu điều hướng */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const Icon = ICON_MAP[item.icon];
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                                    isCollapsed && 'justify-center px-0'
                                )
                            }
                            title={isCollapsed ? item.label : undefined}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.span
                                            layoutId="sidebar-active-indicator"
                                            className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-primary rounded-full"
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                        />
                                    )}
                                    <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                                    {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Khối thông tin gói dịch vụ ở cuối sidebar */}
            {!isCollapsed && (
                <div className="p-4 m-3 rounded-card bg-gradient-primary/10 border border-primary/20">
                    <p className="text-xs font-semibold text-primary mb-1">Nâng cấp Premium</p>
                    <p className="text-xs text-text-secondary leading-relaxed mb-3">
                        Mở khóa dữ liệu thời gian thực và phân tích AI chuyên sâu.
                    </p>
                    <NavLink
                        to="/pricing"
                        onClick={onClose}
                        className="block text-center text-xs font-semibold bg-primary hover:bg-primary-hover text-white py-2 rounded-pill transition-colors duration-200"
                    >
                        Xem gói dịch vụ
                    </NavLink>
                </div>
            )}
        </>
    );

    return (
        <>
            {/* Sidebar Desktop - cố định, không phải drawer */}
            <aside
                className={cn(
                    'hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-bg-surface border-r border-border-subtle z-30 transition-all duration-300',
                    isCollapsed ? 'w-[76px]' : 'w-64'
                )}
            >
                {navContent}
                <button
                    onClick={onToggleCollapse}
                    className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-bg-elevated border border-border-subtle
            flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/40
            transition-colors duration-200"
                    aria-label="Thu gọn menu"
                >
                    <motion.span animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        ‹
                    </motion.span>
                </button>
            </aside>

            {/* Sidebar Mobile/Tablet - dạng Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={onClose}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="lg:hidden fixed top-0 left-0 h-screen w-72 bg-bg-surface border-r border-border-subtle z-50 flex flex-col"
                        >
                            {navContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;