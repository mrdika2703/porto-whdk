import { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BgPhotograph } from '@/components/bg-photograph';
import { PhotoVideo } from './index';

export default function PhotoVideoSection({
    photovideos = [],
}: {
    photovideos: PhotoVideo[];
}) {
    const [activeTab, setActiveTab] = useState('Photography');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

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
        <section
            id="photo"
            className="relative flex min-h-[500px] w-full flex-col items-center overflow-hidden py-16 pb-14 md:py-24 md:pb-32"
        >
            <div className="absolute top-0 left-0 z-0 h-full w-full">
                <BgPhotograph className="text-amber-900 dark:text-cyan-600" />
            </div>

            {/* TOP FADE GRADIENT */}
            <div className="pointer-events-none absolute top-0 left-0 z-10 h-[15%] w-full bg-gradient-to-b from-main to-transparent"></div>

            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-4 sm:px-8 md:gap-12 md:px-12">
                {/* --- HEADER DENGAN ANIMASI --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '200px 0px', amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    className="relative z-20 flex flex-col items-center gap-2 text-center md:gap-4"
                >
                    <div className="relative inline-flex items-center gap-3 md:gap-4">
                        {/* Ukuran font disesuaikan di HP */}
                        <h2 className="text-xl font-bold text-tmain sm:text-2xl md:text-3xl">
                            Photography &{' '}
                            <span className="text-bshine">Videography</span>
                        </h2>
                        <img
                            src="/assets/icons/slay_light.svg"
                            alt="Decoration light"
                            className="absolute top-0 -right-8 h-6 w-6 rotate-12 transform md:-right-10 md:h-8 md:w-8 dark:hidden"
                        />
                        <img
                            src="/assets/icons/slay_dark.svg"
                            alt="Decoration dark"
                            className="absolute top-0 -right-8 hidden h-6 w-6 rotate-12 transform md:-right-10 md:h-8 md:w-8 dark:block"
                        />
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
                            className="absolute top-1/2 left-1 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400/60 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover/nav:opacity-100 md:-left-4 md:h-12 md:w-12 md:-translate-x-6 dark:bg-black/60"
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
                                        className="flex w-[120px] shrink-0 snap-start flex-col gap-4 sm:w-[260px] md:w-[320px] md:gap-6"
                                    >
                                        {column.map((project) => (
                                            <div
                                                key={project.id}
                                                className="group/card md:rounded-base relative w-full cursor-pointer overflow-hidden rounded-sm bg-white/5"
                                                onClick={() =>
                                                    setSelectedImage(
                                                        project.url_1,
                                                    )
                                                }
                                            >
                                                <img
                                                    src={project.url_1}
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
                            className="absolute top-1/2 right-1 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400/60 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover/nav:opacity-100 md:-right-4 md:h-12 md:w-12 md:translate-x-6 dark:bg-black/60"
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
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-6"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative flex max-h-[90vh] w-full max-w-5xl items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Tombol Close ditaruh di luar gambar sedikit untuk HP agar mudah di tap */}
                        <button
                            className="absolute -top-12 right-0 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition-transform hover:scale-110 md:-top-4 md:-right-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        <img
                            src={selectedImage}
                            alt="Preview Full"
                            className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl md:max-h-[85vh]"
                        />
                    </div>
                </div>
            )}

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
