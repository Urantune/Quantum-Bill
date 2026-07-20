export const TRADING_OPEN_HOUR = 10;
export const TRADING_CLOSE_HOUR = 18;

export function isTradingOpen(date = new Date()) {
    const hour = date.getHours();
    return hour >= TRADING_OPEN_HOUR && hour <= TRADING_CLOSE_HOUR;
}

export function tradingHoursMessage() {
    return `Giao dịch chỉ mở từ ${String(TRADING_OPEN_HOUR).padStart(2, '0')}:00 đến ${String(TRADING_CLOSE_HOUR).padStart(2, '0')}:00.`;
}
