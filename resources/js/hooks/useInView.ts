import type { RefObject } from 'react';
import { useState, useEffect } from 'react';

interface UseInViewOptions {
    once?: boolean;
    margin?: string;
    amount?: number | 'all' | 'some';
}

export function useInView(
    ref: RefObject<Element | null>,
    options: UseInViewOptions = {}
): boolean {
    const { once = false, margin = '0px', amount = 0 } = options;
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = ref.current;

        if (!el) {
return;
}

        if (once && isInView) {
return;
}

        let threshold = 0;

        if (typeof amount === 'number') {
            threshold = amount;
        } else if (amount === 'all') {
            threshold = 1.0;
        } else if (amount === 'some') {
            threshold = 0.1;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);

                if (entry.isIntersecting && once) {
                    observer.disconnect();
                }
            },
            {
                rootMargin: margin,
                threshold,
            }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [ref, once, margin, amount, isInView]);

    return isInView;
}
