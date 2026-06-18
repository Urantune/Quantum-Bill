// Dữ liệu demo cho biểu đồ giá cổ phiếu chính (StockChart)
// Sinh dữ liệu theo dạng "random walk" để mô phỏng biến động giá thực tế

const generateSeries = (points, basePrice, volatility, dateFormatter) => {
    const data = [];
    let price = basePrice;

    for (let i = 0; i < points; i += 1) {
        const drift = (Math.random() - 0.48) * volatility;
        price = Math.max(price + drift, basePrice * 0.7);
        const volume = Math.round(800000 + Math.random() * 4200000);

        data.push({
            time: dateFormatter(i, points),
            price: Math.round(price * 100) / 100,
            volume,
        });
    }

    return data;
};

const formatHour = (i) => {
    const hour = 9 + Math.floor((i * 6.5) / 48);
    const minute = Math.floor(((i * 6.5) / 48 - Math.floor((i * 6.5) / 48)) * 60);
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const formatDayLabel = (i, total) => {
    const date = new Date();
    date.setDate(date.getDate() - (total - i));
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

const formatWeekLabel = (i, total) => {
    const date = new Date();
    date.setDate(date.getDate() - (total - i) * 7);
    return `T${date.getDate()}/${date.getMonth() + 1}`;
};

const formatMonthLabel = (i, total) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (total - i));
    return date.toLocaleDateString('vi-VN', { month: '2-digit', year: '2-digit' });
};

const basePrice = 134200;

// Mỗi khung thời gian tương ứng với một bộ dữ liệu riêng, độ biến động khác nhau
export const STOCK_CHART_DATA = {
    '1D': generateSeries(48, basePrice, 220, formatHour),
    '1W': generateSeries(7, basePrice, 900, formatDayLabel),
    '1M': generateSeries(22, basePrice, 1400, formatDayLabel),
    '3M': generateSeries(13, basePrice, 2600, formatWeekLabel),
    '6M': generateSeries(26, basePrice, 3200, formatWeekLabel),
    '1Y': generateSeries(12, basePrice, 5800, formatMonthLabel),
    ALL: generateSeries(36, basePrice * 0.6, 4200, formatMonthLabel),
};

export const CHART_RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

export const DEFAULT_CHART_SYMBOL = {
    symbol: 'FPT',
    name: 'CTCP FPT',
    exchange: 'HOSE',
    currentPrice: 134200,
    change: 1800,
    changePercent: 1.36,
    isUp: true,
    open: 132500,
    high: 135100,
    low: 131800,
    prevClose: 132400,
};