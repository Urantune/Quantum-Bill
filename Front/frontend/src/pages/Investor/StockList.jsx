import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import investorService from "@/services/investorService";
import { getCurrentUserId } from "@/services/session.js";
import StockChart from "@/components/Investor/StockChart.jsx";
import { formatCurrency } from "@/utils/formatters.js";
import { isTradingOpen, tradingHoursMessage } from "@/utils/tradingHours.js";
import timeService from "@/services/timeService.js";

const FEE_RATE = 0.036;

export default function StockList() {
    const [stocks, setStocks] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [tradingTime, setTradingTime] = useState(null);

    const selectedStock = useMemo(
        () => stocks.find((stock) => String(stock.id) === String(selectedId)) || stocks[0],
        [selectedId, stocks]
    );

    useEffect(() => {
        const loadStocks = () => {
            investorService.getStocks()
                .then((res) => {
                    const items = Array.isArray(res.data) ? res.data : [];
                    setStocks(items);
                    setSelectedId((prev) => prev || String(items[0]?.id || ""));
                })
                .catch((err) => setError(err.response?.data?.message || err.message || "Không tải được bảng giá."));
        };

        loadStocks();
        timeService.getTradingTime().then(setTradingTime).catch(() => setTradingTime(null));
        const intervalId = window.setInterval(loadStocks, 15000);
        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!selectedStock?.id) return;
        investorService.getStockHistory(selectedStock.id)
            .then((res) => setHistory(Array.isArray(res.data) ? res.data : []))
            .catch(() => setHistory([]));
    }, [selectedStock?.id]);

    const filteredStocks = stocks.filter((stock) => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return true;
        return stock.symbol?.toLowerCase().includes(keyword) || stock.companyName?.toLowerCase().includes(keyword);
    });

    const grossAmount = selectedStock ? Number(selectedStock.currentPrice) * Number(quantity || 0) : 0;
    const fee = grossAmount * FEE_RATE;

    const placeOrder = async (type) => {
        setError("");
        setMessage("");
        if (!selectedStock) {
            setError("Chọn mã cổ phiếu trước.");
            return;
        }
        if (!quantity || Number(quantity) <= 0) {
            setError("Số lượng phải lớn hơn 0.");
            return;
        }
        if (!isTradingOpen(new Date(), tradingTime)) {
            setError(tradingHoursMessage(tradingTime));
            return;
        }

        try {
            const payload = {
                userId: getCurrentUserId(),
                stockId: selectedStock.id,
                quantity: Number(quantity),
            };
            const response = type === "BUY"
                ? await investorService.buyStock(payload)
                : await investorService.sellStock(payload);
            setMessage(`Đã đặt lệnh ${type === "BUY" ? "mua" : "bán"} ${response.data.quantity} ${response.data.symbol}. Chờ INVESTOR duyệt.`);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Đặt lệnh thất bại.");
        }
    };

    return (
        <div className="p-6 space-y-5">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">Bảng giao dịch cổ phiếu</h2>
                <p className="text-sm text-text-secondary mt-1">Chọn mã, xem chart, đặt lệnh mua/bán trong cùng màn hình.</p>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-100 text-red-700 border border-red-300">{error}</div>}
            {message && <div className="p-3 rounded-lg bg-green-100 text-green-700 border border-green-300">{message}</div>}

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">
                <div className="space-y-5">
                    <StockChart data={history} stock={selectedStock}/>

                    <div className="panel p-5 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-text-secondary">Mã đang chọn</label>
                            <div className="mt-1 text-xl font-bold text-primary">{selectedStock?.symbol || "--"}</div>
                            <div className="text-xs text-text-secondary">{selectedStock?.companyName}</div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-text-secondary">Số lượng</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(event) => setQuantity(event.target.value)}
                                className="input-base w-full mt-1"
                            />
                        </div>
                        <div className="text-sm">
                            <p className="text-text-secondary">Giá trị</p>
                            <p className="font-mono text-text-primary">{formatCurrency(grossAmount)}</p>
                            <p className="text-xs text-text-muted">Phí 3.6%: {formatCurrency(fee)}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => placeOrder("BUY")} className="flex-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2">Mua</button>
                            <button onClick={() => placeOrder("SELL")} className="flex-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2">Bán</button>
                        </div>
                    </div>
                </div>

                <aside className="panel overflow-hidden">
                    <div className="p-5 border-b border-border-subtle">
                        <h3 className="text-lg font-bold text-text-primary">Danh sách theo dõi</h3>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Tìm mã hoặc công ty..."
                            className="input-base w-full mt-3"
                        />
                    </div>
                    <div className="max-h-[720px] overflow-y-auto divide-y divide-border-subtle">
                        {filteredStocks.length === 0 ? (
                            <div className="p-6 text-center text-text-secondary">Không có cổ phiếu active.</div>
                        ) : filteredStocks.map((stock) => {
                            const selected = String(stock.id) === String(selectedStock?.id);
                            return (
                                <button
                                    key={stock.id}
                                    onClick={() => setSelectedId(String(stock.id))}
                                    className={`w-full text-left px-5 py-4 transition-colors ${selected ? "bg-primary/10" : "hover:bg-white/5"}`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="font-mono font-bold text-text-primary">{stock.symbol}</div>
                                            <div className="text-xs text-text-secondary line-clamp-1">{stock.companyName}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-text-primary">{formatCurrency(stock.currentPrice)}</div>
                                            <Link to={`/owner/stocks/${stock.id}`} className="text-xs text-primary hover:underline">Chi tiết</Link>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>
        </div>
    );
}
