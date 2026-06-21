import { animated, useSpring, useTrail } from '@react-spring/web';
import { useRef } from 'react';
import { PhotoshopIcon, LightroomIcon } from '@/components/icons';
import { useInView } from '@/hooks/useInView';
import type { Skill } from './index';

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

    const appRef = useRef<HTMLDivElement>(null);
    const isAppInView = useInView(appRef, { margin: '0px 0px -50px 0px' });

    // Header Skills Animation
    const headerRef = useRef<HTMLDivElement>(null);
    const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
    const headerSpring = useSpring({
        opacity: isHeaderInView ? 1 : 0,
        transform: isHeaderInView ? 'translateY(0px)' : 'translateY(30px)',
        config: { tension: 280, friction: 60 },
        delay: 200,
    });

    // Staggered Skills List Animation
    const gridRef = useRef<HTMLDivElement>(null);
    const isGridInView = useInView(gridRef, { once: true, amount: 0.2 });
    const skillsTrail = useTrail(skills.length, {
        opacity: isGridInView ? 1 : 0,
        transform: isGridInView ? 'scale(1) translateY(0px)' : 'scale(0.8) translateY(20px)',
        config: { mass: 1, tension: 280, friction: 24 },
    });

    // Application Marquees Animation
    const marquee1 = useSpring({
        from: { x: 0 },
        to: { x: -50 },
        reset: true,
        reverse: false,
        loop: true,
        config: { duration: 40000 },
        pause: !isAppInView,
    });

    const marquee2 = useSpring({
        from: { x: -50 },
        to: { x: 0 },
        reset: true,
        reverse: false,
        loop: true,
        config: { duration: 45000 },
        pause: !isAppInView,
    });

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
                <div ref={headerRef} className="mb-10 md:mb-12">
                    <animated.div
                        style={headerSpring}
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
                    </animated.div>
                </div>

                <section>
                    {/* Grid/Flex Container */}
                    <div
                        ref={gridRef}
                        className="mt-4 grid grid-cols-2 gap-3 md:flex md:flex-wrap md:items-center md:justify-between md:gap-x-2 md:gap-y-7 md:after:w-[20%] md:after:flex-auto md:after:content-['']"
                    >
                        {skillsTrail.map((styles, index) => {
                            const skillItem = skills[index];

                            return (
                                <animated.div
                                    key={index}
                                    style={styles}
                                    className="relative flex h-[34px] w-full items-center gap-0 md:h-8 md:w-auto"
                                >
                                    {/* Nama Skill */}
                                    <span className="flex h-full flex-1 items-center truncate rounded-l-full border-y border-l border-white/50 bg-white/10 px-2 text-white md:backdrop-blur-sm md:px-3.5">
                                        <span className="mr-1.5 shrink-0 md:mr-2">
                                            <i className={skillItem.icon ?? undefined}></i>
                                        </span>
                                        <span className="truncate text-[10px] font-normal sm:text-xs">
                                            {skillItem.name_skills}
                                        </span>
                                    </span>

                                    {/* Level Skill */}
                                    <span className="flex h-full shrink-0 items-center rounded-r-full border-y border-r border-white/50 bg-white/20 px-2 md:backdrop-blur-sm md:px-3.5">
                                        <span className="text-[10px] font-medium text-white sm:text-xs">
                                            {skillItem.level}
                                        </span>
                                    </span>
                                </animated.div>
                            );
                        })}
                    </div>
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
                        <animated.div
                            style={{
                                transform: marquee1.x.to(val => `translateX(${val}%)`),
                            }}
                            className="flex w-max gap-12 md:gap-20 will-change-transform"
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
                        </animated.div>
                    </div>

                    {/* Baris Animasi 2 */}
                    <div className="flex w-full border border-x-transparent border-y-white/15 py-5 md:py-7">
                        <animated.div
                            style={{
                                transform: marquee2.x.to(val => `translateX(${val}%)`),
                            }}
                            className="flex w-max gap-12 md:gap-20 will-change-transform"
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
                        </animated.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
