import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Search, Bell, ChevronDown, User } from 'lucide-react';
import { MARKET_INDICES } from '@/data/marketData';
import { formatPercent, getChangeColorClass } from '@/utils/formatters';
import { cn } from '@/utils/cn';

/**
 * Top Navigation - hiển thị nút mở sidebar (mobile), thanh tìm kiếm,
 * ticker chỉ số thị trường thu nhỏ, thông báo và menu tài khoản.
 */
const Navbar = ({ onOpenSidebar }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-20 h-16 bg-bg-base/80 backdrop-blur-md border-b border-border-subtle flex items-center px-4 md:px-6 gap-4">
            {/* Nút mở Sidebar trên mobile/tablet */}
            <button
                onClick={onOpenSidebar}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 text-text-primary"
                aria-label="Mở menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Thanh tìm kiếm */}
            <div className="hidden md:flex items-center flex-1 max-w-md relative">
                <Search className="absolute left-3.5 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Tìm kiếm mã cổ phiếu, tin tức..."
                    className="input-base w-full pl-10 text-sm"
                />
            </div>

            {/* Ticker chỉ số thị trường - chỉ hiện trên desktop để không chật chội */}
            <div className="hidden xl:flex items-center gap-5 ml-auto mr-2">
                {MARKET_INDICES.map((index) => (
                    <div key={index.id} className="flex items-center gap-2 text-sm">
                        <span className="text-text-secondary font-medium">{index.name}</span>
                        <span className="font-financial font-semibold text-text-primary">{index.value}</span>
                        <span className={cn('font-financial text-xs font-medium', getChangeColorClass(index.change))}>
              {formatPercent(index.changePercent)}
            </span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 md:gap-3 ml-auto xl:ml-0">
                {/* Nút tìm kiếm icon trên mobile */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-white/5 text-text-secondary"
                    aria-label="Tìm kiếm"
                >
                    <Search className="w-[18px] h-[18px]" />
                </button>

                {/* Thông báo */}
                <button
                    className="relative p-2 rounded-lg hover:bg-white/5 text-text-secondary transition-colors duration-200"
                    aria-label="Thông báo"
                >
                    <Bell className="w-[18px] h-[18px]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </button>

                {/* Menu tài khoản */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-pill hover:bg-white/5 transition-colors duration-200"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 text-text-secondary hidden sm:block transition-transform duration-200',
                                isProfileOpen && 'rotate-180'
                            )}
                        />
                    </button>

                    {isProfileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute right-0 mt-2 w-52 panel shadow-elevated py-2 z-30"
                        >
                            <div className="px-4 py-2 border-b border-border-subtle mb-1">
                                <p className="text-sm font-semibold text-text-primary">Nguyễn Văn An</p>
                                <p className="text-xs text-text-secondary">Gói Pro</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors">
                                Hồ sơ cá nhân
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors">
                                Cài đặt tài khoản
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger-bg transition-colors">
                                Đăng xuất
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;