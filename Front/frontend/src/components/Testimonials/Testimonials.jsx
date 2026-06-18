import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import { TESTIMONIALS } from '@/data/mockData';
import { cn } from '@/utils/cn';

/**
 * Section "Testimonials" - slider đánh giá khách hàng, tự động chuyển sau mỗi 6 giây
 * Hỗ trợ điều hướng thủ công bằng nút mũi tên và dot indicator
 */
const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    const goTo = useCallback((index, dir) => {
        setDirection(dir);
        setActiveIndex(index);
    }, []);

    const goNext = useCallback(() => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, []);

    const goPrev = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    // Tự động chuyển slide sau mỗi 6 giây
    useEffect(() => {
        const timer = setInterval(goNext, 6000);
        return () => clearInterval(timer);
    }, [goNext]);

    const current = TESTIMONIALS[activeIndex];

    const variants = {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
        center: { opacity: 1, x: 0 },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
    };

    return (
        <section className="mb-8">
            <SectionHeader title="Khách hàng nói gì về chúng tôi" subtitle="Trải nghiệm thực tế từ nhà đầu tư đang sử dụng StockPro Elite" />

            <div className="panel p-7 md:p-10 relative overflow-hidden">
                <Quote className="absolute top-6 right-6 w-16 h-16 text-white/[0.04]" strokeWidth={1.5} />

                <div className="relative min-h-[180px] flex items-center">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={current.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.45, ease: 'easeOut' }}
                            className="w-full"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            'w-4 h-4',
                                            i < current.rating ? 'text-primary fill-primary' : 'text-text-muted'
                                        )}
                                    />
                                ))}
                            </div>

                            <p className="text-text-primary text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
                                "{current.content}"
                            </p>

                            <div className="flex items-center gap-3">
                                <img
                                    src={current.avatar}
                                    alt={current.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                                />
                                <div>
                                    <p className="font-semibold text-text-primary text-sm">{current.name}</p>
                                    <p className="text-text-secondary text-xs">{current.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Điều hướng */}
                <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center gap-2">
                        {TESTIMONIALS.map((item, i) => (
                            <button
                                key={item.id}
                                onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
                                aria-label={`Đánh giá ${i + 1}`}
                                className={cn(
                                    'h-1.5 rounded-pill transition-all duration-300',
                                    i === activeIndex ? 'w-7 bg-primary' : 'w-1.5 bg-white/15 hover:bg-white/30'
                                )}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={goPrev}
                            aria-label="Đánh giá trước"
                            className="w-9 h-9 rounded-full bg-bg-elevated hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors duration-200"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={goNext}
                            aria-label="Đánh giá tiếp theo"
                            className="w-9 h-9 rounded-full bg-bg-elevated hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors duration-200"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;