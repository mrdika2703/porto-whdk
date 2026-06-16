import { Head } from '@inertiajs/react';
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
} from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PortfolioHero() {
    const fullText = 'Wahyu Adam Anandika';
    const [typedText, setTypedText] = useState('');
    const [showIntro, setShowIntro] = useState(true);

    // Hook Scroll dari Framer Motion
    const { scrollY } = useScroll();

    // Transformasi Parallax & Blur untuk Hero
    const heroY = useTransform(scrollY, [0, 500], [0, 200]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroBlur = useTransform(
        scrollY,
        [0, 400],
        ['blur(0px)', 'blur(10px)'],
    );

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

    return (
        <>
            <Head title="Portofolio - Wahyu Adam Anandika" />

            {/* Tambahan overflow-hidden agar elemen SVG absolut tidak tembus/scroll ke samping */}
            <div id="home" className="bg-bg-sec relative min-h-screen w-full">
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity, filter: heroBlur }}
                    // Tambahkan overflow-hidden juga di kontainer fixed
                    className="fixed top-0 left-0 flex min-h-screen w-full flex-col items-center justify-center text-tmain"
                >
                    {/* --- SHAPE 1 (TOP RIGHT) --- */}
                    <motion.div className="pointer-events-none absolute -top-[150px] -right-[150px] h-[400px] w-[400px] max-w-none mix-blend-screen sm:-top-[400px] sm:-right-[300px] sm:h-[900px] sm:w-[800px] md:-top-[800px] md:-right-[600px] md:h-[1812px] md:w-[1611px]">
                        <motion.img
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 1.2,
                            }}
                            src="/assets/shapes/brown_shape_1.svg"
                            alt="Brown Shape Top Right"
                            className="h-full w-full dark:hidden"
                        />
                        <motion.img
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 1.2,
                            }}
                            src="/assets/shapes/blue_shape_1.svg"
                            alt="Blue Shape Top Right"
                            className="hidden h-full w-full dark:block"
                        />
                    </motion.div>

                    {/* --- SHAPE 2 (BOTTOM LEFT) --- */}
                    <motion.div className="pointer-events-none absolute -bottom-[150px] -left-[100px] h-[350px] w-[350px] max-w-none mix-blend-screen sm:-bottom-[300px] sm:-left-[200px] sm:h-[700px] sm:w-[600px] md:-bottom-[600px] md:-left-[500px] md:h-[1355px] md:w-[1204px]">
                        <motion.img
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 1.5,
                            }}
                            src="/assets/shapes/brown_shape_2.svg"
                            alt="Brown Shape Bottom Left"
                            className="h-full w-full dark:hidden"
                        />
                        <motion.img
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 1.5,
                            }}
                            src="/assets/shapes/blue_shape_2.svg"
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
                                        Made With
                                    </span>
                                    <h1 className="text-lg font-semibold text-tmain sm:text-xl md:text-4xl">
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
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            textShadow: [
                                                '0px 0px 15px rgba(255,255,255,0.2)',
                                                '0px 0px 45px rgba(255,255,255,0.8)',
                                                '0px 0px 15px rgba(255,255,255,0.2)',
                                            ],
                                        }}
                                        transition={{
                                            opacity: {
                                                duration: 0.8,
                                                delay: 0.4,
                                            },
                                            y: {
                                                duration: 0.8,
                                                delay: 0.4,
                                                type: 'spring',
                                                stiffness: 80,
                                            },
                                            textShadow: {
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                                delay: 1.5,
                                            },
                                        }}
                                        className="mb-4 px-2 text-4xl leading-tight font-bold sm:text-5xl md:mb-6 md:text-6xl"
                                    >
                                        {typedText}
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.8,
                                                repeatType: 'reverse',
                                            }}
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
                                        className="text-[10px] font-light tracking-widest text-tmain sm:text-xs md:text-sm"
                                    >
                                        Design Graphic | Photography | Website
                                        Development
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Scroll Down Indicator */}
                    <AnimatePresence>
                        {!showIntro && (
                            <motion.a
                                href="#about"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1, delay: 1.2 }}
                                className="group absolute bottom-8 z-10 flex animate-bounce cursor-pointer flex-col items-center gap-2 md:bottom-12"
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
        </>
    );
}
