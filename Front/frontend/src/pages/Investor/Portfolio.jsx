import {useEffect, useState} from "react";
import investorService from "@/services/investorService";
import HoldingsTable from "@/components/Investor/HoldingsTable.jsx";

export default function Portfolio() {

    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        investorService.getPortfolio()
            .then(res => setData(res.data))
            .catch(err => setError(err.response?.data?.message || err.message || "Không tải được danh mục."));
    }, []);

    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!data) return <div className="p-6 text-text-secondary">Loading...</div>;

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                Portfolio
            </h2>

            <div className="grid md:grid-cols-4 gap-4 mb-6">

                <div className="p-4 border rounded-xl">
                    Total Assets
                    <h3>{data.totalAssets?.toLocaleString()}</h3>
                </div>

                <div className="p-4 border rounded-xl">
                    Cash
                    <h3>{data.cashBalance?.toLocaleString()}</h3>
                </div>

                <div className="p-4 border rounded-xl">
                    Holdings
                    <h3>{data.holdingsValue?.toLocaleString()}</h3>
                </div>

                <div className="p-4 border rounded-xl">
                    Profit
                    <h3>{data.profitLoss?.toLocaleString()}</h3>
                </div>

            </div>

            <div className="bg-bg-base border border-border-subtle rounded-xl p-4">
                <h3 className="text-xl font-semibold mb-4">Holdings</h3>
                {data.holdings?.length ? (
                    <HoldingsTable holdings={data.holdings}/>
                ) : (
                    <p className="text-text-secondary">Bạn chưa nắm giữ cổ phiếu nào.</p>
                )}
            </div>

        </div>
    );
}
