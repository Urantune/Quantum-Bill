// Dữ liệu demo các chỉ số thị trường chứng khoán Việt Nam
// Trong môi trường thực tế, dữ liệu này sẽ được thay thế bằng API call qua services/

export const MARKET_INDICES = [
    {
        id: 'vnindex',
        name: 'VNINDEX',
        fullName: 'Sàn HOSE',
        value: 1284.52,
        change: 8.74,
        changePercent: 0.69,
        volume: '742.3M',
        isUp: true,
    },
    {
        id: 'hnxindex',
        name: 'HNXINDEX',
        fullName: 'Sàn HNX',
        value: 231.84,
        change: -1.26,
        changePercent: -0.54,
        volume: '85.6M',
        isUp: false,
    },
    {
        id: 'upcom',
        name: 'UPCOM',
        fullName: 'Sàn UPCOM',
        value: 98.47,
        change: 0.32,
        changePercent: 0.33,
        volume: '52.1M',
        isUp: true,
    },
];

// Danh sách watchlist mặc định - các cổ phiếu blue-chip phổ biến tại VN
export const WATCHLIST_STOCKS = [
    {
        symbol: 'FPT',
        name: 'CTCP FPT',
        exchange: 'HOSE',
        price: 134200,
        change: 1800,
        changePercent: 1.36,
        isUp: true,
        miniChartData: [12, 14, 13, 16, 15, 18, 19, 17, 20, 21],
    },
    {
        symbol: 'VCB',
        name: 'Vietcombank',
        exchange: 'HOSE',
        price: 91500,
        change: -700,
        changePercent: -0.76,
        isUp: false,
        miniChartData: [22, 21, 23, 20, 19, 18, 19, 17, 16, 15],
    },
    {
        symbol: 'HPG',
        name: 'Hòa Phát Group',
        exchange: 'HOSE',
        price: 27850,
        change: 450,
        changePercent: 1.64,
        isUp: true,
        miniChartData: [10, 11, 10, 12, 13, 12, 14, 15, 14, 16],
    },
    {
        symbol: 'VIC',
        name: 'Vingroup',
        exchange: 'HOSE',
        price: 43200,
        change: -300,
        changePercent: -0.69,
        isUp: false,
        miniChartData: [18, 17, 19, 18, 16, 17, 15, 14, 15, 13],
    },
    {
        symbol: 'MSN',
        name: 'Masan Group',
        exchange: 'HOSE',
        price: 76900,
        change: 1100,
        changePercent: 1.45,
        isUp: true,
        miniChartData: [14, 15, 14, 16, 17, 16, 18, 19, 18, 20],
    },
    {
        symbol: 'ACB',
        name: 'ACB',
        exchange: 'HOSE',
        price: 24650,
        change: 150,
        changePercent: 0.61,
        isUp: true,
        miniChartData: [16, 16, 17, 16, 18, 17, 18, 19, 18, 19],
    },
    {
        symbol: 'MBB',
        name: 'MB Bank',
        exchange: 'HOSE',
        price: 23100,
        change: -200,
        changePercent: -0.86,
        isUp: false,
        miniChartData: [20, 19, 20, 18, 19, 17, 18, 16, 17, 15],
    },
    {
        symbol: 'SSI',
        name: 'CTCP Chứng khoán SSI',
        exchange: 'HOSE',
        price: 32400,
        change: 600,
        changePercent: 1.89,
        isUp: true,
        miniChartData: [11, 12, 11, 13, 14, 13, 15, 16, 15, 17],
    },
];

// Top cổ phiếu tăng mạnh nhất
export const TOP_GAINERS = [
    { symbol: 'DGC', name: 'Hóa chất Đức Giang', price: 112500, changePercent: 6.84 },
    { symbol: 'PLX', name: 'Petrolimex', price: 41200, changePercent: 5.92 },
    { symbol: 'GVR', name: 'Cao su Việt Nam', price: 28700, changePercent: 5.51 },
    { symbol: 'DPM', name: 'Đạm Phú Mỹ', price: 36900, changePercent: 4.97 },
    { symbol: 'VPB', name: 'VPBank', price: 19850, changePercent: 4.62 },
    { symbol: 'KDH', name: 'Khang Điền', price: 33400, changePercent: 4.18 },
    { symbol: 'CTG', name: 'VietinBank', price: 35600, changePercent: 3.85 },
    { symbol: 'PNJ', name: 'Vàng bạc Phú Nhuận', price: 94300, changePercent: 3.61 },
    { symbol: 'NLG', name: 'Nam Long Group', price: 38100, changePercent: 3.42 },
    { symbol: 'STB', name: 'Sacombank', price: 31200, changePercent: 3.15 },
];

// Top cổ phiếu giảm mạnh nhất
export const TOP_LOSERS = [
    { symbol: 'NVL', name: 'Novaland', price: 11800, changePercent: -6.35 },
    { symbol: 'PDR', name: 'Phát Đạt', price: 19300, changePercent: -5.47 },
    { symbol: 'HSG', name: 'Hoa Sen Group', price: 17600, changePercent: -4.86 },
    { symbol: 'DXG', name: 'Đất Xanh Group', price: 14900, changePercent: -4.21 },
    { symbol: 'GEX', name: 'Gelex', price: 22400, changePercent: -3.94 },
    { symbol: 'VHM', name: 'Vinhomes', price: 40500, changePercent: -3.58 },
    { symbol: 'TCB', name: 'Techcombank', price: 38200, changePercent: -3.12 },
    { symbol: 'POW', name: 'PV Power', price: 11200, changePercent: -2.87 },
    { symbol: 'HDB', name: 'HDBank', price: 25100, changePercent: -2.54 },
    { symbol: 'KBC', name: 'Kinh Bắc City', price: 27800, changePercent: -2.18 },
];

// Hiệu suất theo ngành - dùng cho Bar Chart và Progress Bar
export const SECTOR_PERFORMANCE = [
    { id: 'banking', name: 'Ngân hàng', changePercent: 1.42, marketCap: 1850000 },
    { id: 'technology', name: 'Công nghệ', changePercent: 2.18, marketCap: 420000 },
    { id: 'realestate', name: 'Bất động sản', changePercent: -1.65, marketCap: 980000 },
    { id: 'energy', name: 'Năng lượng', changePercent: 0.87, marketCap: 610000 },
    { id: 'retail', name: 'Bán lẻ', changePercent: 1.05, marketCap: 340000 },
    { id: 'manufacturing', name: 'Sản xuất', changePercent: -0.42, marketCap: 750000 },
];

// Số liệu thống kê tổng quan thị trường - dùng cho animation counter
export const MARKET_STATISTICS = [
    { id: 'marketcap', label: 'Tổng giá trị vốn hóa', value: 6850000, unit: 'tỷ đồng', prefix: '' },
    { id: 'volume', label: 'Khối lượng giao dịch', value: 1280, unit: 'triệu CP/ngày', prefix: '' },
    { id: 'traders', label: 'Nhà đầu tư hoạt động', value: 2450000, unit: 'tài khoản', prefix: '' },
    { id: 'companies', label: 'Doanh nghiệp niêm yết', value: 1638, unit: 'công ty', prefix: '' },
];

// Dữ liệu danh mục đầu tư mẫu (mô phỏng tài khoản nhà đầu tư)
export const PORTFOLIO_SUMMARY = {
    totalAssets: 458200000,
    profitLoss: 32600000,
    profitLossPercent: 7.66,
    cashBalance: 86400000,
    holdings: [
        { symbol: 'FPT', quantity: 800, avgPrice: 118500, currentPrice: 134200, value: 107360000 },
        { symbol: 'VCB', quantity: 500, avgPrice: 88200, currentPrice: 91500, value: 45750000 },
        { symbol: 'HPG', quantity: 2000, avgPrice: 25400, currentPrice: 27850, value: 55700000 },
        { symbol: 'MSN', quantity: 600, avgPrice: 71200, currentPrice: 76900, value: 46140000 },
        { symbol: 'SSI', quantity: 1500, avgPrice: 29800, currentPrice: 32400, value: 48600000 },
    ],
};