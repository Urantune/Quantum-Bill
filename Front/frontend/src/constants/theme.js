// Hằng số liên quan đến giao diện và theme của ứng dụng
// Tập trung tại đây để dễ điều chỉnh đồng bộ trên toàn bộ dự án

export const COLORS = {
    primary: '#FF3B30',
    primaryHover: '#FF5147',
    bgBase: '#0F1117',
    bgSurface: '#151922',
    bgElevated: '#1B2030',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A3B1',
    borderSubtle: 'rgba(255,255,255,0.08)',
    success: '#16C784',
    danger: '#FF3B30',
};

export const CHART_COLORS = {
    line: '#FF3B30',
    lineGradientStart: 'rgba(255,59,48,0.35)',
    lineGradientEnd: 'rgba(255,59,48,0)',
    volumeUp: '#16C784',
    volumeDown: '#FF3B30',
    grid: 'rgba(255,255,255,0.06)',
    axis: '#6B6F80',
};

// Cấu hình animation dùng chung cho Framer Motion (0.4s - 0.8s, easeOut)
export const MOTION = {
    fadeUp: {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
    },
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, ease: 'easeOut' },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, ease: 'easeOut' },
    },
    slideInLeft: {
        initial: { opacity: 0, x: -24 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5, ease: 'easeOut' },
    },
    staggerContainer: {
        initial: 'hidden',
        animate: 'visible',
        variants: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
            },
        },
    },
    staggerItem: {
        variants: {
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        },
    },
    pageTransition: {
        initial: { opacity: 0, x: 12 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -12 },
        transition: { duration: 0.35, ease: 'easeOut' },
    },
};

export const BREAKPOINTS = {
    mobile: 320,
    tablet: 768,
    desktop: 1200,
};