// Dữ liệu demo tổng hợp: gói dịch vụ, đánh giá khách hàng, câu hỏi thường gặp

export const PRICING_PLANS = [
    {
        id: 'basic',
        name: 'Cơ bản',
        price: 0,
        period: 'Miễn phí',
        description: 'Phù hợp cho người mới bắt đầu tìm hiểu thị trường',
        features: [
            'Theo dõi tối đa 10 mã cổ phiếu',
            'Dữ liệu giá chậm 15 phút',
            'Biểu đồ cơ bản',
            'Tin tức thị trường hàng ngày',
            'Hỗ trợ qua email',
        ],
        highlighted: false,
        cta: 'Bắt đầu miễn phí',
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 29,
        period: '/tháng',
        description: 'Dành cho nhà đầu tư cá nhân nghiêm túc',
        features: [
            'Theo dõi không giới hạn mã cổ phiếu',
            'Dữ liệu giá theo thời gian thực',
            'Biểu đồ kỹ thuật chuyên sâu',
            'Cảnh báo giá tự động',
            'Báo cáo phân tích hàng tuần',
            'Hỗ trợ ưu tiên 24/7',
        ],
        highlighted: false,
        cta: 'Nâng cấp Pro',
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 99,
        period: '/tháng',
        description: 'Trải nghiệm trọn vẹn dành cho nhà đầu tư chuyên nghiệp',
        features: [
            'Toàn bộ tính năng của gói Pro',
            'Truy cập API dữ liệu thị trường',
            'Phân tích AI dự báo xu hướng',
            'Tư vấn 1-1 với chuyên gia',
            'Báo cáo doanh nghiệp độc quyền',
            'Quản lý danh mục đa tài khoản',
            'Không giới hạn lệnh cảnh báo',
        ],
        highlighted: true,
        cta: 'Trải nghiệm Premium',
    },
];

export const TESTIMONIALS = [
    {
        id: 1,
        name: 'Nguyễn Thành Long',
        role: 'Nhà đầu tư cá nhân',
        avatar: 'https://i.pravatar.cc/120?img=12',
        rating: 5,
        content:
            'StockPro Elite giúp tôi theo dõi danh mục đầu tư một cách trực quan và nhanh chóng. Giao diện đẹp, dữ liệu cập nhật liên tục, rất đáng để đầu tư gói Premium.',
    },
    {
        id: 2,
        name: 'Trần Thị Mai Anh',
        role: 'Chuyên viên phân tích tài chính',
        avatar: 'https://i.pravatar.cc/120?img=47',
        rating: 5,
        content:
            'Công cụ phân tích kỹ thuật trên nền tảng rất mạnh, giúp tôi tiết kiệm nhiều thời gian khi đánh giá xu hướng thị trường so với các công cụ tôi từng sử dụng trước đây.',
    },
    {
        id: 3,
        name: 'Lê Hoàng Phúc',
        role: 'Nhà đầu tư F0',
        avatar: 'https://i.pravatar.cc/120?img=33',
        rating: 4,
        content:
            'Là người mới tham gia thị trường, tôi thấy giao diện dễ hiểu, có nhiều tin tức được tổng hợp đầy đủ. Rất phù hợp để bắt đầu hành trình đầu tư.',
    },
    {
        id: 4,
        name: 'Phạm Bích Ngọc',
        role: 'Quản lý quỹ đầu tư nhỏ',
        avatar: 'https://i.pravatar.cc/120?img=24',
        rating: 5,
        content:
            'Tính năng cảnh báo giá theo thời gian thực thực sự hữu ích, giúp tôi không bỏ lỡ các cơ hội giao dịch quan trọng trong ngày.',
    },
];

export const FAQ_ITEMS = [
    {
        id: 1,
        question: 'StockPro Elite có cung cấp dữ liệu thời gian thực không?',
        answer:
            'Gói Cơ bản cung cấp dữ liệu giá chậm 15 phút. Từ gói Pro trở lên, bạn sẽ được truy cập dữ liệu giá theo thời gian thực cho toàn bộ các mã cổ phiếu trên sàn HOSE, HNX và UPCOM.',
    },
    {
        id: 2,
        question: 'Tôi có thể hủy gói dịch vụ vào bất kỳ lúc nào không?',
        answer:
            'Có. Bạn có thể hủy gói Pro hoặc Premium vào bất kỳ thời điểm nào trong tháng. Gói dịch vụ sẽ tiếp tục hoạt động đến hết kỳ thanh toán hiện tại trước khi chuyển về gói Cơ bản.',
    },
    {
        id: 3,
        question: 'Nền tảng có hỗ trợ giao dịch trực tiếp không?',
        answer:
            'StockPro Elite hiện tập trung vào việc cung cấp dữ liệu, phân tích và theo dõi thị trường. Chúng tôi đang phát triển tính năng kết nối trực tiếp với các công ty chứng khoán để hỗ trợ đặt lệnh trong các phiên bản tiếp theo.',
    },
    {
        id: 4,
        question: 'Dữ liệu thống kê thị trường được lấy từ nguồn nào?',
        answer:
            'Dữ liệu được tổng hợp từ các sàn giao dịch chính thức HOSE, HNX, UPCOM cùng các nguồn tin tài chính uy tín, được xử lý và cập nhật liên tục trong giờ giao dịch.',
    },
    {
        id: 5,
        question: 'Tôi có thể sử dụng StockPro Elite trên điện thoại không?',
        answer:
            'Hoàn toàn có thể. Nền tảng được thiết kế responsive đầy đủ cho điện thoại, máy tính bảng và máy tính để bàn, đảm bảo trải nghiệm mượt mà trên mọi thiết bị.',
    },
    {
        id: 6,
        question: 'Gói Premium có phù hợp với nhà đầu tư mới không?',
        answer:
            'Gói Premium phù hợp hơn với nhà đầu tư đã có kinh nghiệm hoặc quản lý danh mục lớn. Nhà đầu tư mới nên bắt đầu với gói Cơ bản hoặc Pro để làm quen với các tính năng cốt lõi trước.',
    },
];