import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Other } from './index';
import { Underline } from '@/components/underline';

export default function OtherSection({ others }: { others: Other[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOther, setSelectedOther] = useState<Other | null>(null);
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
        if (!isDragging) return;
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

    const openModal = (item: Other) => {
        setSelectedOther(item);
        setActiveImg(item.url_1);
    };

    // Helper to get all valid images for slider
    const getImages = (item: Other | null) => {
        if (!item) return [];
        return [
            item.url_1,
            item.url_2,
            item.url_3,
            item.url_4,
            item.url_5,
        ].filter(Boolean) as string[];
    };

    const activeImages = getImages(selectedOther);
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

    return (
        <section className="relative w-full overflow-hidden py-16 text-white">
            {/* Glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/4 hidden h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-bshine/5 blur-[120px] md:block"></div>

            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-6 md:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left"
                >
                    <div className="flex flex-col gap-2">
                        <h2 className="font-regular relative items-center font-montserrat-alt text-3xl tracking-wide text-tmain">
                            Other{' '}
                            <span className="font-bold text-bshine">
                                Creations
                            </span>
                            <Underline className="absolute -right-2 -bottom-1 text-bshine" />
                        </h2>

                        <p
                            className={`font-regular text-center text-xs text-gray-500 transition-opacity duration-100 md:text-left md:text-sm ${isOpen ? 'absolute opacity-0' : 'opacity-100'}`}
                        >
                            {others.map((item) => item.category).join(', ')}
                        </p>
                    </div>

                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-2 rounded-full border border-bshine/50 bg-bshine/10 px-6 py-2.5 text-sm font-medium text-bshine transition-all duration-300 hover:border-bshine hover:bg-bshine/20 md:backdrop-blur-sm"
                    >
                        <i
                            className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-folder-open'} transition-transform duration-300`}
                        />
                        {isOpen ? 'Tutup' : 'Lihat'} {others.length}
                        <motion.i
                            className="fa-solid fa-chevron-down text-xs text-bshine"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.1 }}
                        />
                    </motion.button>
                </motion.div>

                {/* Badge count */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="text-center text-sm text-gray-400 md:text-left"
                        >
                            Geser ke kanan untuk lihat selengkapnya
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* Horizontal scroll */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
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
                            {others.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.08,
                                    }}
                                    className="group relative w-[320px] shrink-0 sm:w-[420px] md:w-[480px]"
                                >
                                    <div
                                        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-bshine/30 hover:shadow-[0_4px_30px_rgba(192,104,0,0.15)] md:backdrop-blur-sm"
                                        onClick={() => {
                                            if (!isDragging) {
                                                openModal(item);
                                            }
                                        }}
                                    >
                                        {/* Category Tag */}
                                        <div className="absolute top-4 left-4 z-10 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-semibold text-white/95 transition-colors duration-300 group-hover:bg-bshine/90 md:backdrop-blur-md">
                                            {item.category}
                                        </div>

                                        {/* Image */}
                                        <img
                                            src={`/storage/${item.url_1}`}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                            draggable={false}
                                        />

                                        {/* Hover Overlay with Gradient info */}
                                        <div className="absolute inset-x-0 bottom-0 flex translate-y-3 flex-col justify-end bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 pt-20 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                            <h4 className="text-base font-bold text-white md:text-lg">
                                                {item.title}
                                            </h4>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div className="w-6 shrink-0 md:w-12" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Complete Card Modal */}
            <AnimatePresence>
                {selectedOther && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedOther(null)}
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
                                onClick={() => setSelectedOther(null)}
                                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-hbshine/50 text-white backdrop-blur-sm transition-all hover:bg-hbshine/65"
                            >
                                <i className="fa-solid fa-xmark text-lg" />
                            </button>

                            {/* Image side (more space) */}
                            <div className="relative flex min-h-[280px] w-full items-center justify-center p-3 md:min-h-[480px] md:w-3/5 lg:w-2/3">
                                {activeImg && (
                                    <img
                                        src={`/storage/${activeImg}`}
                                        alt={selectedOther.title}
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
                                        {selectedOther.category}
                                    </span>

                                    <h3 className="text-xl leading-snug font-bold text-tmain md:text-2xl">
                                        {selectedOther.title}
                                    </h3>

                                    <div className="my-5 h-px bg-hbshine/20" />

                                    <h4 className="text-xs font-bold tracking-wider text-tmain uppercase">
                                        Description
                                    </h4>

                                    <div
                                        className="mt-2.5 max-h-[160px] overflow-y-auto pr-2 text-sm leading-relaxed text-tmain md:max-h-[260px]"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        {selectedOther.description ||
                                            'Tidak ada deskripsi.'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
