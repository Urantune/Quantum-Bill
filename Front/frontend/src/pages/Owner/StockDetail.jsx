import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import ownerService
    from "@/services/ownerService";

import StockChart
    from "@/components/Owner/StockChart";
import { formatCurrency } from "@/utils/formatters.js";

export default function StockDetail() {

    const {id} = useParams();

    const [stock, setStock] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        setError("");

        ownerService
            .getStockById(id)
            .then(res =>
                setStock(res.data)
            )
            .catch(err => setError(err.response?.data?.message || err.message || "Không tải được cổ phiếu."));

        ownerService
            .getStockHistory(id)
            .then(res =>
                setHistory(Array.isArray(res.data) ? res.data : [])
            )
            .catch(() => setHistory([]));

    }, [id]);

    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!stock) return <div className="p-6 text-text-secondary">Loading...</div>;
    const latestHistory = history[0];
    const directionUp = latestHistory?.direction === "UP";

    return (
        <div className="p-6 space-y-6">

            <div className="panel p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold text-text-primary">{stock.symbol}</h2>
                    <p className="text-text-secondary mt-1">{stock.companyName}</p>
                    <p className="text-xs text-text-muted mt-2">Ngành: {stock.industry || "--"} · Trạng thái: {stock.status}</p>
                </div>
                <div>
                    <p className="text-xs text-text-secondary">Giá hiện tại</p>
                    <p className="text-2xl font-bold text-text-primary">{formatCurrency(stock.currentPrice)}</p>
                </div>
                <div>
                    <p className="text-xs text-text-secondary">Phiên gần nhất</p>
                    <p className={directionUp ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                        {latestHistory ? `${directionUp ? "+" : ""}${Number(latestHistory.changeAmount).toLocaleString()} (${directionUp ? "+" : ""}${latestHistory.changePercent}%)` : "Chưa có dữ liệu"}
                    </p>
                </div>
            </div>

            <StockChart data={history} stock={stock}/>

            {/* History Table */}
            <div
                className="
                bg-bg-base
                border
                rounded-xl
                p-6
                mt-6
            "
            >

                <h3 className="text-xl font-semibold mb-4">Lịch sử giá lưu MongoDB</h3>

                <div className="overflow-auto">

                    <table className="w-full">

                        <thead>

                        <tr>
                            <th className="p-3 text-left">
                                Thời gian
                            </th>

                            <th className="p-3 text-left">
                                Giá cũ
                            </th>

                            <th className="p-3 text-left">
                                Giá mới
                            </th>

                            <th className="p-3 text-left">
                                Tăng/giảm
                            </th>

                            <th className="p-3 text-left">
                                %
                            </th>

                            <th className="p-3 text-left">
                                Xu hướng
                            </th>
                        </tr>

                        </thead>

                        <tbody>

                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-text-secondary">
                                    Chưa có lịch sử tăng/giảm.
                                </td>
                            </tr>
                        ) : history.map(item => (

                            <tr
                                key={item.id}
                                className="border-t"
                            >

                                <td className="p-3">
                                    {new Date(
                                        item.recordedAt
                                    ).toLocaleString()}
                                </td>

                                <td className="p-3">
                                    {Number(
                                        item.oldPrice
                                    ).toLocaleString()}
                                </td>

                                <td className="p-3">
                                    {Number(
                                        item.newPrice
                                    ).toLocaleString()}
                                </td>

                                <td className="p-3">
                                    {Number(
                                        item.changeAmount
                                    ).toLocaleString()}
                                </td>

                                <td className="p-3">
                                    {item.changePercent}%
                                </td>

                                <td
                                    className={`p-3 ${
                                        item.direction === "UP"
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {item.direction}
                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );

}
