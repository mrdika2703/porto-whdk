import { useState, useEffect } from 'react';

/**
 * Hook untuk mendeteksi apakah device adalah mobile (< 768px).
 * Digunakan untuk mematikan animasi berat di mobile demi performa.
 */
export function useIsMobile(breakpoint = 768): boolean {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < breakpoint;
    });

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

        setIsMobile(mql.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [breakpoint]);

    return isMobile;
}
