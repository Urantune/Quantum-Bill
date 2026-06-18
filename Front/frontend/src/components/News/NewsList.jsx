import { motion } from 'framer-motion';
import SectionHeader from '@/components/common/SectionHeader.jsx';
import NewsCard from './NewsCard.jsx';
import { NewsCardSkeleton } from '@/components/common/Skeleton.jsx';
import EmptyState from '@/components/common/EmptyState.jsx';
import ErrorState from '@/components/common/ErrorState.jsx';
import { useFetch } from '@/hooks/useFetch.js';
import { marketService } from '@/services/marketService.js';
import { MOTION } from '@/constants/theme.js';
import { Newspaper } from 'lucide-react';

/**
 * Section "Market News" - danh sách tin tức dạng card, có stagger animation khi load xong
 */
const NewsList = ({ limit = null }) => {
    const { data: news, isLoading, error, refetch } = useFetch(() => marketService.getMarketNews(), []);

    const displayedNews = limit ? news?.slice(0, limit) : news;

    return (
        <section className="mb-8">
            <SectionHeader title="Tin tức thị trường" subtitle="Cập nhật mới nhất về thị trường chứng khoán Việt Nam" />

            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <NewsCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {!isLoading && error && <ErrorState onRetry={refetch} description={error} />}

            {!isLoading && !error && displayedNews?.length === 0 && (
                <EmptyState
                    icon={Newspaper}
                    title="Chưa có tin tức nào"
                    description="Hiện chưa có bài viết nào được cập nhật. Vui lòng quay lại sau."
                />
            )}

            {!isLoading && !error && displayedNews?.length > 0 && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={MOTION.staggerContainer.variants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {displayedNews.map((item) => (
                        <NewsCard key={item.id} news={item} variants={MOTION.staggerItem.variants} />
                    ))}
                </motion.div>
            )}
        </section>
    );
};

export default NewsList;