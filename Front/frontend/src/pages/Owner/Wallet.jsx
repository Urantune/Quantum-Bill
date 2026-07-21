import {useEffect, useState} from "react";
import ownerService from "@/services/ownerService";
import { formatCurrency } from "@/utils/formatters.js";

export default function Wallet() {

    const [wallet, setWallet] = useState(null);
    const [error, setError] = useState("");
    const [amount, setAmount] = useState("1000000");
    const [topUpSession, setTopUpSession] = useState(null);
    const [topUpError, setTopUpError] = useState("");
    const [creatingTopUp, setCreatingTopUp] = useState(false);
    const [tab, setTab] = useState("wallet"); // "wallet" | "portfolio"
    const [portfolio, setPortfolio] = useState(null);

    const loadWallet = () => {
        ownerService.getWallet()
            .then(res => setWallet(res.data))
            .catch(err => setError(err.response?.data?.message || err.message || "Không tải được ví."));
    };

    const loadPortfolio = () => {
        ownerService.getPortfolio()
            .then(res => setPortfolio(res.data))
            .catch(() => setPortfolio(null));
    };

    useEffect(() => {
        loadWallet();
        loadPortfolio();
    }, []);

    const createTopUp = async (event) => {
        event.preventDefault();
        setCreatingTopUp(true);
        setTopUpError("");
        setTopUpSession(null);
        try {
            const response = await ownerService.createTopUpSession(Number(amount));
            setTopUpSession(response.data);
        } catch (err) {
            setTopUpError(err.response?.data?.message || err.message || "Không tạo được QR nạp tiền.");
        } finally {
            setCreatingTopUp(false);
        }
    };

    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!wallet) return <div className="p-6 text-text-secondary">Loading...</div>;

    const topUpUrl = topUpSession ? `${window.location.origin}${topUpSession.paymentPath}` : "";
    const qrUrl = topUpUrl
        ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(topUpUrl)}`
        : "";

    return (
        <div className="p-6 space-y-6">

            <h2 className="text-2xl font-bold">
                Ví tiền
            </h2>

            {/* Tabs */}
            <div className="flex rounded-lg bg-black/20 p-1 border border-border-subtle w-fit">
                <button
                    onClick={() => setTab("wallet")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "wallet" ? "bg-primary text-white shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
                >Ví</button>
                <button
                    onClick={() => setTab("portfolio")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "portfolio" ? "bg-primary text-white shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
                >Danh mục</button>
            </div>

            {tab === "wallet" ? (<>
                <div className="bg-bg-base border border-border-subtle rounded-xl p-6">

                    <p>Số dư</p>

                    <h1 className="text-4xl font-bold">
                        {formatCurrency(wallet.balance)}
                    </h1>

                    <p>
                        Currency: {wallet.currency}
                    </p>

                </div>

                <div className="bg-bg-base border border-border-subtle rounded-xl p-6 space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">Nạp tiền ảo bằng QR</h3>
                        <p className="text-sm text-text-secondary">Mỗi lần tạo sẽ sinh link mới, dùng một lần trong 15 phút.</p>
                    </div>

                    <form onSubmit={createTopUp} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="number"
                            min="1000"
                            step="1000"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            className="input-base flex-1"
                            placeholder="Số tiền muốn nạp"
                            required
                        />
                        <button type="submit" disabled={creatingTopUp} className="btn-primary px-4 py-2">
                            {creatingTopUp ? "Đang tạo..." : "Tạo QR"}
                        </button>
                    </form>

                    {topUpError && <p className="text-sm text-danger">{topUpError}</p>}

                    {topUpSession && (
                        <div className="flex flex-col md:flex-row gap-5 items-start">
                            <img src={qrUrl} alt="QR nạp tiền ảo" className="w-[220px] h-[220px] rounded-lg bg-white p-2" />
                            <div className="space-y-2 text-sm">
                                <p className="text-text-secondary">Số tiền: <span className="text-text-primary font-semibold">{formatCurrency(topUpSession.amount)}</span></p>
                                <p className="text-text-secondary break-all">Link: <a className="text-primary" href={topUpUrl} target="_blank" rel="noreferrer">{topUpUrl}</a></p>
                                <p className="text-text-muted">Quét QR hoặc mở link, sau đó bấm nạp tiền.</p>
                            </div>
                        </div>
                    )}
                </div>
            </>) : (
                <div className="bg-bg-base border border-border-subtle rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border-subtle">
                        <h3 className="text-sm font-semibold text-text-primary">Danh mục cổ phiếu đang sở hữu</h3>
                    </div>
                    {!portfolio || !portfolio.holdings || portfolio.holdings.length === 0 ? (
                        <div className="p-6 text-center text-text-muted text-sm">Chưa sở hữu cổ phiếu nào.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                <tr className="border-b border-border-subtle text-xs text-text-secondary uppercase">
                                    <th className="px-6 py-3">Mã</th>
                                    <th className="px-6 py-3">Công ty</th>
                                    <th className="px-6 py-3 text-right">Số lượng</th>
                                    <th className="px-6 py-3 text-right">Giá mua TB</th>
                                    <th className="px-6 py-3 text-right">Giá hiện tại</th>
                                    <th className="px-6 py-3 text-right">Giá trị</th>
                                    <th className="px-6 py-3 text-right">Lãi/Lỗ</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle">
                                {portfolio.holdings.map((item) => (
                                    <tr key={item.stockId}>
                                        <td className="px-6 py-3 font-mono font-bold text-primary">{item.symbol}</td>
                                        <td className="px-6 py-3 text-text-secondary text-xs">{item.companyName}</td>
                                        <td className="px-6 py-3 text-right font-mono">{item.quantity?.toLocaleString()}</td>
                                        <td className="px-6 py-3 text-right font-mono">{formatCurrency(item.averageBuyPrice)}</td>
                                        <td className="px-6 py-3 text-right font-mono">{formatCurrency(item.currentPrice)}</td>
                                        <td className="px-6 py-3 text-right font-mono font-semibold">{formatCurrency(item.marketValue)}</td>
                                        <td className={`px-6 py-3 text-right font-mono font-semibold ${Number(item.profitLoss) >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {Number(item.profitLoss) >= 0 ? '+' : ''}{formatCurrency(item.profitLoss)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
