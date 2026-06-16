import { Head, Link, useForm } from '@inertiajs/react';
import LayoutAdmin from '../Layout/AdminLayout';
import { FormEvent, useEffect } from 'react';
import Swal from 'sweetalert2';

interface ExperienceData {
    id?: number;
    title: string;
    origin: string;
    description: string | null;
    status: string;
    start_date: string;
    end_date: string | null;
    duration: string | null;
}

interface FormProps {
    experience?: ExperienceData;
}

const formatDurationDisplay = (durationStr: string | null) => {
    if (!durationStr) return '';
    const match = durationStr.match(/^(\d+)\s+hari$/);
    if (!match) return durationStr;
    
    const days = parseInt(match[1], 10);
    if (days < 30) {
        return `${days} hari`;
    }
    
    const months = Math.round(days / 30);
    if (months < 12) {
        return `${months} bulan`;
    }
    
    const years = parseFloat((days / 365).toFixed(1));
    return `${years} tahun`;
};

export default function Form({ experience }: FormProps) {
    const isEdit = !!experience;

    // Untuk method tanpa file upload, Inertia membedakan post dan put.
    const { data, setData, post, put, processing, errors } =
        useForm<ExperienceData>({
            title: experience?.title ?? '',
            origin: experience?.origin ?? '',
            description: experience?.description ?? null,
            status: experience?.status ?? '',
            start_date: experience?.start_date ?? '',
            end_date: experience?.end_date ?? null,
            duration: experience?.duration ?? null,
        });

    const handleStatusChange = (statusVal: 'Selesai' | 'Sekarang') => {
        if (statusVal === 'Sekarang') {
            setData((prev) => ({
                ...prev,
                status: 'Sekarang',
                end_date: null,
            }));
        } else {
            const todayStr = new Date().toISOString().split('T')[0];
            setData((prev) => ({
                ...prev,
                status: 'Selesai',
                end_date: prev.end_date || todayStr,
            }));
        }
    };

    // Hitung durasi secara realtime
    useEffect(() => {
        if (!data.start_date) {
            if (data.duration !== null) {
                setData('duration', null);
            }
            return;
        }

        const start = new Date(data.start_date);
        const end = (data.status === 'Sekarang' || data.end_date === null) ? new Date() : new Date(data.end_date);

        // Reset hours for precise day count
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (isNaN(diffDays) || diffDays < 0) {
            if (data.duration !== null) {
                setData('duration', null);
            }
            return;
        }

        const daysStr = `${diffDays} hari`;
        if (data.duration !== daysStr) {
            setData('duration', daysStr);
        }
    }, [data.start_date, data.end_date, data.status]);

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

        if (isEdit) {
            put(`/admin/experience/${experience.id}`, options);
        } else {
            post('/admin/experience', options);
        }
    };

    return (
        <LayoutAdmin>
            <Head title={isEdit ? 'Edit Skill' : 'Tambah Skill'} />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-htext dark:text-tmain">
                        {isEdit ? 'Edit Keahlian' : 'Tambah Keahlian'}
                    </h2>
                    <p className="mt-1 text-sm text-tmuted">
                        {isEdit
                            ? 'Ubah informasi detail kemampuan Anda.'
                            : 'Tambahkan kemampuan baru ke dalam profil Anda.'}
                    </p>
                </div>
                <Link
                    href="/admin/experience"
                    className="flex items-center gap-2 self-start rounded-xl bg-bmain/20 px-4 py-2 text-sm font-semibold text-htext transition-colors hover:bg-bmain/40 dark:text-tmain"
                >
                    <i className="fa-solid fa-arrow-left"></i> Kembali
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
                encType="multipart/form-data"
            >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-4 rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm">
                        <h3 className="text-md mb-4 border-b border-bmain/20 pb-3 font-bold text-htext dark:text-tmain">
                            <i className="fa-solid fa-star mr-2 text-accent"></i>{' '}
                            Detail Pengalaman
                        </h3>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Nama Pengalaman
                            </label>
                            <input
                                type="text"
                                maxLength={200}
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                placeholder="Contoh: HRD di Telkom"
                            />
                            <div className="mt-1 flex items-center justify-between">
                                {errors.title ? (
                                    <p className="text-xs text-red-500">
                                        {errors.title}
                                    </p>
                                ) : (
                                    <span></span>
                                )}
                                <p className="text-[10px] font-semibold text-tmuted">
                                    {data.title.length}/200 Karakter
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Asal Pengalaman
                            </label>
                            <input
                                type="text"
                                maxLength={200}
                                value={data.origin}
                                onChange={(e) =>
                                    setData('origin', e.target.value)
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                placeholder="Contoh: Telkom Surabaya"
                            />
                            <div className="mt-1 flex items-center justify-between">
                                {errors.origin ? (
                                    <p className="text-xs text-red-500">
                                        {errors.origin}
                                    </p>
                                ) : (
                                    <span></span>
                                )}
                                <p className="text-[10px] font-semibold text-tmuted">
                                    {data.origin.length}/200 Karakter
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Deskripsi
                            </label>
                            <textarea
                                rows={4}
                                value={data.description ?? ''}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="w-full resize-none rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                placeholder="Deskripsikan pengalaman ini..."
                            />
                            <div className="mt-1 flex items-center justify-between">
                                {errors.description ? (
                                    <p className="text-xs text-red-500">
                                        {errors.description}
                                    </p>
                                ) : (
                                    <span></span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm">
                        <h3 className="text-md mb-4 border-b border-bmain/20 pb-3 font-bold text-htext dark:text-tmain">
                            <i className="fa-solid fa-star mr-2 text-accent"></i>{' '}
                            Detail Status
                        </h3>
                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    handleStatusChange(
                                        e.target.value as
                                            | 'Selesai'
                                            | 'Sekarang',
                                    )
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                            >
                                <option value="" disabled>
                                    Pilih Status...
                                </option>
                                <option value="Selesai">Selesai</option>
                                <option value="Sekarang">Sekarang</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData('start_date', e.target.value)
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                            />
                            {errors.start_date && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.start_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Tanggal Berakhir
                            </label>
                            <input
                                type="date"
                                value={data.end_date ?? ''}
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                                disabled={data.status === 'Sekarang'}
                                className={`w-full rounded-xl border border-bmain/30 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain ${
                                    data.status === 'Sekarang'
                                        ? 'bg-main/20 cursor-not-allowed opacity-50'
                                        : 'bg-main/40'
                                }`}
                            />
                            {errors.end_date && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Durasi
                            </label>
                            <input
                                type="text"
                                value={formatDurationDisplay(data.duration)}
                                readOnly
                                className="w-full rounded-xl border border-bmain/30 bg-main/20 px-4 py-3 text-sm text-htext/60 transition-colors focus:outline-none cursor-not-allowed dark:text-tmain/60"
                                placeholder="Dihitung otomatis berdasarkan tanggal..."
                            />
                            <div className="mt-1 flex items-center justify-between">
                                {errors.duration ? (
                                    <p className="text-xs text-red-500">
                                        {errors.duration}
                                    </p>
                                ) : (
                                    <span></span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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
                                {isEdit
                                    ? 'Simpan Perubahan'
                                    : 'Tambahkan Pengalaman'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </LayoutAdmin>
    );
}
