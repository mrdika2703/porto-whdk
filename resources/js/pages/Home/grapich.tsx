import { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion'; // Tambahkan import framer-motion
import { Design } from './index';
import { Underline } from '@/components/underline';

const categories = ['Sosmed', 'Poster', 'Banner'];

interface GrapichProps {
    designs: Design[];
}

export default function DesignGraphicSection({ designs = [] }: GrapichProps) {
    const [activeCategory, setActiveCategory] = useState('Sosmed');
    const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // console.log('Isi data designs:', designs);

    // Gunakan pengamanan Array.isArray
    const filteredDesigns = Array.isArray(designs)
        ? designs.filter((item) => item.category === activeCategory)
        : [];

    const getColumns = (items: typeof designs) => {
        const columns: (typeof items)[] = [];
        let i = 0;
        while (i < items.length) {
            const chunkSize = columns.length % 2 === 0 ? 2 : 3;
            columns.push(items.slice(i, i + chunkSize));
            i += chunkSize;
        }
        return columns;
    };

    const designsColumns = getColumns(filteredDesigns);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;

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
        <section className="relative min-h-[500px] w-full overflow-hidden py-16 md:py-24">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-8 md:gap-12 md:px-12">
                {/* --- HEADER DENGAN ANIMASI --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    className="relative z-20 flex flex-row items-center justify-between gap-4 md:gap-6"
                >
                    <div className="flex w-full justify-center gap-3 md:justify-between md:gap-4">
                        {/* Ukuran teks disesuaikan untuk HP */}
                        <h2 className="font-regular relative font-montserrat-alt text-4xl text-tmain md:text-3xl">
                            Design{' '}
                            <span className="font-bold text-bshine">
                                Graphic
                            </span>
                            <Underline className="absolute -right-3 -bottom-1 text-bshine" />
                        </h2>
                        {/* Teks preview disembunyikan di layar sangat kecil agar tidak bertabrakan */}
                        <p className="hidden text-sm font-light text-tmain sm:block md:text-base">
                            Preview Project
                        </p>
                    </div>
                </motion.div>

                {/* --- MAIN CONTENT (Tabs & Slider) --- */}
                <div className="relative z-20 flex w-full flex-col items-center gap-3 md:gap-6">
                    {/* TABS */}
                    <div className="flex w-full flex-wrap items-center justify-center gap-3 md:gap-6">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                // Padding dan teks diperkecil di HP
                                className={`flex items-center justify-center rounded-3xl px-4 py-1.5 text-xs transition-all duration-300 sm:text-sm md:px-6 md:py-2 md:text-base ${
                                    activeCategory === cat
                                        ? 'border bg-gradient-to-r from-bsecond to-stone-500 font-medium text-white dark:border-white dark:bg-white/10 dark:bg-none dark:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                        : 'border border-bsecond font-normal text-tmain hover:bg-bsecond/5 dark:hover:bg-white/10'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                        <Link
                            href="/portfolio/design"
                            className="flex hidden items-center justify-center rounded-3xl bg-bshine px-4 py-1.5 text-xs font-medium text-white transition-colors hover:brightness-110 sm:text-sm md:block md:px-6 md:py-2 md:text-base dark:bg-white dark:text-secondary dark:hover:bg-gray-200"
                        >
                            See More
                            <i className="fa-solid fa-chevron-right ml-1"></i>
                        </Link>
                    </div>

                    {/* SLIDER CONTAINER */}
                    <div className="group/nav relative w-full">
                        {/* Tombol Kiri */}
                        {/* Posisi digeser ke dalam di HP (left-1) agar tidak terpotong, dan ukurannya diperkecil */}
                        <button
                            onClick={() => scroll('left')}
                            className="absolute top-1/2 left-1 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400/60 text-white opacity-0 shadow-lg transition-opacity group-hover/nav:opacity-100 md:-left-4 md:h-12 md:w-12 md:-translate-x-1/2 md:backdrop-blur-sm dark:bg-black/60"
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

                        {/* Area Konten Carousel Kolom */}
                        <div className="relative w-full">
                            <div
                                ref={scrollRef}
                                className="hide-scrollbar flex w-full snap-x snap-mandatory items-start gap-4 overflow-x-auto px-2 pt-4 pb-2 md:gap-6 md:px-4 md:pb-20"
                                style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                {designsColumns.map((column, colIndex) => (
                                    <div
                                        key={colIndex}
                                        // Lebar kolom di HP diperkecil menjadi 220px agar nyaman dilihat
                                        className="flex w-[180px] shrink-0 snap-start flex-col gap-4 sm:w-[180px] md:w-[320px] md:gap-6"
                                    >
                                        {column.map((designs) => (
                                            <div
                                                key={designs.id}
                                                className="group/card relative w-full cursor-pointer overflow-hidden rounded-xl bg-white/5 md:rounded-2xl"
                                                onClick={() =>
                                                    setSelectedDesign(designs)
                                                }
                                            >
                                                {/* Badge Hover */}
                                                <div className="absolute top-2 right-2 z-10 rounded-full bg-bshine/90 px-3 py-1 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 md:top-3 md:right-3 md:px-4 md:py-1.5 md:backdrop-blur-md dark:bg-cyan-500/90">
                                                    <span className="text-[10px] font-semibold tracking-wide text-white md:text-xs">
                                                        {designs.title}
                                                    </span>
                                                </div>

                                                {/* Gambar */}
                                                <img
                                                    src={`/storage/${designs.url_1}`}
                                                    alt={designs.title}
                                                    className="h-auto w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                {/* Gradient fade disesuaikan tinggi dan transparansinya */}
                                <div className="from-bg-sec pointer-events-none absolute bottom-0 left-0 z-20 h-32 w-full bg-gradient-to-t to-transparent md:h-48"></div>
                            </div>
                        </div>

                        {/* Tombol Kanan */}
                        <button
                            onClick={() => scroll('right')}
                            className="absolute top-1/2 right-1 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400/60 text-white opacity-0 shadow-lg transition-opacity group-hover/nav:opacity-100 md:-right-4 md:h-12 md:w-12 md:translate-x-1/2 md:backdrop-blur-sm dark:bg-black/60"
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
                {selectedDesign && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedDesign(null)}
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
                                onClick={() => setSelectedDesign(null)}
                                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-hbshine/50 text-white backdrop-blur-sm transition-all hover:bg-hbshine/65"
                            >
                                <i className="fa-solid fa-xmark text-lg" />
                            </button>

                            {/* Image side (more space) */}
                            <div className="relative flex min-h-[280px] w-full items-center justify-center p-3 md:min-h-[480px] md:w-3/5 lg:w-2/3">
                                <img
                                    src={`/storage/${selectedDesign.url_1}`}
                                    alt={selectedDesign.title}
                                    className="max-h-[50vh] max-w-full rounded-lg object-contain shadow-lg md:max-h-[85vh]"
                                    draggable={false}
                                />
                            </div>

                            {/* Info side (less space) */}
                            <div className="flex w-full flex-col justify-between border-t border-white/10 p-6 sm:p-8 md:w-2/5 md:border-t-0 md:border-l lg:w-1/3">
                                <div className="flex flex-col">
                                    <span className="mb-3 w-fit rounded-full border border-bshine/10 bg-bshine/20 px-3 py-1 text-xs font-semibold text-bshine backdrop-blur-sm">
                                        {selectedDesign.category}
                                    </span>

                                    <h3 className="text-xl leading-snug font-bold text-tmain md:text-2xl">
                                        {selectedDesign.title}
                                    </h3>

                                    <div className="my-5 h-px bg-hbshine/20" />

                                    <h4 className="text-xs font-bold tracking-wider text-tmain uppercase">
                                        Description
                                    </h4>

                                    <div className="mt-2.5 text-sm leading-relaxed text-tmain">
                                        Desain grafis untuk kategori{' '}
                                        {selectedDesign.category}.
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
