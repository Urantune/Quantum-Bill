import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Card hiển thị một gói dịch vụ (Basic / Pro / Premium)
 * Gói có highlighted=true (Premium) sẽ được làm nổi bật với border, badge và scale lớn hơn
 */
const PricingCard = ({ plan, delay = 0 }) => {
    const { name, price, period, description, features, highlighted, cta } = plan;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay }}
            whileHover={{ y: -6 }}
            className={cn(
                'relative panel p-7 flex flex-col',
                highlighted ? 'border-primary/50 shadow-glow lg:scale-105 lg:z-10' : 'border-border-subtle'
            )}
        >
            {highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-bold px-4 py-1.5 rounded-pill flex items-center gap-1.5 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5" />
          Phổ biến nhất
        </span>
            )}

            <h3 className="font-bold text-text-primary text-lg mt-2">{name}</h3>
            <p className="text-text-secondary text-sm mt-1.5 mb-5 min-h-[40px]">{description}</p>

            <div className="flex items-end gap-1 mb-6">
        <span className="font-financial font-extrabold text-3xl md:text-4xl text-text-primary">
          {price === 0 ? 'Miễn phí' : `$${price}`}
        </span>
                {price !== 0 && <span className="text-text-secondary text-sm mb-1">{period}</span>}
            </div>

            <button
                className={cn(
                    'w-full py-3 rounded-pill font-semibold text-sm transition-all duration-300 active:scale-95 mb-6',
                    highlighted
                        ? 'bg-primary hover:bg-primary-hover text-white hover:shadow-glow'
                        : 'bg-white/5 hover:bg-white/10 text-text-primary border border-border-subtle'
                )}
            >
                {cta}
            </button>

            <ul className="space-y-3 flex-1">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

export default PricingCard;