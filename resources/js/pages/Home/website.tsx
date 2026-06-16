import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion'; // Tambahkan import framer-motion
import { Website } from './index';

interface ProjectCardProps {
    project: Website;
    position: string;
    onClickCard: () => void;
}

// --- SUB-KOMPONEN: PROJECT CARD ---
const ProjectCard = ({ project, position, onClickCard }: ProjectCardProps) => {
    const [screenIndex, setScreenIndex] = useState(0);

    // Reset screenshot saat card pindah ke tengah
    useEffect(() => {
        if (position !== 'center') setScreenIndex(0);
    }, [position]);

    const handleNextScreenshot = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScreenIndex((prev) => (prev + 1) % project.images.length);
    };

    const handlePrevScreenshot = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScreenIndex(
            (prev) =>
                (prev - 1 + project.images.length) % project.images.length,
        );
    };

    const prevScreen =
        (screenIndex - 1 + project.images.length) % project.images.length;
    const nextScreen = (screenIndex + 1) % project.images.length;

    // Menentukan kelas CSS berdasarkan posisi
    // Ditambahkan max-md:opacity-0 max-md:pointer-events-none agar card samping tak terlihat di HP
    let positionClass = '';
    if (position === 'center') {
        positionClass = 'opacity-100 scale-100 z-30 translate-x-0 ';
    } else if (position === 'left') {
        positionClass =
            'max-md:opacity-0 max-md:pointer-events-none opacity-40 scale-[0.85] z-20 -translate-x-[65%] cursor-pointer hover:opacity-60 blur-[1px] hover:blur-none';
    } else if (position === 'right') {
        positionClass =
            'max-md:opacity-0 max-md:pointer-events-none opacity-40 scale-[0.85] z-20 translate-x-[65%] cursor-pointer hover:opacity-60 blur-[1px] hover:blur-none';
    } else {
        positionClass =
            'opacity-0 scale-75 z-10 translate-x-0 pointer-events-none';
    }

    return (
        <div
            onClick={position !== 'center' ? onClickCard : undefined}
            // Padding & Gap disesuaikan untuk HP (px-6 py-8) dan Desktop (md:px-15 md:py-10)
            className={`absolute flex w-full max-w-5xl flex-col items-center gap-6 rounded-3xl bg-sectiondark px-6 py-8 transition-all duration-700 ease-in-out md:flex-row md:items-start md:gap-10 md:gap-20 md:px-15 md:py-10 ${positionClass}`}
        >
            {/* KOLOM GAMBAR */}
            {/* Tinggi gambar diperkecil di HP (h-[220px]) agar teks di bawahnya muat */}
            <div className="group/screenshot relative flex h-[220px] w-full max-w-[450px] shrink-0 items-center justify-center overflow-hidden sm:h-[280px] md:h-[320px]">
                {position === 'center' && (
                    <>
                        <button
                            onClick={handlePrevScreenshot}
                            className="absolute top-1/2 left-2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/screenshot:opacity-70 hover:!opacity-100 md:left-6 md:h-10 md:w-10"
                        >
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={handleNextScreenshot}
                            className="absolute top-1/2 right-2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/screenshot:opacity-70 hover:!opacity-100 md:right-6 md:h-10 md:w-10"
                        >
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </>
                )}

                {/* Render Animasi Gambar Screenshot */}
                <div className="relative flex h-full w-full items-center justify-center">
                    {project.images.map((imgSrc: string, idx: number) => {
                        let imgPosition =
                            'opacity-0 scale-90 z-0 translate-x-0';
                        if (idx === screenIndex) {
                            imgPosition =
                                'opacity-100 scale-100 z-20 translate-x-0';
                        } else if (idx === prevScreen) {
                            imgPosition =
                                'opacity-50 scale-95 z-10 -translate-x-[85%]';
                        } else if (idx === nextScreen) {
                            imgPosition =
                                'opacity-50 scale-95 z-10 translate-x-[85%]';
                        }
                        return (
                            <div
                                key={idx}
                                className={`absolute aspect-[3/2] w-[85%] overflow-hidden rounded-2xl bg-white transition-all duration-700 ease-in-out md:rounded-[32px] ${imgPosition}`}
                                onClick={(e) => {
                                    if (position === 'center') {
                                        e.stopPropagation();
                                        setScreenIndex(idx);
                                    }
                                }}
                            >
                                <img
                                    src={imgSrc}
                                    alt={`${project.title} ${idx + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Efek Opacity Sisi Gambar */}
                <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-20 w-10 bg-gradient-to-r from-sectiondark to-transparent md:w-24" />
                <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-10 bg-gradient-to-l from-sectiondark to-transparent md:w-24" />
            </div>

            {/* KOLOM INFORMASI DESKRIPSI */}
            <div className="flex w-full flex-1 flex-col gap-5 md:gap-14 md:pt-4">
                <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-2">
                    <h3 className="text-lg font-bold tracking-wide text-white md:text-xl">
                        {project.title}
                    </h3>
                    <span className="text-xs font-light whitespace-nowrap text-gray-400 md:text-sm">
                        {project.origin}
                    </span>
                </div>

                <p className="max-w-[640px] text-xs leading-relaxed font-normal text-white/90 sm:text-sm">
                    {project.description}
                </p>

                <div className="border-l-2 border-bshine py-1 pl-3 md:pl-6">
                    <p className="text-xs font-medium text-white italic sm:text-sm md:text-base">
                        {project.tech}
                    </p>
                </div>
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

    // 1. STATE BARU UNTUK AUTO-SWIPE & TOUCH SWIPE
    const [isPaused, setIsPaused] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    const filteredProjects = websites.filter(
        (item) => item.category === activeTab,
    );

    useEffect(() => {
        setProjectIndex(0);
    }, [activeTab]);

    const handleNextProject = () => {
        setProjectIndex((prev) => (prev + 1) % filteredProjects.length);
    };
    const handlePrevProject = () => {
        setProjectIndex(
            (prev) =>
                (prev - 1 + filteredProjects.length) % filteredProjects.length,
        );
    };

    // 2. LOGIKA AUTO-SWIPE (5 DETIK)
    useEffect(() => {
        // Jangan jalankan interval jika card sedang ditahan/hover atau data kosong
        if (isPaused || filteredProjects.length === 0) return;

        const interval = setInterval(() => {
            // Animasi hanya aktif jika halaman sedang dilihat user (tab tidak disembunyikan)
            if (!document.hidden) {
                setProjectIndex((prev) => (prev + 1) % filteredProjects.length);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, filteredProjects.length]);

    // 3. LOGIKA DETEKSI SWIPE MOBILE
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX);
        setIsPaused(true); // Hentikan auto-swipe saat layar ditahan
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) {
            setIsPaused(false); // Lanjutkan auto-swipe jika hanya sekadar tap
            return;
        }

        const distance = touchStartX - touchEndX;

        // Jarak minimal swipe 50px agar tidak bentrok dengan tap tombol biasa
        if (distance > 50) {
            handleNextProject(); // Swipe Kiri -> Card Selanjutnya
        } else if (distance < -50) {
            handlePrevProject(); // Swipe Kanan -> Card Sebelumnya
        }

        // Reset nilai
        setTouchStartX(null);
        setTouchEndX(null);
        setIsPaused(false); // Lanjutkan auto-swipe setelah jari dilepas
    };

    const getCardPosition = (index: number) => {
        const total = filteredProjects.length;
        if (total === 1) return index === projectIndex ? 'center' : 'hidden';
        if (total === 2) {
            if (index === projectIndex) return 'center';
            return 'right';
        }
        if (index === projectIndex) return 'center';
        if (index === (projectIndex - 1 + total) % total) return 'left';
        if (index === (projectIndex + 1) % total) return 'right';
        return 'hidden';
    };

    return (
        <section
            id="website"
            className="relative min-h-[650px] w-full overflow-hidden py-10 font-poppins md:min-h-[800px] md:py-15"
        >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 md:gap-16 md:px-12">
                {/* --- HEADER DENGAN ANIMASI --- */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '200px 0px', amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    className="flex flex-row items-center justify-between gap-4 px-2 md:gap-6 md:px-4"
                >
                    <div className="relative flex items-center gap-3 md:gap-4">
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
                </motion.div>

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
                        className="relative flex h-[500px] w-full items-center justify-center md:h-[350px]"
                        // 4. PASANG EVENT HANDLER DI SINI
                        onMouseEnter={() => setIsPaused(true)} // Desktop Hover (Tahan)
                        onMouseLeave={() => setIsPaused(false)} // Desktop Lepas
                        onTouchStart={handleTouchStart} // HP Tahan Layar
                        onTouchMove={handleTouchMove} // HP Geser Jari
                        onTouchEnd={handleTouchEnd} // HP Angkat Jari
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
        </section>
    );
}
