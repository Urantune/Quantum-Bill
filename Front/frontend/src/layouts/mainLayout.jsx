import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { cn } from '@/utils/cn';

/**
 * Layout chính của toàn ứng dụng: kết hợp Sidebar, Top Navigation,
 * khu vực nội dung chính (Outlet của React Router) và Footer.
 */
const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-bg-base">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
            />

            <div
                className={cn(
                    'flex flex-col min-h-screen transition-all duration-300',
                    isCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'
                )}
            >
                <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

                <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 max-w-[1600px] w-full mx-auto">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;