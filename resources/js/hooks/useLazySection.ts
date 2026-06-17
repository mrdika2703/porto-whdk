import { useState, useEffect, useRef } from 'react';

/**
 * Hook untuk lazy-render section berat.
 * Section hanya di-mount saat mendekati viewport (dengan rootMargin).
 * Sekali terlihat, section tetap di-mount (tidak di-unmount).
 */
export function useLazySection(rootMargin = '200px'): {
    ref: React.RefObject<HTMLDivElement | null>;
    shouldRender: boolean;
} {
    const ref = useRef<HTMLDivElement | null>(null);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || shouldRender) return;

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
    }, [rootMargin, shouldRender]);

    return { ref, shouldRender };
}
