import { animated, useSpring, useTrail, useTransition, to } from '@react-spring/web';
import { useState, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import type { Certificate } from './index';

const getMonthYear = (dateString: string | null) => {
    if (!dateString) {
return '';
}

    const date = new Date(dateString);

    return date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
};

export default function CertificateSection({
    certificates,
}: {
    certificates: Certificate[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const [activeImg, setActiveImg] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft ?? 0));
        setScrollLeft(scrollRef.current?.scrollLeft ?? 0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) {
return;
}

        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
        const walk = (x - startX) * 1.5;

        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const openModal = (cert: Certificate) => {
        setSelectedCert(cert);
        setActiveImg(cert.url_1);
    };

    // Header animation
    const headerRef = useRef<HTMLDivElement>(null);
    const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
    const headerSpring = useSpring({
        opacity: isHeaderInView ? 1 : 0,
        transform: isHeaderInView ? 'translateY(0px)' : 'translateY(30px)',
        config: { tension: 280, friction: 60 },
        delay: 200,
    });

    // Button hover & active spring
    const [isBtnHovered, setIsBtnHovered] = useState(false);
    const [isBtnActive, setIsBtnActive] = useState(false);
    const btnSpring = useSpring({
        scale: isBtnActive ? 0.95 : isBtnHovered ? 1.02 : 1,
        config: { tension: 300, friction: 15 },
    });

    // Chevron rotation spring
    const chevronSpring = useSpring({
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        config: { duration: 100 },
    });

    // Badge count transition
    const badgeTransition = useTransition(isOpen, {
        from: { opacity: 0, transform: 'translateY(-10px)' },
        enter: { opacity: 1, transform: 'translateY(0px)' },
        leave: { opacity: 0, transform: 'translateY(-10px)' },
        config: { duration: 200 },
    });

    // List height transition
    const listTransition = useTransition(isOpen, {
        from: { height: 0, opacity: 0 },
        enter: { height: 'auto', opacity: 1 },
        leave: { height: 0, opacity: 0 },
        config: { duration: 400, tension: 280, friction: 30 },
    });

    // Staggered certificates trail animation
    const certsTrail = useTrail(isOpen ? certificates.length : 0, {
        opacity: 1,
        transform: 'translateX(0px)',
        from: { opacity: 0, transform: 'translateX(50px)' },
        config: { tension: 280, friction: 30 },
    });

    // Modal transition
    const modalTransition = useTransition(selectedCert, {
        from: { opacity: 0, scale: 0.9, y: 20 },
        enter: { opacity: 1, scale: 1, y: 0 },
        leave: { opacity: 0, scale: 0.9, y: 20 },
        config: { tension: 220, friction: 26 },
    });

    return (
        <section
            id="certificate"
            className="relative w-full overflow-hidden py-16 text-white"
        >
            {/* Glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/4 hidden h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-bshine/5 blur-[120px] md:block"></div>

            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 md:px-12">
                {/* Header */}
                <animated.div
                    style={headerSpring}
                    className="flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left"
                >
                    <div ref={headerRef} className="relative flex items-center">
                        <h2 className="text-3xl font-bold tracking-wide text-tmain">
                            My <span className="text-bshine">Certificates</span>
                        </h2>
                        <img
                            src="/assets/icons/slay_light.svg"
                            alt="Deco light"
                            className="absolute top-0 -right-12 h-8 w-8 rotate-12 transform dark:hidden"
                        />
                        <img
                            src="/assets/icons/slay_dark.svg"
                            alt="Deco dark"
                            className="absolute top-0 -right-12 hidden h-8 w-8 rotate-12 transform dark:block"
                        />
                    </div>

                    <animated.button
                        onClick={() => setIsOpen(!isOpen)}
                        onMouseEnter={() => setIsBtnHovered(true)}
                        onMouseLeave={() => {
                            setIsBtnHovered(false);
                            setIsBtnActive(false);
                        }}
                        onMouseDown={() => setIsBtnActive(true)}
                        onMouseUp={() => setIsBtnActive(false)}
                        style={{ transform: btnSpring.scale.to(s => `scale(${s})`) }}
                        className="group flex items-center gap-2 rounded-full border border-bshine/50 bg-bshine/10 px-6 py-2.5 text-sm font-medium text-bshine md:backdrop-blur-sm transition-all duration-300 hover:border-bshine hover:bg-bshine/20 hover:shadow-[0_0_20px_rgba(192,104,0,0.3)]"
                    >
                        <i
                            className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-certificate'} transition-transform duration-300`}
                        />
                        {isOpen ? 'Tutup Sertifikasi' : 'Lihat Sertifikasi'}
                        <animated.i
                            style={chevronSpring}
                            className="fa-solid fa-chevron-down text-xs text-bshine"
                        />
                    </animated.button>
                </animated.div>

                {/* Badge count */}
                {badgeTransition((styles, item) =>
                    item && (
                        <animated.p
                            style={styles}
                            className="text-center text-sm text-gray-400 md:text-left"
                        >
                            Geser ke kanan untuk lihat selengkapnya
                        </animated.p>
                    )
                )}
            </div>

            {/* Horizontal scroll */}
            {listTransition((styles, item) =>
                item && (
                    <animated.div
                        style={styles}
                        className="overflow-hidden"
                    >
                        <div
                            ref={scrollRef}
                            className={`mt-6 flex gap-6 overflow-x-auto px-6 pb-8 md:px-12 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch',
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {certsTrail.map((trailStyle, index) => {
                                const cert = certificates[index];

                                if (!cert) {
return null;
}

                                return (
                                    <animated.div
                                        key={cert.id}
                                        style={trailStyle}
                                        className="group relative w-[320px] shrink-0 sm:w-[420px] md:w-[480px]"
                                    >
                                        <div
                                            className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] md:backdrop-blur-sm transition-all duration-300 hover:border-bshine/30 hover:shadow-[0_4px_30px_rgba(192,104,0,0.15)] cursor-pointer"
                                            onClick={() => {
                                                if (!isDragging) {
                                                    openModal(cert);
                                                }
                                            }}
                                        >
                                            {/* Category Tag */}
                                            <div className="absolute top-4 left-4 z-10 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-semibold text-white/95 md:backdrop-blur-md transition-colors duration-300 group-hover:bg-bshine/90">
                                                {cert.category}
                                            </div>

                                            {/* Image */}
                                            <img
                                                src={`/storage/${cert.url_1}`}
                                                alt={cert.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                draggable={false}
                                            />

                                            {/* Hover Overlay with Gradient info */}
                                            <div className="absolute inset-x-0 bottom-0 flex translate-y-3 flex-col justify-end bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 pt-20 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                <h4 className="text-base font-bold text-white md:text-lg">
                                                    {cert.title}
                                                </h4>
                                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-300">
                                                    <i className="fa-regular fa-calendar-days text-bshine" />
                                                    {getMonthYear(cert.start_date)}
                                                    {cert.end_date
                                                        ? ` - ${getMonthYear(cert.end_date)}`
                                                        : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </animated.div>
                                );
                            })}
                            <div className="w-6 shrink-0 md:w-12" />
                        </div>
                    </animated.div>
                )
            )}

            {/* Complete Card Modal */}
            {modalTransition((styles, cert) =>
                cert && (
                    <animated.div
                        style={{ opacity: styles.opacity }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-md"
                        onClick={() => setSelectedCert(null)}
                    >
                        <animated.div
                            style={{
                                opacity: styles.opacity,
                                transform: to([styles.scale, styles.y], (s, y) => `scale(${s}) translateY(${y}px)`),
                            }}
                            className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-main shadow-2xl backdrop-blur-md md:flex-row"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setSelectedCert(null)}
                                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-hbshine/50 text-white backdrop-blur-sm transition-all hover:bg-hbshine/65"
                            >
                                <i className="fa-solid fa-xmark text-lg" />
                            </button>

                            {/* Image side (more space) */}
                            <div className="relative flex min-h-[280px] w-full items-center justify-center p-3 md:min-h-[480px] md:w-3/5 lg:w-2/3">
                                {activeImg && (
                                    <img
                                        src={`/storage/${activeImg}`}
                                        alt={cert.title}
                                        className="max-h-[50vh] max-w-full rounded-lg object-contain shadow-lg md:max-h-[85vh]"
                                        draggable={false}
                                    />
                                )}

                                {/* Arrow Navigation if url_2 exists */}
                                {cert.url_2 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setActiveImg(
                                                    activeImg ===
                                                        cert.url_1
                                                        ? cert.url_2
                                                        : cert.url_1,
                                                )
                                            }
                                            className="absolute top-1/2 left-6 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-bshine hover:bg-hbshine/50"
                                        >
                                            <i className="fa-solid fa-chevron-left text-sm" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveImg(
                                                    activeImg ===
                                                        cert.url_1
                                                        ? cert.url_2
                                                        : cert.url_1,
                                                )
                                            }
                                            className="absolute top-1/2 right-6 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-bshine hover:bg-hbshine/50"
                                        >
                                            <i className="fa-solid fa-chevron-right text-sm" />
                                        </button>
                                    </>
                                )}

                                {/* Thumbnail Switcher if url_2 exists */}
                                {cert.url_2 && (
                                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 rounded-lg border border-white/5 bg-black/60 p-2 backdrop-blur-md">
                                        <button
                                            onClick={() =>
                                                setActiveImg(cert.url_1)
                                            }
                                            className={`h-10 w-14 overflow-hidden rounded border transition-all ${
                                                activeImg === cert.url_1
                                                    ? 'scale-105 border-bshine'
                                                    : 'border-white/20 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${cert.url_1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveImg(cert.url_2)
                                            }
                                            className={`h-10 w-14 overflow-hidden rounded border transition-all ${
                                                activeImg === cert.url_2
                                                    ? 'scale-105 border-bshine'
                                                    : 'border-white/20 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${cert.url_2}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Info side (less space) */}
                            <div className="flex w-full flex-col justify-between border-t border-white/10 p-6 sm:p-8 md:w-2/5 md:border-t-0 md:border-l lg:w-1/3">
                                <div className="flex flex-col">
                                    <span className="mb-3 w-fit rounded-full border border-bshine/10 bg-bshine/20 px-3 py-1 text-xs font-semibold text-bshine backdrop-blur-sm">
                                        {cert.category}
                                    </span>

                                    <h3 className="text-xl leading-snug font-bold text-tmain md:text-2xl">
                                        {cert.title}
                                    </h3>

                                    <p className="mt-3 flex items-center gap-2 text-sm font-medium text-hbshine">
                                        <i className="fa-regular fa-calendar-days text-bshine" />
                                        {getMonthYear(cert.start_date)}
                                        {cert.end_date
                                            ? ` - ${getMonthYear(cert.end_date)}`
                                            : ''}
                                    </p>

                                    <div className="my-5 h-px bg-hbshine/20" />

                                    <h4 className="text-xs font-bold tracking-wider text-tmain uppercase">
                                        Description
                                    </h4>

                                    <div
                                        className="mt-2.5 max-h-[160px] overflow-y-auto pr-2 text-sm leading-relaxed text-tmain md:max-h-[260px]"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        {cert.description ||
                                            'Tidak ada deskripsi.'}
                                    </div>
                                </div>
                            </div>
                        </animated.div>
                    </animated.div>
                )
            )}
        </section>
    );
}
