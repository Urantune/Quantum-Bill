import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import investorService
    from "@/services/investorService";

import StockChart
    from "@/components/investor/StockChart";

export default function StockDetail() {

    const {id} = useParams();

    const [stock, setStock] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {

        investorService
            .getStockById(id)
            .then(res =>
                setStock(res.data)
            );

        investorService
            .getStockHistory(id)
            .then(res =>
                setHistory(res.data)
            );

    }, [id]);

    if (!stock) return <div>Loading...</div>;

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

                        {history.map(item => (

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