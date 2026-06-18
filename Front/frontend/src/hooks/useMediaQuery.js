import { useState, useEffect } from 'react';

/**
 * Hook theo dõi media query, dùng để xử lý responsive logic trong JS
 * (ví dụ: tự động đóng sidebar trên mobile)
 * @param {string} query - Chuỗi media query, ví dụ: '(max-width: 768px)'
 */
export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const listener = (event) => setMatches(event.matches);

        mediaQueryList.addEventListener('change', listener);
        return () => mediaQueryList.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

// Các hook tiện lợi tương ứng với breakpoint trong spec (320 / 768 / 1200)
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1199px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1200px)');

export default useMediaQuery;