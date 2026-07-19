import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import investorService from "@/services/investorService";

export default function StockList() {

    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        investorService
            .getStocks()
            .then(res =>
                setStocks(res.data.content)
            );

    }, []);

    const handleSearch = async value => {

        setSearch(value);

        if (!value.trim()) {

            const res =
                await investorService.getStocks();

            setStocks(res.data.content);
            return;
        }

        const res =
            await investorService.searchStocks(value);

        setStocks(res.data);
    };

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                Stock Market
            </h2>

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

                    {stocks.map(stock => (

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