import {useEffect, useState} from "react";
import investorService from "@/services/investorService";

export default function Portfolio() {

    const [data, setData] = useState(null);

    useEffect(() => {
        investorService.getPortfolio()
            .then(res => setData(res.data));
    }, []);

    if (!data) return <div>Loading...</div>;

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

        </div>
    );
}