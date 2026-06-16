import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { PhotoshopIcon, LightroomIcon } from '@/components/icons';
import { Skill } from './index';

export default function Skills({ skills = [] }: { skills: Skill[] }) {
    const appIcons = [
        PhotoshopIcon,
        LightroomIcon,
        PhotoshopIcon,
        LightroomIcon,
        PhotoshopIcon,
        LightroomIcon,
        PhotoshopIcon,
        LightroomIcon,
    ];

    const appRef = useRef(null);
    const isAppInView = useInView(appRef, { margin: '0px 0px -50px 0px' });

    // --- VARIAN ANIMASI UNTUK SKILLS ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Memunculkan item berurutan setiap 0.1 detik
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 120, damping: 12 },
        },
    };

    return (
        <div
            id="skills"
            className="relative w-full overflow-hidden rounded-t-[40px] rounded-b-[40px] py-20 md:rounded-t-4xl md:rounded-b-4xl"
        >
            {/* =========================================
                SKILLS SECTION
            ========================================= */}
            <div className="px-6 md:px-20">
                {/* Header Skills */}
                <div className="mb-10 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{
                            once: true,
                            margin: '200px 0px',
                            amount: 0.5,
                        }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeOut',
                            delay: 0.2,
                        }}
                        className="flex items-center gap-4"
                    >
                        <h3 className="text-3xl font-semibold text-white">
                            Skills
                        </h3>
                        <img
                            src="/assets/icons/slay_light.svg"
                            alt="Slay dark decoration"
                            className="h-8 w-8 dark:hidden"
                        />
                        <img
                            src="/assets/icons/slay_dark.svg"
                            alt="Slay light decoration"
                            className="hidden h-8 w-8 dark:block"
                        />
                    </motion.div>
                </div>

                <section>
                    {/* Grid/Flex Container 
                        Mobile: grid-cols-2 (2 item memanjang)
                        Desktop (md): flex wrap menyebar seperti desain asli
                    */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            margin: '200px 0px',
                            amount: 0.5,
                        }}
                        className="mt-4 grid grid-cols-2 gap-3 md:flex md:flex-wrap md:items-center md:justify-between md:gap-x-2 md:gap-y-7 md:after:w-[20%] md:after:flex-auto md:after:content-['']"
                    >
                        {skills.map((skills, index) => (
                            <motion.div
                                variants={itemVariants}
                                key={index}
                                // w-full di HP agar mengisi kolom grid, w-auto di Desktop agar memadat
                                className="relative flex h-[34px] w-full items-center gap-0 md:h-8 md:w-auto"
                            >
                                {/* Nama Skill */}
                                {/* flex-1 ditambahkan agar nama skill memanjang mengambil sisa ruang di HP */}
                                <span className="flex h-full flex-1 items-center truncate rounded-l-full border-y border-l border-white/50 bg-white/10 px-2 text-white backdrop-blur-sm md:px-3.5">
                                    <span className="mr-1.5 shrink-0 md:mr-2">
                                        <i className={skills.icon}></i>
                                    </span>
                                    <span className="truncate text-[10px] font-normal sm:text-xs">
                                        {skills.name_skills}
                                    </span>
                                </span>

                                {/* Level Skill */}
                                {/* shrink-0 agar level tidak menyusut tertekan teks nama */}
                                <span className="flex h-full shrink-0 items-center rounded-r-full border-y border-r border-white/50 bg-white/20 px-2 backdrop-blur-sm md:px-3.5">
                                    <span className="text-[10px] font-medium text-white sm:text-xs">
                                        {skills.level}
                                    </span>
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </div>

            {/* =========================================
                APPLICATION SECTION (MARQUEE)
            ========================================= */}
            <section
                ref={appRef}
                className="mt-14 overflow-hidden px-6 py-7 md:mt-10 md:px-15"
            >
                <div className="flex flex-wrap py-4 md:py-7">
                    <div className="flex w-full justify-start md:justify-end">
                        <p className="font-regular text-sm text-white md:text-base">
                            Application in use
                        </p>
                    </div>
                </div>

                <div className="mx-auto flex flex-col items-center overflow-hidden">
                    {/* Baris Animasi 1 */}
                    <div className="flex w-full border border-x-transparent border-y-white/15 py-5 md:py-7">
                        <motion.div
                            className="flex w-max gap-12 md:gap-20"
                            animate={
                                isAppInView
                                    ? { x: ['0%', '-50%'] }
                                    : { x: '0%' }
                            }
                            transition={{
                                repeat: Infinity,
                                duration: 40,
                                ease: 'easeIn',
                            }}
                        >
                            <div className="flex gap-16 px-4 md:gap-25 md:px-6">
                                {appIcons.map((Icon, index) => (
                                    <div
                                        key={`set1-${index}`}
                                        className="flex size-16 items-center justify-center md:size-24"
                                    >
                                        <Icon />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-16 px-4 md:gap-25 md:px-6">
                                {appIcons.map((Icon, index) => (
                                    <div
                                        key={`set2-${index}`}
                                        className="flex size-16 items-center justify-center md:size-24"
                                    >
                                        <Icon />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Baris Animasi 2 */}
                    <div className="flex w-full border border-x-transparent border-y-white/15 py-5 md:py-7">
                        <motion.div
                            className="flex w-max gap-12 md:gap-20"
                            animate={
                                isAppInView
                                    ? { x: ['-50%', '0%'] }
                                    : { x: '-50%' }
                            }
                            transition={{
                                repeat: Infinity,
                                duration: 45,
                                ease: 'easeIn',
                            }}
                        >
                            <div className="flex gap-16 px-4 md:gap-25 md:px-6">
                                {appIcons.map((Icon, index) => (
                                    <div
                                        key={`set3-${index}`}
                                        className="flex size-16 items-center justify-center md:size-24"
                                    >
                                        <Icon />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-16 px-4 md:gap-25 md:px-6">
                                {appIcons.map((Icon, index) => (
                                    <div
                                        key={`set4-${index}`}
                                        className="flex size-16 items-center justify-center md:size-24"
                                    >
                                        <Icon />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
