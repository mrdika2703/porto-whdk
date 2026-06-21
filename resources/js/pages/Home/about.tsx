import { animated, useSpring } from '@react-spring/web';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useInView } from '@/hooks/useInView';
import type { Profile } from './index';

export default function About({ profiles = [] }: { profiles: Profile[] }) {
    const profile = profiles[0];

    const words = useMemo(() => [
        `I'm ${profile?.nickname || 'Nickname'}`,
        profile?.passion || 'Passion',
    ], [profile?.nickname, profile?.passion]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const typingRef = useRef<HTMLDivElement>(null);
    const isTypingInView = useInView(typingRef, { once: true, amount: 0.5 });

    useEffect(() => {
        if (!isTypingInView) {
            return;
        }

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
                }, 5000);
            }
        } else {
            if (displayedText.length > 0) {
                timer = setTimeout(() => {
                    setDisplayedText(displayedText.slice(0, -1));
                }, 60); // Kecepatan menghapus
            } else {
                timer = setTimeout(() => {
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                }, 0);
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

    // React-Spring for content fade-in and slide-in
    const contentRef = useRef<HTMLDivElement>(null);
    const isContentInView = useInView(contentRef, { once: true, amount: 0.3 });

    const leftColSpring = useSpring({
        opacity: isContentInView ? 1 : 0,
        transform: isContentInView ? 'translateX(0px)' : 'translateX(-30px)',
        config: { tension: 280, friction: 60 },
        delay: 200,
    });

    const rightColSpring = useSpring({
        opacity: isContentInView ? 1 : 0,
        transform: isContentInView ? 'translateX(0px)' : 'translateX(30px)',
        config: { tension: 280, friction: 60 },
        delay: 200,
    });

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
                        src="/assets/background/beach.jpg"
                        alt="Beach Background"
                        className="h-full w-full object-cover dark:hidden"
                    />
                    <img
                        src="/assets/background/mountain.jpg"
                        alt="Mountain Background"
                        className="hidden h-full w-full object-cover dark:block"
                    />
                    <div className="absolute top-0 left-0 h-40 w-full bg-gradient-to-b from-main to-transparent"></div>
                    <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-main to-transparent"></div>
                </div>

                {/* Konten Utama About */}
                {/* Padding horizontal disesuaikan px-6 untuk HP, px-12 untuk desktop */}
                <div ref={contentRef} className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 md:px-12">
                    {/* Header & Sapaan */}
                    <div
                        ref={typingRef}
                        className="mb-16 flex flex-col items-center gap-4 text-center md:mb-20 md:gap-6"
                    >
                        <div className="relative inline-flex items-center">
                            <div className="rounded-full border border-bsecond bg-bsecond/80 px-5 py-1.5 md:backdrop-blur-md md:px-6 md:py-2 dark:bg-bsecond/10">
                                <span className="text-lg font-medium text-white md:text-xl">
                                    Hello!
                                </span>
                            </div>
                            <img
                                src="/assets/icons/slay_light.svg"
                                alt="Slay light decoration"
                                className="absolute -top-3 -right-6 h-6 w-6 md:-top-4 md:-right-8 md:h-8 md:w-8 dark:hidden"
                            />
                            <img
                                src="/assets/icons/slay_dark.svg"
                                alt="Slay dark decoration"
                                className="absolute -top-3 -right-6 hidden h-6 w-6 md:-top-4 md:-right-8 md:h-8 md:w-8 dark:block"
                            />
                        </div>

                        {/* Ukuran font teks animasi disesuaikan di HP */}
                        <h2 className="flex min-h-[80px] items-center justify-center text-3xl leading-tight font-medium text-tmain sm:min-h-[60px] sm:text-4xl md:text-5xl">
                            {renderTypedText()}
                            <span className="ml-1 animate-pulse font-light text-bsecond">
                                |
                            </span>
                        </h2>
                    </div>

                    {/* Layout 2 Kolom (Teks & Foto) */}
                    <div className="flex w-full flex-col items-center justify-between gap-16 lg:flex-row lg:items-start lg:gap-8">
                        {/* Kolom Kiri: Deskripsi */}
                        <animated.div
                            style={leftColSpring}
                            // Memastikan alignment rata kiri-tengah agar rapi
                            className="flex w-full flex-col items-start gap-5 md:gap-6 lg:w-[60%]"
                        >
                            <h2 className="max-w-2xl text-2xl leading-relaxed font-bold text-tmain md:text-3xl">
                                {profile?.name || 'Nama Lengkap'}
                            </h2>
                            <p className="max-w-2xl text-sm leading-relaxed font-light text-tmain md:text-base lg:w-[70%]">
                                {profile?.about || 'About'}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-4 md:mt-8 md:gap-5">
                                <a
                                    href={`https://wa.me/62${profile?.whatsapp}`}
                                    className="rounded-xl bg-gradient-to-r from-bsecond to-stone-500 px-5 py-2.5 text-center text-xs font-semibold text-main hover:brightness-120 md:text-sm dark:from-bshine dark:to-cyan-100"
                                >
                                    Chat me
                                    <i className="fa-brands fa-whatsapp ml-2"></i>
                                </a>
                                <a
                                    href="#skills"
                                    className="rounded-xl border border-bsecond bg-white/10 px-5 py-2.5 text-center text-xs font-semibold text-tmain hover:bg-yellow-950/5 md:text-sm dark:border-bsecond/50 dark:hover:bg-gray-200/20"
                                >
                                    See My Skills
                                    <i className="fa-solid fa-arrow-up-right-from-square ml-2"></i>
                                </a>
                            </div>
                        </animated.div>

                        {/* Kolom Kanan: Foto Dika */}
                        <animated.div
                            style={rightColSpring}
                            className="relative mt-8 flex w-full justify-center lg:mt-0 lg:w-[40%]"
                        >
                            {/* Max-width mencegah elemen tumpah di layar HP yang sempit */}
                            <div className="relative h-[320px] w-full max-w-[350px] sm:h-[420px]">
                                {/* Foto Dika menabrak batas shape */}
                                <img
                                    src={`/storage/${profile?.photo}`}
                                    alt="Wahyu Adam Anandika"
                                    className="absolute bottom-0 left-1/2 z-10 h-auto w-[220px] -translate-x-1/2 object-contain drop-shadow-2xl sm:w-[280px] md:w-[387px]"
                                />

                                {/* Kutipan Animasi Melayang (Floating Badge) — CSS animation untuk performa */}
                                <div
                                    // Responsif posisi: tengah di HP, melayang ke kiri di desktop.
                                    className="absolute -bottom-4 left-1/2 z-20 w-[90%] -translate-x-1/2 rounded-full border border-white/20 bg-gray-600/70 px-4 py-3 text-center shadow-2xl md:bg-gray-600/40 md:backdrop-blur-md sm:bottom-12 sm:left-4 sm:w-auto sm:translate-x-0 sm:px-6 sm:py-3.5 sm:text-left lg:-left-20"
                                    style={{
                                        animation: 'floatBadge 4s ease-in-out infinite',
                                        willChange: 'transform',
                                    }}
                                >
                                    {/* Mencegah wrap di desktop (whitespace-nowrap), izinkan wrap di HP (whitespace-normal) */}
                                    <p className="text-[10px] font-light tracking-wide whitespace-normal text-gray-200 italic sm:text-xs sm:whitespace-nowrap">
                                        {profile?.caption}
                                    </p>
                                </div>
                            </div>
                        </animated.div>
                    </div>
                </div>
            </section>
        </div>

        {/* CSS float animation — berjalan di compositor thread, jauh lebih ringan dari Framer Motion */}
        <style>{`
            @keyframes floatBadge {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50% { transform: translateX(-50%) translateY(-12px); }
            }
            @media (min-width: 640px) {
                @keyframes floatBadge {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(0) translateY(-12px); }
                }
            }
        `}</style>
        </>
    );
}
