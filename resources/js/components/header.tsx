import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Watermark } from '@/components/watermark';

export default function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDark, setIsDark] = useState(true);

    // --- LOGIKA THEME (DARK/LIGHT) ---
    useEffect(() => {
        // Mengecek localStorage (apakah user pernah klik tombol sebelumnya)
        const savedTheme = localStorage.getItem('theme');

        // Karena desain web Anda aslinya gelap, kita set default ke dark
        if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    // --- LOGIKA SCROLL NAVBAR ---
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 100) {
                setIsVisible(false);
                lastScrollY = currentScrollY;
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(true);
                lastScrollY = currentScrollY;
            } else if (lastScrollY - currentScrollY > 80) {
                setIsVisible(false);
                lastScrollY = currentScrollY;
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            // 1. PERBAIKAN LEBAR: w-[95vw] dan justify-between untuk HP agar melebar maksimal, md:w-max untuk Desktop
            className={`font-inter fixed top-4 left-1/2 z-50 flex w-[95vw] -translate-x-1/2 items-center justify-between gap-2 transition-all duration-500 ease-in-out md:top-6 md:w-max md:justify-center md:gap-4 ${
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none -translate-y-8 opacity-0'
            }`}
        >
            {/* Navigasi Utama (Pill Putih) */}
            {/* 1. PERBAIKAN LEBAR: w-full untuk HP agar mengisi sisa ruang, md:w-auto untuk Desktop */}
            <nav className="flex w-full items-center justify-between gap-2 rounded-full bg-white px-5 py-2 shadow-lg md:w-auto md:gap-10 md:px-10 md:py-3">
                <a
                    href="#"
                    className="transition-colors hover:text-hbshine sm:text-sm md:text-base"
                >
                    <Watermark className="h-6 w-6 text-htext hover:text-hbshine" />
                </a>

                <a
                    href="#home"
                    className="text-[13.5px] font-medium text-htext transition-colors hover:text-hbshine sm:text-sm md:text-base"
                >
                    Home
                </a>

                {/* Dropdown Portofolio */}
                {/* 2. PERBAIKAN DROPDOWN: Tambahkan tabIndex={0} dan outline-none agar div ini bisa menerima "Tap" / Fokus di HP */}
                <div
                    tabIndex={0}
                    className="group relative flex cursor-pointer items-center gap-1 pb-0 outline-none"
                >
                    {/* Tambahkan group-focus: agar saat ditap warnanya berubah */}
                    <span className="text-[13.5px] font-medium text-htext transition-colors group-hover:text-hbshine group-focus:text-hhtext sm:text-sm md:text-base">
                        Portofolio
                    </span>
                    {/* Tambahkan group-focus:rotate-180 agar panah ikut berputar saat ditap */}
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="mt-0.5 h-3 w-3 transition-transform group-hover:rotate-180 group-focus:rotate-180 md:mt-1 md:h-3.5 md:w-3.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>

                    {/* Menu Dropdown */}
                    {/* 2. PERBAIKAN DROPDOWN: Tambahkan group-focus:visible dan group-focus:opacity-100 agar menu muncul saat layar ditap */}
                    <div className="invisible absolute top-full left-1/2 mt-2 flex w-40 -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 md:w-48 md:rounded-2xl">
                        <a
                            href="#design"
                            className="px-4 py-2.5 text-[13.5px] text-gray-700 hover:bg-gray-100 hover:text-hbshine md:px-5 md:py-3 md:text-sm"
                        >
                            Design Graphic
                        </a>
                        <a
                            href="#photo"
                            className="px-4 py-2.5 text-[13.5px] text-gray-700 hover:bg-gray-100 hover:text-hbshine md:px-5 md:py-3 md:text-sm"
                        >
                            Photography & Video
                        </a>
                        <a
                            href="#website"
                            className="px-4 py-2.5 text-[13.5px] text-gray-700 hover:bg-gray-100 hover:text-hbshine md:px-5 md:py-3 md:text-sm"
                        >
                            Websites
                        </a>
                    </div>
                </div>

                <a
                    href="#about"
                    className="text-[13.5px] font-medium text-htext transition-colors hover:text-hbshine sm:text-sm md:text-base"
                >
                    About
                </a>
            </nav>

            {/* Tombol Tema (Sun / Moon Icon) */}
            <button
                onClick={toggleTheme}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 border-white/50 bg-white/20 text-bsecond shadow-lg backdrop-blur-md transition-all hover:bg-white/30 sm:h-10 sm:w-10 md:h-[52px] md:w-[52px] dark:border-white/50 dark:text-white"
            >
                {isDark ? (
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 md:h-5 md:w-5"
                    >
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                ) : (
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 md:h-5 md:w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                )}
            </button>

            {/* Tombol Chat */}
            <a
                href="#contact-footer"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 border-white/50 bg-white/20 text-bsecond shadow-lg backdrop-blur-md transition-all hover:bg-white/30 sm:h-10 sm:w-10 md:h-[52px] md:w-[52px] dark:border-white/50 dark:text-white"
            >
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 md:h-5 md:w-5"
                >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
            </a>
        </header>
    );
}
