// Cấu hình menu điều hướng cho Sidebar
// Tên icon tương ứng với bộ Lucide React (import động trong component Sidebar)

export const NAV_ITEMS = [
    { id: 'dashboard', label: 'Tổng quan', path: '/', icon: 'LayoutDashboard' },
    { id: 'markets', label: 'Thị trường', path: '/markets', icon: 'TrendingUp' },
    { id: 'watchlist', label: 'Theo dõi', path: '/watchlist', icon: 'Star' },
    { id: 'portfolio', label: 'Danh mục', path: '/portfolio', icon: 'Wallet' },
    { id: 'news', label: 'Tin tức', path: '/news', icon: 'Newspaper' },
    { id: 'analytics', label: 'Phân tích', path: '/analytics', icon: 'BarChart3' },
    { id: 'pricing', label: 'Gói dịch vụ', path: '/pricing', icon: 'CreditCard' },
    { id: 'settings', label: 'Cài đặt', path: '/settings', icon: 'Settings' },
];

export const FOOTER_LINKS = {
    company: {
        title: 'Công ty',
        links: [
            { label: 'Về chúng tôi', path: '/about' },
            { label: 'Tuyển dụng', path: '/careers' },
            { label: 'Tin tức', path: '/news' },
            { label: 'Đối tác', path: '/partners' },
        ],
    },
    products: {
        title: 'Sản phẩm',
        links: [
            { label: 'Giao dịch cổ phiếu', path: '/markets' },
            { label: 'Danh mục đầu tư', path: '/portfolio' },
            { label: 'Phân tích kỹ thuật', path: '/analytics' },
            { label: 'Cảnh báo giá', path: '/watchlist' },
        ],
    },
    pricing: {
        title: 'Gói dịch vụ',
        links: [
            { label: 'Gói Cơ bản', path: '/pricing' },
            { label: 'Gói Pro', path: '/pricing' },
            { label: 'Gói Premium', path: '/pricing' },
            { label: 'So sánh gói', path: '/pricing' },
        ],
    },
    contact: {
        title: 'Liên hệ',
        links: [
            { label: 'Hỗ trợ khách hàng', path: '/contact' },
            { label: 'Trung tâm trợ giúp', path: '/help' },
            { label: 'Liên hệ kinh doanh', path: '/contact' },
        ],
    },
};

export const SOCIAL_LINKS = [
    { id: 'facebook', label: 'Facebook', url: 'https://facebook.com', icon: 'Facebook' },
    { id: 'youtube', label: 'Youtube', url: 'https://youtube.com', icon: 'Youtube' },
    { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
    { id: 'twitter', label: 'X (Twitter)', url: 'https://twitter.com', icon: 'Twitter' },
];