import { useState, useEffect, useRef } from 'react';

/**
 * Hook tạo hiệu ứng đếm số tăng dần (count-up animation), dùng cho phần Statistics.
 * Sử dụng requestAnimationFrame để animation mượt mà, không giật khung hình.
 *
 * @param {number} targetValue - Giá trị đích cần đếm tới
 * @param {number} duration - Thời gian animation (ms), mặc định 1500ms
 * @param {boolean} shouldStart - Cờ điều khiển khi nào bắt đầu đếm (ví dụ: khi vào viewport)
 */
export const useCountUp = (targetValue, duration = 1500, shouldStart = true) => {
    const [count, setCount] = useState(0);
    const frameRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        if (!shouldStart) return undefined;

        const animate = (timestamp) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = timestamp;
            }
            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutExpo - chuyển động chậm dần về cuối, cảm giác chuyên nghiệp
            const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
            setCount(Math.round(eased * targetValue));

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            startTimeRef.current = null;
        };
    }, [targetValue, duration, shouldStart]);

    return count;
};

export default useCountUp;