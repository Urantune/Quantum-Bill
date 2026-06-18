import { cn } from '@/utils/cn';

/**
 * Component Skeleton dùng chung để hiển thị trạng thái loading dạng shimmer
 * Có thể tái sử dụng cho card, dòng văn bản, hình tròn avatar, v.v.
 */
const Skeleton = ({ className = '', variant = 'rect' }) => {
    const variantClass = {
        rect: 'rounded-lg',
        circle: 'rounded-full',
        text: 'rounded-md h-4',
    };

    return <div className={cn('skeleton', variantClass[variant], className)} />;
};

export const MarketCardSkeleton = () => (
    <div className="panel p-5 space-y-3">
        <div className="flex items-center justify-between">
            <Skeleton className="w-20 h-4" variant="text" />
            <Skeleton className="w-6 h-6" variant="circle" />
        </div>
        <Skeleton className="w-32 h-7" variant="text" />
        <Skeleton className="w-24 h-4" variant="text" />
    </div>
);

export const WatchlistRowSkeleton = () => (
    <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10" variant="circle" />
            <div className="space-y-2">
                <Skeleton className="w-16 h-3.5" variant="text" />
                <Skeleton className="w-24 h-3" variant="text" />
            </div>
        </div>
        <Skeleton className="w-16 h-8" />
        <Skeleton className="w-20 h-6" />
    </div>
);

export const NewsCardSkeleton = () => (
    <div className="panel overflow-hidden">
        <Skeleton className="w-full h-40 rounded-none" />
        <div className="p-4 space-y-3">
            <Skeleton className="w-3/4 h-4" variant="text" />
            <Skeleton className="w-full h-3" variant="text" />
            <Skeleton className="w-full h-3" variant="text" />
            <div className="flex items-center gap-2 pt-2">
                <Skeleton className="w-8 h-8" variant="circle" />
                <Skeleton className="w-20 h-3" variant="text" />
            </div>
        </div>
    </div>
);

export const ChartSkeleton = () => (
    <div className="panel p-6 space-y-4">
        <div className="flex items-center justify-between">
            <Skeleton className="w-40 h-6" variant="text" />
            <Skeleton className="w-56 h-8" />
        </div>
        <Skeleton className="w-full h-72" />
    </div>
);

export default Skeleton;