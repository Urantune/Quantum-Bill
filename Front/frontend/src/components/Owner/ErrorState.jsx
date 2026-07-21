export default function ErrorState({message}) {

    return (
        <div
            className="
                bg-red-500/10
                border
                border-red-500/20
                rounded-xl
                p-4
            "
        >
            {message}
        </div>
    );
}