import { useState, useEffect } from 'react';

/**
 * Hook untuk lazy-render section berat.
 * Section hanya di-mount saat mendekati viewport (dengan rootMargin).
 * Sekali terlihat, section tetap di-mount (tidak di-unmount).
 */
export function useLazySection(
    ref: React.RefObject<Element | null>,
    rootMargin = '200px'
): boolean {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const el = ref.current;

        if (!el || shouldRender) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldRender(true);
                    observer.disconnect();
                }
            },
            { rootMargin },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [ref, rootMargin, shouldRender]);

    return shouldRender;
}
