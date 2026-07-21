import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import ownerService from "@/services/ownerService";
import TransactionTable from "@/components/Owner/TransactionTable";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export default function Dashboard() {
    const [portfolio, setPortfolio] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [error, setError] = useState("");

    const loadHistory = async (stock) => {
        setSelectedStock(stock);
        setHistoryLoading(true);
        try {
            const response = await ownerService.getStockHistory(stock.id);
            const points = (response.data || [])
                .map((item) => ({
                    time: new Date(item.recordedAt).getTime(),
                    label: new Date(item.recordedAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    price: Number(item.newPrice),
                    change: Number(item.changePercent),
                }))
                .filter((item) => Number.isFinite(item.time) && Number.isFinite(item.price))
                .sort((a, b) => a.time - b.time)
                .slice(-300);
            setHistory(points);
        } catch {
            setHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        let active = true;

        Promise.all([
            ownerService.getPortfolio(),
            ownerService.getTransactions(),
            ownerService.getStocks(),
        ])
            .then(async ([portfolioResponse, transactionsResponse, stocksResponse]) => {
                if (!active) return;
                const nextPortfolio = portfolioResponse.data;
                const nextStocks = stocksResponse.data || [];
                setPortfolio(nextPortfolio);
                setTransactions(transactionsResponse.data || []);
                setStocks(nextStocks);

                const holdingStockId = nextPortfolio?.holdings?.[0]?.stockId;
                const initialStock = nextStocks.find((stock) => stock.id === holdingStockId) || nextStocks[0];
                if (initialStock) await loadHistory(initialStock);
            })
            .catch((requestError) => {
                if (active) {
                    setError(requestError.response?.data?.message || requestError.message || "Không tải được tổng quan đầu tư.");
                }
            });

        return () => {
            active = false;
        };
    }, []);

    if (error) {
        return <div className="p-6 text-red-400">{error}</div>;
    }

    if (!portfolio) {
        return <div className="p-6 text-text-secondary">Đang tải tổng quan đầu tư...</div>;
    }

    const money = (value) => Number(value || 0).toLocaleString("vi-VN") + " đ";
    const profit = Number(portfolio.profitLoss || 0);
    const latestPoint = history[history.length - 1];
    const firstPoint = history[0];
    const marketChange = latestPoint && firstPoint ? latestPoint.price - firstPoint.price : 0;
    const marketChangePercent = firstPoint?.price ? marketChange / firstPoint.price * 100 : 0;

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Tổng quan đầu tư</h1>
                    <p className="text-sm text-text-secondary mt-1">Tài sản MySQL và diễn biến giá thực từ lịch sử MongoDB.</p>
                </div>
                <Link to="/owner/stocks" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold">
                    Giao dịch cổ phiếu
                </Link>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    ["Tổng tài sản", money(portfolio.totalAssets)],
                    ["Số dư khả dụng", money(portfolio.cashBalance)],
                    ["Giá trị danh mục", money(portfolio.holdingsValue)],
                    ["Lãi / lỗ", money(profit)],
                ].map(([label, value], index) => (
                    <div key={label} className="panel p-5">
                        <p className="text-sm text-text-secondary">{label}</p>
                        <p className={`text-xl font-bold mt-2 ${index === 3 ? (profit >= 0 ? "text-emerald-400" : "text-red-400") : "text-text-primary"}`}>
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-5">
                <section className="panel overflow-hidden">
                    <div className="p-5 border-b border-border-subtle flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-lg">{selectedStock?.symbol || "Thị trường"}</h2>
                                <span className="text-xs text-text-secondary">{selectedStock?.companyName}</span>
                            </div>
                            <p className={`text-sm mt-1 ${marketChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                {latestPoint ? `${money(latestPoint.price)} · ${marketChange >= 0 ? "+" : ""}${money(marketChange)} (${marketChangePercent.toFixed(2)}%)` : "Chưa có lịch sử giá"}
                            </p>
                        </div>
                        {selectedStock && (
                            <Link to={`/owner/stocks/${selectedStock.id}`} className="text-sm text-primary hover:underline">
                                Xem chi tiết
                            </Link>
                        )}
                    </div>

                    <div className="h-[380px] p-3">
                        {historyLoading ? (
                            <div className="h-full grid place-items-center text-text-secondary">Đang tải MongoDB...</div>
                        ) : history.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history} margin={{top: 16, right: 16, left: 12, bottom: 4}}>
                                    <defs>
                                        <linearGradient id="mongoPriceFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.32}/>
                                            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="#293244" strokeDasharray="3 5" vertical={false}/>
                                    <XAxis dataKey="label" stroke="#7c879b" tickLine={false} axisLine={false} minTickGap={48}/>
                                    <YAxis
                                        domain={["dataMin - 100", "dataMax + 100"]}
                                        orientation="right"
                                        stroke="#7c879b"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => Number(value).toLocaleString("vi-VN")}
                                        width={82}
                                    />
                                    <Tooltip
                                        contentStyle={{background: "#111827", border: "1px solid #2a3445", borderRadius: 8}}
                                        labelStyle={{color: "#94a3b8"}}
                                        formatter={(value) => [money(value), "Giá"]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#22d3ee"
                                        strokeWidth={2}
                                        fill="url(#mongoPriceFill)"
                                        dot={false}
                                        activeDot={{r: 4, fill: "#22d3ee"}}
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full grid place-items-center text-center text-text-secondary px-6">
                                MongoDB chưa có lịch sử cho mã này hoặc kết nối đang timeout.
                            </div>
                        )}
                    </div>
                </section>

                <aside className="panel p-3">
                    <h2 className="font-bold px-2 py-2">Cổ phiếu đang giao dịch</h2>
                    <div className="space-y-1 max-h-[430px] overflow-y-auto">
                        {stocks.map((stock) => {
                            const change = Number(stock.changePercent || 0);
                            return (
                                <button
                                    type="button"
                                    key={stock.id}
                                    onClick={() => loadHistory(stock)}
                                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between gap-3 transition-colors ${selectedStock?.id === stock.id ? "bg-primary/10" : "hover:bg-white/5"}`}
                                >
                                    <span>
                                        <span className="block font-semibold">{stock.symbol}</span>
                                        <span className="block text-xs text-text-secondary truncate max-w-40">{stock.companyName}</span>
                                    </span>
                                    <span className="text-right">
                                        <span className="block font-mono text-sm">{money(stock.currentPrice)}</span>
                                        <span className={`block text-xs ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                            {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>

            <section className="panel p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Giao dịch gần đây</h2>
                    <Link to="/owner/transactions" className="text-sm text-primary hover:underline">Xem tất cả</Link>
                </div>
                <TransactionTable transactions={transactions.slice(0, 5)}/>
            </section>
        </div>
    );
}
