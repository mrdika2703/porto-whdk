import { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutAdminProps {
    children: ReactNode;
}

export default function LayoutAdmin({ children }: LayoutAdminProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-main font-poppins transition-colors duration-300 selection:bg-accent selection:text-white">
            {/* Sidebar Component */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Header setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
