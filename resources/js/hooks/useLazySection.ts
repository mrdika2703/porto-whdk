import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook untuk lazy-render section berat.
 * Menggunakan callback ref agar IntersectionObserver dapat dilekatkan ulang
 * ketika komponen unmount/remount (misal akibat pergantian viewMode).
 */
export function useLazySection(rootMargin = '200px') {
    const [shouldRender, setShouldRender] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const refCallback = useCallback((node: HTMLDivElement | null) => {
        // Putuskan koneksi observer sebelumnya jika ada
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }

        // Jika node kosong atau section sudah dirender, abaikan
        if (!node || shouldRender) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldRender(true);
                    observer.disconnect();
                    observerRef.current = null;
                }
            },
            { rootMargin },
        );

        observer.observe(node);
        observerRef.current = observer;
    }, [rootMargin, shouldRender]);

    // Bersihkan observer saat komponen utama benar-benar unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return { ref: refCallback, shouldRender };
}
