// Các hàm tiện ích định dạng số liệu, dùng chung toàn bộ ứng dụng

/**
 * Định dạng số thành chuỗi tiền tệ VNĐ
 * @param {number} value - Giá trị cần định dạng
 * @param {boolean} compact - Nếu true, hiển thị dạng rút gọn (K, M, tỷ)
 */
export const formatCurrency = (value, compact = false) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';

    if (compact) {
        return formatCompactNumber(value) + ' đ';
    }

    return new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' đ';
};

/**
 * Định dạng số dạng rút gọn: 1.500.000 -> 1,5tr ; 6.850.000.000.000 -> 6.850 tỷ
 */
export const formatCompactNumber = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';

    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (abs >= 1_000_000_000_000) {
        return `${sign}${(abs / 1_000_000_000_000).toFixed(2)} nghìn tỷ`;
    }
    if (abs >= 1_000_000_000) {
        return `${sign}${(abs / 1_000_000_000).toFixed(2)} tỷ`;
    }
    if (abs >= 1_000_000) {
        return `${sign}${(abs / 1_000_000).toFixed(2)} triệu`;
    }
    if (abs >= 1_000) {
        return `${sign}${(abs / 1_000).toFixed(1)}K`;
    }
    return `${sign}${abs}`;
};

/**
 * Định dạng phần trăm thay đổi, luôn có dấu (+/-)
 */
export const formatPercent = (value, decimals = 2) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Định dạng số thay đổi giá, luôn có dấu (+/-)
 */
export const formatChange = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    const sign = value > 0 ? '+' : '';
    return `${sign}${new Intl.NumberFormat('vi-VN').format(value)}`;
};

/**
 * Định dạng số nguyên có phân tách hàng nghìn
 */
export const formatNumber = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    return new Intl.NumberFormat('vi-VN').format(value);
};

/**
 * Trả về class màu sắc Tailwind dựa trên giá trị tăng/giảm
 */
export const getChangeColorClass = (value) => {
    if (value > 0) return 'text-success';
    if (value < 0) return 'text-danger';
    return 'text-text-secondary';
};