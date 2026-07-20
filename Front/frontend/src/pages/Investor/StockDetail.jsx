import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import investorService
    from "@/services/investorService";

import StockChart
    from "@/components/Investor/StockChart";

export default function StockDetail() {

    const {id} = useParams();

    const [stock, setStock] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        setError("");

        investorService
            .getStockById(id)
            .then(res =>
                setStock(res.data)
            )
            .catch(err => setError(err.response?.data?.message || err.message || "Không tải được cổ phiếu."));

        investorService
            .getStockHistory(id)
            .then(res =>
                setHistory(Array.isArray(res.data) ? res.data : [])
            )
            .catch(() => setHistory([]));

    }, [id]);

    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!stock) return <div className="p-6 text-text-secondary">Loading...</div>;

    return (
        <div className="p-6">

            {/* Stock Info */}
            <div
                className="
                bg-bg-base
                border
                rounded-xl
                p-6
                mb-6
            "
            >
                <h2 className="text-3xl font-bold">
                    {stock.symbol}
                </h2>

                <p>
                    {stock.companyName}
                </p>

                <p>
                    Industry: {stock.industry}
                </p>

                <p>
                    Current Price:
                    {stock.currentPrice?.toLocaleString()}
                </p>

            </div>

            {/* Chart */}
            <div
                className="
                bg-bg-base
                border
                rounded-xl
                p-6
            "
            >
                <StockChart data={history}/>
            </div>

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

                <h3 className="text-xl font-semibold mb-4">
                    Price History
                </h3>

                <div className="overflow-auto">

                    <table className="w-full">

                        <thead>

                        <tr>
                            <th className="p-3 text-left">
                                Time
                            </th>

                            <th className="p-3 text-left">
                                Old Price
                            </th>

                            <th className="p-3 text-left">
                                New Price
                            </th>

                            <th className="p-3 text-left">
                                Change
                            </th>

                            <th className="p-3 text-left">
                                %
                            </th>

                            <th className="p-3 text-left">
                                Direction
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
