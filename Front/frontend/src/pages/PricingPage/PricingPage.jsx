import { motion } from 'framer-motion';
import Pricing from '@/components/Pricing/Pricing';
import FAQ from '@/components/FAQ/FAQ';
import Testimonials from '@/components/Testimonials/Testimonials';
import { MOTION } from '@/constants/theme';

/**
 * Trang Pricing độc lập - hiển thị đầy đủ gói dịch vụ, đánh giá khách hàng và FAQ liên quan
 */
const PricingPage = () => {
    return (
        <motion.div {...MOTION.pageTransition}>
            <div className="mb-6 text-center max-w-2xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                    Lựa chọn gói phù hợp với bạn
                </h1>
                <p className="text-text-secondary text-sm mt-2">
                    Từ nhà đầu tư mới bắt đầu đến chuyên gia phân tích chuyên nghiệp, StockPro Elite có gói dịch vụ dành riêng cho bạn
                </p>
            </div>

            <Pricing />
            <Testimonials />
            <FAQ />
        </motion.div>
    );
};

export default PricingPage;