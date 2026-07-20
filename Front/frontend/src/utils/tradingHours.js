export const TRADING_OPEN_HOUR = 10;
export const TRADING_CLOSE_HOUR = 18;

function parseTime(value, fallbackHour) {
    if (!value) return { hour: fallbackHour, minute: 0 };
    const [hour, minute] = String(value).split(':').map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return { hour: fallbackHour, minute: 0 };
    return { hour, minute };
}

function minutesOfDay({ hour, minute }) {
    return hour * 60 + minute;
}

export function isTradingOpen(date = new Date(), settings = null) {
    const now = date.getHours() * 60 + date.getMinutes();
    const open = minutesOfDay(parseTime(settings?.openTime, TRADING_OPEN_HOUR));
    const close = minutesOfDay(parseTime(settings?.closeTime, TRADING_CLOSE_HOUR));
    return now >= open && now <= close;
}

export function tradingHoursMessage(settings = null) {
    const open = settings?.openTime || `${String(TRADING_OPEN_HOUR).padStart(2, '0')}:00`;
    const close = settings?.closeTime || `${String(TRADING_CLOSE_HOUR).padStart(2, '0')}:00`;
    return `Giao dịch chỉ mở từ ${open} đến ${close}.`;
}
