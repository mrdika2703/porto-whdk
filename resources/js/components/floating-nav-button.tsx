import { useState, useEffect, useCallback, useRef } from 'react';

const SECTIONS = [
    'about',
    'skills',
    'journey',
    'certificate',
    'direct',
    'design',
    'photo',
    'website',
    'other',
    'contact-footer',
] as const;

export default function FloatingNavButton() {
    const [visible, setVisible] = useState(false);
    const [isAtFooter, setIsAtFooter] = useState(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const IDLE_DELAY = 350; // ms sebelum tombol muncul setelah berhenti scroll

    // Detect apakah user di footer
    const checkFooter = useCallback(() => {
        const footer = document.getElementById('contact-footer');
        if (!footer) return false;
        const rect = footer.getBoundingClientRect();
        // Jika top footer sudah masuk viewport
        return rect.top < window.innerHeight * 0.8;
    }, []);

    // Cari section selanjutnya yg belum terlewat
    const getNextSection = useCallback((): string | null => {
        for (const id of SECTIONS) {
            const el = document.getElementById(id);
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            // Section dianggap "berikutnya" jika top-nya masih di bawah 120px dari atas viewport
            if (rect.top > 120) {
                return id;
            }
        }
        return null;
    }, []);

    // Handle scroll — hide tombol, set timer utk show setelah idle
    useEffect(() => {
        const handleScroll = () => {
            setVisible(false);

            if (scrollTimerRef.current) {
                clearTimeout(scrollTimerRef.current);
            }

            scrollTimerRef.current = setTimeout(() => {
                setIsAtFooter(checkFooter());
                setVisible(true);
            }, IDLE_DELAY);
        };

        // Show awal setelah delay
        scrollTimerRef.current = setTimeout(() => {
            setIsAtFooter(checkFooter());
            setVisible(true);
        }, IDLE_DELAY);

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        };
    }, [checkFooter]);

    const handleClick = () => {
        if (isAtFooter) {
            // Scroll ke about
            const about = document.getElementById('about');
            if (about) {
                about.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Scroll ke section berikutnya
            const nextId = getNextSection();
            if (nextId) {
                const el = document.getElementById(nextId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <button
            id="floating-nav-btn"
            onClick={handleClick}
            aria-label={isAtFooter ? 'Scroll to top' : 'Scroll to next section'}
            className={`fixed right-5 bottom-12 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-tmain/20 bg-white/50 backdrop-blur-md transition-all duration-300 ease-in-out hover:bg-white/75 md:right-8 md:bottom-8 md:h-14 md:w-14 ${
                visible
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-2 opacity-0'
            }`}
        >
            {isAtFooter ? (
                // Arrow up icon
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-tmain md:h-6 md:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 15l7-7 7 7"
                    />
                </svg>
            ) : (
                // Arrow down icon
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-tmain md:h-6 md:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            )}
        </button>
    );
}
