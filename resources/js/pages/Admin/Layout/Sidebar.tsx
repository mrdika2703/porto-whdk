import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const { url } = usePage();
    // State baru untuk mengatur mode minimize (hanya berlaku di desktop)
    const [isMinimized, setIsMinimized] = useState(false);

    const menuItems = [
        {
            name: 'Dashboard',
            icon: 'fa-solid fa-gauge',
            route: '/admin/dashboard',
        },
        { name: 'Profile', icon: 'fa-solid fa-user', route: '/admin/profiles' },
        {
            name: 'Graphic Design',
            icon: 'fa-solid fa-palette',
            route: '/admin/grapich-design',
        },
        { name: 'Skills', icon: 'fa-solid fa-code', route: '/admin/skills' },
        {
            name: 'Experiences',
            icon: 'fa-solid fa-briefcase',
            route: '/admin/experience',
        },
        {
            name: 'Education',
            icon: 'fa-solid fa-graduation-cap',
            route: '/admin/education',
        },
        {
            name: 'Certificate',
            icon: 'fa-solid fa-award',
            route: '/admin/certificate',
        },
        {
            name: 'Photo & Videos',
            icon: 'fa-solid fa-camera',
            route: '/admin/photo-video',
        },
        {
            name: 'Websites',
            icon: 'fa-solid fa-globe',
            route: '/admin/website',
        },
        {
            name: 'Others',
            icon: 'fa-solid fa-ellipsis',
            route: '/admin/others',
        },
    ];

    return (
        <>
            {/* Overlay untuk Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Asli */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 transform border-r border-tmuted/20 bg-bcard transition-all duration-300 lg:static lg:inset-0 lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } ${isMinimized ? 'w-20' : 'w-64'}`}
            >
                {/* Header Sidebar (Logo & Tombol Minimize) */}
                <div
                    className={`flex h-16 items-center border-b border-tmuted/20 px-4 ${isMinimized ? 'justify-center' : 'justify-between'}`}
                >
                    {!isMinimized && (
                        <h1 className="overflow-hidden text-xl font-bold whitespace-nowrap text-htext dark:text-tmain">
                            DK <span className="text-accent">Panel</span>
                        </h1>
                    )}

                    {/* Tombol Minimize (Disembunyikan di Mobile) */}
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="hidden h-8 w-8 items-center justify-center rounded-lg bg-bmain/20 text-tmuted transition-colors hover:text-accent lg:flex"
                        title={
                            isMinimized
                                ? 'Perbesar Sidebar'
                                : 'Perkecil Sidebar'
                        }
                    >
                        <i
                            className={`fa-solid ${isMinimized ? 'fa-chevron-right' : 'fa-chevron-left'}`}
                        ></i>
                    </button>
                </div>

                {/* Navigasi Menu */}
                <nav className="custom-scrollbar h-[calc(100vh-4rem)] space-y-2 overflow-y-auto p-4">
                    {menuItems.map((item, index) => {
                        const isActive = url.startsWith(item.route);
                        return (
                            <Link
                                key={index}
                                href={item.route}
                                title={item.name} // Memunculkan tooltip bawaan browser saat hover ikon
                                className={`flex items-center rounded-xl transition-all duration-200 ${
                                    isMinimized
                                        ? 'justify-center px-0 py-3'
                                        : 'gap-3 px-4 py-3'
                                } ${
                                    isActive
                                        ? 'bg-bshine/10 font-semibold text-bshine dark:text-accent'
                                        : 'text-tmuted hover:bg-bmain/50 hover:text-htext dark:hover:text-tmain'
                                }`}
                            >
                                <i
                                    className={`${item.icon} ${isMinimized ? 'text-lg' : 'w-5 text-center'}`}
                                ></i>

                                {/* Teks disembunyikan jika isMinimized true */}
                                {!isMinimized && (
                                    <span className="whitespace-nowrap">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
