import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import investorService from "@/services/investorService";

export default function StockList() {

    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStocks = () => {
            investorService
                .getStocks()
                .then(res =>
                    setStocks(Array.isArray(res.data) ? res.data : [])
                )
                .catch(err => setError(err.response?.data?.message || err.message || "Không tải được bảng giá."));
        };

        loadStocks();
        const intervalId = window.setInterval(loadStocks, 15000);
        return () => window.clearInterval(intervalId);

    }, []);

    const handleSearch = async value => {

        setSearch(value);
        setError("");

        try {
            if (!value.trim()) {

                const res =
                    await investorService.getStocks();

                setStocks(Array.isArray(res.data) ? res.data : []);
                return;
            }

            const res =
                await investorService.searchStocks(value);

            setStocks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Tìm kiếm thất bại.");
        }
    };

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                Stock Market
            </h2>

            {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300">{error}</div>}

            <input
                value={search}
                onChange={(e) =>
                    handleSearch(e.target.value)
                }
                placeholder="Search stock..."
                className="
                    w-full
                    md:w-96
                    border
                    rounded-lg
                    px-4
                    py-2
                    mb-6
                "
            />

            <div className="overflow-auto">

                <table className="w-full">

                    <thead>

                    <tr>

                        <th className="p-4">
                            Symbol
                        </th>

                        <th className="p-4">
                            Company
                        </th>

                        <th className="p-4">
                            Industry
                        </th>

                        <th className="p-4">
                            Price
                        </th>

                        <th className="p-4">
                            Status
                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    {stocks.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="p-6 text-center text-text-secondary">
                                Không có cổ phiếu active.
                            </td>
                        </tr>
                    ) : stocks.map(stock => (

                        <tr
                            key={stock.id}
                            className="border-t"
                        >

                            <td className="p-4">

                                <Link
                                    to={`/investor/stocks/${stock.id}`}
                                    className="text-primary"
                                >
                                    {stock.symbol}
                                </Link>

                            </td>

                            <td className="p-4">
                                {stock.companyName}
                            </td>

                            <td className="p-4">
                                {stock.industry}
                            </td>

                            <td className="p-4">
                                {stock.currentPrice?.toLocaleString()}
                            </td>

                            <td className="p-4">
                                {stock.status}
                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}
