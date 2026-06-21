import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface HeaderProps {
    setSidebarOpen: (isOpen: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        // 1. Cek apakah user sudah punya preferensi manual di browser
        const storedTheme = localStorage.getItem('theme');

        if (storedTheme === 'dark') {
            root.classList.add('dark');
            setIsDark(true);
        } else if (storedTheme === 'light') {
            root.classList.remove('dark');
            setIsDark(false);
        } else {
            // 2. Jika tidak ada preferensi, gunakan pengaturan waktu (Otomatis)
            const currentHour = new Date().getHours();

            // Mode Gelap jika jam 18:00 ke atas, ATAU jam 05:59 ke bawah
            if (currentHour >= 18 || currentHour < 6) {
                root.classList.add('dark');
                setIsDark(true);
            } else {
                root.classList.remove('dark');
                setIsDark(false);
            }
        }
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;

        if (isDark) {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <header className="z-10 flex h-16 items-center justify-between border-b border-tmuted/20 bg-bcard px-4 transition-colors duration-300 lg:px-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="text-tmuted hover:text-htext lg:hidden dark:hover:text-tmain"
                >
                    <i className="fa-solid fa-bars text-xl"></i>
                </button>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={toggleTheme}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-bmain/20 text-tmuted transition-colors hover:text-accent"
                    title={
                        isDark
                            ? 'Beralih ke Mode Terang'
                            : 'Beralih ke Mode Gelap'
                    }
                >
                    {isDark ? (
                        <i className="fa-solid fa-sun"></i>
                    ) : (
                        <i className="fa-solid fa-moon"></i>
                    )}
                </button>

                <div className="flex items-center gap-3 border-l border-tmuted/20 pl-6">
                    <div className="hidden text-right md:block">
                        <p className="text-sm font-semibold text-htext dark:text-tmain">
                            Wahyu Adam
                        </p>
                        <p className="text-xs text-tmuted">Administrator</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 font-bold text-accent">
                        <i className="fa-solid fa-user"></i>
                    </div>

                    <Link
                        href="/admin/logout"
                        method="post"
                        as="button"
                        className="ml-2 text-tmuted transition-colors hover:text-red-500"
                        title="Logout"
                    >
                        <i className="fa-solid fa-right-from-bracket text-lg"></i>
                    </Link>
                </div>
            </div>
        </header>
    );
}
