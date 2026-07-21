export default function AssetCard({
                                      title,
                                      value,
                                      subtitle,
                                      icon
                                  }) {
    return (
        <div className="bg-bg-base border border-border-subtle rounded-xl p-5">

            <div className="flex justify-between items-center mb-3">

                <h4 className="text-text-secondary text-sm">
                    {title}
                </h4>

                {icon}

            </div>

            <div className="text-2xl font-bold">
                {value}
            </div>

            {subtitle && (
                <div className="text-sm text-text-secondary mt-2">
                    {subtitle}
                </div>
            )}

        </div>
    );
}