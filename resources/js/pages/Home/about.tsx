import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Profile } from './index';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Underline } from '@/components/underline';

function ProfilePhoto({ src }: { src: string }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        setIsLoaded(false);
        // Check if image already cached by browser
        const img = imgRef.current;
        if (img && img.complete && img.naturalHeight > 0) {
            setIsLoaded(true);
        }
    }, [src]);

    return (
        <>
            {!isLoaded && (
                <div className="absolute bottom-0 left-1/2 z-10 flex h-auto w-[220px] -translate-x-1/2 items-center justify-center sm:w-[280px] md:w-[387px]">
                    <div className="flex h-40 w-full animate-pulse items-center justify-center rounded-2xl bg-gray-400/30">
                        <div className="h-8 w-8 animate-spin rounded-full border-3 border-bshine/30 border-t-bshine" />
                    </div>
                </div>
            )}
            <img
                ref={imgRef}
                src={src}
                alt="Wahyu Adam Anandika"
                onLoad={() => setIsLoaded(true)}
                onError={() => setIsLoaded(true)}
                className={`absolute bottom-0 left-1/2 z-10 h-auto w-[220px] -translate-x-1/2 object-contain drop-shadow-2xl transition-opacity duration-500 sm:w-[280px] md:w-[387px] ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </>
    );
}

export default function About({
    profiles = [],
    viewMode = 'All',
}: {
    profiles: Profile[];
    viewMode?: 'All' | 'Multimedia' | 'Programming';
}) {
    const profile = profiles[0];
    const isMobile = useIsMobile();

    const currentPassion =
        viewMode === 'Multimedia'
            ? profile?.passion_multimedia || profile?.passion
            : viewMode === 'Programming'
              ? profile?.passion_coding || profile?.passion
              : profile?.passion;

    const currentAbout =
        viewMode === 'Multimedia'
            ? profile?.description_multimedia || profile?.about
            : viewMode === 'Programming'
              ? profile?.description_coding || profile?.about
              : profile?.about;

    const words = [
        `I'm ${profile?.nickname || 'Nickname'}`,
        currentPassion || 'Passion',
    ];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const typingRef = useRef(null);
    const isTypingInView = useInView(typingRef, { once: true, amount: 0.8 });

    // Reset typing effect when viewMode changes
    useEffect(() => {
        setCurrentWordIndex(0);
        setDisplayedText('');
        setIsDeleting(false);
    }, [viewMode]);

    useEffect(() => {
        if (!isTypingInView) return;
        const currentWord = words[currentWordIndex];
        let timer: NodeJS.Timeout;

        if (!isDeleting) {
            if (displayedText.length < currentWord.length) {
                timer = setTimeout(() => {
                    setDisplayedText(
                        currentWord.slice(0, displayedText.length + 1),
                    );
                }, 120); // Kecepatan mengetik
            } else {
                // Selesai mengetik, tunggu 5 detik
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, 2000);
            }
        } else {
            if (displayedText.length > 0) {
                timer = setTimeout(() => {
                    setDisplayedText(displayedText.slice(0, -1));
                }, 60); // Kecepatan menghapus
            } else {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
            }
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentWordIndex, isTypingInView, words]);

    const renderTypedText = () => {
        if (currentWordIndex === 0) {
            if (displayedText.length <= 3) {
                return (
                    <span
                        className="text-bshine"
                        dangerouslySetInnerHTML={{
                            __html: displayedText.replace(' ', '&nbsp;'),
                        }}
                    />
                );
            } else {
                return (
                    <>
                        <span className="text-bshine">I’m&nbsp;</span>
                        <span className="font-bold">
                            {displayedText.slice(3)}
                        </span>
                    </>
                );
            }
        } else {
            return (
                <span className="font-bold text-tmain">{displayedText}</span>
            );
        }
    };

    return (
        <>
            <div id="about" className="w-full">
                {/* =========================================
          ABOUT SECTION
      ========================================= */}
                {/* Radius lengkungan diperkecil sedikit di HP agar proporsional */}
                <section className="relative z-10 flex w-full flex-col items-center overflow-hidden rounded-t-[40px] pt-16 pb-16 shadow-[0_-15px_50px_rgba(0,0,0,0.2)] md:rounded-t-[60px] md:pt-24 md:pb-24 lg:rounded-t-[120px] dark:shadow-[0_-15px_50px_rgba(0,0,0,0.4)]">
                    {/* Background Foto Gunung */}
                    <div className="pointer-events-none absolute top-0 left-0 h-[582px] w-full overflow-hidden opacity-40">
                        <img
                            src="/assets/background/beach.webp"
                            alt="Beach Background"
                            loading="lazy"
                            className="h-full w-full object-cover dark:hidden"
                        />
                        <img
                            src="/assets/background/mountain.webp"
                            alt="Mountain Background"
                            loading="lazy"
                            className="hidden h-full w-full object-cover dark:block"
                        />
                        <div className="absolute top-0 left-0 h-40 w-full bg-gradient-to-b from-main to-transparent"></div>
                        <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-main to-transparent"></div>
                    </div>

                    {/* Konten Utama About */}
                    {/* Padding horizontal disesuaikan px-6 untuk HP, px-12 untuk desktop */}
                    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 md:px-12">
                        {/* Header & Sapaan */}
                        <div
                            ref={typingRef}
                            className="mb-5 flex flex-col items-center gap-4 text-center md:mb-20 md:gap-6"
                        >
                            <div className="relative inline-flex items-center">
                                <div className="relative rounded-full border border-bsecond bg-bsecond/80 px-5 py-1.5 md:px-6 md:py-2 md:backdrop-blur-md dark:bg-bsecond/10">
                                    <span className="text-sm font-medium text-white md:text-base">
                                        Hello!
                                    </span>
                                </div>
                            </div>

                            {/* Ukuran font teks animasi disesuaikan di HP */}
                            <h2 className="flex min-h-[80px] items-center justify-center font-montserrat-alt text-3xl leading-tight font-medium tracking-tighter text-tmain sm:min-h-[60px] sm:text-4xl md:text-5xl">
                                <span className="inline-block max-w-full text-center">
                                    {renderTypedText()}
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 1, 1, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1,
                                            ease: 'easeInOut',
                                        }}
                                        className="ml-1 inline-block font-light"
                                    >
                                        |
                                    </motion.span>
                                </span>
                            </h2>
                        </div>

                        {/* Layout 2 Kolom (Teks & Foto) */}
                        <div className="mb-10 flex w-full flex-col items-center justify-between gap-3 lg:flex-row lg:items-start">
                            {/* Kolom Kiri: Deskripsi */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                // Memastikan alignment rata kiri-tengah agar rapi
                                className="flex w-full flex-col items-start gap-2.5 md:gap-3 lg:w-[60%]"
                            >
                                <h2 className="max-w-2xl font-montserrat-alt text-2xl leading-relaxed font-bold tracking-tighter text-tmain md:text-3xl">
                                    <span className="relative inline-block">
                                        <span>
                                            {profile?.name || 'Nama Lengkap'}
                                        </span>
                                        {/* Layer Kilau bshine Shimmer */}
                                        <motion.span
                                            aria-hidden="true"
                                            whileInView={{
                                                backgroundPosition: [
                                                    '-200% 0',
                                                    '200% 0',
                                                ],
                                            }}
                                            viewport={{
                                                amount: 0.8,
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                repeatDelay: 1,
                                                ease: 'easeOut',
                                            }}
                                            style={{
                                                backgroundImage:
                                                    'linear-gradient(90deg, transparent 0%, transparent 30%, var(--color-bshine, #c06800) 50%, transparent 70%, transparent 100%)',
                                                backgroundSize: '200% 100%',
                                                backgroundRepeat: 'no-repeat',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor:
                                                    'transparent',
                                            }}
                                            className="pointer-events-none absolute top-0 left-0 h-full w-full text-left select-none"
                                        >
                                            {profile?.name || 'Nama Lengkap'}
                                        </motion.span>
                                    </span>
                                </h2>
                                <p className="font-regular max-w-2xl text-sm leading-relaxed tracking-normal text-tmain whitespace-pre-line md:text-lg lg:w-[70%]">
                                    {currentAbout || 'About'}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-4 md:mt-4 md:gap-5">
                                    <a
                                        href={`https://wa.me/62${profile?.whatsapp}`}
                                        className="rounded-xl bg-gradient-to-r from-bsecond to-stone-500 px-6 py-2.5 text-center text-xs font-semibold text-main hover:brightness-120 md:text-base dark:from-bshine dark:to-cyan-100"
                                    >
                                        Chat me
                                        <i className="fa-brands fa-whatsapp ml-2"></i>
                                    </a>
                                    <a
                                        href="#skills"
                                        className="rounded-xl border border-bsecond bg-white/10 px-6 py-2.5 text-center text-xs font-semibold text-tmain hover:bg-yellow-950/5 md:text-base dark:border-bsecond/50 dark:hover:bg-gray-200/20"
                                    >
                                        See My Skills
                                        <i className="fa-solid fa-arrow-up-right-from-square ml-2"></i>
                                    </a>
                                </div>
                            </motion.div>

                            {/* Kolom Kanan: Foto Dika */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative mt-2 flex w-full justify-center lg:mt-0 lg:w-[40%]"
                            >
                                <div className="relative h-[320px] w-full max-w-[350px] sm:h-[420px]">
                                    <ProfilePhoto
                                        src={`/storage/${profile?.photo}`}
                                    />

                                    {/* Kutipan Animasi Melayang (Floating Badge) — CSS animation untuk performa */}
                                    <div className="absolute -bottom-4 left-1/2 z-20 w-[90%] -translate-x-1/2 sm:bottom-12 sm:left-4 sm:w-auto sm:translate-x-0 lg:-left-20">
                                        <div
                                            className="rounded-full border border-white/20 bg-gray-600/70 px-4 py-3 text-center shadow-2xl sm:px-6 sm:py-3.5 sm:text-left md:bg-gray-600/40 md:backdrop-blur-md"
                                            style={{
                                                animation:
                                                    'floatBadge 4s ease-in-out infinite',
                                                willChange: 'transform',
                                            }}
                                        >
                                            {/* Mencegah wrap di desktop (whitespace-nowrap), izinkan wrap di HP (whitespace-normal) */}
                                            <p className="text-[10px] font-light tracking-wide whitespace-normal text-gray-200 italic sm:text-xs sm:whitespace-nowrap">
                                                {profile?.caption}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>

            {/* CSS float animation — berjalan di compositor thread, jauh lebih ringan dari Framer Motion */}
            <style>{`
            @keyframes floatBadge {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-12px); }
            }
        `}</style>
        </>
    );
}
