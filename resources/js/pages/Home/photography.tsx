import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { BgPhotograph } from '@/components/bg-photograph';
import { PhotoVideo, DescriptionSection } from './index';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Underline } from '@/components/underline';

function PhotoVideoImageCard({
    project,
    onClick,
}: {
    project: PhotoVideo;
    onClick: () => void;
}) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div
            className="group/card md:rounded-base relative w-full cursor-pointer overflow-hidden rounded-sm bg-white/5"
            onClick={onClick}
        >
            {/* Loading Skeleton */}
            {!isLoaded && (
                <div className="absolute inset-0 z-0 flex min-h-[120px] w-full animate-pulse items-center justify-center bg-gray-400/30 md:min-h-[160px]">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-bshine/30 border-t-bshine" />
                </div>
            )}

            <img
                src={
                    project.thumbnail || project.url_1
                        ? `/storage/${project.thumbnail || project.url_1}`
                        : '/assets/sample/sampleimages-3_2.webp'
                }
                alt={project.title}
                className={`h-auto w-full object-cover transition-all duration-500 group-hover/card:scale-105 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                        '/assets/sample/sampleimages-3_2.webp';
                    setIsLoaded(true);
                }}
            />

            <div className="absolute inset-x-0 bottom-0 z-10 flex h-1/2 flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 md:p-5">
                <span className="translate-y-4 text-[10px] font-medium tracking-wide text-white transition-transform duration-300 group-hover/card:translate-y-0 md:text-sm">
                    {project.title}
                </span>
            </div>
        </div>
    );
}

function ModalImage({ src, alt }: { src: string; alt: string }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
    }, [src]);

    return (
        <div className="relative flex w-full items-center justify-center">
            {!isLoaded && (
                <div className="flex h-48 w-48 animate-pulse items-center justify-center rounded-lg bg-white/5">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-bshine/30 border-t-bshine" />
                </div>
            )}
            <img
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
                elements.push(<p key={`p-${idx}`} className="leading-relaxed">{trimmed}</p>);
            }
        }
    });
    flushList('list-end');
    return elements;
}

export default function PhotoVideoSection({
    photovideos = [],
    description_sections,
}: {
    photovideos: PhotoVideo[];
    description_sections?: DescriptionSection | null;
}) {
    const [activeTab, setActiveTab] = useState('photo');
    const [selectedPhotoVideo, setSelectedPhotoVideo] =
        useState<PhotoVideo | null>(null);
    const [activeImg, setActiveImg] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        setActiveImg(null);
    }, [selectedPhotoVideo]);

    useEffect(() => {
        setSelectedPhotoVideo(null);
        setActiveImg(null);
    }, [activeTab]);

    const getImages = (item: PhotoVideo | null) => {
        if (!item) return [];
        return [
            item.url_1,
            item.url_2,
            item.url_3,
            item.url_4,
            item.url_5,
        ].filter(Boolean) as string[];
    };

    const activeImages = getImages(selectedPhotoVideo);
    const currentImg = activeImg || selectedPhotoVideo?.url_1 || null;
    const activeIndex = currentImg ? activeImages.indexOf(currentImg) : 0;

    const handlePrev = useCallback(() => {
        if (activeImages.length <= 1) return;
        const newIndex =
            (activeIndex - 1 + activeImages.length) % activeImages.length;
        setActiveImg(activeImages[newIndex]);
    }, [activeImages, activeIndex]);

    const handleNext = useCallback(() => {
        if (activeImages.length <= 1) return;
        const newIndex = (activeIndex + 1) % activeImages.length;
        setActiveImg(activeImages[newIndex]);
    }, [activeImages, activeIndex]);

    const filteredProjects = useMemo(
        () => photovideos.filter((item) => item.type === activeTab),
        [photovideos, activeTab],
    );

    const desktopColumns = useMemo(() => {
        const cols: (typeof filteredProjects)[] = [[], [], [], []];
        filteredProjects.forEach((item, index) => {
            cols[index % 4].push(item);
        });
        return cols;
    }, [filteredProjects]);

    const mobileColumns = useMemo(() => {
        const cols: (typeof filteredProjects)[] = [[], [], []];
        filteredProjects.forEach((item, index) => {
            cols[index % 3].push(item);
        });
        return cols;
    }, [filteredProjects]);

    const scroll = useCallback((direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.75;

            if (direction === 'left') {
                if (scrollLeft <= 0) {
                    scrollRef.current.scrollTo({
                        left: scrollWidth,
                        behavior: 'smooth',
                    });
                } else {
                    scrollRef.current.scrollTo({
                        left: scrollLeft - scrollAmount,
                        behavior: 'smooth',
                    });
                }
            } else {
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollTo({
                        left: scrollLeft + scrollAmount,
                        behavior: 'smooth',
                    });
                }
            }
        }
    }, []);

    return (
        <section className="relative flex min-h-[500px] w-full flex-col items-center overflow-hidden py-16 pb-14 md:py-24 md:pb-32">
            {/* BgPhotograph SVG (71KB, 400 path) — skip di mobile untuk performa */}
            <div className="absolute top-0 left-0 z-1 h-full w-full">
                <BgPhotograph className="h-full w-full object-cover text-amber-900 dark:text-cyan-600" />
            </div>

            {/* TOP FADE GRADIENT */}
            <div className="pointer-events-none absolute top-0 left-0 z-10 h-[15%] w-full bg-gradient-to-b from-main to-transparent"></div>

            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 sm:px-8 md:gap-3 md:px-12">
                {/* --- HEADER DENGAN ANIMASI --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    className="relative z-20 flex flex-col items-center gap-2 text-center md:gap-4"
                >
                    <div className="relative flex w-full flex-wrap justify-center gap-1 font-montserrat-alt md:gap-4">
                        {/* Ukuran font disesuaikan di HP */}
                        <h2 className="font-regular relative flex text-3xl text-tmain md:text-3xl">
                            Photography
                            <span className="ml-2.5 hidden font-bold text-bshine md:block">
                                {' '}
                                & Videography
                                <Underline className="absolute -right-2 -bottom-2 text-bshine" />
                            </span>
                        </h2>
                        <h2 className="relative text-3xl font-bold text-bshine md:hidden md:text-3xl">
                            Videography
                            <Underline className="absolute -right-2 -bottom-2 text-bshine" />
                        </h2>
                    </div>
                    {/* Teks preview disembunyikan di layar HP paling kecil agar bersih */}
                    <p className="text-xs font-light text-tmain md:text-base">
                        {description_sections?.photovideo_section ||
                            'Preview Project'}
                    </p>
                </motion.div>

                {/* --- TABS (Filter & See More) --- */}
                <div className="relative z-20 mt-10 flex w-full flex-col items-center justify-center gap-3 md:mt-12 md:gap-6">
                    <div className="flex w-full flex-wrap items-center justify-center gap-3 md:gap-6">
                        {['photo', 'video'].map((type) => {
                            const count = Array.isArray(photovideos)
                                ? photovideos.filter(
                                      (item) => item.type === type,
                                  ).length
                                : 0;
                            const label =
                                type === 'photo'
                                    ? 'Photography'
                                    : 'Videography';

                            return (
                                <div key={type} className="relative">
                                    {count > 0 && (
                                        <span className="absolute -top-1 -right-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-bshine px-1 text-[10px] font-bold text-white shadow-md">
                                            {count}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => setActiveTab(type)}
                                        className={`flex items-center justify-center rounded-full px-4 py-1.5 text-xs transition-all duration-300 sm:text-sm md:px-6 md:py-2 md:text-base ${
                                            activeTab === type
                                                ? 'border bg-gradient-to-r from-bsecond to-stone-500 font-medium text-white dark:border-white dark:bg-white/10 dark:bg-none dark:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                                : 'border border-bsecond font-normal text-tmain hover:bg-bsecond/5 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                </div>
                            );
                        })}

                        <button
                            disabled
                            className="hidden items-center justify-center rounded-3xl bg-bshine px-4 py-1.5 text-xs font-medium text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm md:flex md:px-6 md:py-2 md:text-base dark:bg-white dark:text-secondary dark:hover:bg-gray-200"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1"></i>
                        </button>
                    </div>

                    {/* KONTEN GAMBAR */}
                    {/* Mode Mobile: Masonry 3 Kolom Flex (tanpa scroll horizontal & tanpa gap Y berlebih) */}
                    <div className="flex w-full gap-2 pt-2 md:hidden">
                        {mobileColumns.map((col, colIdx) => (
                            <div
                                key={colIdx}
                                className="flex flex-1 flex-col gap-2"
                            >
                                {col.map((project) => (
                                    <PhotoVideoImageCard
                                        key={project.id}
                                        project={project}
                                        onClick={() => {
                                            setSelectedPhotoVideo(project);
                                            setActiveImg(project.url_1);
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Mode Desktop: Masonry 4 Kolom Flex (Tanpa Scroll Horizontal) */}
                    <div className="relative z-20 hidden w-full gap-4 pt-4 md:flex md:gap-6">
                        {desktopColumns.map((col, colIdx) => (
                            <div
                                key={colIdx}
                                className="flex flex-1 flex-col gap-4 md:gap-6"
                            >
                                {col.map((project) => (
                                    <PhotoVideoImageCard
                                        key={project.id}
                                        project={project}
                                        onClick={() => {
                                            setSelectedPhotoVideo(project);
                                            setActiveImg(project.url_1);
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Tombol see more berpindah saat mode hp */}
                    <div className="relative z-20 flex w-full flex-wrap items-center justify-center">
                        <button
                            disabled
                            className="flex w-full items-center justify-center rounded-lg bg-bshine py-1.5 text-xs font-medium text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm md:hidden md:px-6 md:py-2 md:text-base dark:bg-white dark:text-secondary dark:hover:bg-gray-200"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MODAL UNTUK PREVIEW GAMBAR --- */}
            <AnimatePresence>
                {selectedPhotoVideo && (
                    <motion.div
                        initial={isMobile ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={isMobile ? undefined : { opacity: 0 }}
                        transition={
                            isMobile ? { duration: 0 } : { duration: 0.1 }
                        }
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedPhotoVideo(null)}
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
                            {/* Close */}
                            <button
                                onClick={() => setSelectedPhotoVideo(null)}
                                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-hbshine/50 text-white backdrop-blur-sm transition-all hover:bg-hbshine/65"
                            >
                                <i className="fa-solid fa-xmark text-lg" />
                            </button>

                            {/* Image side (more space) */}
                            <div className="relative flex min-h-[280px] w-full items-center justify-center p-3 md:min-h-[480px] md:w-3/5 lg:w-2/3">
                                {currentImg && (
                                    <ModalImage
                                        src={`/storage/${currentImg}`}
                                        alt={selectedPhotoVideo.title}
                                    />
                                )}

                                {/* Arrow Navigation if multiple images exist */}
                                {activeImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrev}
                                            className="absolute top-1/2 left-6 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-bshine hover:bg-hbshine/50"
                                        >
                                            <i className="fa-solid fa-chevron-left text-sm" />
                                        </button>
                                        <button
                                            onClick={handleNext}
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

                            {/* Info side (less space) */}
                            <div className="flex w-full flex-col justify-between border-t border-white/10 p-6 sm:p-8 md:w-2/5 md:border-t-0 md:border-l lg:w-1/3">
                                <div className="flex flex-col">
                                    <span className="mb-3 w-fit rounded-full border border-bshine/10 bg-bshine/20 px-3 py-1 text-xs font-semibold text-bshine backdrop-blur-sm">
                                        {selectedPhotoVideo.category}
                                    </span>

                                    <h3 className="text-xl leading-snug font-bold text-tmain md:text-2xl">
                                        {selectedPhotoVideo.title}
                                    </h3>

                                    <div className="my-5 h-px bg-hbshine/20" />

                                    <h4 className="text-xs font-bold tracking-wider text-tmain uppercase">
                                        Description
                                    </h4>

                                    <div
                                        className="mt-2.5 max-h-[160px] overflow-y-auto pr-2 text-sm text-tmain md:max-h-[260px]"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        {selectedPhotoVideo.description
                                            ? renderDescription(
                                                  selectedPhotoVideo.description,
                                              )
                                            : 'Tidak ada deskripsi.'}
                                    </div>

                                    {selectedPhotoVideo.link && (
                                        <a
                                            href={
                                                selectedPhotoVideo.link.match(
                                                    /^https?:\/\//,
                                                )
                                                    ? selectedPhotoVideo.link
                                                    : `https://${selectedPhotoVideo.link}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-bshine/50 bg-bshine/10 px-6 py-2 text-sm font-semibold text-bshine backdrop-blur-sm transition-all duration-300 hover:border-bshine hover:bg-bshine/20 hover:shadow-[0_0_20px_rgba(192,104,0,0.2)]"
                                        >
                                            <i className="fa-solid fa-arrow-up-right-from-square" />
                                            See Video
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
