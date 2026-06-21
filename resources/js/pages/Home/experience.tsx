import { animated, useSpring, useTrail, useTransition } from '@react-spring/web';
import { useState, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import type { Experience, Education } from './index';

const getMonthYear = (dateString: string | null) => {
    if (!dateString) {
return '';
}

    const date = new Date(dateString);

    return date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
};

interface CardProps {
    item: Experience | Education;
    expanded: boolean;
    onToggle: () => void;
    isHovered: boolean;
    onHover: (hovered: boolean) => void;
}

function JourneyCard({ item, expanded, onToggle, isHovered, onHover }: CardProps) {
    const isOpen = expanded || isHovered;

    // Chevron rotation spring
    const chevronSpring = useSpring({
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        config: { duration: 200 },
    });

    // Content collapse transition
    const contentTransition = useTransition(isOpen, {
        from: { height: 0, opacity: 0 },
        enter: { height: 'auto', opacity: 1 },
        leave: { height: 0, opacity: 0 },
        config: { duration: 150 },
    });

    return (
        <div
            className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:backdrop-blur-sm transition-all duration-300 group-hover:border-white/10 group-hover:bg-white/[0.04] group-hover:shadow-xl"
            onClick={onToggle}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            <span className="inline-block w-fit rounded-full bg-bshine/20 px-3 py-1 text-xs font-medium text-white/80">
                {getMonthYear(item.start_date)}
                {item.end_date !== null
                    ? ' - ' + getMonthYear(item.end_date)
                    : ''}
            </span>
            <div className="mt-1 flex items-center justify-between">
                <h4 className="text-lg font-bold text-white md:text-xl">
                    {item.title}
                </h4>
                <animated.span
                    style={chevronSpring}
                    className="inline-block"
                >
                    <i className="fa-solid fa-chevron-down text-xs text-gray-400" />
                </animated.span>
            </div>
            <h5 className="text-sm font-medium text-gray-400 italic">
                {item.origin}
            </h5>
            {contentTransition((styles, show) => show && (
                <animated.div
                    style={styles}
                    className="overflow-hidden"
                >
                    <p className="mt-2 text-sm leading-relaxed text-gray-300">
                        {item.description}
                    </p>
                </animated.div>
            ))}
        </div>
    );
}

export default function ExperienceEducationSection({
    experiences,
    educations,
}: {
    experiences: Experience[];
    educations: Education[];
}) {
    const [expandedExp, setExpandedExp] = useState<number | null>(null);
    const [expandedEdu, setExpandedEdu] = useState<number | null>(null);
    const [hoveredExp, setHoveredExp] = useState<number | null>(null);
    const [hoveredEdu, setHoveredEdu] = useState<number | null>(null);

    // Header animation
    const headerRef = useRef<HTMLDivElement>(null);
    const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
    const headerSpring = useSpring({
        opacity: isHeaderInView ? 1 : 0,
        transform: isHeaderInView ? 'translateY(0px)' : 'translateY(30px)',
        config: { tension: 280, friction: 60 },
        delay: 200,
    });

    // Columns animations
    const expRef = useRef<HTMLDivElement>(null);
    const isExpInView = useInView(expRef, { once: true, amount: 0.2 });

    const expLineSpring = useSpring({
        height: isExpInView ? '100%' : '0%',
        config: { duration: 1500 },
    });

    const expTrail = useTrail(experiences.length, {
        opacity: isExpInView ? 1 : 0,
        transform: isExpInView ? 'translateX(0px)' : 'translateX(-30px)',
        config: { tension: 280, friction: 60 },
    });

    const eduRef = useRef<HTMLDivElement>(null);
    const isEduInView = useInView(eduRef, { once: true, amount: 0.2 });

    const eduLineSpring = useSpring({
        height: isEduInView ? '100%' : '0%',
        config: { duration: 1500 },
    });

    const eduTrail = useTrail(educations.length, {
        opacity: isEduInView ? 1 : 0,
        transform: isEduInView ? 'translateX(0px)' : 'translateX(-30px)',
        config: { tension: 280, friction: 60 },
    });

    return (
        <section
            id="journey"
            className="relative overflow-hidden pb-24 text-white"
        >
            {/* Latar Belakang Glow Ambient — hidden di mobile untuk performa */}
            <div className="pointer-events-none absolute top-1/4 left-0 hidden h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-bshine/10 blur-[120px] md:block"></div>
            <div className="pointer-events-none absolute top-3/4 right-0 hidden h-[400px] w-[400px] translate-x-1/3 rounded-full bg-bshine/10 blur-[100px] md:block"></div>

            <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 md:px-12">
                {/* --- HEADER --- */}
                <animated.div
                    ref={headerRef}
                    style={headerSpring}
                    className="flex flex-row items-center justify-center gap-4 text-center md:justify-between md:text-left"
                >
                    <div className="relative flex items-center">
                        <h2 className="text-3xl font-bold tracking-wide">
                            My{' '}
                            <span className="bg-bshine bg-clip-text text-transparent">
                                Journey
                            </span>
                        </h2>
                        <img
                            src="/assets/icons/slay_light.svg"
                            alt="Decoration light"
                            className="absolute top-0 -right-12 h-8 w-8 rotate-12 transform dark:hidden"
                        />
                        <img
                            src="/assets/icons/slay_dark.svg"
                            alt="Decoration dark"
                            className="absolute top-0 -right-12 hidden h-8 w-8 rotate-12 transform dark:block"
                        />
                    </div>
                    <p className="hidden text-base font-light text-gray-300 md:block">
                        Experience & Education
                    </p>
                </animated.div>

                {/* --- KONTEN TIMELINE KIRI KANAN --- */}
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
                    {/* KOLOM PENGALAMAN */}
                    <div
                        ref={expRef}
                        className="flex flex-col gap-10"
                    >
                        <h3 className="flex items-center gap-3 text-xl font-semibold text-white">
                            <i className="fa-solid fa-briefcase text-bshine"></i>{' '}
                            Experience
                        </h3>

                        <div className="relative pl-4 md:pl-6">
                            {/* Garis Vertikal Timeline */}
                            <animated.div
                                style={expLineSpring}
                                className="absolute top-2 bottom-0 left-[7px] w-[2px] rounded-full bg-gradient-to-b from-bshine via-bshine/50 to-transparent md:left-[11px]"
                            />

                            {/* Item Timeline */}
                            {expTrail.map((styles, index) => {
                                const item = experiences[index];

                                return (
                                    <animated.div
                                        key={item.id}
                                        style={styles}
                                        className="group relative mb-12 pl-10 last:mb-0 md:pl-12"
                                    >
                                        {/* Bullet Point / Dot */}
                                        <div className="absolute top-1.5 left-[-5px] h-4 w-4 rounded-full border-4 border-[#050015] bg-bshine transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(192,104,0,0.6)] group-hover:brightness-130 md:left-[-1px] dark:group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]" />

                                        {/* Konten Card */}
                                        <JourneyCard
                                            item={item}
                                            expanded={expandedExp === item.id}
                                            onToggle={() =>
                                                setExpandedExp(
                                                    expandedExp === item.id
                                                        ? null
                                                        : item.id,
                                                )
                                            }
                                            isHovered={hoveredExp === item.id}
                                            onHover={(hov) => setHoveredExp(hov ? item.id : null)}
                                        />
                                    </animated.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* KOLOM PENDIDIKAN */}
                    <div
                        ref={eduRef}
                        className="flex flex-col gap-10"
                    >
                        <h3 className="flex items-center gap-3 text-xl font-semibold text-white">
                            <i className="fa-solid fa-graduation-cap text-bshine"></i>{' '}
                            Education
                        </h3>

                        <div className="relative pl-4 md:pl-6">
                            {/* Garis Vertikal Timeline */}
                            <animated.div
                                style={eduLineSpring}
                                className="absolute top-2 bottom-0 left-[7px] w-[2px] rounded-full bg-gradient-to-b from-bshine via-bshine/50 to-transparent md:left-[11px]"
                            />

                            {/* Item Timeline */}
                            {eduTrail.map((styles, index) => {
                                const item = educations[index];

                                return (
                                    <animated.div
                                        key={item.id}
                                        style={styles}
                                        className="group relative mb-12 pl-10 last:mb-0 md:pl-12"
                                    >
                                        {/* Bullet Point / Dot */}
                                        <div className="absolute top-1.5 left-[-5px] h-4 w-4 rounded-full border-4 border-[#050015] bg-bshine transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(192,104,0,0.6)] group-hover:brightness-130 md:left-[-1px] dark:group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]" />

                                        {/* Konten Card */}
                                        <JourneyCard
                                            item={item}
                                            expanded={expandedEdu === item.id}
                                            onToggle={() =>
                                                setExpandedEdu(
                                                    expandedEdu === item.id
                                                        ? null
                                                        : item.id,
                                                )
                                            }
                                            isHovered={hoveredEdu === item.id}
                                            onHover={(hov) => setHoveredEdu(hov ? item.id : null)}
                                        />
                                    </animated.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
