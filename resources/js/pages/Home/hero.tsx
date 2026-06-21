import { Head } from '@inertiajs/react';
import { useScroll, animated, useSpring, useTransition } from '@react-spring/web';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function PortfolioHero() {
    const fullText = 'Wahyu Adam Anandika';
    const [typedText, setTypedText] = useState('');
    const [showIntro, setShowIntro] = useState(true);
    const isMobile = useIsMobile();

    // Hook Scroll dari React-Spring
    const { scrollY } = useScroll();

    // Transformasi Parallax dengan interpolation
    const heroY = scrollY.to(val => {
        if (val <= 0) {
return 0;
}

        if (val >= 500) {
return isMobile ? 100 : 200;
}

        return (val / 500) * (isMobile ? 100 : 200);
    });

    const heroOpacity = scrollY.to(val => {
        if (val <= 0) {
return 1;
}

        if (val >= 400) {
return 0;
}

        return 1 - val / 400;
    });

    const heroBlur = scrollY.to(val => {
        if (isMobile) {
return 'blur(0px)';
}

        if (val <= 0) {
return 'blur(0px)';
}

        if (val >= 400) {
return 'blur(5px)';
}

        return `blur(${(val / 400) * 5}px)`;
    });

    // 1. Logika Timer untuk durasi teks Intro (3 Detik)
    useEffect(() => {
        const introTimer = setTimeout(() => {
            setShowIntro(false);
        }, 3000);

        return () => clearTimeout(introTimer);
    }, []);

    // 2. Logika Efek Ngetik (Hanya berjalan setelah Intro selesai)
    useEffect(() => {
        if (showIntro) {
return;
}

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

            if (intervalId) {
clearInterval(intervalId);
}
        };
    }, [showIntro, fullText]);

    // Spring animations untuk Shapes
    const shapeSpring1 = useSpring({
        from: { opacity: 1 },
        to: { opacity: isMobile ? 1 : 0.7 },
        loop: isMobile ? false : { reverse: true },
        config: { duration: 4000 },
        delay: 1200,
    });

    const shapeSpring2 = useSpring({
        from: { opacity: 1 },
        to: { opacity: isMobile ? 1 : 0.7 },
        loop: isMobile ? false : { reverse: true },
        config: { duration: 5000 },
        delay: 1500,
    });

    // Spring animations untuk main content elements
    const titleSpring = useSpring({
        opacity: showIntro ? 0 : 1,
        y: showIntro ? -20 : 0,
        delay: 200,
        config: { tension: 280, friction: 60 },
    });

    const leftLineSpring = useSpring({
        scaleX: showIntro ? 0 : 1,
        delay: 500,
        config: { tension: 280, friction: 60 },
    });

    const rightLineSpring = useSpring({
        scaleX: showIntro ? 0 : 1,
        delay: 500,
        config: { tension: 280, friction: 60 },
    });

    const textGlowSpring = useSpring({
        opacity: showIntro ? 0 : 1,
        y: showIntro ? 30 : 0,
        shadowGlow: isMobile ? 15 : 45,
        from: { opacity: 0, y: 30, shadowGlow: 15 },
        loop: isMobile ? false : { reverse: true },
        config: { duration: 2500 },
        delay: 400,
    });

    const descSpring = useSpring({
        opacity: showIntro ? 0 : 1,
        y: showIntro ? 20 : 0,
        delay: 600,
        config: { tension: 280, friction: 60 },
    });

    const cursorSpring = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        loop: { reverse: true },
        config: { duration: 400 },
    });

    // Transition untuk intro vs main content
    const introTransition = useTransition(showIntro, {
        from: { opacity: 0, y: 15 },
        enter: { opacity: 1, y: 0 },
        leave: { opacity: 0, y: -15 },
        config: { duration: 800 },
    });

    // Transition untuk Scroll Down Indicator
    const scrollIndicatorTransition = useTransition(!showIntro, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 1000 },
        delay: 1200,
    });

    return (
        <>
            <Head title="Portofolio - Wahyu Adam Anandika" />

            {/* Tambahan overflow-hidden agar elemen SVG absolut tidak tembus/scroll ke samping */}
            <div id="home" className="bg-bg-sec relative min-h-screen w-full">
                <animated.div
                    style={
                        isMobile
                            ? {
                                  transform: heroY.to(y => `translateY(${y}px)`),
                                  opacity: heroOpacity,
                              }
                            : {
                                  transform: heroY.to(y => `translateY(${y}px)`),
                                  opacity: heroOpacity,
                                  filter: heroBlur,
                              }
                    }
                    className="fixed top-0 left-0 flex min-h-screen w-full flex-col items-center justify-center text-tmain will-change-transform"
                >
                    {/* --- SHAPE 1 (TOP RIGHT) --- */}
                    <animated.div className="pointer-events-none absolute -top-[150px] -right-[150px] h-[400px] w-[400px] max-w-none mix-blend-screen sm:-top-[400px] sm:-right-[300px] sm:h-[900px] sm:w-[800px] md:-top-[800px] md:-right-[600px] md:h-[1812px] md:w-[1611px]">
                        <animated.img
                            style={{ opacity: shapeSpring1.opacity }}
                            src="/assets/shapes/brown_shape_1.svg"
                            alt="Brown Shape Top Right"
                            className="h-full w-full dark:hidden"
                        />
                        <animated.img
                            style={{ opacity: shapeSpring1.opacity }}
                            src="/assets/shapes/blue_shape_1.svg"
                            alt="Blue Shape Top Right"
                            className="hidden h-full w-full dark:block"
                        />
                    </animated.div>

                    {/* --- SHAPE 2 (BOTTOM LEFT) --- */}
                    <animated.div className="pointer-events-none absolute -bottom-[150px] -left-[100px] h-[350px] w-[350px] max-w-none mix-blend-screen sm:-bottom-[300px] sm:-left-[200px] sm:h-[700px] sm:w-[600px] md:-bottom-[600px] md:-left-[500px] md:h-[1355px] md:w-[1204px]">
                        <animated.img
                            style={{ opacity: shapeSpring2.opacity }}
                            src="/assets/shapes/brown_shape_2.svg"
                            alt="Brown Shape Bottom Left"
                            className="h-full w-full dark:hidden"
                        />
                        <animated.img
                            style={{ opacity: shapeSpring2.opacity }}
                            src="/assets/shapes/blue_shape_2.svg"
                            alt="Blue Shape Bottom Left"
                            className="hidden h-full w-full dark:block"
                        />
                    </animated.div>

                    {/* --- KONTEN TEKS DENGAN ANIMATE PRESENCE (REPLACED WITH USTRANSITION) --- */}
                    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
                        {introTransition((styles, item) =>
                            item ? (
                                // TEKS INTRO (Muncul 3 detik)
                                <animated.div
                                    style={styles}
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
                                </animated.div>
                            ) : (
                                // TEKS UTAMA (Muncul setelah intro selesai)
                                <animated.div
                                    style={{ opacity: styles.opacity }}
                                    className="flex flex-col items-center"
                                >
                                    {/* Portofolio Title */}
                                    <animated.div
                                        style={{
                                            opacity: titleSpring.opacity,
                                            transform: titleSpring.y.to(y => `translateY(${y}px)`),
                                        }}
                                        className="mb-4 flex items-center gap-4 md:mb-6"
                                    >
                                        <animated.div
                                            style={{
                                                transform: leftLineSpring.scaleX.to(s => `scaleX(${s})`),
                                            }}
                                            className="h-[1px] w-8 origin-left bg-tmain md:w-20"
                                        ></animated.div>
                                        <h2 className="text-xs font-bold tracking-[0.15em] uppercase md:text-base md:tracking-[0.2em]">
                                            Portofolio
                                        </h2>
                                        <animated.div
                                            style={{
                                                transform: rightLineSpring.scaleX.to(s => `scaleX(${s})`),
                                            }}
                                            className="h-[1px] w-8 origin-right bg-tmain md:w-20"
                                        ></animated.div>
                                    </animated.div>

                                    {/* Nama Animasi Ketik */}
                                    <animated.h1
                                        style={{
                                            opacity: textGlowSpring.opacity,
                                            transform: textGlowSpring.y.to(y => `translateY(${y}px)`),
                                            textShadow: textGlowSpring.shadowGlow.to(g =>
                                                `0px 0px ${g}px rgba(255,255,255,${isMobile ? 0.2 : 0.2 + ((g - 15) / 30) * 0.6})`
                                            ),
                                        }}
                                        className="mb-4 px-2 text-4xl leading-tight font-bold sm:text-5xl md:mb-6 md:text-6xl"
                                    >
                                        {typedText}
                                        <animated.span
                                            style={{ opacity: cursorSpring.opacity }}
                                            className="font-light"
                                        >
                                            |
                                        </animated.span>
                                    </animated.h1>

                                    {/* Sub-kategori */}
                                    <animated.p
                                        style={{
                                            opacity: descSpring.opacity,
                                            transform: descSpring.y.to(y => `translateY(${y}px)`),
                                        }}
                                        className="text-[10px] font-light tracking-widest text-tmain sm:text-xs md:text-sm"
                                    >
                                        Design Graphic | Photography | Website
                                        Development
                                    </animated.p>
                                </animated.div>
                            )
                        )}
                    </div>

                    {/* Scroll Down Indicator */}
                    {scrollIndicatorTransition((styles, item) =>
                        item && (
                            <animated.a
                                href="#about"
                                style={{
                                    ...styles,
                                    animation: 'gentleBounce 2s ease-in-out infinite',
                                    willChange: 'transform',
                                }}
                                className="group absolute bottom-8 z-10 flex cursor-pointer flex-col items-center gap-2 md:bottom-12"
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
                            </animated.a>
                        )
                    )}
                </animated.div>

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
