import { Head, useForm } from '@inertiajs/react';
import LayoutAdmin from '../Layout/AdminLayout';
import { FormEvent, useEffect } from 'react';
import Swal from 'sweetalert2';

interface DescriptionSectionData {
    id?: number;
    profile_id?: number;
    design_section: string;
    photovideo_section: string;
    website_section: string;
    other_section: string;
}

interface FormProps {
    descriptionSection: DescriptionSectionData | null;
    hasProfile: boolean;
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function Form({
    descriptionSection,
    hasProfile,
    flash,
}: FormProps) {
    const isEdit = !!descriptionSection;

    const { data, setData, post, processing, errors } =
        useForm<DescriptionSectionData>({
            design_section: descriptionSection?.design_section ?? '',
            photovideo_section: descriptionSection?.photovideo_section ?? '',
            website_section: descriptionSection?.website_section ?? '',
            other_section: descriptionSection?.other_section ?? '',
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
    }, [flash]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        let progressInterval: any = null;
        let currentProgress = 0;

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
                        progressInterval = setInterval(() => {
                            if (currentProgress < 95) {
                                currentProgress += Math.floor(Math.random() * 10) + 5;
                                if (currentProgress > 95) currentProgress = 95;
                                const b = Swal.getHtmlContainer()?.querySelector('b');
                                if (b) b.textContent = `${currentProgress}%`;
                            }
                        }, 100);
                    },
                });
            },
            onProgress: (event: any) => {
                if (event?.percentage) {
                    if (progressInterval) {
                        clearInterval(progressInterval);
                        progressInterval = null;
                    }
                    currentProgress = event.percentage;
                    const b = Swal.getHtmlContainer()?.querySelector('b');
                    if (b) b.textContent = `${currentProgress}%`;
                }
            },
            onSuccess: () => {
                if (progressInterval) {
                    clearInterval(progressInterval);
                }
                const b = Swal.getHtmlContainer()?.querySelector('b');
                if (b) b.textContent = '100%';
                Swal.close();
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
            post(
                `/admin/description-sections/${descriptionSection.id}`,
                options,
            );
        } else {
            post('/admin/description-sections', options);
        }
    };

    if (!hasProfile) {
        return (
            <LayoutAdmin>
                <Head title="Deskripsi Bagian" />
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-500">
                    <i className="fa-solid fa-triangle-exclamation mb-2 text-4xl"></i>
                    <h3 className="text-lg font-bold">Profil Belum Dibuat</h3>
                    <p className="mt-1 text-sm">
                        Buat profil utama terlebih dahulu sebelum mengisi
                        deskripsi bagian.
                    </p>
                </div>
            </LayoutAdmin>
        );
    }

    return (
        <LayoutAdmin>
            <Head title="Deskripsi Bagian" />
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-htext dark:text-tmain">
                        Deskripsi Bagian Halaman Utama
                    </h2>
                    <p className="mt-1 text-sm text-tmuted">
                        Kelola tulisan/deskripsi pengantar untuk masing-masing
                        bagian (section) di landing page.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <fieldset disabled={processing} className="space-y-6 w-full">
                    <div className="space-y-6 rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm">
                        <h3 className="text-md mb-4 border-b border-bmain/20 pb-3 font-bold text-htext dark:text-tmain">
                            <i className="fa-solid fa-feather mr-2 text-accent"></i>{' '}
                            Deskripsi Per Bagian
                        </h3>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Graphic Design Section
                            </label>
                            <textarea
                                disabled={processing}
                                rows={4}
                                value={data.design_section}
                                onChange={(e) =>
                                    setData('design_section', e.target.value)
                                }
                                className="w-full resize-none rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none disabled:opacity-50 dark:text-tmain"
                                placeholder="Tulis deskripsi untuk bagian Graphic Design..."
                            />
                            {errors.design_section && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.design_section}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Photo & Video Section
                            </label>
                            <textarea
                                disabled={processing}
                                rows={4}
                                value={data.photovideo_section}
                                onChange={(e) =>
                                    setData('photovideo_section', e.target.value)
                                }
                                className="w-full resize-none rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none disabled:opacity-50 dark:text-tmain"
                                placeholder="Tulis deskripsi untuk bagian Photo & Video..."
                            />
                            {errors.photovideo_section && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.photovideo_section}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Websites Section
                            </label>
                            <textarea
                                disabled={processing}
                                rows={4}
                                value={data.website_section}
                                onChange={(e) =>
                                    setData('website_section', e.target.value)
                                }
                                className="w-full resize-none rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none disabled:opacity-50 dark:text-tmain"
                                placeholder="Tulis deskripsi untuk bagian Websites..."
                            />
                            {errors.website_section && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.website_section}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Others Section
                            </label>
                            <textarea
                                disabled={processing}
                                rows={4}
                                value={data.other_section}
                                onChange={(e) =>
                                    setData('other_section', e.target.value)
                                }
                                className="w-full resize-none rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none disabled:opacity-50 dark:text-tmain"
                                placeholder="Tulis deskripsi untuk bagian Others..."
                            />
                            {errors.other_section && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.other_section}
                                </p>
                            )}
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
                                        : 'Simpan Deskripsi'}
                                </>
                            )}
                        </button>
                    </div>
                </fieldset>
            </form>
        </LayoutAdmin>
    );
}
