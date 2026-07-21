import {useEffect, useState} from "react";
import ownerService from "@/services/ownerService";

export default function Ranking() {

    const [rankings, setRankings] = useState([]);

    useEffect(() => {

        ownerService.getRanking()
            .then((res) => setRankings(res.data))
            .catch(console.error);

    }, []);

    const topThree = rankings.slice(0, 3);
    const remaining = rankings.slice(3);

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                Investor Ranking
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-8">

                {topThree.map((item, index) => (

                    <div
                        key={item.userId}
                        className="bg-bg-base border border-border-subtle rounded-xl p-6"
                    >

                        <div className="text-3xl font-bold mb-4">

                            #{index + 1}

                        </div>

                        <h3 className="text-xl font-semibold">
                            {item.fullName}
                        </h3>

                        <p>
                            Assets:
                            {" "}
                            {item.totalAssets?.toLocaleString()}
                        </p>

                        <p>
                            Profit:
                            {" "}
                            {item.profitLoss?.toLocaleString()}
                        </p>

                    </div>

                ))}

            </div>

            <div className="overflow-auto bg-bg-base border border-border-subtle rounded-xl">

                <table className="w-full">

                    <thead>

                    <tr className="border-b border-border-subtle">

                        <th className="p-4 text-left">Rank</th>
                        <th className="p-4 text-left">Investor</th>
                        <th className="p-4 text-left">Assets</th>
                        <th className="p-4 text-left">Profit</th>

                    </tr>

                    </thead>

                    <tbody>

                    {remaining.map((item, index) => (

                        <tr
                            key={item.userId}
                            className="border-b border-border-subtle"
                        >

                            <td className="p-4">
                                {index + 4}
                            </td>

                            <td className="p-4">
                                {item.fullName}
                            </td>

                            <td className="p-4">
                                {item.totalAssets?.toLocaleString()}
                            </td>

                            <td className="p-4">
                                {item.profitLoss?.toLocaleString()}
                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}