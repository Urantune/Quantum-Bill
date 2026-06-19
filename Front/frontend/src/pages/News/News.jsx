import { useState } from 'react';
import { motion } from 'framer-motion';
import NewsCard from '@/components/News/NewsCard';
import { NewsCardSkeleton } from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { useFetch } from '@/hooks/useFetch';
import { marketService } from '@/services/marketService';
import { NEWS_CATEGORIES } from '@/data/newsData.js';
import { MOTION } from '@/constants/theme';
import { cn } from '@/utils/cn';
import { Newspaper } from 'lucide-react';

/**
 * Trang News - danh sách đầy đủ tin tức thị trường, có bộ lọc theo category
 */
const News = () => {
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const { data: news, isLoading, error, refetch } = useFetch(() => marketService.getMarketNews(), []);

    const filteredNews =
        activeCategory === 'Tất cả' ? news : news?.filter((item) => item.category === activeCategory);

    return (
        <motion.div {...MOTION.pageTransition}>
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Tin tức</h1>
                <p className="text-text-secondary text-sm mt-1">
                    Cập nhật tin tức và phân tích mới nhất về thị trường chứng khoán Việt Nam
                </p>
            </div>

            {/* Bộ lọc category */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                {NEWS_CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                            'px-4 py-2 rounded-pill text-sm font-medium whitespace-nowrap transition-all duration-200',
                            activeCategory === category
                                ? 'bg-primary text-white'
                                : 'bg-bg-elevated text-text-secondary hover:text-text-primary hover:bg-white/10'
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <NewsCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {!isLoading && error && <ErrorState onRetry={refetch} description={error} />}

            {!isLoading && !error && filteredNews?.length === 0 && (
                <EmptyState
                    icon={Newspaper}
                    title="Không có tin tức phù hợp"
                    description={`Hiện chưa có bài viết nào trong danh mục "${activeCategory}".`}
                />
            )}

            {!isLoading && !error && filteredNews?.length > 0 && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={MOTION.staggerContainer.variants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {filteredNews.map((item) => (
                        <NewsCard key={item.id} news={item} variants={MOTION.staggerItem.variants} />
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default News;