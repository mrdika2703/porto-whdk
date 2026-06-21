import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import LayoutAdmin from '../Layout/AdminLayout';

interface ExperienceData {
    id: number;
    title: string;
    origin: string;
    description: string | null;
    status: string;
    start_date: string;
    end_date: string | null;
}

interface IndexProps {
    experience: ExperienceData[];
    hasProfile: boolean;
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function Index({ experience, hasProfile, flash }: IndexProps) {
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
    }, [flash]);

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Hapus Data?',
            text: 'Pengalaman ini akan dihapus permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#8C7A6B',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/experience/${id}`);
            }
        });
    };

    return (
        <LayoutAdmin>
            <Head title="Kelola Experience" />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-htext dark:text-tmain">
                        Pengalaman (Experience)
                    </h2>
                    <p className="mt-1 text-sm text-tmuted">
                        Kelola daftar pengalaman Anda.
                    </p>
                </div>

                {hasProfile ? (
                    <Link
                        href="/admin/experience/create"
                        className="flex items-center gap-2 self-start rounded-xl bg-bshine px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-hbshine"
                    >
                        <i className="fa-solid fa-plus"></i> Tambah Pengalaman
                    </Link>
                ) : (
                    <div className="flex items-center gap-2 self-start rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500">
                        <i className="fa-solid fa-triangle-exclamation"></i>{' '}
                        Buat Profil Dahulu
                    </div>
                )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm">
                <table className="w-full text-left text-sm text-htext dark:text-tmain">
                    <thead className="border-b border-bmain/20 text-xs text-tmuted uppercase">
                        <tr>
                            <th className="px-4 py-3">Nama Keahlian</th>
                            <th className="px-4 py-3">Asal</th>
                            <th className="px-4 py-3">Satus</th>
                            <th className="px-4 py-3">Tanggal Mulai</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {experience.length > 0 ? (
                            experience.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-bmain/10 transition-colors hover:bg-main/20"
                                >
                                    <td className="px-4 py-3 font-semibold">
                                        {item.title}
                                    </td>
                                    <td className="font-regular px-4 py-3">
                                        {item.origin}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-md border px-2 py-1 text-xs ${item.status === 'Selesai' ? 'border-orange-500/20 bg-orange-500/10 text-orange-500' : 'border-purple-500/20 bg-purple-500/10 text-purple-500'}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-md border px-2 py-1 text-xs font-semibold ${item.end_date !== null ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 'border-blue-500/20 bg-blue-500/10 text-blue-500'}`}
                                        >
                                            {item.start_date}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/experience/${item.id}/edit`}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-colors hover:bg-blue-500 hover:text-white"
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-8 text-center text-tmuted"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <i className="fa-solid fa-screwdriver-wrench mb-2 text-4xl opacity-50"></i>
                                        <p>
                                            Belum ada data pengalaman
                                            (experience).
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </LayoutAdmin>
    );
}
