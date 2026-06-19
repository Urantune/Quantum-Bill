// Dữ liệu demo tin tức thị trường chứng khoán Việt Nam
// Thumbnail sử dụng ảnh placeholder, dễ dàng thay bằng URL thật khi tích hợp API

export const MARKET_NEWS = [
    {
        id: 1,
        title: 'VN-Index vượt mốc 1.280 điểm nhờ dòng tiền khối ngoại',
        description:
            'Thị trường chứng khoán Việt Nam ghi nhận phiên giao dịch tích cực khi khối ngoại quay lại mua ròng mạnh nhóm cổ phiếu ngân hàng và bất động sản, kéo VN-Index tăng gần 9 điểm.',
        thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
        author: 'Minh Khang',
        time: '2 giờ trước',
        category: 'Thị trường',
    },
    {
        id: 2,
        title: 'Ngân hàng Nhà nước giữ nguyên lãi suất điều hành',
        description:
            'Trong kỳ họp định kỳ, Ngân hàng Nhà nước quyết định giữ nguyên các mức lãi suất điều hành nhằm hỗ trợ tăng trưởng kinh tế trong bối cảnh lạm phát được kiểm soát ổn định.',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
        author: 'Thanh Hà',
        time: '4 giờ trước',
        category: 'Chính sách',
    },
    {
        id: 3,
        title: 'Nhóm cổ phiếu công nghệ dẫn dắt thị trường phiên đầu tuần',
        description:
            'FPT và các doanh nghiệp công nghệ tiếp tục là điểm sáng khi nhà đầu tư kỳ vọng vào triển vọng tăng trưởng doanh thu từ mảng chuyển đổi số và xuất khẩu phần mềm.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        author: 'Quốc Anh',
        time: '6 giờ trước',
        category: 'Doanh nghiệp',
    },
    {
        id: 4,
        title: 'Khối ngoại bán ròng hơn 500 tỷ đồng trên HOSE',
        description:
            'Áp lực bán ròng từ khối ngoại tập trung chủ yếu ở nhóm cổ phiếu bất động sản và thép, trong khi nhóm ngân hàng vẫn duy trì được sự cân bằng giữa lực mua và bán.',
        thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
        author: 'Hải Yến',
        time: '8 giờ trước',
        category: 'Thị trường',
    },
    {
        id: 5,
        title: 'Doanh nghiệp bất động sản công bố kế hoạch tái cấu trúc nợ',
        description:
            'Nhiều doanh nghiệp bất động sản lớn đã công bố kế hoạch đàm phán gia hạn trái phiếu và tái cấu trúc nợ vay nhằm giảm áp lực tài chính trong giai đoạn thị trường còn nhiều thách thức.',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        author: 'Đức Thắng',
        time: '12 giờ trước',
        category: 'Doanh nghiệp',
    },
    {
        id: 6,
        title: 'Giá vàng trong nước biến động mạnh theo xu hướng thế giới',
        description:
            'Giá vàng SJC và vàng nhẫn trong nước có phiên điều chỉnh mạnh, theo sát diễn biến giá vàng thế giới khi đồng USD suy yếu trước kỳ vọng Fed sẽ điều chỉnh chính sách tiền tệ.',
        thumbnail: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
        author: 'Lan Phương',
        time: '1 ngày trước',
        category: 'Hàng hóa',
    },
];

export const NEWS_CATEGORIES = ['Tất cả', 'Thị trường', 'Doanh nghiệp', 'Chính sách', 'Hàng hóa'];