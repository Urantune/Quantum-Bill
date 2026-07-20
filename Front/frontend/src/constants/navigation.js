// Cấu hình menu điều hướng cho Sidebar
// Tên icon tương ứng với bộ Lucide React (import động trong component Sidebar)

export const NAV_ITEMS = [
    {id: 'admin-dashboard', label: 'Tổng quan admin', path: '/admin', icon: 'LayoutDashboard', roles: ['ADMIN']},
    {id: 'admin-users', label: 'Quản lý user', path: '/admin/users', icon: 'Settings', roles: ['ADMIN']},
    {id: 'admin-stocks', label: 'Duyệt cổ phiếu', path: '/admin/stocks', icon: 'Building', roles: ['ADMIN']},
    {id: 'admin-simulation', label: 'Simulation', path: '/admin/simulation', icon: 'BarChart3', roles: ['ADMIN']},
    {id: 'company-dashboard', label: 'Quản lý doanh nghiệp', path: '/investor', icon: 'Building', roles: ['INVESTOR']},
    {id: 'owner-dashboard', label: 'Tổng quan đầu tư', path: '/owner', icon: 'LayoutDashboard', roles: ['OWNER']},
    {id: 'owner-wallet', label: 'Ví tiền', path: '/owner/wallet', icon: 'Wallet', roles: ['OWNER']},
    {id: 'owner-stocks', label: 'Bảng giá cổ phiếu', path: '/owner/stocks', icon: 'TrendingUp', roles: ['OWNER']},
    {id: 'owner-portfolio', label: 'Danh mục', path: '/owner/portfolio', icon: 'BarChart3', roles: ['OWNER']},
    {id: 'owner-transactions', label: 'Lịch sử giao dịch', path: '/owner/transactions', icon: 'LayoutDashboard', roles: ['OWNER']},
    {id: 'owner-ranking', label: 'Xếp hạng', path: '/owner/ranking', icon: 'Star', roles: ['OWNER']},
    {id: 'settime', label: 'Giờ giao dịch', path: '/admin/settime', icon: 'Settings', roles: ['ADMIN']}
];

export const FOOTER_LINKS = {
    company: {
        title: 'Công ty',
        links: [
            {label: 'Về chúng tôi', path: '/about'},
            {label: 'Tuyển dụng', path: '/careers'},
            {label: 'Tin tức', path: '/news'},
            {label: 'Đối tác', path: '/partners'},
        ],
    },
    products: {
        title: 'Sản phẩm',
        links: [
            {label: 'Giao dịch cổ phiếu', path: '/markets'},
            {label: 'Danh mục đầu tư', path: '/portfolio'},
            {label: 'Phân tích kỹ thuật', path: '/analytics'},
            {label: 'Cảnh báo giá', path: '/watchlist'},
        ],
    },
    pricing: {
        title: 'Gói dịch vụ',
        links: [
            {label: 'Gói Cơ bản', path: '/pricing'},
            {label: 'Gói Pro', path: '/pricing'},
            {label: 'Gói Premium', path: '/pricing'},
            {label: 'So sánh gói', path: '/pricing'},
        ],
    },
    contact: {
        title: 'Liên hệ',
        links: [
            {label: 'Hỗ trợ khách hàng', path: '/contact'},
            {label: 'Trung tâm trợ giúp', path: '/help'},
            {label: 'Liên hệ kinh doanh', path: '/contact'},
        ],
    },
};

export const SOCIAL_LINKS = [
    {id: 'facebook', label: 'Facebook', url: 'https://facebook.com', icon: 'Facebook'},
    {id: 'youtube', label: 'Youtube', url: 'https://youtube.com', icon: 'Youtube'},
    {id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin'},
    {id: 'twitter', label: 'X (Twitter)', url: 'https://twitter.com', icon: 'Twitter'},
];
