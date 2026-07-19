export default function TradeConfirmModal({
                                              open,
                                              title,
                                              symbol,
                                              quantity,
                                              onConfirm,
                                              onCancel
                                          }) {

    if (!open) return null;

    return (
        <div
            className="
                fixed
                inset-0
                bg-black/60
                flex
                items-center
                justify-center
                z-50
            "
        >

            <div
                className="
                    bg-bg-base
                    border
                    border-border-subtle
                    rounded-xl
                    p-6
                    w-[400px]
                "
            >

                <h3 className="text-xl font-bold mb-4">
                    {title}
                </h3>

                <p>
                    Symbol: {symbol}
                </p>

                <p>
                    Quantity: {quantity}
                </p>

                <div className="flex gap-3 mt-6">

                    <button
                        onClick={onConfirm}
                        className="
                            px-4 py-2
                            bg-primary
                            rounded-lg
                        "
                    >
                        Confirm
                    </button>

                    <button
                        onClick={onCancel}
                        className="
                            px-4 py-2
                            border
                            rounded-lg
                        "
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>
    );
}