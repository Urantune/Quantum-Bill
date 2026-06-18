import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, CreditCard } from 'lucide-react';
import { MOTION } from '@/constants/theme';
import { cn } from '@/utils/cn';

const SETTINGS_TABS = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
    { id: 'language', label: 'Ngôn ngữ & Khu vực', icon: Globe },
    { id: 'billing', label: 'Thanh toán', icon: CreditCard },
];

/**
 * Toggle switch tái sử dụng cho phần cài đặt thông báo
 */
const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-border-subtle last:border-0">
        <div className="pr-4">
            <p className="text-sm font-medium text-text-primary">{label}</p>
            {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={cn(
                'relative w-11 h-6 rounded-pill transition-colors duration-300 shrink-0',
                enabled ? 'bg-primary' : 'bg-bg-elevated'
            )}
            aria-pressed={enabled}
        >
            <motion.span
                animate={{ x: enabled ? 20 : 2 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-card"
            />
        </button>
    </div>
);

/**
 * Trang Settings - cài đặt tài khoản và ứng dụng
 */
const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState({
        priceAlerts: true,
        newsDigest: true,
        portfolioReports: false,
        marketOpen: true,
    });

    const renderTabContent = () => {
        if (activeTab === 'profile') {
            return (
                <div className="space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                            A
                        </div>
                        <div>
                            <button className="text-sm font-medium text-primary hover:text-primary-hover">
                                Thay đổi ảnh đại diện
                            </button>
                            <p className="text-xs text-text-muted mt-1">JPG, PNG tối đa 2MB</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-text-secondary mb-1.5">Họ và tên</label>
                            <input type="text" defaultValue="Nguyễn Văn An" className="input-base w-full text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1.5">Email</label>
                            <input type="email" defaultValue="an.nguyen@email.com" className="input-base w-full text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1.5">Số điện thoại</label>
                            <input type="tel" defaultValue="0901 234 567" className="input-base w-full text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1.5">Số tài khoản giao dịch</label>
                            <input type="text" defaultValue="0123456789" disabled className="input-base w-full text-sm opacity-60" />
                        </div>
                    </div>

                    <button className="btn-primary text-sm">Lưu thay đổi</button>
                </div>
            );
        }

        if (activeTab === 'notifications') {
            return (
                <div>
                    <ToggleSwitch
                        label="Cảnh báo giá"
                        description="Nhận thông báo khi cổ phiếu trong danh sách theo dõi đạt ngưỡng giá đã đặt"
                        enabled={notifications.priceAlerts}
                        onChange={(v) => setNotifications((prev) => ({ ...prev, priceAlerts: v }))}
                    />
                    <ToggleSwitch
                        label="Tổng hợp tin tức"
                        description="Nhận email tổng hợp tin tức thị trường mỗi sáng"
                        enabled={notifications.newsDigest}
                        onChange={(v) => setNotifications((prev) => ({ ...prev, newsDigest: v }))}
                    />
                    <ToggleSwitch
                        label="Báo cáo danh mục"
                        description="Nhận báo cáo hiệu suất danh mục đầu tư hàng tuần"
                        enabled={notifications.portfolioReports}
                        onChange={(v) => setNotifications((prev) => ({ ...prev, portfolioReports: v }))}
                    />
                    <ToggleSwitch
                        label="Thông báo mở phiên"
                        description="Nhận thông báo khi thị trường mở phiên giao dịch"
                        enabled={notifications.marketOpen}
                        onChange={(v) => setNotifications((prev) => ({ ...prev, marketOpen: v }))}
                    />
                </div>
            );
        }

        // Các tab còn lại: hiển thị nội dung placeholder có cấu trúc rõ ràng để dễ mở rộng sau
        const tabInfo = SETTINGS_TABS.find((t) => t.id === activeTab);
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
                    <tabInfo.icon className="w-6 h-6 text-text-muted" />
                </div>
                <h3 className="text-text-primary font-semibold mb-1.5">{tabInfo.label}</h3>
                <p className="text-text-secondary text-sm max-w-sm">
                    Tính năng này sẽ sớm được cập nhật trong phiên bản tiếp theo của StockPro Elite.
                </p>
            </div>
        );
    };

    return (
        <motion.div {...MOTION.pageTransition}>
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Cài đặt</h1>
                <p className="text-text-secondary text-sm mt-1">Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                {/* Tab navigation */}
                <div className="lg:col-span-1">
                    <div className="panel p-2 space-y-1">
                        {SETTINGS_TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-left transition-colors duration-200',
                                        activeTab === tab.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                                    )}
                                >
                                    <Icon className="w-[18px] h-[18px]" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Nội dung tab */}
                <div className="lg:col-span-3 panel p-6">{renderTabContent()}</div>
            </div>
        </motion.div>
    );
};

export default Settings;