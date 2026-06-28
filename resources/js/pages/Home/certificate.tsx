import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Certificate } from './index';
import { Underline } from '@/components/underline';

const getMonthYear = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
};

export default function CertificateSection({
    certificates,
    viewMode = 'All',
}: {
    certificates: Certificate[];
    viewMode?: 'All' | 'Multimedia' | 'Programming';
}) {
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const [activeImg, setActiveImg] = useState<string | null>(null);

    const filteredCertificates = useMemo(
        () => certificates.filter(
            (cert) =>
                viewMode === 'All' ||
                !cert.viewmode ||
                cert.viewmode === 'All' ||
                cert.viewmode === viewMode
        ),
        [certificates, viewMode]
    );

    const softSkills = useMemo(
        () => filteredCertificates.filter((cert) => cert.category.includes('Soft Skill')),
        [filteredCertificates],
    );
    const hardSkills = useMemo(
        () => filteredCertificates.filter((cert) => cert.category.includes('Hard Skill')),
        [filteredCertificates],
    );

    const openModal = (cert: Certificate) => {
        setSelectedCert(cert);
        setActiveImg(cert.url_1);
    };

    return (
        <section
            id="certificate"
            className="relative mt-15 w-full overflow-hidden py-16 text-white"
        >
            {/* Glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/4 hidden h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-bshine/5 blur-[120px] md:block"></div>

            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 md:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left"
                >
                    <div className="relative flex items-center">
                        <h2 className="font-regular relative font-montserrat-alt text-3xl text-tmain">
                            My{' '}
                            <span className="font-bold text-bshine">
                                Certificates {viewMode !== 'All' ? `- ${viewMode}` : ''}
                            </span>
                            <Underline className="absolute -right-1 -bottom-1 text-bshine" />
                        </h2>
                    </div>
                </motion.div>

                {/* List of Certificate Names */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 gap-8 md:grid-cols-2"
                >
                    {/* Soft Skills Section */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-hbshine/10 bg-bshine/1.5 px-10 py-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="flex items-center font-montserrat-alt text-lg font-bold text-tmain">
                                <i className="fa-solid fa-brain mr-2.5 text-bshine" />
                                Soft Skills
                            </h3>
                            <span className="rounded-full border border-bshine/25 bg-bshine/10 px-2.5 py-0.5 text-xs font-bold text-bshine">
                                {softSkills.length}
                            </span>
                        </div>
                        {softSkills.length > 0 ? (
                            <ul className="flex flex-col gap-1">
                                {softSkills.map((cert) => (
                                    <li
                                        key={cert.id}
                                        onClick={() => openModal(cert)}
                                        className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent bg-transparent px-2 py-2 transition-all duration-300 hover:border-bshine/30 hover:bg-white/[0.04]"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="truncate text-sm font-semibold text-tmain transition-colors duration-300 group-hover:text-bshine">
                                                    {cert.title}
                                                </span>
                                            </div>
                                        </div>
                                        <i className="fa-solid fa-chevron-right shrink-0 text-xs text-gray-500 transition-colors duration-300 group-hover:translate-x-0.5 group-hover:text-bshine" />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="py-4 text-center text-sm text-gray-500 italic">
                                Belum ada sertifikat.
                            </p>
                        )}
                    </div>

                    {/* Hard Skills Section */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-hbshine/10 bg-bshine/1.5 px-10 py-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="flex items-center font-montserrat-alt text-lg font-bold text-tmain">
                                <i className="fa-solid fa-code mr-2.5 text-bshine" />
                                Hard Skills
                            </h3>
                            <span className="rounded-full border border-bshine/25 bg-bshine/10 px-2.5 py-0.5 text-xs font-bold text-bshine">
                                {hardSkills.length}
                            </span>
                        </div>
                        {hardSkills.length > 0 ? (
                            <ul className="flex flex-col gap-1">
                                {hardSkills.map((cert) => (
                                    <li
                                        key={cert.id}
                                        onClick={() => openModal(cert)}
                                        className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent bg-transparent px-2 py-2 transition-all duration-300 hover:border-bshine/30 hover:bg-white/[0.04]"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="truncate text-sm font-semibold text-tmain transition-colors duration-300 group-hover:text-bshine">
                                                    {cert.title}
                                                </span>
                                            </div>
                                        </div>
                                        <i className="fa-solid fa-chevron-right shrink-0 text-xs text-gray-500 transition-colors duration-300 group-hover:translate-x-0.5 group-hover:text-bshine" />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="py-4 text-center text-sm text-gray-500 italic">
                                Belum ada sertifikat.
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Complete Card Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedCert(null)}
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
                                        alt={selectedCert.title}
                                        className="max-h-[50vh] max-w-full rounded-lg object-contain shadow-lg md:max-h-[85vh]"
                                        draggable={false}
                                    />
                                )}

                                {/* Arrow Navigation if url_2 exists */}
                                {selectedCert.url_2 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setActiveImg(
                                                    activeImg ===
                                                        selectedCert.url_1
                                                        ? selectedCert.url_2
                                                        : selectedCert.url_1,
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
                                                        selectedCert.url_1
                                                        ? selectedCert.url_2
                                                        : selectedCert.url_1,
                                                )
                                            }
                                            className="absolute top-1/2 right-6 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-bshine hover:bg-hbshine/50"
                                        >
                                            <i className="fa-solid fa-chevron-right text-sm" />
                                        </button>
                                    </>
                                )}

                                {/* Thumbnail Switcher if url_2 exists */}
                                {selectedCert.url_2 && (
                                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 rounded-lg border border-white/5 bg-black/60 p-2 backdrop-blur-md">
                                        <button
                                            onClick={() =>
                                                setActiveImg(selectedCert.url_1)
                                            }
                                            className={`h-10 w-14 overflow-hidden rounded border transition-all ${
                                                activeImg === selectedCert.url_1
                                                    ? 'scale-105 border-bshine'
                                                    : 'border-white/20 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${selectedCert.url_1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveImg(selectedCert.url_2)
                                            }
                                            className={`h-10 w-14 overflow-hidden rounded border transition-all ${
                                                activeImg === selectedCert.url_2
                                                    ? 'scale-105 border-bshine'
                                                    : 'border-white/20 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${selectedCert.url_2}`}
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
                                        {selectedCert.category}
                                    </span>

                                    <h3 className="text-xl leading-snug font-bold text-tmain md:text-2xl">
                                        {selectedCert.title}
                                    </h3>

                                    <p className="mt-3 flex items-center gap-2 text-sm font-medium text-hbshine">
                                        <i className="fa-regular fa-calendar-days text-bshine" />
                                        {getMonthYear(selectedCert.start_date)}
                                        {selectedCert.end_date
                                            ? ` - ${getMonthYear(selectedCert.end_date)}`
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
                                        {selectedCert.description ||
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
