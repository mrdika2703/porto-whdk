import { Head } from '@inertiajs/react';
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
    delay,
} from 'framer-motion';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function PortfolioHero() {
    const fullText = 'Wahyu Adam Anandika';
    const [typedText, setTypedText] = useState('');
    const [showIntro, setShowIntro] = useState(true);
    const isMobile = useIsMobile();

    // Hook Scroll dari Framer Motion
    const { scrollY } = useScroll();

    const heroY = useTransform(scrollY, [0, 500], [0, isMobile ? 100 : 200]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    // 1. Logika Timer untuk durasi teks Intro (3 Detik)
    useEffect(() => {
        const introTimer = setTimeout(() => {
            setShowIntro(false);
        }, 3000);

        return () => clearTimeout(introTimer);
    }, []);

    // 2. Logika Efek Ngetik (Hanya berjalan setelah Intro selesai)
    useEffect(() => {
        if (showIntro) return;

        let intervalId: any;
        const timeoutId = setTimeout(() => {
            let i = 0;
            intervalId = setInterval(() => {
                setTypedText(fullText.slice(0, i + 1));
                i++;
                if (i >= fullText.length) {
                    clearInterval(intervalId);
                }
            }, 100);
        }, 500); // Delay 0.5 detik setelah transisi masuk teks utama

        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [showIntro, fullText]);

    // Animasi shape: matikan infinite di mobile
    const shapeAnimation = isMobile
        ? { opacity: 1 } // Static, no loop
        : { opacity: [1, 0.7, 1] }; // Infinite pulse di desktop

    const shapeTransition1 = isMobile
        ? { duration: 0.5 }
        : {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut' as const,
              delay: 1.2,
          };

    const shapeTransition2 = isMobile
        ? { duration: 0.5 }
        : {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut' as const,
              delay: 1.5,
          };

    // textShadow glow: matikan infinite di mobile
    const textShadowAnimation = isMobile
        ? {
              opacity: 1,
              y: 0,
              textShadow: '0px 0px 15px rgba(255,255,255,0.2)',
          }
        : {
              opacity: 1,
              y: 0,
              textShadow: [
                  '0px 0px 15px rgba(255,255,255,0.2)',
                  '0px 0px 45px rgba(255,255,255,0.8)',
                  '0px 0px 15px rgba(255,255,255,0.2)',
              ],
          };

    const textShadowTransition = isMobile
        ? {
              opacity: { duration: 0.8, delay: 0.4 },
              y: {
                  duration: 0.8,
                  delay: 0.4,
                  type: 'spring' as const,
                  stiffness: 80,
              },
          }
        : {
              opacity: { duration: 0.8, delay: 0.4 },
              y: {
                  duration: 0.8,
                  delay: 0.4,
                  type: 'spring' as const,
                  stiffness: 80,
              },
              textShadow: {
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                  delay: 1.5,
              },
          };

    // Cursor blink: matikan infinite di mobile setelah awal
    const cursorAnimation = { opacity: [0, 1, 1, 1, 0] };

    const cursorTransition = {
        repeat: Infinity,
        duration: 1,
        ease: 'easeInOut' as const,
    };

    return (
        <>
            {/* Tambahan overflow-hidden agar elemen SVG absolut tidak tembus/scroll ke samping */}
            <div id="home" className="bg-bg-sec relative min-h-screen w-full">
                <motion.div
                    style={
                        isMobile
                            ? { y: heroY, opacity: heroOpacity }
                            : {
                                  y: heroY,
                                  opacity: heroOpacity,
                              }
                    }
                    // Tambahkan overflow-hidden juga di kontainer fixed
                    className="fixed top-0 left-0 flex min-h-screen w-full flex-col items-center justify-center text-tmain will-change-transform"
                >
                    {/* --- SHAPE 1 (TOP RIGHT) --- */}
                    <motion.div className="pointer-events-none absolute -top-[200px] -right-[150px] h-[600px] w-[600px] max-w-none mix-blend-screen md:-top-[800px] md:-right-[600px] md:h-[1812px] md:w-[1611px]">
                        <motion.img
                            animate={shapeAnimation}
                            transition={shapeTransition1}
                            src="/assets/shapes/brown_shape_1.webp"
                            alt="Brown Shape Top Right"
                            className="h-full w-full dark:hidden"
                        />
                        <motion.img
                            animate={shapeAnimation}
                            transition={shapeTransition1}
                            src="/assets/shapes/blue_shape_1.webp"
                            alt="Blue Shape Top Right"
                            className="hidden h-full w-full dark:block"
                        />
                    </motion.div>

                    {/* --- SHAPE 2 (BOTTOM LEFT) --- */}
                    <motion.div className="pointer-events-none absolute -bottom-[100px] -left-[150px] h-[500px] w-[500px] max-w-none mix-blend-screen md:-bottom-[600px] md:-left-[500px] md:h-[1355px] md:w-[1204px]">
                        <motion.img
                            animate={shapeAnimation}
                            transition={shapeTransition2}
                            src="/assets/shapes/brown_shape_2.webp"
                            alt="Brown Shape Bottom Left"
                            className="h-full w-full dark:hidden"
                        />
                        <motion.img
                            animate={shapeAnimation}
                            transition={shapeTransition2}
                            src="/assets/shapes/blue_shape_2.webp"
                            alt="Blue Shape Bottom Left"
                            className="hidden h-full w-full dark:block"
                        />
                    </motion.div>

                    {/* --- KONTEN TEKS DENGAN ANIMATE PRESENCE --- */}
                    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
                        {/* mode="wait" memastikan intro hilang sepenuhnya sebelum konten utama muncul */}
                        <AnimatePresence mode="wait">
                            {showIntro ? (
                                // TEKS INTRO (Muncul 3 detik)
                                <motion.div
                                    key="intro"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{
                                        opacity: 0,
                                        y: -15,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: 'easeInOut',
                                    }}
                                    className="flex flex-col items-center gap-2 md:gap-3"
                                >
                                    <span className="text-xs font-light tracking-[0.2em] text-tmain/70 uppercase md:text-sm">
                                        Build With
                                    </span>
                                    <h1 className="hidden font-montserrat-alt text-3xl font-semibold text-tmain md:block md:text-5xl">
                                        Laravel 13{' '}
                                        <span className="mx-1 text-bshine md:mx-2">
                                            |
                                        </span>{' '}
                                        React{' '}
                                        <span className="mx-1 text-bshine md:mx-2">
                                            |
                                        </span>{' '}
                                        Full Tailwind
                                    </h1>
                                    <h1 className="flex flex-col gap-5 text-center font-montserrat-alt text-3xl font-semibold text-tmain md:hidden">
                                        <p className="mx-auto">Laravel 13</p>
                                        <p className="mx-auto">React</p>
                                        <p className="mx-auto">Full Tailwind</p>
                                    </h1>
                                </motion.div>
                            ) : (
                                // TEKS UTAMA (Muncul setelah intro selesai)
                                <motion.div
                                    key="main"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center"
                                >
                                    {/* Portofolio Title */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.2,
                                        }}
                                        className="mb-4 flex items-center gap-4 md:mb-6"
                                    >
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 0.5,
                                            }}
                                            className="h-[1px] w-8 origin-left bg-tmain md:w-20"
                                        ></motion.div>
                                        <h2 className="text-xs font-bold tracking-[0.15em] uppercase md:text-base md:tracking-[0.2em]">
                                            Portofolio
                                        </h2>
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 0.5,
                                            }}
                                            className="h-[1px] w-8 origin-right bg-tmain md:w-20"
                                        ></motion.div>
                                    </motion.div>

                                    {/* Nama Animasi Ketik */}
                                    <motion.h1
                                        initial={{
                                            opacity: 0,
                                            y: 30,
                                            textShadow:
                                                '0px 0px 0px rgba(255,255,255,0)',
                                        }}
                                        animate={textShadowAnimation}
                                        transition={textShadowTransition}
                                        className="mb-4 px-2 font-montserrat-alt text-[55px] leading-tight font-bold md:mb-6 md:text-6xl"
                                    >
                                        {typedText}
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={cursorAnimation}
                                            transition={cursorTransition}
                                            className="font-light"
                                        >
                                            |
                                        </motion.span>
                                    </motion.h1>

                                    {/* Sub-kategori */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.6,
                                        }}
                                        className="text-xs font-light tracking-widest text-tmain md:text-sm"
                                    >
                                        Design Graphic | Photography | Website
                                        Development
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Scroll Down Indicator — gunakan CSS animation bukan animate-bounce */}
                    <AnimatePresence>
                        {!showIntro && (
                            <motion.a
                                href="#about"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1, delay: 1.2 }}
                                className="group absolute bottom-20 z-10 flex cursor-pointer flex-col items-center gap-2 md:bottom-12"
                                style={{
                                    animation:
                                        'gentleBounce 2s ease-in-out infinite',
                                    willChange: 'transform',
                                }}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mb-1 text-tmain opacity-80 transition-opacity group-hover:opacity-100"
                                >
                                    <rect
                                        x="5"
                                        y="2"
                                        width="14"
                                        height="20"
                                        rx="7"
                                    />
                                    <path d="M12 6v4" />
                                </svg>
                                <span className="text-[10px] font-medium tracking-wide text-tmain opacity-80 transition-opacity group-hover:opacity-100 md:text-xs">
                                    Scroll down
                                </span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-tmain opacity-80 transition-opacity group-hover:opacity-100"
                                >
                                    <path d="M12 5v14M19 12l-7 7-7-7" />
                                </svg>
                            </motion.a>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Pembatas Scroll */}
                <div className="min-h-screen w-full"></div>
            </div>

            {/* CSS animation ringan (compositor-thread) sebagai pengganti animate-bounce */}
            <style>{`
                @keyframes gentleBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </>
    );
}
