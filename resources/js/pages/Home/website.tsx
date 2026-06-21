import { Link } from '@inertiajs/react';
import { animated, useSpring, useTransition, to } from '@react-spring/web';
import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import type { Website } from './index';

interface ProjectCardProps {
    project: Website;
    position: string;
    onClickCard: () => void;
    onOpenDetails: (project: Website) => void;
}

// --- SUB-KOMPONEN: PROJECT CARD ---
const ProjectCard = ({
    project,
    position,
    onClickCard,
    onOpenDetails,
}: ProjectCardProps) => {
    // Menentukan kelas CSS berdasarkan posisi
    let positionClass = '';

    if (position === 'center') {
        positionClass = 'opacity-100 scale-100 z-30 translate-x-0 ';
    } else if (position === 'left') {
        positionClass =
            'max-lg:opacity-0 max-lg:pointer-events-none opacity-40 scale-[0.85] z-20 -translate-x-[65%] cursor-pointer hover:opacity-60 blur-[1px] hover:blur-none';
    } else if (position === 'right') {
        positionClass =
            'max-lg:opacity-0 max-lg:pointer-events-none opacity-40 scale-[0.85] z-20 translate-x-[65%] cursor-pointer hover:opacity-60 blur-[1px] hover:blur-none';
    } else {
        positionClass =
            'opacity-0 scale-75 z-10 translate-x-0 pointer-events-none';
    }

    return (
        <div
            onClick={
                position !== 'center'
                    ? onClickCard
                    : () => onOpenDetails(project)
            }
            className={`absolute flex w-full max-w-7xl flex-col items-center gap-6 rounded-xl bg-sectiondark px-6 py-10 transition-all duration-700 ease-in-out md:px-10 md:py-12 lg:flex-row lg:items-start lg:gap-10 lg:px-15 lg:py-18 ${positionClass} ${position === 'center' ? 'cursor-pointer hover:border-bshine/30 hover:shadow-[0_4px_30px_rgba(192,104,0,0.15)]' : ''}`}
        >
            {/* KOLOM GAMBAR */}
            <div className="group/screenshot relative flex h-[220px] w-full max-w-[550px] shrink-0 items-center justify-center overflow-hidden sm:h-[280px] md:h-[380px] md:max-w-[700px] lg:h-[320px] lg:max-w-[550px]">
                {/* Render Hanya Gambar Pertama */}
                <div className="relative flex h-full w-full items-center justify-center">
                    {project.images && project.images[0] && (
                        <div className="absolute aspect-[3/2] w-[85%] overflow-hidden rounded-xl bg-white shadow-md">
                            <img
                                src={`/storage/${project.images[0]}`}
                                alt={`${project.title} cover`}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Efek Opacity Sisi Gambar */}
                <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-20 w-10 bg-gradient-to-r from-sectiondark to-transparent lg:w-24" />
                <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-10 bg-gradient-to-l from-sectiondark to-transparent lg:w-24" />
            </div>

            {/* KOLOM INFORMASI DESKRIPSI */}
            <div className="flex w-full flex-1 flex-col gap-5 lg:gap-14 lg:pt-4">
                <div className="flex flex-col items-start gap-1 lg:flex-row lg:items-center lg:justify-between lg:gap-2">
                    <h3 className="text-lg font-bold tracking-wide text-white lg:text-xl">
                        {project.title}
                    </h3>
                    <span className="text-xs font-light whitespace-nowrap text-gray-400 lg:text-sm">
                        {project.origin}
                    </span>
                </div>

                <p className="text-xs leading-relaxed font-normal text-white/90 sm:text-sm lg:max-w-[640px]">
                    {project.description}
                </p>

                <div className="border-l-2 border-bshine py-1 pl-3 lg:pl-6">
                    <p className="text-xs font-medium text-white italic sm:text-sm lg:text-base">
                        {project.tech}
                    </p>
                </div>
            </div>

            <div className="font-regular absolute right-2 bottom-2 flex items-center gap-1.5 rounded-full px-3 py-1 text-[8px] text-white/75 md:right-4 md:bottom-4 md:text-xs">
                Klik untuk info lebih lanjut
                <i className="fa-solid fa-angles-right ml-2"></i>
            </div>
        </div>
    );
};

export default function WebsiteSection({
    websites = [],
}: {
    websites: Website[];
}) {
    const [activeTab, setActiveTab] = useState('project');
    const [projectIndex, setProjectIndex] = useState(0);
    const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(
        null,
    );
    const [activeImg, setActiveImg] = useState<string | null>(null);

    const getImages = (item: Website | null) => {
        if (!item) {
return [];
}

        return item.images || [];
    };

    const activeImages = getImages(selectedWebsite);
    const activeIndex = activeImg ? activeImages.indexOf(activeImg) : 0;

    const handlePrevImg = () => {
        if (activeImages.length <= 1) {
return;
}

        const newIndex =
            (activeIndex - 1 + activeImages.length) % activeImages.length;
        setActiveImg(activeImages[newIndex]);
    };

    const handleNextImg = () => {
        if (activeImages.length <= 1) {
return;
}

        const newIndex = (activeIndex + 1) % activeImages.length;
        setActiveImg(activeImages[newIndex]);
    };

    const openModal = (project: Website) => {
        setSelectedWebsite(project);
        setActiveImg(project.images[0] || null);
    };

    const [isPaused, setIsPaused] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    const filteredProjects = websites.filter(
        (item) => item.category === activeTab,
    );

    const [prevActiveTab, setPrevActiveTab] = useState(activeTab);

    if (activeTab !== prevActiveTab) {
        setPrevActiveTab(activeTab);
        setProjectIndex(0);
    }

    const handleNextProject = () => {
        setProjectIndex((prev) => (prev + 1) % filteredProjects.length);
    };
    const handlePrevProject = () => {
        setProjectIndex(
            (prev) =>
                (prev - 1 + filteredProjects.length) % filteredProjects.length,
        );
    };

    useEffect(() => {
        if (isPaused || filteredProjects.length === 0) {
return;
}

        const interval = setInterval(() => {
            if (!document.hidden) {
                setProjectIndex((prev) => (prev + 1) % filteredProjects.length);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, filteredProjects.length]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX);
        setIsPaused(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) {
            setIsPaused(false);

            return;
        }

        const distance = touchStartX - touchEndX;

        if (distance > 50) {
            handleNextProject();
        } else if (distance < -50) {
            handlePrevProject();
        }

        setTouchStartX(null);
        setTouchEndX(null);
        setIsPaused(false);
    };

    const getCardPosition = (index: number) => {
        const total = filteredProjects.length;

        if (total === 1) {
return index === projectIndex ? 'center' : 'hidden';
}

        if (total === 2) {
            if (index === projectIndex) {
return 'center';
}

            return 'right';
        }

        if (index === projectIndex) {
return 'center';
}

        if (index === (projectIndex - 1 + total) % total) {
return 'left';
}

        if (index === (projectIndex + 1) % total) {
return 'right';
}

        return 'hidden';
    };

    // Header animation
    const headerRef = useRef<HTMLDivElement>(null);
    const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
    const headerSpring = useSpring({
        opacity: isHeaderInView ? 1 : 0,
        transform: isHeaderInView ? 'translateY(0px)' : 'translateY(-30px)',
        config: { tension: 280, friction: 60 },
        delay: 200,
    });

    // Modal transition
    const modalTransition = useTransition(selectedWebsite, {
        from: { opacity: 0, scale: 0.9, y: 20 },
        enter: { opacity: 1, scale: 1, y: 0 },
        leave: { opacity: 0, scale: 0.9, y: 20 },
        config: { tension: 220, friction: 26 },
    });

    return (
        <section
            id="website"
            className="relative min-h-[650px] w-full overflow-hidden py-10 font-poppins md:min-h-[800px] md:py-15"
        >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 md:gap-16 md:px-12">
                {/* --- HEADER DENGAN ANIMASI --- */}
                <animated.div
                    style={headerSpring}
                    className="flex flex-row items-center justify-between gap-4 px-2 md:gap-6 md:px-4"
                >
                    <div ref={headerRef} className="relative flex items-center gap-3 md:gap-4">
                        <h2 className="text-2xl font-bold text-tmain sm:text-3xl">
                            Website
                        </h2>
                        <img
                            src="/assets/icons/slay_light.svg"
                            alt="Decoration light"
                            className="absolute top-0 -right-8 h-8 w-8 rotate-12 transform md:-right-12 md:h-10 md:w-10 dark:hidden"
                        />
                        <img
                            src="/assets/icons/slay_dark.svg"
                            alt="Decoration dark"
                            className="absolute top-0 -right-8 hidden h-8 w-8 rotate-12 transform md:-right-12 md:h-10 md:w-10 dark:block"
                        />
                    </div>
                    <p className="hidden text-sm font-light text-tmain sm:block md:text-base">
                        Preview Project
                    </p>
                </animated.div>

                {/* --- TABS --- */}
                <div className="flex flex-col items-center gap-3 md:gap-10">
                    <div className="mb-2 flex w-full flex-wrap items-center justify-center gap-3 md:gap-6">
                        {['project', 'develop'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center justify-center rounded-full px-5 py-1.5 text-sm transition-all duration-300 md:px-7 md:py-2 md:text-base ${
                                    activeTab === tab
                                        ? 'border bg-gradient-to-r from-bsecond to-stone-500 font-medium text-white dark:border-white dark:bg-white/10 dark:bg-none dark:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                        : 'border border-bsecond font-normal text-tmain hover:bg-bsecond/5 dark:hover:bg-white/10'
                                }`}
                            >
                                <span className="capitalize">{tab}</span>
                            </button>
                        ))}
                        <Link
                            href="/portfolio/website"
                            className="flex hidden items-center justify-center rounded-3xl bg-bshine px-4 py-1.5 text-xs font-medium text-white transition-colors hover:brightness-110 sm:text-sm md:block md:px-6 md:py-2 md:text-base dark:bg-white dark:text-secondary dark:hover:bg-gray-200"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1"></i>
                        </Link>
                    </div>

                    {/* --- AREA CAROUSEL UTAMA --- */}
                    <div
                        className="relative flex h-[450px] w-full items-center justify-center md:h-[600px] lg:h-[400px]"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {filteredProjects.map((project, idx) => {
                            const position = getCardPosition(idx);

                            return (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    position={position}
                                    onClickCard={
                                        position === 'left'
                                            ? handlePrevProject
                                            : handleNextProject
                                    }
                                    onOpenDetails={openModal}
                                />
                            );
                        })}
                    </div>

                    {/* --- TOMBOL NAVIGASI SIMPEL --- */}
                    <div className="mt-2 flex items-center gap-4 md:gap-8">
                        <button
                            onClick={handlePrevProject}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-tmain/50 transition-colors hover:bg-white/10 hover:text-tmain"
                        >
                            <svg
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <div className="flex items-center gap-2 md:gap-3">
                            {filteredProjects.map((_, idx) => (
                                <div
                                    key={`dot-${idx}`}
                                    className={`h-2 cursor-pointer rounded-full transition-all duration-500 md:h-2.5 ${
                                        idx === projectIndex
                                            ? 'w-8 bg-bshine md:w-10'
                                            : 'w-2 bg-gray-600 hover:bg-gray-400 md:w-2.5'
                                    }`}
                                    onClick={() => setProjectIndex(idx)}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNextProject}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-tmain/50 transition-colors hover:bg-white/10 hover:text-tmain"
                        >
                            <svg
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="relative z-20 flex w-full flex-wrap items-center justify-center">
                        <Link
                            href="/portfolio/website"
                            className="flex w-full items-center justify-center rounded-lg bg-bshine py-1.5 text-xs font-medium text-white transition-colors hover:brightness-110 sm:text-sm md:hidden md:px-6 md:py-2 md:text-base dark:bg-white dark:text-secondary dark:hover:bg-gray-200"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- MODAL UNTUK PREVIEW GAMBAR --- */}
            {modalTransition((styles, project) =>
                project && (
                    <animated.div
                        style={{ opacity: styles.opacity }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-md"
                        onClick={() => setSelectedWebsite(null)}
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
                                onClick={() => setSelectedWebsite(null)}
                                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-hbshine/50 text-white backdrop-blur-sm transition-all hover:bg-hbshine/65"
                            >
                                <i className="fa-solid fa-xmark text-lg" />
                            </button>

                            {/* Image side (more space) */}
                            <div className="relative flex min-h-[280px] w-full items-center justify-center p-3 md:min-h-[480px] md:w-3/5 lg:w-2/3">
                                {activeImg && (
                                    <img
                                        src={`/storage/${activeImg}`}
                                        alt={project.title}
                                        className="max-h-[50vh] max-w-full rounded-lg object-contain shadow-lg md:max-h-[85vh]"
                                        draggable={false}
                                    />
                                )}

                                {/* Arrow Navigation if multiple images exist */}
                                {activeImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrevImg}
                                            className="absolute top-1/2 left-6 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-bshine hover:bg-hbshine/50"
                                        >
                                            <i className="fa-solid fa-chevron-left text-sm" />
                                        </button>
                                        <button
                                            onClick={handleNextImg}
                                            className="absolute top-1/2 right-6 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-bshine hover:bg-hbshine/50"
                                        >
                                            <i className="fa-solid fa-chevron-right text-sm" />
                                        </button>
                                    </>
                                )}

                                {/* Thumbnail Switcher if multiple images exist */}
                                {activeImages.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 rounded-lg border border-white/5 bg-black/60 p-2 backdrop-blur-md">
                                        {activeImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() =>
                                                    setActiveImg(img)
                                                }
                                                className={`h-10 w-14 overflow-hidden rounded border transition-all ${
                                                    activeImg === img
                                                        ? 'scale-105 border-bshine'
                                                        : 'border-white/20 opacity-60 hover:opacity-100'
                                                }`}
                                            >
                                                <img
                                                    src={`/storage/${img}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Info side (less space) */}
                            <div className="flex w-full flex-col justify-between border-t border-white/10 p-6 sm:p-8 md:w-2/5 md:border-t-0 md:border-l lg:w-1/3">
                                <div className="animate-fade-in flex flex-col">
                                    <span className="mb-3 w-fit rounded-full border border-bshine/10 bg-bshine/20 px-3 py-1 text-xs font-semibold text-bshine capitalize backdrop-blur-sm">
                                        {project.category}
                                    </span>

                                    <h3 className="text-xl leading-snug font-bold text-tmain md:text-2xl">
                                        {project.title}
                                    </h3>

                                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-hbshine">
                                        <i className="fa-regular fa-building text-bshine" />
                                        {project.origin}
                                    </p>

                                    <div className="my-4 border-l-2 border-bshine py-1 pl-4">
                                        <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                                            Tech Stack
                                        </p>
                                        <p className="mt-0.5 text-sm font-medium text-tmain italic">
                                            {project.tech}
                                        </p>
                                    </div>

                                    <div className="my-3 h-px bg-hbshine/20" />

                                    <h4 className="text-xs font-bold tracking-wider text-tmain uppercase">
                                        Description
                                    </h4>

                                    <div
                                        className="mt-2.5 max-h-[160px] overflow-y-auto pr-2 text-sm leading-relaxed text-tmain md:max-h-[220px]"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        {project.description ||
                                            'Tidak ada deskripsi.'}
                                    </div>

                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-bshine/50 bg-bshine/10 px-6 py-2 text-sm font-semibold text-bshine backdrop-blur-sm transition-all duration-300 hover:border-bshine hover:bg-bshine/20 hover:shadow-[0_0_20px_rgba(192,104,0,0.2)]"
                                        >
                                            <i className="fa-solid fa-arrow-up-right-from-square" />
                                            Visit Live Site
                                        </a>
                                    )}
                                </div>
                            </div>
                        </animated.div>
                    </animated.div>
                )
            )}
        </section>
    );
}
