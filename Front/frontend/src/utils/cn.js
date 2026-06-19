/**
 * Hàm tiện ích gộp các class CSS, lọc bỏ giá trị falsy
 * Tương tự thư viện 'clsx' nhưng viết tối giản để tránh thêm dependency
 * @param  {...any} classes - Danh sách class hoặc điều kiện
 * @returns {string} Chuỗi class đã gộp
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');