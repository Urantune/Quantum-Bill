export default function HoldingsTable({
                                          holdings
                                      }) {

    return (
        <table className="w-full">

            <thead>

            <tr>

                <th className="p-4">
                    Symbol
                </th>

                <th className="p-4">
                    Quantity
                </th>

                <th className="p-4">
                    Avg Price
                </th>

                <th className="p-4">
                    Current Price
                </th>

                <th className="p-4">
                    Profit/Loss
                </th>

            </tr>

            </thead>

            <tbody>

            {holdings.map((item,index) => (

                <tr
                    key={index}
                    className="
                        border-t
                        border-border-subtle
                    "
                >

                    <td className="p-4">
                        {item.symbol}
                    </td>

                    <td className="p-4">
                        {item.quantity}
                    </td>

                    <td className="p-4">
                        {item.averagePrice}
                    </td>

                    <td className="p-4">
                        {item.currentPrice}
                    </td>

                    <td
                        className={`
                            p-4
                            ${
                            item.profitLoss >= 0
                                ? "text-green-500"
                                : "text-red-500"
                        }
                        `}
                    >
                        {item.profitLoss}
                    </td>

                </tr>

            ))}

            </tbody>

        </table>
    );
}