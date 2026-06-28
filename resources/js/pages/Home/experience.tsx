import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Experience, Education } from './index';
import { Underline } from '@/components/underline';

// --- VARIAN ANIMASI FRAMER MOTION ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Efek muncul berurutan
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring', stiffness: 80, damping: 20 },
    },
} as const;

const lineVariants = {
    hidden: { height: 0 },
    visible: {
        height: '100%',
        transition: { duration: 1.5, ease: 'easeInOut' },
    },
} as const;

const getMonthYear = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
};

const renderDescription = (text: string | null) => {
    if (!text) return null;

    const lines = text.split('\n');
    const hasList = lines.some(l => l.trim().startsWith('-') || l.trim().startsWith('*'));

    if (!hasList) {
        return <span className="whitespace-pre-line">{text}</span>;
    }

    return (
        <ul className="list-disc list-inside space-y-1">
            {lines.map((line, idx) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                    return (
                        <li key={idx} className="ml-2">
                            {trimmed.substring(1).trim()}
                        </li>
                    );
                }
                return <p key={idx} className="mt-1">{line}</p>;
            })}
        </ul>
    );
};

export default function ExperienceEducationSection({
    experiences,
    educations,
    viewMode = 'All',
}: {
    experiences: Experience[];
    educations: Education[];
    viewMode?: 'All' | 'Multimedia' | 'Programming';
}) {
    const [expandedExp, setExpandedExp] = useState<number | null>(null);
    const [expandedEdu, setExpandedEdu] = useState<number | null>(null);

    // Filter experiences based on viewMode
    const filteredExperiences = experiences.filter(
        (exp) =>
            viewMode === 'All' ||
            !exp.viewmode ||
            exp.viewmode === 'All' ||
            exp.viewmode === viewMode
    );

    return (
        <section
            id="journey"
            className="relative overflow-hidden pt-15 pb-35 text-white"
        >
            {/* Latar Belakang Glow Ambient — hidden di mobile untuk performa */}
            <div className="pointer-events-none absolute top-1/4 left-0 hidden h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-bshine/10 blur-[120px] md:block"></div>
            <div className="pointer-events-none absolute top-3/4 right-0 hidden h-[400px] w-[400px] translate-x-1/3 rounded-full bg-bshine/10 blur-[100px] md:block"></div>

            <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 md:px-12">
                {/* --- HEADER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-row items-center justify-center gap-4 text-center md:justify-between md:text-left"
                >
                    <div className="relative flex items-center">
                        <h2 className="font-regular relative font-montserrat-alt text-3xl text-white">
                            My{' '}
                            <span className="font-bold text-bshine">
                                Journey {viewMode !== 'All' ? `- ${viewMode}` : ''}
                            </span>
                            <Underline className="absolute -right-2 -bottom-2 text-bshine" />
                        </h2>
                    </div>
                    <p className="hidden text-base font-light text-gray-300 md:block">
                        Experience & Education
                    </p>
                </motion.div>

                {/* --- KONTEN TIMELINE KIRI KANAN --- */}
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
                    {/* KOLOM PENGALAMAN */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.2,
                        }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col gap-10"
                    >
                        <h3 className="flex items-center gap-3 text-xl font-semibold text-white">
                            <i className="fa-solid fa-briefcase text-bshine"></i>{' '}
                            Experience {viewMode !== 'All' ? `- ${viewMode}` : ''}
                        </h3>

                        <div className="relative pl-4 md:pl-6">
                            {/* Garis Vertikal Timeline */}
                            <motion.div
                                variants={lineVariants}
                                className="absolute top-2 bottom-0 left-[7px] w-[2px] rounded-full bg-gradient-to-b from-bshine via-bshine/50 to-transparent md:left-[11px]"
                            />

                            {/* Item Timeline */}
                            {filteredExperiences.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                    className="group relative mb-12 pl-10 last:mb-0 md:pl-12"
                                >
                                    {/* Bullet Point / Dot */}
                                    <div className="absolute top-1.5 left-[-5px] h-4 w-4 rounded-full border-4 border-[#050015] bg-bshine transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(192,104,0,0.6)] group-hover:brightness-130 md:left-[-1px] dark:group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]" />

                                    {/* Konten Card */}
                                    <div
                                        className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 group-hover:border-white/10 group-hover:bg-white/[0.04] group-hover:shadow-xl md:backdrop-blur-sm"
                                        onClick={() =>
                                            setExpandedExp(
                                                expandedExp === item.id
                                                    ? null
                                                    : item.id,
                                            )
                                        }
                                    >
                                        <span className="inline-block w-fit rounded-full bg-bshine/20 px-3 py-1 text-xs font-medium text-white/80">
                                            {getMonthYear(item.start_date)}
                                            {item.end_date !== null
                                                ? ' - ' +
                                                  getMonthYear(item.end_date)
                                                : ''}
                                        </span>
                                        <div className="mt-1 flex items-center justify-between">
                                            <h4 className="text-lg font-bold text-white md:text-xl">
                                                {item.title}
                                            </h4>
                                            <motion.span
                                                className="inline-block"
                                                animate={{
                                                    rotate:
                                                        expandedExp === item.id
                                                            ? 180
                                                            : 0,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <i className="fa-solid fa-chevron-down text-xs text-gray-400" />
                                            </motion.span>
                                        </div>
                                        <h5 className="text-sm font-medium text-gray-400 italic">
                                            {item.origin}
                                        </h5>
                                        <AnimatePresence>
                                            {expandedExp === item.id && (
                                                <motion.div
                                                    initial={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        height: 'auto',
                                                        opacity: 1,
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.1,
                                                        ease: 'easeInOut',
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-2 text-sm leading-relaxed text-gray-300">
                                                        {renderDescription(item.description)}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* KOLOM PENDIDIKAN */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.2,
                        }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col gap-10"
                    >
                        <h3 className="flex items-center gap-3 text-xl font-semibold text-white">
                            <i className="fa-solid fa-graduation-cap text-bshine"></i>{' '}
                            Education
                        </h3>

                        <div className="relative pl-4 md:pl-6">
                            {/* Garis Vertikal Timeline */}
                            <motion.div
                                variants={lineVariants}
                                className="absolute top-2 bottom-0 left-[7px] w-[2px] rounded-full bg-gradient-to-b from-bshine via-bshine/50 to-transparent md:left-[11px]"
                            />

                            {/* Item Timeline */}
                            {educations.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                    className="group relative mb-12 pl-10 last:mb-0 md:pl-12"
                                >
                                    {/* Bullet Point / Dot */}
                                    <div className="absolute top-1.5 left-[-5px] h-4 w-4 rounded-full border-4 border-[#050015] bg-bshine transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(192,104,0,0.6)] group-hover:brightness-130 md:left-[-1px] dark:group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]" />

                                    {/* Konten Card */}
                                    <div
                                        className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 group-hover:border-white/10 group-hover:bg-white/[0.04] group-hover:shadow-xl md:backdrop-blur-sm"
                                        onClick={() =>
                                            setExpandedEdu(
                                                expandedEdu === item.id
                                                    ? null
                                                    : item.id,
                                            )
                                        }
                                    >
                                        <span className="inline-block w-fit rounded-full bg-bshine/20 px-3 py-1 text-xs font-medium text-white/80">
                                            {getMonthYear(item.start_date)}
                                            {item.end_date !== null
                                                ? ' - ' +
                                                  getMonthYear(item.end_date)
                                                : ''}
                                        </span>
                                        <div className="mt-1 flex items-center justify-between">
                                            <h4 className="text-lg font-bold text-white md:text-xl">
                                                {item.title}
                                            </h4>
                                            <motion.span
                                                className="inline-block"
                                                animate={{
                                                    rotate:
                                                        expandedEdu === item.id
                                                            ? 180
                                                            : 0,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <i className="fa-solid fa-chevron-down text-xs text-gray-400" />
                                            </motion.span>
                                        </div>
                                        <h5 className="text-sm font-medium text-gray-400 italic">
                                            {item.origin}
                                        </h5>
                                        <AnimatePresence>
                                            {expandedEdu === item.id && (
                                                <motion.div
                                                    initial={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        height: 'auto',
                                                        opacity: 1,
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.1,
                                                        ease: 'easeInOut',
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-2 text-sm leading-relaxed text-gray-300">
                                                        {renderDescription(item.description)}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
