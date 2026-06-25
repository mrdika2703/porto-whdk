import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import {
    motion,
    useInView,
    Variants,
    useMotionValue,
    animate,
} from 'framer-motion';
import {
    PhotoshopIcon,
    LightroomIcon,
    AfterEffctIcon,
    IllustratorIcon,
    CanvaIcon,
    CorellIcon,
    PremiereIcon,
    OfficeIcon,
    ExcelIcon,
    PowerpointIcon,
    FigmaIcon,
    TailwindIcon,
    GitIcon,
    GithubIcon,
    ReactIcon,
    PhpIcon,
    JsIcon,
    LaravelIcon,
    HtmlIcon,
    CssIcon,
    MysqlIcon,
    PgsqlIcon,
    PythonIcon,
    NodeJsIcon,
    ApiIcon,
} from '@/components/icons';
import { Skill } from './index';
import { Underline } from '@/components/underline';

function MarqueeRow({
    children,
    direction = 'left',
    speed = 40,
    isAppInView,
}: {
    children: React.ReactNode;
    direction?: 'left' | 'right';
    speed?: number;
    isAppInView: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [loopWidth, setLoopWidth] = useState(0);
    const activeAnimation = useRef<any>(null);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                // Lebar satu loop adalah setengah dari total lebar container (karena ada 2 set data)
                setLoopWidth(containerRef.current.offsetWidth / 2);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const normalizeX = (val: number, width: number) => {
        if (width === 0) return val;
        const mod = val % width;
        return mod > 0 ? mod - width : mod;
    };

    useEffect(() => {
        if (!isAppInView || isHovered || isDragging || loopWidth === 0) {
            if (activeAnimation.current) {
                activeAnimation.current.stop();
                activeAnimation.current = null;
            }
            return;
        }

        const target = direction === 'left' ? -loopWidth : 0;
        const startVal = x.get();

        let currentX = startVal;
        if (direction === 'left' && currentX <= -loopWidth) {
            currentX = 0;
            x.set(0);
        } else if (direction === 'right' && currentX >= 0) {
            currentX = -loopWidth;
            x.set(-loopWidth);
        }

        const distance = Math.abs(target - currentX);
        const currentDuration = speed * (distance / loopWidth);

        activeAnimation.current = animate(x, [currentX, target], {
            ease: 'linear',
            duration: currentDuration,
            onComplete: () => {
                const resetVal = direction === 'left' ? 0 : -loopWidth;
                const nextTarget = direction === 'left' ? -loopWidth : 0;
                x.set(resetVal);

                activeAnimation.current = animate(x, [resetVal, nextTarget], {
                    ease: 'linear',
                    duration: speed,
                    repeat: Infinity,
                    repeatType: 'loop',
                });
            },
        });

        return () => {
            if (activeAnimation.current) {
                activeAnimation.current.stop();
            }
        };
    }, [isAppInView, isHovered, isDragging, loopWidth, direction, speed]);

    const handleDragEnd = () => {
        setIsDragging(false);
        if (loopWidth > 0) {
            const currentX = x.get();
            const normalized = normalizeX(currentX, loopWidth);
            x.set(normalized);
        }
    };

    return (
        <div className="flex w-full overflow-hidden select-none">
            <motion.div
                ref={containerRef}
                className="flex w-max cursor-grab gap-12 will-change-transform active:cursor-grabbing md:gap-20"
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -loopWidth, right: 0 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                {children}
            </motion.div>
        </div>
    );
}

export default function Skills({ skills = [] }: { skills: Skill[] }) {
    const MultiIcons = [
        PhotoshopIcon,
        LightroomIcon,
        AfterEffctIcon,
        IllustratorIcon,
        CanvaIcon,
        CorellIcon,
        PremiereIcon,
        OfficeIcon,
        ExcelIcon,
        PowerpointIcon,
    ];

    const CodeIcons = [
        FigmaIcon,
        TailwindIcon,
        GitIcon,
        GithubIcon,
        ReactIcon,
        PhpIcon,
        JsIcon,
        LaravelIcon,
        HtmlIcon,
        CssIcon,
        MysqlIcon,
        PgsqlIcon,
        PythonIcon,
        NodeJsIcon,
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
                            amount: 0.2,
                        }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeOut',
                            delay: 0.2,
                        }}
                        className="relative flex items-center gap-4"
                    >
                        <h3 className="relative font-montserrat-alt text-3xl font-semibold text-white">
                            Skills
                            <Underline className="absolute -right-2 -bottom-1 text-bshine" />
                        </h3>
                    </motion.div>
                </div>

                <section>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.2,
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
                                <span className="flex h-full flex-1 items-center truncate rounded-l-full border-y border-l border-white/50 bg-white/10 px-2 text-white md:px-3.5 md:backdrop-blur-sm">
                                    <span className="mr-1.5 shrink-0 md:mr-2">
                                        <i
                                            className={skills.icon ?? undefined}
                                        ></i>
                                    </span>
                                    <span className="truncate text-[10px] font-normal sm:text-xs">
                                        {skills.name_skills}
                                    </span>
                                </span>

                                {/* Level Skill */}
                                {/* shrink-0 agar level tidak menyusut tertekan teks nama */}
                                <span className="flex h-full shrink-0 items-center rounded-r-full border-y border-r border-white/50 bg-white/20 px-2 md:px-3.5 md:backdrop-blur-sm">
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
                className="mt-14 overflow-hidden px-6 py-7 md:mt-25 md:px-15"
            >
                <div className="mx-auto flex flex-col items-center">
                    {/* Baris Animasi 1 */}
                    <div className="relative mt-10 flex w-full border border-x-transparent border-y-white/15 py-8 md:py-12">
                        <p className="absolute -top-3.5 right-0 bg-sectiondark px-4 text-xs font-light tracking-wide text-white italic md:text-base">
                            Multimedia Apps
                        </p>
                        <MarqueeRow
                            direction="left"
                            speed={40}
                            isAppInView={isAppInView}
                        >
                            <div className="flex gap-16 px-4 md:gap-30 md:px-6">
                                {MultiIcons.map((Icon, index) => (
                                    <div
                                        key={`set1-${index}`}
                                        className="flex size-8 items-center justify-center md:size-16"
                                    >
                                        <Icon />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-16 px-4 md:gap-30 md:px-6">
                                {MultiIcons.map((Icon, index) => (
                                    <div
                                        key={`set2-${index}`}
                                        className="flex size-8 items-center justify-center md:size-16"
                                    >
                                        <Icon />
                                    </div>
                                ))}
                            </div>
                        </MarqueeRow>
                    </div>

                    {/* Baris Animasi 2 */}
                    <div className="relative flex w-full border border-x-transparent border-y-white/15 py-8 md:py-12">
                        <p className="absolute -top-3.5 left-0 bg-sectiondark px-4 text-xs font-light tracking-wide text-white italic md:text-base">
                            Coding Apps
                        </p>
                        <MarqueeRow
                            direction="right"
                            speed={45}
                            isAppInView={isAppInView}
                        >
                            <div className="pointer-none flex gap-16 px-4 md:gap-30 md:px-6">
                                {CodeIcons.map((Icon, index) => (
                                    <div
                                        key={`set3-${index}`}
                                        className="flex size-8 items-center justify-center md:size-16"
                                    >
                                        <Icon />
                                    </div>
                                ))}
                            </div>
                            <div className="pointer-none flex gap-16 px-4 md:gap-30 md:px-6">
                                {CodeIcons.map((Icon, index) => (
                                    <div
                                        key={`set4-${index}`}
                                        className="flex size-8 items-center justify-center md:size-16"
                                    >
                                        <Icon />
                                    </div>
                                ))}
                            </div>
                        </MarqueeRow>
                    </div>
                </div>
            </section>
        </div>
    );
}
