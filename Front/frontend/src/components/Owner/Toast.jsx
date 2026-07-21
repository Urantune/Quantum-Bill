export default function Toast({
                                  show,
                                  message,
                                  type = "success"
                              }) {

    if (!show) return null;

    return (
        <div
            className={`
                fixed
                top-5
                right-5
                z-50
                px-5
                py-3
                rounded-lg
                shadow-lg
                ${
                type === "success"
                    ? "bg-green-600"
                    : "bg-red-600"
            }
            `}
        >
            {message}
        </div>
    );
}