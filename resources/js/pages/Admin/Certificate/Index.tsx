import { Head, Link, router } from '@inertiajs/react';
import LayoutAdmin from '../Layout/AdminLayout';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

interface CertificateData {
    id: number;
    category: string;
    title: string;
    url_1: string;
    viewmode: 'All' | 'Programming' | 'Multimedia';
}

interface IndexProps {
    certificates: CertificateData[];
    hasProfile: boolean;
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function Index({ certificates, hasProfile, flash }: IndexProps) {
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
            text: 'Data yang dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#8C7A6B',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                // Konvensi zigzag menggunakan helper kustom atau router.delete manual
                router.delete(`/admin/certificate/${id}`);
            }
        });
    };

    return (
        <LayoutAdmin>
            <Head title="Kelola Sertifikat" />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-htext dark:text-tmain">
                        Kelola Sertifikat
                    </h2>
                    <p className="mt-1 text-sm text-tmuted">
                        Kelola Sertifikat Anda di sini.
                    </p>
                </div>

                {hasProfile ? (
                    <Link
                        href="/admin/certificate/create"
                        className="flex items-center gap-2 self-start rounded-xl bg-bshine px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-hbshine"
                    >
                        <i className="fa-solid fa-plus"></i> Tambah Sertifikat
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
                            <th className="px-4 py-3">Media</th>
                            <th className="px-4 py-3">Judul Karya</th>
                            <th className="px-4 py-3">Kategori</th>
                            <th className="px-4 py-3">View Mode</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.length > 0 ? (
                            certificates.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-bmain/10 transition-colors hover:bg-main/20"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-bmain/30 bg-main">
                                            <img
                                                src={`/storage/${item.url_1}`}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-semibold">
                                        {item.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-md border border-accent/20 bg-accent/10 px-2 py-1 text-xs text-accent">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-md border px-2 py-1 text-xs font-semibold ${item.viewmode === 'Programming' ? 'border-blue-500/20 bg-blue-500/10 text-blue-500' : item.viewmode === 'Multimedia' ? 'border-purple-500/20 bg-purple-500/10 text-purple-500' : 'border-orange-500/20 bg-orange-500/10 text-orange-500'}`}
                                        >
                                            {item.viewmode}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/certificate/${item.id}/edit`}
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
                                        <i className="fa-regular fa-folder-open mb-2 text-4xl"></i>
                                        <p>Belum ada data portofolio desain.</p>
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
