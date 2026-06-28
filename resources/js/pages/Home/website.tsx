import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Website } from './index';
import { Underline } from '@/components/underline';

const transitionVariants = {
    enter: (direction: 'next' | 'prev') => ({
        x: direction === 'next' ? 150 : -150,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.1,
            ease: 'easeOut' as const,
        },
    },
    exit: (direction: 'next' | 'prev') => ({
        x: direction === 'next' ? -150 : 150,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: 'easeIn' as const,
        },
    }),
};

export default function WebsiteSection({
    websites = [],
}: {
    websites: Website[];
}) {
    const [activeTab, setActiveTab] = useState('project');
    const [projectIndex, setProjectIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(
        null,
    );
    const [activeImg, setActiveImg] = useState<string | null>(null);

    const getImages = (item: Website | null) => {
        if (!item) return [];
        return item.images || [];
    };

    const activeImages = getImages(selectedWebsite);
    const activeIndex = activeImg ? activeImages.indexOf(activeImg) : 0;

    const handlePrevImg = useCallback(() => {
        if (activeImages.length <= 1) return;
        const newIndex =
            (activeIndex - 1 + activeImages.length) % activeImages.length;
        setActiveImg(activeImages[newIndex]);
    }, [activeImages, activeIndex]);

    const handleNextImg = useCallback(() => {
        if (activeImages.length <= 1) return;
        const newIndex = (activeIndex + 1) % activeImages.length;
        setActiveImg(activeImages[newIndex]);
    }, [activeImages, activeIndex]);

    const openModal = (project: Website) => {
        setSelectedWebsite(project);
        setActiveImg(project.images[0] || null);
    };

    const filteredProjects = useMemo(
        () => websites.filter((item) => item.category === activeTab),
        [websites, activeTab],
    );

    useEffect(() => {
        setProjectIndex(0);
        setDirection('next');
    }, [activeTab]);

    const handleNextProject = useCallback(() => {
        setDirection('next');
        setProjectIndex((prev) => (prev + 1) % filteredProjects.length);
    }, [filteredProjects.length]);

    const handlePrevProject = useCallback(() => {
        setDirection('prev');
        setProjectIndex(
            (prev) =>
                (prev - 1 + filteredProjects.length) % filteredProjects.length,
        );
    }, [filteredProjects.length]);

    const project = filteredProjects[projectIndex];

    return (
        <section
            id="website"
            className="relative min-h-[600px] w-full overflow-hidden py-16 text-white"
        >
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bshine/5 blur-[120px] md:block"></div>

            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 md:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    className="flex flex-row items-center justify-between gap-4"
                >
                    <div className="relative flex items-center gap-3">
                        <h2 className="relative font-montserrat-alt text-3xl font-bold text-tmain">
                            Website
                        </h2>
                        <Underline className="absolute -right-2 -bottom-1 text-bshine" />
                    </div>
                    <p className="hidden text-sm font-light text-tmain sm:block md:text-base">
                        Preview Project
                    </p>
                </motion.div>

                {/* Tabs & Content Container */}
                <div className="flex flex-col items-center gap-8">
                    <div className="flex w-full flex-wrap items-center justify-center gap-4">
                        {['project', 'develop'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center justify-center rounded-full px-6 py-2 text-sm transition-all duration-300 md:text-base ${
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
                            className="hidden items-center justify-center rounded-full bg-bshine px-6 py-2 text-sm font-medium text-white transition-colors hover:brightness-110 md:flex dark:bg-white dark:text-secondary dark:hover:bg-gray-200"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1.5"></i>
                        </Link>
                    </div>

                    {/* Main Content: 2-Column Grid */}
                    <div className="relative flex min-h-[420px] w-full items-center">
                        <AnimatePresence mode="wait" custom={direction}>
                            {project ? (
                                <motion.div
                                    key={project.id}
                                    custom={direction}
                                    variants={transitionVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="group grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16"
                                >
                                    {/* Left Column: Stacked Images (3:2 Ratio) */}
                                    <div className="flex items-center justify-center">
                                        <div className="relative aspect-[3/2] w-full max-w-[480px]">
                                            {/* Behind Image (Image 2) */}
                                            {project.images &&
                                            project.images[1] ? (
                                                <div className="absolute inset-0 translate-x-6 translate-y-6 scale-95 rotate-3 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] opacity-40 shadow-2xl transition-all duration-500 group-hover:translate-x-8 group-hover:translate-y-4 group-hover:rotate-6">
                                                    <img
                                                        src={`/storage/${project.images[1]}`}
                                                        alt="Screenshot 2"
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                        draggable={false}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="absolute inset-0 translate-x-6 translate-y-6 scale-95 rotate-3 rounded-2xl border border-white/5 bg-bshine/5 opacity-20 shadow-2xl transition-all duration-500 group-hover:translate-x-8 group-hover:translate-y-4 group-hover:rotate-6" />
                                            )}

                                            {/* Front Image (Image 1) */}
                                            {project.images &&
                                                project.images[0] && (
                                                    <div className="relative z-10 aspect-[3/2] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                                        <img
                                                            src={`/storage/${project.images[0]}`}
                                                            alt="Screenshot 1"
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                            draggable={false}
                                                        />
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* Right Column: Explanations */}
                                    <div className="flex flex-col gap-6 text-left">
                                        <div className="flex flex-col gap-2">
                                            <span className="w-fit rounded-full border border-bshine/10 bg-bshine/20 px-3 py-1 text-xs font-semibold text-bshine capitalize backdrop-blur-sm">
                                                {project.category}
                                            </span>
                                            <h3 className="font-montserrat-alt text-2xl leading-tight font-bold text-tmain sm:text-3xl">
                                                {project.title}
                                            </h3>
                                            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-hbshine uppercase">
                                                <i className="fa-regular fa-building text-bshine" />
                                                {project.origin}
                                            </p>
                                        </div>

                                        <p className="max-w-[540px] text-sm leading-relaxed text-gray-300">
                                            {project.description}
                                        </p>

                                        <div className="border-l-2 border-bshine pl-4">
                                            <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                                Tech Stack
                                            </p>
                                            <p className="mt-0.5 text-sm font-medium text-tmain italic">
                                                {project.tech}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-2 flex flex-wrap gap-4">
                                            <button
                                                onClick={() =>
                                                    openModal(project)
                                                }
                                                className="flex items-center justify-center gap-2 rounded-full border border-bshine/50 bg-bshine/10 px-6 py-2.5 text-sm font-semibold text-bshine backdrop-blur-sm transition-all duration-300 hover:border-bshine hover:bg-bshine/20 hover:shadow-[0_0_20px_rgba(192,104,0,0.3)]"
                                            >
                                                <i className="fa-solid fa-circle-info" />
                                                Detail Project
                                            </button>
                                            {filteredProjects.length > 1 && (
                                                <button
                                                    onClick={handleNextProject}
                                                    className="flex items-center justify-center gap-2 rounded-full border border-tmain/10 bg-tmain/5 px-6 py-2.5 text-sm font-semibold text-tmain transition-all duration-300 hover:border-tmain/20 hover:bg-tmain/10"
                                                >
                                                    Next Project
                                                    <i className="fa-solid fa-arrow-right-long" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <p className="w-full py-12 text-center text-gray-500 italic">
                                    Belum ada project.
                                </p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Pagination Indicators (Arrows + Dots) */}
                    {filteredProjects.length > 1 && (
                        <div className="mt-8 flex items-center gap-4 md:gap-8">
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
                                        onClick={() => {
                                            setDirection(
                                                idx > projectIndex
                                                    ? 'next'
                                                    : 'prev',
                                            );
                                            setProjectIndex(idx);
                                        }}
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
                    )}

                    <div className="flex w-full items-center justify-center md:hidden">
                        <Link
                            href="/portfolio/website"
                            className="flex w-full items-center justify-center rounded-lg bg-bshine py-2 text-sm font-medium text-white transition-colors hover:brightness-110 dark:bg-white dark:text-secondary"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1.5"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal Detail Project */}
            <AnimatePresence>
                {selectedWebsite && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedWebsite(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ ease: 'easeOut', duration: 0.1 }}
                            className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-main shadow-2xl backdrop-blur-md md:flex-row"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedWebsite(null)}
                                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-hbshine/50 text-white backdrop-blur-sm transition-all hover:bg-hbshine/65"
                            >
                                <i className="fa-solid fa-xmark text-lg" />
                            </button>

                            {/* Modal Images */}
                            <div className="relative flex min-h-[280px] w-full items-center justify-center p-3 md:min-h-[480px] md:w-3/5 lg:w-2/3">
                                {activeImg && (
                                    <img
                                        src={`/storage/${activeImg}`}
                                        alt={selectedWebsite.title}
                                        className="max-h-[50vh] max-w-full rounded-lg object-contain shadow-lg md:max-h-[85vh]"
                                        draggable={false}
                                    />
                                )}

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

                            {/* Modal Info */}
                            <div className="flex w-full flex-col justify-between border-t border-white/10 p-6 sm:p-8 md:w-2/5 md:border-t-0 md:border-l lg:w-1/3">
                                <div className="flex flex-col">
                                    <span className="mb-3 w-fit rounded-full border border-bshine/10 bg-bshine/20 px-3 py-1 text-xs font-semibold text-bshine capitalize backdrop-blur-sm">
                                        {selectedWebsite.category}
                                    </span>

                                    <h3 className="text-xl leading-snug font-bold text-tmain md:text-2xl">
                                        {selectedWebsite.title}
                                    </h3>

                                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-hbshine">
                                        <i className="fa-regular fa-building text-bshine" />
                                        {selectedWebsite.origin}
                                    </p>

                                    <div className="my-4 border-l-2 border-bshine py-1 pl-4">
                                        <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                                            Tech Stack
                                        </p>
                                        <p className="mt-0.5 text-sm font-medium text-tmain italic">
                                            {selectedWebsite.tech}
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
                                        {selectedWebsite.description ||
                                            'Tidak ada deskripsi.'}
                                    </div>

                                    {selectedWebsite.link && (
                                        <a
                                            href={
                                                selectedWebsite.link.match(
                                                    /^https?:\/\//,
                                                )
                                                    ? selectedWebsite.link
                                                    : `https://${selectedWebsite.link}`
                                            }
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
