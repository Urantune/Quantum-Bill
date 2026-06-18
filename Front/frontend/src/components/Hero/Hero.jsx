import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, LineChart } from 'lucide-react';

/**
 * Hero Section - hiển thị ở đầu trang Dashboard
 * Logo, tên nền tảng, slogan và 2 nút hành động chính (CTA)
 */
const Hero = () => {
    return (
        <section className="relative overflow-hidden rounded-card border border-border-subtle bg-bg-surface mb-8">
            {/* Hiệu ứng glow nền phía sau, tạo cảm giác premium */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 px-6 md:px-12 py-12 md:py-16 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex items-center gap-2.5 mb-6"
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                        <LineChart className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-2xl text-text-primary tracking-tight">
            StockPro <span className="text-primary">Elite</span>
          </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                    className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight max-w-2xl leading-tight"
                >
                    Giao dịch thông minh hơn.{' '}
                    <span className="text-primary">Đầu tư hiệu quả hơn.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                    className="text-text-secondary text-base md:text-lg mt-5 max-w-xl"
                >
                    Theo dõi thị trường chứng khoán Việt Nam theo thời gian thực, phân tích chuyên sâu
                    và quản lý danh mục đầu tư trên một nền tảng duy nhất.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mt-8"
                >
                    <Link to="/markets" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
                        Bắt đầu giao dịch
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/markets" className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center">
                        <Compass className="w-4 h-4" />
                        Khám phá thị trường
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;