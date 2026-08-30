import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { Website, DescriptionSection } from './index';
import { Underline } from '@/components/underline';
import { useIsMobile } from '@/hooks/useIsMobile';

function WebsiteCardImage({ src, alt }: { src: string; alt: string }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        setIsLoaded(false);
        // If image is already cached/complete, mark loaded immediately
        if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
            setIsLoaded(true);
        }
    }, [src]);

    return (
        <div className="relative h-full w-full">
            {!isLoaded && (
                <div className="absolute inset-0 z-10 flex animate-pulse items-center justify-center rounded-2xl bg-gray-400/30">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-bshine/30 border-t-bshine" />
                </div>
            )}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                loading="lazy"
                draggable={false}
                onLoad={() => setIsLoaded(true)}
                onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                        '/assets/sample/sampleimages-3_2.webp';
                    setIsLoaded(true);
                }}
                className={`h-full w-full object-cover transition-opacity duration-500 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </div>
    );
}

function ModalImage({ src, alt }: { src: string; alt: string }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        setIsLoaded(false);
        if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
            setIsLoaded(true);
        }
    }, [src]);

    return (
        <div className="relative flex w-full items-center justify-center">
            {!isLoaded && (
                <div className="flex h-48 w-48 animate-pulse items-center justify-center rounded-lg bg-white/5">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-bshine/30 border-t-bshine" />
                </div>
            )}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                draggable={false}
                onLoad={() => setIsLoaded(true)}
                onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                        '/assets/sample/sampleimages-3_2.webp';
                    setIsLoaded(true);
                }}
                className={`max-h-[50vh] max-w-full rounded-lg object-contain shadow-lg transition-opacity duration-300 md:max-h-[85vh] ${
                    isLoaded ? 'opacity-100' : 'absolute opacity-0'
                }`}
            />
        </div>
    );
}

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

const TABS = ['all', 'project', 'develop'] as const;
type TabType = (typeof TABS)[number];

// Render description: supports newlines and list items (- / • prefix)
function renderDescription(text: string) {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = (key: string) => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={key} className="mt-1 space-y-1 pl-1">
                    {listItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bshine" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>,
            );
            listItems = [];
        }
    };

    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        const isList = /^[-•*]\s+/.test(trimmed);
        if (isList) {
            listItems.push(trimmed.replace(/^[-•*]\s+/, ''));
        } else {
            flushList(`list-${idx}`);
            if (trimmed === '') {
                elements.push(<div key={`br-${idx}`} className="h-2" />);
            } else {
                elements.push(
                    <p key={`p-${idx}`} className="leading-relaxed">
                        {trimmed}
                    </p>,
                );
            }
        }
    });
    flushList('list-end');
    return elements;
}

export default function WebsiteSection({
    websites = [],
    description_sections,
}: {
    websites: Website[];
    description_sections?: DescriptionSection | null;
}) {
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [projectIndex, setProjectIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(
        null,
    );
    const [activeImg, setActiveImg] = useState<string | null>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        setActiveImg(null);
    }, [selectedWebsite]);

    useEffect(() => {
        setSelectedWebsite(null);
        setActiveImg(null);
    }, [activeTab]);

    const getImages = (item: Website | null) => {
        if (!item) return [];
        return item.images || [];
    };

    const activeImages = getImages(selectedWebsite);
    const currentImg =
        activeImg ||
        (selectedWebsite?.images && selectedWebsite.images.length > 0
            ? selectedWebsite.images[0]
            : null);
    const activeIndex = currentImg ? activeImages.indexOf(currentImg) : 0;

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

    const filteredProjects = useMemo(() => {
        if (activeTab === 'all') {
            // Sort by created_at desc for "all" tab
            return [...websites].sort((a, b) => {
                const da = a.created_at ? new Date(a.created_at).getTime() : 0;
                const db = b.created_at ? new Date(b.created_at).getTime() : 0;
                return db - da;
            });
        }
        return websites.filter((item) => item.category === activeTab);
    }, [websites, activeTab]);

    useEffect(() => {
        setProjectIndex(0);
        setDirection('next');
    }, [activeTab]);

    const ITEMS_PER_PAGE = 3;

    const handleNextProject = useCallback(() => {
        setDirection('next');
        setProjectIndex((prev) => {
            const next = prev + ITEMS_PER_PAGE;
            return next >= filteredProjects.length ? 0 : next;
        });
    }, [filteredProjects.length]);

    const handlePrevProject = useCallback(() => {
        setDirection('prev');
        setProjectIndex((prev) => {
            const next = prev - ITEMS_PER_PAGE;
            return next < 0
                ? Math.floor((filteredProjects.length - 1) / ITEMS_PER_PAGE) *
                      ITEMS_PER_PAGE
                : next;
        });
    }, [filteredProjects.length]);

    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const pageIndex = Math.floor(projectIndex / ITEMS_PER_PAGE);
    const pagedProjects = filteredProjects.slice(
        pageIndex * ITEMS_PER_PAGE,
        pageIndex * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
    );

    return (
        <section
            id="website"
            className="relative min-h-[600px] w-full overflow-hidden py-16 text-white"
        >
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bshine/5 blur-[120px] md:block"></div>

            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-6 md:px-12">
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

                {description_sections?.website_section && (
                    <div className="flex w-full flex-col items-start">
                        <p className="text-xs font-light text-tmain/70 md:text-sm">
                            {description_sections.website_section}
                        </p>
                    </div>
                )}

                {/* Tabs & Content Container */}
                <div className="mt-10 flex flex-col items-center gap-6">
                    <div className="flex w-full flex-wrap items-center justify-center gap-4">
                        {TABS.map((tab) => {
                            const count =
                                tab === 'all'
                                    ? Array.isArray(websites)
                                        ? websites.length
                                        : 0
                                    : Array.isArray(websites)
                                      ? websites.filter(
                                            (item) => item.category === tab,
                                        ).length
                                      : 0;

                            return (
                                <div key={tab} className="relative">
                                    {/* Badge count — notif style */}
                                    {count > 0 && (
                                        <span className="absolute -top-1 -right-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-bshine px-1 text-[10px] font-bold text-white shadow-md">
                                            {count}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex items-center justify-center rounded-full px-6 py-2 text-sm transition-all duration-300 md:text-base ${
                                            activeTab === tab
                                                ? 'border bg-gradient-to-r from-bsecond to-stone-500 font-medium text-white dark:border-white dark:bg-white/10 dark:bg-none dark:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                                : 'border border-bsecond font-normal text-tmain hover:bg-bsecond/5 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="capitalize">
                                            {tab}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                        <button
                            disabled
                            className="hidden items-center justify-center rounded-full bg-bshine px-6 py-2 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 md:flex dark:bg-white dark:text-secondary dark:hover:bg-gray-200"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1.5"></i>
                        </button>
                    </div>

                    {/* 4-per-page Card Grid */}
                    <AnimatePresence mode="wait" custom={direction}>
                        {pagedProjects.length > 0 ? (
                            <motion.div
                                key={`page-${pageIndex}-${activeTab}`}
                                custom={direction}
                                variants={transitionVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="mx-auto grid w-full grid-cols-1 gap-6 md:grid-cols-3"
                            >
                                {pagedProjects.map((proj) => (
                                    <div
                                        key={`${activeTab}-${proj.id}`}
                                        className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:border-bshine/50 hover:shadow-[0_6px_30px_rgba(192,104,0,0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-sm dark:hover:border-bshine/30 dark:hover:bg-white/[0.06] dark:hover:shadow-[0_4px_24px_rgba(192,104,0,0.08)]"
                                    >
                                        {/* Stacked Image — 16:9 */}
                                        <div className="relative p-4 pb-0">
                                            <div className="relative aspect-[16/9] w-full">
                                                {/* Behind layer */}
                                                {proj.images &&
                                                proj.images[1] ? (
                                                    <div className="absolute inset-0 translate-x-0 translate-y-0 rotate-0 overflow-hidden rounded-lg border border-white/5 bg-white/[0.02] opacity-0 shadow-sm transition-all duration-500 group-hover:translate-x-3 group-hover:translate-y-3 group-hover:rotate-2 group-hover:opacity-40">
                                                        <WebsiteCardImage
                                                            src={`/storage/${proj.images[1]}`}
                                                            alt="Screenshot 2"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 translate-x-0 translate-y-0 rotate-0 rounded-lg border border-white/5 bg-bshine/5 opacity-0 shadow-sm transition-all duration-500 group-hover:translate-x-3 group-hover:translate-y-3 group-hover:rotate-2 group-hover:opacity-20" />
                                                )}
                                                {/* Front layer */}
                                                <div className="absolute inset-0 z-10 overflow-hidden rounded-lg border border-white/10 shadow-md transition-transform duration-500 group-hover:scale-[1.02]">
                                                    <WebsiteCardImage
                                                        src={`/storage/${proj.thumbnail || proj.images?.[0]}`}
                                                        alt={proj.title}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Info */}
                                        <div className="flex flex-1 flex-col gap-3 p-5">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-montserrat-alt text-base leading-tight font-bold text-tmain md:text-lg">
                                                    {proj.title}
                                                </h3>
                                                <p className="flex items-center gap-1 text-xs font-semibold tracking-wider text-hbshine uppercase">
                                                    <i className="fa-regular fa-building text-bshine" />
                                                    {proj.origin}
                                                </p>
                                            </div>

                                            <p className="line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                                {proj.description}
                                            </p>

                                            <div className="border-l-2 border-bshine pl-3">
                                                <p className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                                    Tech Stack
                                                </p>
                                                <p className="mt-0.5 text-sm font-medium text-tmain italic">
                                                    {proj.tech}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-auto flex gap-2 pt-1">
                                                <button
                                                    onClick={() =>
                                                        openModal(proj)
                                                    }
                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-bshine/50 bg-bshine/10 px-4 py-2 text-sm font-semibold text-bshine transition-all duration-300 hover:border-bshine hover:bg-bshine/20"
                                                >
                                                    <i className="fa-solid fa-circle-info" />
                                                    Detail
                                                </button>
                                                {proj.link && (
                                                    <a
                                                        href={
                                                            proj.link.match(
                                                                /^https?:\/\//,
                                                            )
                                                                ? proj.link
                                                                : `https://${proj.link}`
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-tmain/10 bg-tmain/5 px-4 py-2 text-sm font-semibold text-tmain transition-all duration-300 hover:border-tmain/20 hover:bg-tmain/10"
                                                    >
                                                        <i className="fa-solid fa-arrow-up-right-from-square" />
                                                        Visit
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <p className="w-full py-12 text-center text-gray-500 italic">
                                Belum ada project.
                            </p>
                        )}
                    </AnimatePresence>

                    {/* Simple Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-4 md:gap-8">
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
                                {Array.from({ length: totalPages }).map(
                                    (_, idx) => (
                                        <div
                                            key={`dot-${idx}`}
                                            className={`h-2 cursor-pointer rounded-full transition-all duration-500 md:h-2.5 ${
                                                idx === pageIndex
                                                    ? 'w-8 bg-bshine md:w-10'
                                                    : 'w-2 bg-gray-600 hover:bg-gray-400 md:w-2.5'
                                            }`}
                                            onClick={() => {
                                                setDirection(
                                                    idx > pageIndex
                                                        ? 'next'
                                                        : 'prev',
                                                );
                                                setProjectIndex(
                                                    idx * ITEMS_PER_PAGE,
                                                );
                                            }}
                                        />
                                    ),
                                )}
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
                        <button
                            disabled
                            className="flex w-full items-center justify-center rounded-lg bg-bshine py-2 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-secondary"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1.5"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Detail Project */}
            <AnimatePresence>
                {selectedWebsite && (
                    <motion.div
                        initial={isMobile ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={isMobile ? undefined : { opacity: 0 }}
                        transition={
                            isMobile ? { duration: 0 } : { duration: 0.1 }
                        }
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedWebsite(null)}
                    >
                        <motion.div
                            initial={
                                isMobile
                                    ? false
                                    : { scale: 0.95, opacity: 0, y: 10 }
                            }
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={
                                isMobile
                                    ? undefined
                                    : { scale: 0.95, opacity: 0, y: 10 }
                            }
                            transition={
                                isMobile
                                    ? { duration: 0 }
                                    : { ease: 'easeOut', duration: 0.1 }
                            }
                            className="relative flex w-[90vw] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-white/10 bg-main shadow-2xl backdrop-blur-md md:flex-row"
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
                                {currentImg && (
                                    <ModalImage
                                        src={`/storage/${currentImg}`}
                                        alt={selectedWebsite.title}
                                    />
                                )}

                                {/* Arrow Navigation */}
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
                                                    currentImg === img
                                                        ? 'scale-105 border-bshine'
                                                        : 'border-white/20 opacity-60 hover:opacity-100'
                                                }`}
                                            >
                                                <img
                                                    src={`/storage/${img}`}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        (
                                                            e.currentTarget as HTMLImageElement
                                                        ).src =
                                                            '/assets/sample/sampleimages-3_2.webp';
                                                    }}
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
                                        className="mt-2.5 max-h-[160px] overflow-y-auto pr-2 text-sm text-tmain md:max-h-[220px]"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        {selectedWebsite.description
                                            ? renderDescription(
                                                  selectedWebsite.description,
                                              )
                                            : 'Tidak ada deskripsi.'}
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
