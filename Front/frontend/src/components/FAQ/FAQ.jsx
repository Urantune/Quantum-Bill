import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import { FAQ_ITEMS } from '@/data/mockData';
import { cn } from '@/utils/cn';

/**
 * Một item trong Accordion FAQ
 */
const FAQItem = ({ item, isOpen, onToggle, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay }}
            className="panel overflow-hidden"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-text-primary text-sm md:text-base">{item.question}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={cn(
                        'shrink-0 w-7 h-7 rounded-full flex items-center justify-center',
                        isOpen ? 'bg-primary/15 text-primary' : 'bg-bg-elevated text-text-secondary'
                    )}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">{item.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/**
 * Section "FAQ" - danh sách câu hỏi thường gặp dạng accordion
 */
const FAQ = () => {
    const [openId, setOpenId] = useState(FAQ_ITEMS[0]?.id ?? null);

    const handleToggle = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="mb-8">
            <SectionHeader title="Câu hỏi thường gặp" subtitle="Giải đáp những thắc mắc phổ biến về StockPro Elite" />
            <div className="space-y-3 max-w-3xl">
                {FAQ_ITEMS.map((item, i) => (
                    <FAQItem
                        key={item.id}
                        item={item}
                        isOpen={openId === item.id}
                        onToggle={() => handleToggle(item.id)}
                        delay={i * 0.06}
                    />
                ))}
            </div>
        </section>
    );
};

export default FAQ;