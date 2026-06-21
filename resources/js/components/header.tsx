import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Watermark } from '@/components/watermark';

export default function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // 2. STATE BARU UNTUK TRACKING MENU AKTIF
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const root = document.documentElement;
        const storedTheme = localStorage.getItem('theme');

        if (storedTheme === 'dark') {
            root.classList.add('dark');
            setIsDark(true);
        } else if (storedTheme === 'light') {
            root.classList.remove('dark');
            setIsDark(false);
        } else {
            const currentHour = new Date().getHours();

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

    // --- LOGIKA SCROLL NAVBAR HIDE/SHOW ---
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

    // 3. LOGIKA DETEKSI SECTION MANA YANG SEDANG DI LAYAR (SCROLL SPY)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Jika elemen menyentuh 40% area tengah layar, jadikan menu tersebut aktif
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-40% 0px -40% 0px' },
        );

        // Daftarkan semua ID section yang ada di halaman utama
        const sections = [
            'home',
            'about',
            'journey',
            'design',
            'photo',
            'website',
            'contact-footer',
        ];
        sections.forEach((id) => {
            const element = document.getElementById(id);

            if (element) {
observer.observe(element);
}
        });

        return () => observer.disconnect();
    }, []);

    // Helper untuk mengecek apakah salah satu isi Portofolio sedang aktif
    const isPortfolioActive = ['design', 'photo', 'website'].includes(
        activeSection,
    );

    return (
        <header
            className={`font-inter fixed top-4 left-1/2 z-50 flex w-[95vw] -translate-x-1/2 items-center justify-between gap-1.5 transition-all duration-500 ease-in-out md:top-6 md:w-max md:justify-center md:gap-4 ${
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none -translate-y-8 opacity-0'
            }`}
        >
            <nav className="flex w-full items-center justify-between gap-0.5 rounded-full bg-white px-3 py-1.5 shadow-lg md:w-auto md:gap-4 md:px-6 md:py-2.5">
                <a
                    href="#"
                    className="mr-2 hidden transition-colors hover:text-hbshine md:mr-6 md:block md:text-sm"
                >
                    <Watermark className="h-6 w-6 text-htext hover:text-hbshine" />
                </a>

                {/* --- MENU HOME --- */}
                <a
                    href="#home"
                    onClick={() => setActiveSection('home')}
                    className={`relative rounded-full px-2 py-1.5 text-xs font-medium transition-colors md:px-4 md:text-sm ${
                        activeSection === 'home'
                            ? 'text-hbshine'
                            : 'text-htext hover:text-hbshine'
                    }`}
                >
                    {/* 4. ANIMASI OUTLINE BERPINDAH (FRAMER MOTION) */}
                    {activeSection === 'home' && (
                        <motion.div
                            layoutId="active-nav-pill"
                            className="absolute inset-0 rounded-full border border-bshine bg-bshine/5"
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                    )}
                    <span className="relative z-10">Home</span>
                </a>

                {/* --- MENU ABOUT --- */}
                <a
                    href="#about"
                    onClick={() => setActiveSection('about')}
                    className={`relative rounded-full px-2 py-1.5 text-xs font-medium transition-colors md:px-4 md:text-sm ${
                        activeSection === 'about'
                            ? 'text-hbshine'
                            : 'text-htext hover:text-hbshine'
                    }`}
                >
                    {activeSection === 'about' && (
                        <motion.div
                            layoutId="active-nav-pill"
                            className="absolute inset-0 rounded-full border border-bshine bg-bshine/5"
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                    )}
                    <span className="relative z-10">About</span>
                </a>

                {/* --- MENU Journey --- */}
                <a
                    href="#journey"
                    onClick={() => setActiveSection('journey')}
                    className={`relative rounded-full px-2 py-1.5 text-xs font-medium transition-colors md:px-4 md:text-sm ${
                        activeSection === 'journey'
                            ? 'text-hbshine'
                            : 'text-htext hover:text-hbshine'
                    }`}
                >
                    {activeSection === 'journey' && (
                        <motion.div
                            layoutId="active-nav-pill"
                            className="absolute inset-0 rounded-full border border-bshine bg-bshine/5"
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                    )}
                    <span className="relative z-10">Journey</span>
                </a>

                {/* --- MENU PORTOFOLIO --- */}
                <div
                    tabIndex={0}
                    className={`group relative flex cursor-pointer items-center gap-1 rounded-full px-2 py-1.5 transition-colors outline-none md:px-4 ${
                        isPortfolioActive
                            ? 'text-hbshine'
                            : 'text-htext hover:text-hbshine'
                    }`}
                >
                    {isPortfolioActive && (
                        <motion.div
                            layoutId="active-nav-pill"
                            className="absolute inset-0 rounded-full border border-bshine bg-bshine/5"
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                    )}
                    <span className="relative z-10 text-xs font-medium md:text-sm">
                        Portofolio
                    </span>
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="relative z-10 mt-0.5 h-3 w-3 transition-transform group-hover:rotate-180 group-focus:rotate-180 md:mt-1 md:h-3.5 md:w-3.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>

                    {/* Menu Dropdown */}
                    <div className="invisible absolute top-full left-1/2 mt-2 flex w-40 -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 md:w-48 md:rounded-2xl">
                        <a
                            href="#design"
                            onClick={() => setActiveSection('design')}
                            className={`px-4 py-2.5 text-xs hover:bg-gray-100 hover:text-hbshine md:px-5 md:py-3 md:text-sm ${activeSection === 'design' ? 'bg-gray-50 font-semibold text-hbshine' : 'text-gray-700'}`}
                        >
                            Design Graphic
                        </a>
                        <a
                            href="#photo"
                            onClick={() => setActiveSection('photo')}
                            className={`px-4 py-2.5 text-xs hover:bg-gray-100 hover:text-hbshine md:px-5 md:py-3 md:text-sm ${activeSection === 'photo' ? 'bg-gray-50 font-semibold text-hbshine' : 'text-gray-700'}`}
                        >
                            Photography & Video
                        </a>
                        <a
                            href="#website"
                            onClick={() => setActiveSection('website')}
                            className={`px-4 py-2.5 text-xs hover:bg-gray-100 hover:text-hbshine md:px-5 md:py-3 md:text-sm ${activeSection === 'website' ? 'bg-gray-50 font-semibold text-hbshine' : 'text-gray-700'}`}
                        >
                            Websites
                        </a>
                    </div>
                </div>
            </nav>

            {/* Tombol Tema (Sun / Moon Icon) */}
            <button
                onClick={toggleTheme}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/20 text-bsecond shadow-lg backdrop-blur-md transition-all hover:bg-white/30 sm:h-10 sm:w-10 md:h-[52px] md:w-[52px] dark:border-white/50 dark:text-white"
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
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 ${activeSection === 'contact-footer' ? 'bg-bshine/20' : 'bg-white/20'} text-bsecond shadow-lg backdrop-blur-md transition-all hover:bg-white/30 sm:h-10 sm:w-10 md:h-[52px] md:w-[52px] dark:border-white/50 dark:text-white`}
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
