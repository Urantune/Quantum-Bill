import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';

/**
 * Card hiển thị một tin tức thị trường, thiết kế lấy cảm hứng từ Bloomberg
 */
const NewsCard = ({ news, variants }) => {
    const { title, description, thumbnail, author, time, category } = news;

    return (
        <motion.article
            variants={variants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="panel overflow-hidden cursor-pointer group flex flex-col h-full"
        >
            <div className="relative h-40 overflow-hidden">
                <img
                    src={thumbnail}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-[11px] font-semibold bg-bg-base/80 backdrop-blur-sm text-primary px-2.5 py-1 rounded-pill">
          {category}
        </span>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-text-primary text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3 flex-1">
                    {description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-text-muted pt-3 border-t border-border-subtle">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
              {author}
          </span>
                    <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
                        {time}
          </span>
                </div>
            </div>
        </motion.article>
    );
};

export default NewsCard;