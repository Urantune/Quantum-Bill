import { Link } from 'react-router-dom';
import { LineChart, Facebook, Youtube, Linkedin, Twitter } from 'lucide-react';
import { FOOTER_LINKS, SOCIAL_LINKS } from '@/constants/navigation';

const SOCIAL_ICON_MAP = { Facebook, Youtube, Linkedin, Twitter };

/**
 * Footer chung cho toàn bộ ứng dụng
 * Bao gồm: thông tin công ty, các nhóm link (Products, Pricing, Careers, Contact), social media
 */
const Footer = () => {
    return (
        <footer className="border-t border-border-subtle bg-bg-surface mt-auto">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {/* Cột thông tin công ty + logo */}
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                                <LineChart className="w-4 h-4 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="font-extrabold text-text-primary tracking-tight">
                StockPro <span className="text-primary">Elite</span>
              </span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed mb-4">
                            Nền tảng giao dịch và phân tích chứng khoán Việt Nam thế hệ mới.
                        </p>
                        <div className="flex items-center gap-2">
                            {SOCIAL_LINKS.map((social) => {
                                const Icon = SOCIAL_ICON_MAP[social.icon];
                                return (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center
                      text-text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-200"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Các cột link */}
                    {Object.values(FOOTER_LINKS).map((group) => (
                        <div key={group.title}>
                            <h4 className="text-text-primary font-semibold text-sm mb-4">{group.title}</h4>
                            <ul className="space-y-2.5">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.path}
                                            className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border-subtle mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} StockPro Elite. Đã đăng ký bản quyền.
                    </p>
                    <p className="text-xs text-text-muted text-center sm:text-right">
                        Dữ liệu chỉ mang tính chất tham khảo, không phải khuyến nghị đầu tư.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;