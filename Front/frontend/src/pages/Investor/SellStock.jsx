import { useEffect, useMemo, useState } from "react";
import investorService from "@/services/investorService";
import { getCurrentUserId } from "@/services/session.js";
import { isTradingOpen, tradingHoursMessage } from "@/utils/tradingHours.js";

const FEE_RATE = 0.036;

export default function SellStock() {
    const [portfolio, setPortfolio] = useState(null);
    const [stockId, setStockId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loadPortfolio = () => {
        investorService.getPortfolio()
            .then(res => setPortfolio(res.data))
            .catch(err => setError(err.message || "Không tải được danh mục"));
    };

    useEffect(() => {
        loadPortfolio();
    }, []);

    const holdings = portfolio?.holdings || [];
    const selectedHolding = useMemo(
        () => holdings.find(item => String(item.stockId) === String(stockId)),
        [holdings, stockId]
    );

    const grossAmount = selectedHolding && quantity
        ? Number(selectedHolding.currentPrice) * Number(quantity)
        : 0;
    const fee = grossAmount * FEE_RATE;
    const netAmount = grossAmount - fee;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!selectedHolding) {
            setError("Vui lòng chọn cổ phiếu đang nắm giữ.");
            return;
        }

        if (!quantity || Number(quantity) <= 0) {
            setError("Số lượng phải lớn hơn 0.");
            return;
        }

        if (Number(quantity) > selectedHolding.quantity) {
            setError(`Bạn chỉ đang nắm giữ tối đa ${selectedHolding.quantity} cổ phiếu.`);
            return;
        }

        if (!isTradingOpen()) {
            setError(tradingHoursMessage());
            return;
        }

        try {
            setLoading(true);
            const response = await investorService.sellStock({
                userId: getCurrentUserId(),
                stockId: selectedHolding.stockId,
                quantity: Number(quantity),
            });
            setMessage(`Bán thành công ${response.data.quantity} ${response.data.symbol}. Số dư mới ${Number(response.data.walletBalance).toLocaleString()} VND.`);
            setQuantity("");
            loadPortfolio();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Bán cổ phiếu thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-xl mx-auto bg-bg-base border border-border-subtle rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Bán cổ phiếu</h2>

                {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300">{error}</div>}
                {message && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 border border-green-300">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2">Cổ phiếu đang nắm giữ</label>
                        <select
                            value={stockId}
                            onChange={event => setStockId(event.target.value)}
                            className="w-full border border-border-subtle rounded-lg px-4 py-2"
                            required
                        >
                            <option value="">Chọn mã cổ phiếu</option>
                            {holdings.map(item => (
                                <option key={item.stockId} value={item.stockId}>
                                    {item.symbol} - đang giữ {item.quantity} - giá {Number(item.currentPrice).toLocaleString()} VND
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">Số lượng</label>
                        <input
                            type="number"
                            min="1"
                            max={selectedHolding?.quantity || undefined}
                            value={quantity}
                            onChange={event => setQuantity(event.target.value)}
                            className="w-full border border-border-subtle rounded-lg px-4 py-2"
                            required
                        />
                    </div>

                    <div className="rounded-lg border border-border-subtle p-4 text-sm space-y-2">
                        <div className="flex justify-between"><span>Giá trị bán</span><b>{grossAmount.toLocaleString()} VND</b></div>
                        <div className="flex justify-between"><span>Phí sàn 3.6%</span><b>{fee.toLocaleString()} VND</b></div>
                        <div className="flex justify-between"><span>Thực nhận</span><b>{netAmount.toLocaleString()} VND</b></div>
                    </div>

                    <p className="text-xs text-text-secondary">
                        Giao dịch mở từ 10:00 đến 18:00 theo giờ server/local.
                    </p>

                    <button type="submit" disabled={loading || holdings.length === 0 || !isTradingOpen()} className="px-6 py-2 rounded-lg bg-primary text-white disabled:opacity-50">
                        {loading ? "Đang xử lý..." : "Bán"}
                    </button>
                </form>
            </div>
        </div>
    );
}
