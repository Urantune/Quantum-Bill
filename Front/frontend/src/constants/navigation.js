// Cấu hình menu điều hướng cho Sidebar
// Tên icon tương ứng với bộ Lucide React (import động trong component Sidebar)

export const NAV_ITEMS = [
    {id: 'investor-dashboard', label: 'Tổng quan investor', path: '/investor', icon: 'LayoutDashboard', roles: ['INVESTOR']},
    {id: 'investor-wallet', label: 'Ví tiền', path: '/investor/wallet', icon: 'Wallet', roles: ['INVESTOR']},
    {id: 'investor-stocks', label: 'Bảng giá cổ phiếu', path: '/investor/stocks', icon: 'TrendingUp', roles: ['INVESTOR']},
    {id: 'investor-buy', label: 'Mua cổ phiếu', path: '/investor/buy', icon: 'CreditCard', roles: ['INVESTOR']},
    {id: 'investor-sell', label: 'Bán cổ phiếu', path: '/investor/sell', icon: 'CreditCard', roles: ['INVESTOR']},
    {id: 'investor-portfolio', label: 'Danh mục', path: '/investor/portfolio', icon: 'BarChart3', roles: ['INVESTOR']},
    {id: 'investor-transactions', label: 'Lịch sử giao dịch', path: '/investor/transactions', icon: 'LayoutDashboard', roles: ['INVESTOR']},
    {id: 'investor-ranking', label: 'Xếp hạng', path: '/investor/ranking', icon: 'Star', roles: ['INVESTOR', 'ADMIN']},
    {id: 'owner-dashboard', label: 'Doanh nghiệp', path: '/owner', icon: 'Building', roles: ['OWNER'], statuses: ['PENDING']}
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
