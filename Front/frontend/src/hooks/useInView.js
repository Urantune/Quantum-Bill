import { useState, useEffect, useRef } from 'react';

/**
 * Hook phát hiện khi một element xuất hiện trong viewport, dùng IntersectionObserver.
 * Dùng để kích hoạt animation (count-up, fade-up) chỉ khi người dùng cuộn tới phần đó,
 * tránh chạy animation ngay từ đầu khi chưa nhìn thấy.
 *
 * @param {Object} options - Tùy chọn cho IntersectionObserver (threshold, rootMargin...)
 * @returns {[React.RefObject, boolean]} ref để gắn vào element, và trạng thái đã vào view hay chưa
 */
export const useInView = (options = { threshold: 0.2 }) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return undefined;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                // Chỉ cần kích hoạt một lần, sau đó ngắt theo dõi để tối ưu hiệu năng
                observer.disconnect();
            }
        }, options);

        observer.observe(element);

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [ref, isInView];
};

export default useInView;