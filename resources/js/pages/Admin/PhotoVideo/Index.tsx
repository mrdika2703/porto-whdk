import { Head, Link, router } from '@inertiajs/react';
import LayoutAdmin from '../Layout/AdminLayout';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

interface PhotoVideoData {
    id: number;
    category: string;
    title: string;
    type: 'image' | 'video';
    url_1: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedPhotoVideos {
    data: PhotoVideoData[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

interface IndexProps {
    photovideos: PaginatedPhotoVideos;
    hasProfile: boolean;
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function Index({ photovideos, hasProfile, flash }: IndexProps) {
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
                router.delete(`/admin/photo-video/${id}`);
            }
        });
    };

    return (
        <LayoutAdmin>
            <Head title="Kelola Photo & Video" />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-htext dark:text-tmain">
                        Photo & Video
                    </h2>
                    <p className="mt-1 text-sm text-tmuted">
                        Kelola aset visual dan portofolio multimedia Anda di
                        sini.
                    </p>
                </div>

                {hasProfile ? (
                    <Link
                        href="/admin/photo-video/create"
                        className="flex items-center gap-2 self-start rounded-xl bg-bshine px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-hbshine"
                    >
                        <i className="fa-solid fa-plus"></i> Tambah Portofolio
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
                            <th className="px-4 py-3">Tipe</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {photovideos.data && photovideos.data.length > 0 ? (
                            photovideos.data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-bmain/10 transition-colors hover:bg-main/20"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-bmain/30 bg-main">
                                            {item.type === 'video' ? (
                                                <i className="fa-solid fa-play text-xl text-accent"></i>
                                            ) : (
                                                <img
                                                    src={`/storage/${item.url_1}`}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
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
                                    <td className="px-4 py-3 text-xs font-bold text-tmuted uppercase">
                                        {item.type === 'video' ? (
                                            <i className="fa-solid fa-video mr-1"></i>
                                        ) : (
                                            <i className="fa-solid fa-image mr-1"></i>
                                        )}
                                        {item.type}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/photo-video/${item.id}/edit`}
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

                {/* PAGINATION */}
                {photovideos.last_page > 1 && (
                    <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-bmain/20 pt-4 sm:flex-row">
                        <p className="text-xs text-tmuted">
                            Menampilkan {photovideos.from}–{photovideos.to} dari {photovideos.total} data
                        </p>
                        <div className="flex flex-wrap items-center gap-1">
                            {photovideos.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                    className={`min-w-[36px] rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                                        link.active
                                            ? 'bg-bshine text-white shadow-md'
                                            : link.url
                                              ? 'bg-main/40 text-tmuted hover:bg-accent/20 hover:text-accent'
                                              : 'cursor-not-allowed text-tmuted/40'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </LayoutAdmin>
    );
}
