import { animated, useSpring } from '@react-spring/web';
import { useState, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

const direct = [
    {
        name: 'Graphic Design',
        href: '#design',
        icon: 'fa-regular fa-circle-right',
        color: 'text-bshine',
        bg: 'bg-main shadow-bshine hover:bg-bshine/5',
    },
    {
        name: 'Photo Video',
        href: '#photo',
        icon: 'fa-regular fa-circle-right',
        color: 'text-white',
        bg: 'bg-bshine shadow-hbshine hover:brightness-105',
    },
    {
        name: 'Website',
        href: '#website',
        icon: 'fa-regular fa-circle-right',
        color: 'text-bshine',
        bg: 'bg-main shadow-bshine hover:bg-bshine/5',
    },
    {
        name: 'Others',
        href: '#others',
        icon: 'fa-regular fa-circle-right',
        color: 'text-white',
        bg: 'bg-bshine shadow-hbshine hover:brightness-105',
    },
];

interface DirectCardProps {
    item: typeof direct[0];
    index: number;
    isInView: boolean;
}

function DirectCard({ item, index, isInView }: DirectCardProps) {
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);

    // Combine entrance with hover and active states
    const springProps = useSpring({
        opacity: isInView ? 1 : 0,
        transform: active
            ? 'scale(0.98) translateY(0px)'
            : hovered
            ? 'scale(1.05) translateY(-2px)'
            : isInView
            ? 'scale(1) translateY(0px)'
            : 'scale(1) translateY(40px)',
        delay: isInView ? index * 100 : 0,
        config: { tension: 300, friction: 20 },
    });

    return (
        <animated.div
            style={springProps}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                setActive(false);
            }}
            onMouseDown={() => setActive(true)}
            onMouseUp={() => setActive(false)}
            className={`${item.bg} flex cursor-pointer rounded-xl border-2 border-bshine px-4 py-3 shadow-[2px_5px_0px_rgba(0,0,0,1)] transition-all`}
        >
            <a
                href={item.href}
                className={`flex w-full items-center justify-between text-xs font-semibold md:text-base ${item.color}`}
            >
                {item.name}
                <i className={`ml-2 ${item.icon}`}></i>
            </a>
        </animated.div>
    );
}

export default function DirectSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    const headerSpring = useSpring({
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0px)' : 'translateY(30px)',
        config: { tension: 280, friction: 60 },
    });

    return (
        <>
            <section
                id="direct"
                ref={sectionRef}
                className="min-h-5xl relative my-10 w-full py-30"
            >
                <div className="pointer-events-none absolute top-0.5 left-0 hidden h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-bshine/10 blur-[120px] md:block"></div>
                <div className="pointer-events-none absolute top-3/4 right-0 hidden h-[400px] w-[400px] translate-x-1/3 rounded-full bg-bshine/10 blur-[100px] md:block"></div>

                <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-8 md:px-12">
                    <animated.div
                        style={headerSpring}
                        className="flex justify-center text-center"
                    >
                        <h2 className="text-2xl font-bold text-bshine">
                            <span className="text-tmain">Quick Direct </span>
                            Portofolio
                        </h2>
                    </animated.div>

                    <div className="grid grid-cols-2 justify-center gap-5 overflow-visible sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                        {direct.map((item, index) => (
                            <DirectCard
                                key={index}
                                item={item}
                                index={index}
                                isInView={isInView}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
