export default function TransactionTable({transactions}) {

    return (
        <div className="overflow-auto">

            <table className="w-full">

                <thead>

                <tr>

                    <th className="p-4 text-left">
                        ID
                    </th>

                    <th className="p-4 text-left">
                        Type
                    </th>

                    <th className="p-4 text-left">
                        Symbol
                    </th>

                    <th className="p-4 text-left">
                        Qty
                    </th>

                    <th className="p-4 text-left">
                        Price
                    </th>

                    <th className="p-4 text-left">
                        Amount
                    </th>

                    <th className="p-4 text-left">
                        Date
                    </th>

                </tr>

                </thead>

                <tbody>

                {transactions.map(tx => (

                    <tr
                        key={tx.id}
                        className="border-t border-border-subtle"
                    >

                        <td className="p-4">
                            {tx.id}
                        </td>

                        <td className="p-4">
                            {tx.type}
                        </td>

                        <td className="p-4">
                            {tx.symbol}
                        </td>

                        <td className="p-4">
                            {tx.quantity}
                        </td>

                        <td className="p-4">
                            {tx.price?.toLocaleString()}
                        </td>

                        <td className="p-4">
                            {tx.totalAmount?.toLocaleString()}
                        </td>

                        <td className="p-4">
                            {new Date(tx.createdAt)
                                .toLocaleString()}
                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>
    );
}