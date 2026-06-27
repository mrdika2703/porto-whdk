import { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BgPhotograph } from '@/components/bg-photograph';
import { PhotoVideo } from './index';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Underline } from '@/components/underline';

export default function PhotoVideoSection({
    photovideos = [],
}: {
    photovideos: PhotoVideo[];
}) {
    const [activeTab, setActiveTab] = useState('photo');
    const [selectedPhotoVideo, setSelectedPhotoVideo] =
        useState<PhotoVideo | null>(null);
    const [activeImg, setActiveImg] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

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
    const activeIndex = activeImg ? activeImages.indexOf(activeImg) : 0;

    const handlePrev = () => {
        if (activeImages.length <= 1) return;
        const newIndex =
            (activeIndex - 1 + activeImages.length) % activeImages.length;
        setActiveImg(activeImages[newIndex]);
    };

    const handleNext = () => {
        if (activeImages.length <= 1) return;
        const newIndex = (activeIndex + 1) % activeImages.length;
        setActiveImg(activeImages[newIndex]);
    };

    // 1. Filter data berdasarkan tab yang aktif
    const filteredProjects = photovideos.filter(
        (item) => item.type === activeTab,
    );

    // 2. Fungsi memecah data menjadi kolom-kolom (Maks 2-3 item per kolom ala Pinterest)
    const getColumns = (items: typeof photovideos) => {
        const columns: (typeof items)[] = [];
        let i = 0;
        while (i < items.length) {
            const chunkSize = columns.length % 2 === 0 ? 2 : 3;
            columns.push(items.slice(i, i + chunkSize));
            i += chunkSize;
        }
        return columns;
    };

    const projectColumns = getColumns(filteredProjects);

    // 3. Fungsi untuk Slider (Kiri/Kanan) dengan sistem Loop
    const scroll = (direction: 'left' | 'right') => {
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
    };

    return (
        <section className="relative flex min-h-[500px] w-full flex-col items-center overflow-hidden py-16 pb-14 md:py-24 md:pb-32">
            {/* BgPhotograph SVG (71KB, 400 path) — skip di mobile untuk performa */}
            <div className="absolute top-0 left-0 z-1 h-full w-full">
                {!isMobile && (
                    <BgPhotograph className="text-amber-900 dark:text-cyan-600" />
                )}
            </div>

            {/* TOP FADE GRADIENT */}
            <div className="pointer-events-none absolute top-0 left-0 z-10 h-[15%] w-full bg-gradient-to-b from-main to-transparent"></div>

            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-4 sm:px-8 md:gap-12 md:px-12">
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
                    <p className="hidden text-sm font-light text-tmain sm:block md:text-base">
                        Preview Project
                    </p>
                </motion.div>

                {/* --- TABS (Filter & See More) --- */}
                <div className="relative z-20 flex w-full flex-col items-center justify-center gap-3 md:gap-6">
                    <div className="flex w-full flex-wrap items-center justify-center gap-3 md:gap-6">
                        <button
                            onClick={() => setActiveTab('photo')}
                            // Ukuran tombol diperkecil di HP
                            className={`flex items-center justify-center rounded-full px-4 py-1.5 text-xs transition-all duration-300 sm:text-sm md:px-6 md:py-2 md:text-base ${
                                activeTab === 'photo'
                                    ? 'border bg-gradient-to-r from-bsecond to-stone-500 font-medium text-white dark:border-white dark:bg-white/10 dark:bg-none dark:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                    : 'border border-bsecond font-normal text-tmain hover:bg-bsecond/5 dark:hover:bg-white/10'
                            }`}
                        >
                            Photography
                        </button>

                        <button
                            onClick={() => setActiveTab('video')}
                            className={`flex items-center justify-center rounded-full px-4 py-1.5 text-xs transition-all duration-300 sm:text-sm md:px-6 md:py-2 md:text-base ${
                                activeTab === 'video'
                                    ? 'border bg-gradient-to-r from-bsecond to-stone-500 font-medium text-white dark:border-white dark:bg-white/10 dark:bg-none dark:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                    : 'border border-bsecond font-normal text-tmain hover:bg-bsecond/5 dark:hover:bg-white/10'
                            }`}
                        >
                            Videography
                        </button>

                        <Link
                            href="/portfolio/media"
                            className="flex hidden items-center justify-center rounded-3xl bg-bshine px-4 py-1.5 text-xs font-medium text-white transition-colors hover:brightness-110 sm:text-sm md:block md:px-6 md:py-2 md:text-base dark:bg-white dark:text-secondary dark:hover:bg-gray-200"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1"></i>
                        </Link>
                    </div>

                    {/* --- MAIN MASONRY SLIDER CONTENT --- */}
                    <div className="group/nav relative z-20 w-full md:mt-6">
                        {/* Tombol Panah Kiri */}
                        {/* Digeser agak ke dalam (left-1) untuk HP agar tombol bisa diklik */}
                        <button
                            onClick={() => scroll('left')}
                            className="absolute top-1/2 left-1 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400/60 text-white opacity-0 shadow-lg transition-all duration-300 group-hover/nav:opacity-100 md:-left-4 md:h-12 md:w-12 md:-translate-x-6 md:backdrop-blur-md dark:bg-black/60"
                            aria-label="Previous"
                        >
                            <svg
                                width="20"
                                height="20"
                                className="md:h-6 md:w-6"
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

                        {/* Area Konten Masonry Columns */}
                        <div className="relative w-full">
                            <div
                                ref={scrollRef}
                                className="hide-scrollbar flex w-full snap-x snap-mandatory items-start gap-4 overflow-x-auto px-2 pt-4 pb-0 md:gap-6 md:px-4 md:pb-20"
                                style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                {projectColumns.map((column, colIndex) => (
                                    <div
                                        key={colIndex}
                                        // Lebar kolom responsif (220px di HP, membesar di tablet/desktop)
                                        className="flex w-[180px] shrink-0 snap-start flex-col gap-4 md:w-[320px] md:gap-6"
                                    >
                                        {column.map((project) => (
                                            <div
                                                key={project.id}
                                                className="group/card md:rounded-base relative w-full cursor-pointer overflow-hidden rounded-sm bg-white/5"
                                                onClick={() => {
                                                    setSelectedPhotoVideo(
                                                        project,
                                                    );
                                                    setActiveImg(project.url_1);
                                                }}
                                            >
                                                <img
                                                    src={`/storage/${project.url_1}`}
                                                    alt={project.title}
                                                    className="h-auto w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                                                    loading="lazy"
                                                />

                                                <div className="absolute inset-x-0 bottom-0 z-10 flex h-1/2 flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 md:p-5">
                                                    <span className="translate-y-4 text-[10px] font-medium tracking-wide text-white transition-transform duration-300 group-hover/card:translate-y-0 md:text-sm">
                                                        {project.title}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tombol Panah Kanan */}
                        <button
                            onClick={() => scroll('right')}
                            className="absolute top-1/2 right-1 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400/60 text-white opacity-0 shadow-lg transition-all duration-300 group-hover/nav:opacity-100 md:-right-4 md:h-12 md:w-12 md:translate-x-6 md:backdrop-blur-md dark:bg-black/60"
                            aria-label="Next"
                        >
                            <svg
                                width="20"
                                height="20"
                                className="md:h-6 md:w-6"
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

                    {/* Tombol see more berpindah saat mode hp */}
                    <div className="relative z-20 flex w-full flex-wrap items-center justify-center">
                        <Link
                            href="/portfolio/media"
                            className="flex w-full items-center justify-center rounded-lg bg-bshine py-1.5 text-xs font-medium text-white transition-colors hover:brightness-110 sm:text-sm md:hidden md:px-6 md:py-2 md:text-base dark:bg-white dark:text-secondary dark:hover:bg-gray-200"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- MODAL UNTUK PREVIEW GAMBAR --- */}
            <AnimatePresence>
                {selectedPhotoVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedPhotoVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ ease: 'easeOut', duration: 0.1 }}
                            className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-main shadow-2xl backdrop-blur-md md:flex-row"
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
                                {activeImg && (
                                    <img
                                        src={`/storage/${activeImg}`}
                                        alt={selectedPhotoVideo.title}
                                        className="max-h-[50vh] max-w-full rounded-lg object-contain shadow-lg md:max-h-[85vh]"
                                        draggable={false}
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
                                        className="mt-2.5 max-h-[160px] overflow-y-auto pr-2 text-sm leading-relaxed text-tmain md:max-h-[260px]"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        {selectedPhotoVideo.description ||
                                            'Tidak ada deskripsi.'}
                                    </div>
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
