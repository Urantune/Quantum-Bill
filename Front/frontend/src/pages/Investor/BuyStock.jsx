import { useEffect, useMemo, useState } from "react";
import investorService from "@/services/investorService";
import { getCurrentUserId } from "@/services/session.js";

const FEE_RATE = 0.036;

export default function BuyStock() {
    const [stocks, setStocks] = useState([]);
    const [stockId, setStockId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        investorService.getStocks()
            .then(res => setStocks(Array.isArray(res.data) ? res.data : []))
            .catch(err => setError(err.message || "Không tải được danh sách cổ phiếu"));
    }, []);

    const selectedStock = useMemo(
        () => stocks.find(stock => String(stock.id) === String(stockId)),
        [stockId, stocks]
    );

    const grossAmount = selectedStock && quantity
        ? Number(selectedStock.currentPrice) * Number(quantity)
        : 0;
    const fee = grossAmount * FEE_RATE;
    const netAmount = grossAmount + fee;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!selectedStock) {
            setError("Vui lòng chọn cổ phiếu.");
            return;
        }

        if (!quantity || Number(quantity) <= 0) {
            setError("Số lượng phải lớn hơn 0.");
            return;
        }

        try {
            setLoading(true);
            const response = await investorService.buyStock({
                userId: getCurrentUserId(),
                stockId: selectedStock.id,
                quantity: Number(quantity),
            });
            setMessage(`Mua thành công ${response.data.quantity} ${response.data.symbol}. Số dư còn ${Number(response.data.walletBalance).toLocaleString()} VND.`);
            setQuantity("");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Mua cổ phiếu thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-xl mx-auto bg-bg-base border border-border-subtle rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Mua cổ phiếu</h2>

                {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300">{error}</div>}
                {message && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 border border-green-300">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2">Cổ phiếu</label>
                        <select
                            value={stockId}
                            onChange={event => setStockId(event.target.value)}
                            className="w-full border border-border-subtle rounded-lg px-4 py-2"
                            required
                        >
                            <option value="">Chọn mã cổ phiếu</option>
                            {stocks.map(stock => (
                                <option key={stock.id} value={stock.id}>
                                    {stock.symbol} - {stock.companyName} - {Number(stock.currentPrice).toLocaleString()} VND
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">Số lượng</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={event => setQuantity(event.target.value)}
                            className="w-full border border-border-subtle rounded-lg px-4 py-2"
                            required
                        />
                    </div>

                    <div className="rounded-lg border border-border-subtle p-4 text-sm space-y-2">
                        <div className="flex justify-between"><span>Giá trị mua</span><b>{grossAmount.toLocaleString()} VND</b></div>
                        <div className="flex justify-between"><span>Phí sàn 3.6%</span><b>{fee.toLocaleString()} VND</b></div>
                        <div className="flex justify-between"><span>Tổng thanh toán</span><b>{netAmount.toLocaleString()} VND</b></div>
                    </div>

                    <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-primary text-white">
                        {loading ? "Đang xử lý..." : "Mua"}
                    </button>
                </form>
            </div>
        </div>
    );
}
