import { Head, Link, useForm } from '@inertiajs/react';
import LayoutAdmin from '../Layout/AdminLayout';
import { FormEvent, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface CertificateData {
    id?: number;
    category: string;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    url_1: string | File | null;
    url_2: string | File | null;
    viewmode: 'All' | 'Programming' | 'Multimedia';
    visible: 'yes' | 'no';
    clear_url_1?: boolean;
    clear_url_2?: boolean;
}

interface FormProps {
    certificates?: CertificateData;
}

export default function Form({ certificates }: FormProps) {
    const isEdit = !!certificates;

    const { data, setData, post, processing, errors } =
        useForm<CertificateData>({
            category: certificates?.category ?? '',
            title: certificates?.title ?? '',
            description: certificates?.description ?? '',
            start_date: certificates?.start_date ?? '',
            end_date: certificates?.end_date ?? null,
            url_1: null,
            url_2: null,
            viewmode: certificates?.viewmode ?? 'All',
            visible: certificates?.visible ?? 'yes',
            clear_url_1: false,
            clear_url_2: false,
        });

    const [previews, setPreviews] = useState<{ [key: string]: string | null }>({
        url_1: certificates?.url_1 ? `/storage/${certificates.url_1}` : null,
        url_2: certificates?.url_2 ? `/storage/${certificates.url_2}` : null,
    });

    const [modalMedia, setModalMedia] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            Object.values(previews).forEach((url) => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);

    const handleFileChange = (num: number, file: File | null) => {
        const urlKey = `url_${num}` as keyof CertificateData;
        const clearKey = `clear_url_${num}` as keyof CertificateData;
        
        setData((prev) => ({
            ...prev,
            [urlKey]: file,
            [clearKey]: false,
        }));

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviews((prev) => ({ ...prev, [urlKey]: objectUrl }));
        } else {
            const existingFile = certificates
                ? (certificates as any)[urlKey]
                : null;
            setPreviews((prev) => ({
                ...prev,
                [urlKey]: existingFile ? `/storage/${existingFile}` : null,
            }));
        }
    };

    const handleClearFile = (num: number) => {
        const urlKey = `url_${num}` as keyof CertificateData;
        const clearKey = `clear_url_${num}` as keyof CertificateData;

        setData((prev) => ({
            ...prev,
            [urlKey]: null,
            [clearKey]: true,
        }));
        setPreviews((prev) => ({
            ...prev,
            [urlKey]: null,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        let progressInterval: any = null;
        let currentProgress = 0;
        const hasFiles = data.url_1 instanceof File || data.url_2 instanceof File;

        const options = {
            onStart: () => {
                currentProgress = 0;
                Swal.fire({
                    title: 'Mengirim Data...',
                    html: 'Progress: <b>0%</b>',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    backdrop: 'rgba(0, 0, 0, 0.5)',
                    showClass: { popup: '', backdrop: '' },
                    hideClass: { popup: '', backdrop: '' },
                    didOpen: () => {
                        Swal.showLoading();
                        if (!hasFiles) {
                            progressInterval = setInterval(() => {
                                if (currentProgress < 95) {
                                    currentProgress += Math.floor(Math.random() * 10) + 5;
                                    if (currentProgress > 95) currentProgress = 95;
                                    const b = Swal.getHtmlContainer()?.querySelector('b');
                                    if (b) b.textContent = `${currentProgress}%`;
                                }
                            }, 100);
                        }
                    },
                });
            },
            onProgress: (event: any) => {
                if (event?.percentage) {
                    currentProgress = event.percentage;
                    const b = Swal.getHtmlContainer()?.querySelector('b');
                    if (b) b.textContent = `${currentProgress}%`;
                }
            },
            onSuccess: (page: any) => {
                if (progressInterval) {
                    clearInterval(progressInterval);
                }
                const b = Swal.getHtmlContainer()?.querySelector('b');
                if (b) b.textContent = '100%';
                Swal.close();

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
                        title: 'Terjadi Kesalahan Sistem',
                        text: page.props.flash.error,
                        confirmButtonColor: '#ef4444',
                    });
                }
            },
            onError: () => {
                if (progressInterval) {
                    clearInterval(progressInterval);
                }
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Menyimpan',
                    text: 'Harap periksa kembali input form Anda.',
                    confirmButtonColor: '#ef4444',
                });
            },
            onFinish: () => {
                if (progressInterval) {
                    clearInterval(progressInterval);
                }
            },
        };

        if (isEdit) {
            post(`/admin/certificate/${certificates.id}`, options);
        } else {
            post('/admin/certificate', options);
        }
    };

    return (
        <LayoutAdmin>
            <Head title={isEdit ? 'Edit Sertifikat' : 'Tambah Sertifikat'} />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-htext dark:text-tmain">
                        {isEdit ? 'Edit Sertifikat' : 'Tambah Sertifikat'}
                    </h2>
                    <p className="mt-1 text-sm text-tmuted">
                        {isEdit
                            ? 'Ubah informasi sertifikat Anda.'
                            : 'Unggah dan deskripsikan sertifikat baru Anda.'}
                    </p>
                </div>
                <Link
                    href="/admin/certificate"
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
                            <i className="fa-solid fa-circle-info mr-2 text-accent"></i>{' '}
                            Detail Sertifikat
                        </h3>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Judul Sertifikat
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                placeholder="Contoh: Logo Design Company X"
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Kategori
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                            >
                                <option value="" disabled>
                                    Pilih Kategori...
                                </option>
                                <option value="Hard Skill">Hard Skill</option>
                                <option value="Soft Skill">Soft Skill</option>
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Deskripsi (Opsional)
                            </label>
                            <textarea
                                rows={4}
                                value={data.description || ''}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="w-full resize-none rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                placeholder="Jelaskan konsep karya ini..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.description}
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
                                value={data.end_date || ''}
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                            />
                            {errors.end_date && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                View Mode
                            </label>
                            <select
                                value={data.viewmode}
                                onChange={(e) =>
                                    setData(
                                        'viewmode',
                                        e.target.value as
                                            | 'All'
                                            | 'Programming'
                                            | 'Multimedia',
                                    )
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                            >
                                <option value="" disabled>
                                    Pilih Kategori...
                                </option>
                                <option value="All">All</option>
                                <option value="Programming">Programming</option>
                                <option value="Multimedia">Multimedia</option>
                            </select>
                            {errors.viewmode && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.viewmode}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Visible (Tampilkan di Portfolio)
                            </label>
                            <select
                                value={data.visible}
                                onChange={(e) =>
                                    setData(
                                        'visible',
                                        e.target.value as 'yes' | 'no',
                                    )
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                            >
                                <option value="yes">Yes (Tampilkan)</option>
                                <option value="no">No (Sembunyikan)</option>
                            </select>
                            {errors.visible && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.visible}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm">
                        <h3 className="text-md mb-4 border-b border-bmain/20 pb-3 font-bold text-htext dark:text-tmain">
                            <i className="fa-solid fa-cloud-arrow-up mr-2 text-accent"></i>{' '}
                            File Upload
                        </h3>

                        {[1, 2].map((num) => {
                            const urlKey = `url_${num}`;
                            const previewUrl = previews[urlKey];

                            return (
                                <div
                                    key={num}
                                    className="rounded-xl border border-dashed border-bmain/30 bg-main/20 p-4"
                                >
                                    <label className="mb-3 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                        File {num}{' '}
                                        {num === 1 && (
                                            <span className="text-red-500">
                                                * (Wajib)
                                            </span>
                                        )}
                                    </label>

                                    {previewUrl && (
                                        <div className="relative mb-4">
                                            <div
                                                className="group relative h-48 w-full cursor-pointer overflow-hidden rounded-xl border border-bmain/40 bg-black/5"
                                                onClick={() =>
                                                    setModalMedia(previewUrl)
                                                }
                                            >
                                                <img
                                                    src={previewUrl}
                                                    alt={`Preview ${num}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <i className="fa-solid fa-magnifying-glass-plus text-3xl text-white"></i>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleClearFile(num)}
                                                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
                                                title="Hapus File"
                                            >
                                                <i className="fa-solid fa-trash-can text-sm"></i>
                                            </button>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        key={data[urlKey as keyof CertificateData] ? (data[urlKey as keyof CertificateData] as File).name : 'empty'}
                                        onChange={(e) =>
                                            handleFileChange(
                                                num,
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                        className="w-full cursor-pointer text-xs text-tmuted file:mr-4 file:rounded-xl file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-accent hover:file:bg-accent/20"
                                    />
                                    {errors[
                                        urlKey as keyof CertificateData
                                    ] && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {
                                                errors[
                                                    urlKey as keyof CertificateData
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>
                            );
                        })}
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
                                    : 'Tambahkan Karya'}
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* MODAL ZOOM GAMBAR */}
            {modalMedia && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity"
                    onClick={() => setModalMedia(null)}
                >
                    <div
                        className="relative w-full max-w-5xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-12 right-0 text-4xl text-white/70 transition-colors hover:text-white"
                            onClick={() => setModalMedia(null)}
                        >
                            &times;
                        </button>

                        <div className="flex justify-center overflow-hidden rounded-2xl bg-black shadow-2xl">
                            <img
                                src={modalMedia}
                                alt="Zoom Preview"
                                className="max-h-[85vh] w-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </LayoutAdmin>
    );
}
