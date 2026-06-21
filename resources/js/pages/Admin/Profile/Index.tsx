import { Head, useForm } from '@inertiajs/react';
import type { FormEvent} from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { store, update } from '@/routes/admin/profiles';
import LayoutAdmin from '../Layout/AdminLayout';

interface ProfileData {
    id?: number;
    user_id: number;
    name: string;
    nickname: string;
    passion: string;
    about: string;
    caption: string;
    description: string | null;
    ttl: string;
    photo: string | File | null;
    whatsapp: string;
    email: string;
    linkedin: string;
    linkedin_name: string;
    instagram: string;
    github: string;
}

interface IndexProps {
    profile: ProfileData | null;
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function Index({ profile, flash }: IndexProps) {
    // Inisialisasi useForm Inertia dengan data awal dari backend jika ada
    const { data, setData, post, processing, errors, transform } =
        useForm<ProfileData>({
            name: profile?.name ?? '',
            nickname: profile?.nickname ?? '',
            passion: profile?.passion ?? '',
            about: profile?.about ?? '',
            caption: profile?.caption ?? '',
            description: profile?.description ?? '',
            ttl: profile?.ttl ?? '',
            photo: null, // Dikirim ulang hanya jika user mengganti file foto
            whatsapp: profile?.whatsapp ?? '',
            email: profile?.email ?? '',
            linkedin: profile?.linkedin ?? '',
            linkedin_name: profile?.linkedin_name ?? '',
            instagram: profile?.instagram ?? '',
            github: profile?.github ?? '',
            user_id: profile?.user_id ?? 1,
        });

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: 'success',
                title: flash.success,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }

        if (flash.error) {
            Swal.fire({
                icon: 'error',
                title: flash.error,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
            });
        }
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: (page: any) => {
                if (page.props.flash?.success) {
                    Swal.fire({
                        icon: 'success',
                        title: page.props.flash.success,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });
                }

                if (page.props.flash?.error) {
                    Swal.fire({
                        icon: 'error',
                        title: page.props.flash.error,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true,
                    });
                }
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Menyimpan',
                    text: 'Harap periksa kembali input form Anda.',
                    confirmButtonColor: '#ef4444',
                });
            },
        };

        if (profile?.id) {
            // Karena method PUT pada multipart/form-data sering bermasalah di Laravel,
            // kita kirim via POST dengan trik routing Laravel atau langsung ke rute POST kustom kita.
            post(update.url(profile.id), options);
        } else {
            post(store.url(), options);
        }
    };

    return (
        <LayoutAdmin>
            <Head title="Kelola Profil" />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-htext dark:text-tmain">
                        Manajemen Profil
                    </h2>
                    <p className="mt-1 text-sm text-tmuted">
                        {profile
                            ? 'Perbarui data identitas portofolio utama Anda.'
                            : 'Silakan buat data profil dasar Anda terlebih dahulu.'}
                    </p>
                </div>
                {profile && (
                    <div className="flex items-center gap-2 self-start rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-500">
                        <i className="fa-solid fa-circle-check"></i> Terhubung
                        (ID: {profile.id})
                    </div>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-8"
                encType="multipart/form-data"
            >
                {/* GRID UTAMA FORM */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* BAGIAN KIRI: Foto & Identitas Inti */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm">
                            <h3 className="text-md mb-4 border-b border-bmain/20 pb-3 font-bold text-htext dark:text-tmain">
                                <i className="fa-solid fa-camera-retro mr-2 text-accent"></i>{' '}
                                Foto Utama
                            </h3>

                            <div className="flex flex-col items-center justify-center space-y-4">
                                {profile?.photo && !data.photo && (
                                    <div className="group relative h-36 w-36 overflow-hidden rounded-full border-2 border-accent/40 p-1">
                                        <img
                                            src={`/storage/${profile.photo}`}
                                            alt="Profil saat ini"
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="w-full">
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                        Unggah Foto Baru
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setData(
                                                'photo',
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                        className="w-full cursor-pointer text-xs text-tmuted file:mr-4 file:rounded-xl file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-accent hover:file:bg-accent/20"
                                    />
                                    {errors.photo && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm">
                            <h3 className="text-md border-b border-bmain/20 pb-3 font-bold text-htext dark:text-tmain">
                                <i className="fa-solid fa-id-card mr-2 text-accent"></i>{' '}
                                Informasi Dasar
                            </h3>

                            <div>
                                <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                        Nama Panggilan
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={10}
                                        value={data.nickname}
                                        onChange={(e) =>
                                            setData('nickname', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                        placeholder="Max 10 huruf"
                                    />
                                    {errors.nickname && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.nickname}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                        Tanggal Lahir
                                    </label>
                                    <input
                                        type="date"
                                        value={data.ttl}
                                        onChange={(e) =>
                                            setData('ttl', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                    />
                                    {errors.ttl && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.ttl}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                    Passion / Fokus Karir
                                </label>
                                <input
                                    type="text"
                                    value={data.passion}
                                    onChange={(e) =>
                                        setData('passion', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                    placeholder="Contoh: Web Developer & UI Designer"
                                />
                                {errors.passion && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.passion}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BAGIAN KANAN: Narasi & Informasi Sosial Media */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Blok Deskripsi */}
                        <div className="space-y-4 rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm">
                            <h3 className="text-md border-b border-bmain/20 pb-3 font-bold text-htext dark:text-tmain">
                                <i className="fa-solid fa-feather-pointed mr-2 text-accent"></i>{' '}
                                Narasi Profil
                            </h3>

                            <div>
                                <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                    Keterangan Singkat (Caption)
                                </label>
                                <input
                                    type="text"
                                    value={data.caption}
                                    onChange={(e) =>
                                        setData('caption', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                    placeholder="Quote singkat pendukung landing page"
                                />
                                {errors.caption && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.caption}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                    Tentang Saya (About)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.about}
                                    onChange={(e) =>
                                        setData('about', e.target.value)
                                    }
                                    className="w-full resize-none rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                    placeholder="Jelaskan ringkasan diri Anda..."
                                />
                                {errors.about && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.about}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                    Deskripsi Tambahan (Opsional)
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.description || ''}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="w-full resize-none rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                    placeholder="Detail tambahan pengalaman atau rekam jejak..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Blok Sosial Media & Kontak */}
                        <div className="rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm">
                            <h3 className="text-md mb-4 border-b border-bmain/20 pb-3 font-bold text-htext dark:text-tmain">
                                <i className="fa-solid fa-share-nodes mr-2 text-accent"></i>{' '}
                                Kontak & Integrasi Sosial
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                        <i className="fa-brands fa-whatsapp mr-1 text-green-500"></i>{' '}
                                        WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={data.whatsapp}
                                        onChange={(e) =>
                                            setData('whatsapp', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                        placeholder="Contoh: 08123456789"
                                    />
                                    {errors.whatsapp && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.whatsapp}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                        <i className="fa-solid fa-envelope mr-1 text-red-400"></i>{' '}
                                        Email Publik
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                        placeholder="email@domain.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                        <i className="fa-brands fa-linkedin mr-1 text-blue-500"></i>{' '}
                                        URL LinkedIn
                                    </label>
                                    <input
                                        type="text"
                                        value={data.linkedin}
                                        onChange={(e) =>
                                            setData('linkedin', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                    {errors.linkedin && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.linkedin}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                        Nama Tampilan LinkedIn
                                    </label>
                                    <input
                                        type="text"
                                        value={data.linkedin_name}
                                        onChange={(e) =>
                                            setData(
                                                'linkedin_name',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                        placeholder="Contoh: Wahyu Adam A."
                                    />
                                    {errors.linkedin_name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.linkedin_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                        <i className="fa-brands fa-instagram mr-1 text-pink-500"></i>{' '}
                                        URL Instagram
                                    </label>
                                    <input
                                        type="text"
                                        value={data.instagram}
                                        onChange={(e) =>
                                            setData('instagram', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                        placeholder="https://instagram.com/username"
                                    />
                                    {errors.instagram && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.instagram}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                        <i className="fa-brands fa-github mr-1 text-neutral-800 dark:text-neutral-200"></i>{' '}
                                        URL GitHub
                                    </label>
                                    <input
                                        type="text"
                                        value={data.github}
                                        onChange={(e) =>
                                            setData('github', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                        placeholder="https://github.com/username"
                                    />
                                    {errors.github && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.github}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TOMBOL SUBMIT */}
                <div className="flex justify-end border-t border-bmain/10 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 rounded-xl bg-bshine px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-hbshine disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <i className="fa-solid fa-spinner animate-spin"></i>{' '}
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-floppy-disk"></i>{' '}
                                {profile
                                    ? 'Simpan Perubahan'
                                    : 'Buat Profil Utama'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </LayoutAdmin>
    );
}
