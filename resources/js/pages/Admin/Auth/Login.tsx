import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import { BgPhotograph } from '@/components/bg-photograph';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [isDark, setIsDark] = useState(false);

    // 1. Logika Theme (Otomatis & Membaca LocalStorage)
    useEffect(() => {
        const root = document.documentElement;
        const storedTheme = localStorage.getItem('theme');

        if (storedTheme === 'dark') {
            root.classList.add('dark');
            setIsDark(true);
        } else if (storedTheme === 'light') {
            root.classList.remove('dark');
            setIsDark(false);
        } else {
            // Auto-Dark Mode berdasarkan jam (18.00 - 05.59)
            const currentHour = new Date().getHours();
            if (currentHour >= 18 || currentHour < 6) {
                root.classList.add('dark');
                setIsDark(true);
            } else {
                root.classList.remove('dark');
                setIsDark(false);
            }
        }

        // Membersihkan password dari state saat unmount
        return () => {
            reset('password');
        };
    }, []);

    // 2. Fungsi Toggle Theme Manual
    const toggleTheme = () => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="relative flex min-h-screen w-full bg-main transition-colors duration-300 dark:bg-[#050015]">
            <Head title="Admin Login - Portofolio" />

            {/* SISI KIRI: Background Polos + Pattern & Teks Tengah */}
            <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-amber-50 lg:flex dark:bg-[#03000d]">
                {/* Komponen Pattern SVG */}
                <div className="absolute inset-0 z-0 h-full w-full scale-200">
                    <BgPhotograph className="h-full w-full object-cover text-amber-900 dark:text-cyan-600" />
                </div>

                {/* Konten Judul Ditengah */}
                <div className="relative z-10 flex flex-col items-center justify-center px-12 text-center">
                    <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-amber-900 dark:text-cyan-500">
                        Admin Portofolio
                    </h1>
                    <h2 className="text-2xl font-medium text-amber-800/90 dark:text-cyan-600/90">
                        Wahyu Adam Anandika
                    </h2>
                    <div className="mt-6 h-1 w-16 rounded-full bg-accent"></div>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-amber-900/70 dark:text-cyan-600/70">
                        Sistem manajemen konten portofolio interaktif. Kelola
                        pengalaman, keahlian, dan karya visual Anda di satu
                        tempat yang tersentralisasi.
                    </p>
                </div>
            </div>

            {/* SISI KANAN: Form Input Kredensial */}
            <div className="flex w-full flex-col justify-center bg-bcard px-8 sm:px-16 lg:w-1/2 xl:px-32">
                <div className="mx-auto w-full max-w-md">
                    {/* Header Mobile: Muncul saat di HP menggantikan sisi kiri */}
                    <div className="mb-10 text-center lg:hidden">
                        <h1 className="text-2xl font-extrabold text-htext dark:text-tmain">
                            Admin{' '}
                            <span className="text-accent">Portofolio</span>
                        </h1>
                        <p className="mt-1 text-sm text-tmuted">
                            Wahyu Adam Anandika
                        </p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-htext dark:text-tmain">
                            Selamat Datang
                        </h2>
                        <p className="mt-2 text-sm text-tmuted">
                            Silakan masukkan kredensial Anda untuk masuk ke
                            panel manajemen.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                <i className="fa-regular fa-envelope mr-1"></i>{' '}
                                Alamat Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                placeholder="admin@example.com"
                                autoComplete="username"
                                autoFocus
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                <i className="fa-solid fa-lock mr-1"></i>{' '}
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-bmain/30 bg-main/40 text-accent focus:ring-accent"
                                />
                                <span className="text-sm font-medium text-tmuted">
                                    Ingat Saya
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-bshine px-6 py-3 text-sm font-bold text-white shadow-lg shadow-bshine/30 transition-all duration-200 hover:bg-hbshine hover:shadow-hbshine/40 disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <i className="fa-solid fa-spinner animate-spin"></i>{' '}
                                    Memverifikasi...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-right-to-bracket"></i>{' '}
                                    Masuk ke Panel
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* TOMBOL SWITCH THEME MELAYANG */}
            <button
                onClick={toggleTheme}
                className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-bmain/20 bg-bcard text-tmuted shadow-xl transition-all duration-300 hover:scale-110 hover:text-accent"
                title={
                    isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'
                }
            >
                {isDark ? (
                    <i className="fa-solid fa-sun text-xl"></i>
                ) : (
                    <i className="fa-solid fa-moon text-xl"></i>
                )}
            </button>
        </div>
    );
}
