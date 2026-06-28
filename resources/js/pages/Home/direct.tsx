import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const direct = [
    {
        name: 'Graphic Design',
        href: '#design',
        icon: 'fa-regular fa-circle-right',
        color: 'text-bshine',
        bg: 'bg-main shadow-bshine hover:bg-bshine/5 border-bshine',
        modes: ['All', 'Multimedia'] as const,
    },
    {
        name: 'Photo Video',
        href: '#photo',
        icon: 'fa-regular fa-circle-right',
        color: 'text-white',
        bg: 'bg-bshine dark:bg-hbshine shadow-hbshine dark:shadow-[#078293] hover:brightness-105 border-hbshine dark:border-[#078293]',
        modes: ['All', 'Multimedia'] as const,
    },
    {
        name: 'Website',
        href: '#website',
        icon: 'fa-regular fa-circle-right',
        color: 'text-bshine',
        bg: 'bg-main shadow-bshine hover:bg-bshine/5 border-bshine',
        modes: ['All', 'Programming'] as const,
    },
    {
        name: 'Others',
        href: '#other',
        icon: 'fa-regular fa-circle-right',
        color: 'text-white',
        bg: 'bg-bshine dark:bg-hbshine shadow-hbshine dark:shadow-[#078293] hover:brightness-105 border-hbshine dark:border-[#078293]',
        modes: ['All', 'Multimedia', 'Programming'] as const,
    },
];

export default function DirectSection({
    viewMode = 'All',
}: {
    viewMode?: 'All' | 'Multimedia' | 'Programming';
}) {
    const filteredDirect = useMemo(
        () =>
            direct.filter((item) =>
                (item.modes as readonly string[]).includes(viewMode),
            ),
        [viewMode],
    );

    return (
        <>
            <section
                id="direct"
                className="min-h-5xl relative my-25 w-full py-30"
            >
                <div className="pointer-events-none absolute top-0.5 left-0 hidden h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-bshine/10 blur-[120px] md:block"></div>
                <div className="pointer-events-none absolute top-3/4 right-0 hidden h-[400px] w-[400px] translate-x-1/3 rounded-full bg-bshine/10 blur-[100px] md:block"></div>

                <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-8 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center text-center"
                    >
                        <h2 className="font-montserrat-alt text-5xl font-bold text-bshine">
                            <span className="text-tmain">Quick Direct </span>
                            Portofolio
                        </h2>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-5 overflow-visible">
                        {filteredDirect.map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className={`${item.bg} w-[calc(50%-10px)] md:w-[calc(25%-15px)] flex justify-center cursor-pointer rounded-xl border-2 px-4 py-3 shadow-[2px_5px_0px_rgba(0,0,0,1)] transition-all hover:scale-102`}
                            >
                                <a
                                    href={item.href}
                                    className={`flex w-full items-center justify-between text-xs font-semibold md:text-base ${item.color}`}
                                >
                                    {item.name}
                                    <i className={`ml-2 ${item.icon}`}></i>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
