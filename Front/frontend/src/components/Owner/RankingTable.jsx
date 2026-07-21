export default function RankingTable({
                                         rankings
                                     }) {

    return (
        <table className="w-full">

            <thead>

            <tr>

                <th className="p-4 text-left">
                    Rank
                </th>

                <th className="p-4 text-left">
                    Investor
                </th>

                <th className="p-4 text-left">
                    Assets
                </th>

                <th className="p-4 text-left">
                    Profit
                </th>

            </tr>

            </thead>

            <tbody>

            {rankings.map((item, index) => (

                <tr
                    key={item.userId}
                    className="border-t border-border-subtle"
                >

                    <td className="p-4">
                        {index + 1}
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
    );
}