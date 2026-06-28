import { Head, Link, useForm } from '@inertiajs/react';
import LayoutAdmin from '../Layout/AdminLayout';
import { FormEvent, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface DesignData {
    id?: number;
    category: string;
    title: string;
    description: string | null;
    type: 'image' | 'video';
    link: string | null;
    url_1: string | File | null;
    url_2: string | File | null;
    url_3: string | File | null;
}

interface FormProps {
    design?: DesignData;
    existingCategories?: string[];
}

export default function Form({ design, existingCategories = [] }: FormProps) {
    const isEdit = !!design;

    const { data, setData, post, processing, errors } = useForm<DesignData>({
        category: design?.category ?? '',
        title: design?.title ?? '',
        description: design?.description ?? '',
        type: design?.type ?? 'image',
        link: design?.link ?? '',
        url_1: null,
        url_2: null,
        url_3: null,
    });

    const [previews, setPreviews] = useState<{ [key: string]: string | null }>({
        url_1: design?.url_1 ? `/storage/${design.url_1}` : null,
        url_2: design?.url_2 ? `/storage/${design.url_2}` : null,
        url_3: design?.url_3 ? `/storage/${design.url_3}` : null,
    });

    const [modalMedia, setModalMedia] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false); // State untuk Dropdown Kategori

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
        const urlKey = `url_${num}` as keyof DesignData;
        setData(urlKey, file);

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviews((prev) => ({ ...prev, [urlKey]: objectUrl }));
        } else {
            const existingFile = design ? (design as any)[urlKey] : null;
            setPreviews((prev) => ({
                ...prev,
                [urlKey]: existingFile ? `/storage/${existingFile}` : null,
            }));
        }
    };

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
                    if (page.props.flash?.error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Terjadi Kesalahan Sistem',
                            text: page.props.flash.error,
                            confirmButtonColor: '#ef4444',
                        });
                    }
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
            post(`/admin/grapich-design/${design.id}`, options);
        } else {
            post('/admin/grapich-design', options);
        }
    };

    // Logika Filter Kategori
    const filteredCategories = existingCategories.filter(
        (c) =>
            c.toLowerCase().includes(data.category.toLowerCase()) &&
            c.toLowerCase() !== data.category.toLowerCase(),
    );

    return (
        <LayoutAdmin>
            <Head
                title={isEdit ? 'Edit Graphic Design' : 'Tambah Graphic Design'}
            />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-htext dark:text-tmain">
                        {isEdit ? 'Edit Portofolio' : 'Tambah Portofolio'}
                    </h2>
                    <p className="mt-1 text-sm text-tmuted">
                        {isEdit
                            ? 'Ubah informasi karya visual Anda.'
                            : 'Unggah dan deskripsikan karya desain baru Anda.'}
                    </p>
                </div>
                <Link
                    href="/admin/grapich-design"
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
                            Detail Karya
                        </h3>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Judul Karya
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

                        <div className="grid grid-cols-2 gap-4">
                            {/* BAGIAN AUTOCOMPLETE KATEGORI */}
                            <div className="relative">
                                <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                    Kategori
                                </label>
                                <input
                                    type="text"
                                    value={data.category}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setShowSuggestions(false)}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                    placeholder="Contoh: Branding"
                                    autoComplete="off"
                                />

                                {/* DROPDOWN KATEGORI MELAYANG */}
                                {showSuggestions &&
                                    filteredCategories.length > 0 && (
                                        <div className="absolute top-full left-0 z-20 mt-2 max-h-40 w-full overflow-y-auto rounded-xl border border-bmain/20 bg-bcard py-1 shadow-lg backdrop-blur-md">
                                            {filteredCategories.map(
                                                (cat, index) => (
                                                    <div
                                                        key={index}
                                                        // onMouseDown bekerja lebih cepat dibanding onBlur milik input, sehingga klik terbaca
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            setData(
                                                                'category',
                                                                cat,
                                                            );
                                                            setShowSuggestions(
                                                                false,
                                                            );
                                                        }}
                                                        className="cursor-pointer px-4 py-2 text-sm text-htext transition-colors hover:bg-accent/20 dark:text-tmain"
                                                    >
                                                        <i className="fa-solid fa-tag mr-2 text-xs text-tmuted"></i>{' '}
                                                        {cat}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                {errors.category && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                    Tipe Media
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData(
                                            'type',
                                            e.target.value as 'image' | 'video',
                                        )
                                    }
                                    className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                >
                                    <option value="image">
                                        Image (Gambar)
                                    </option>
                                    <option value="video">
                                        Video (Animasi/Clip)
                                    </option>
                                </select>
                                {errors.type && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.type}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                link (Optional)
                            </label>
                            <input
                                type="text"
                                value={data.link || ''}
                                onChange={(e) =>
                                    setData('link', e.target.value)
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                placeholder="www.google.com"
                            />
                            {errors.link && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.link}
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
                    </div>

                    <div className="space-y-4 rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm">
                        <h3 className="text-md mb-4 border-b border-bmain/20 pb-3 font-bold text-htext dark:text-tmain">
                            <i className="fa-solid fa-cloud-arrow-up mr-2 text-accent"></i>{' '}
                            File Upload
                        </h3>

                        {[1, 2, 3].map((num) => {
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
                                        <div
                                            className="group relative mb-4 h-48 w-full cursor-pointer overflow-hidden rounded-xl border border-bmain/40 bg-black/5"
                                            onClick={() =>
                                                setModalMedia(previewUrl)
                                            }
                                        >
                                            {data.type === 'video' &&
                                            num === 1 ? (
                                                <video
                                                    src={previewUrl}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={previewUrl}
                                                    alt={`Preview ${num}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                <i className="fa-solid fa-magnifying-glass-plus text-3xl text-white"></i>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
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
                                    {errors[urlKey as keyof DesignData] && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors[urlKey as keyof DesignData]}
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

            {/* MODAL ZOOM GAMBAR / VIDEO */}
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
