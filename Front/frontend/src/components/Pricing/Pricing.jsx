import SectionHeader from '@/components/common/SectionHeader';
import PricingCard from './PricingCard';
import { PRICING_PLANS } from '@/data/mockData';

/**
 * Section "Pricing" - hiển thị 3 gói dịch vụ: Basic, Pro, Premium
 * Dữ liệu lấy tĩnh từ mockData (không cần gọi API vì đây là nội dung marketing cố định)
 */
const Pricing = () => {
    return (
        <section className="mb-8">
            <SectionHeader
                title="Gói dịch vụ"
                subtitle="Lựa chọn gói phù hợp với nhu cầu đầu tư của bạn"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 pt-2">
                {PRICING_PLANS.map((plan, i) => (
                    <PricingCard key={plan.id} plan={plan} delay={i * 0.12} />
                ))}
            </div>
        </section>
    );
};

export default Pricing;