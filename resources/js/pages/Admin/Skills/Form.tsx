import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Swal from 'sweetalert2';
import LayoutAdmin from '../Layout/AdminLayout';

interface SkillData {
    id?: number;
    name_skills: string;
    category: 'Soft Skill' | 'Hard Skill' | '';
    level: 'Beginner' | 'Intermediate' | 'Expert' | '';
    icon: string;
}

interface FormProps {
    skill?: SkillData;
}

export default function Form({ skill }: FormProps) {
    const isEdit = !!skill;

    // Untuk method tanpa file upload, Inertia membedakan post dan put.
    const { data, setData, post, put, processing, errors } = useForm<SkillData>(
        {
            name_skills: skill?.name_skills ?? '',
            category: skill?.category ?? 'Hard Skill',
            level: skill?.level ?? 'Intermediate',
            icon: skill?.icon ?? '',
        },
    );

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
            put(`/admin/skills/${skill.id}`, options);
        } else {
            post('/admin/skills', options);
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
                    href="/admin/skills"
                    className="flex items-center gap-2 self-start rounded-xl bg-bmain/20 px-4 py-2 text-sm font-semibold text-htext transition-colors hover:bg-bmain/40 dark:text-tmain"
                >
                    <i className="fa-solid fa-arrow-left"></i> Kembali
                </Link>
            </div>

            <div className="mx-auto max-w-2xl">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-bmain/20 bg-bcard p-6 shadow-sm"
                >
                    <h3 className="text-md mb-4 border-b border-bmain/20 pb-3 font-bold text-htext dark:text-tmain">
                        <i className="fa-solid fa-star mr-2 text-accent"></i>{' '}
                        Detail Keahlian
                    </h3>

                    <div>
                        <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                            Nama Keahlian
                        </label>
                        <input
                            type="text"
                            maxLength={20}
                            value={data.name_skills}
                            onChange={(e) =>
                                setData('name_skills', e.target.value)
                            }
                            className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                            placeholder="Contoh: Laravel, Leadership, Figma"
                        />
                        <div className="mt-1 flex items-center justify-between">
                            {errors.name_skills ? (
                                <p className="text-xs text-red-500">
                                    {errors.name_skills}
                                </p>
                            ) : (
                                <span></span>
                            )}
                            <p className="text-[10px] font-semibold text-tmuted">
                                {data.name_skills.length}/20 Karakter
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Kategori
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData(
                                        'category',
                                        e.target.value as
                                            | 'Soft Skill'
                                            | 'Hard Skill',
                                    )
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                            >
                                <option value="" disabled>
                                    Pilih Kategori...
                                </option>
                                <option value="Hard Skill">
                                    Hard Skill (Teknis)
                                </option>
                                <option value="Soft Skill">
                                    Soft Skill (Interpersonal)
                                </option>
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                                Level Penguasaan
                            </label>
                            <select
                                value={data.level}
                                onChange={(e) =>
                                    setData(
                                        'level',
                                        e.target.value as
                                            | 'Beginner'
                                            | 'Intermediate'
                                            | 'Expert'
                                            | '',
                                    )
                                }
                                className="w-full rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                            >
                                <option value="">Tidak Didefinisikan</option>
                                <option value="Beginner">
                                    Beginner (Pemula)
                                </option>
                                <option value="Intermediate">
                                    Intermediate (Menengah)
                                </option>
                                <option value="Expert">Expert (Ahli)</option>
                            </select>
                            {errors.level && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.level}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold tracking-wider text-tmuted uppercase">
                            Ikon (Font Awesome Class)
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={data.icon}
                                onChange={(e) =>
                                    setData('icon', e.target.value)
                                }
                                className="flex-1 rounded-xl border border-bmain/30 bg-main/40 px-4 py-3 text-sm text-htext transition-colors focus:border-accent focus:outline-none dark:text-tmain"
                                placeholder="Contoh: fa-brands fa-laravel"
                            />
                            {/* Kotak Preview Ikon */}
                            <div
                                key={data.icon || 'empty'}
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-bmain/30 bg-main/40 text-2xl text-accent shadow-inner transition-all"
                            >
                                {data.icon ? (
                                    <i className={data.icon}></i>
                                ) : (
                                    <i className="fa-solid fa-question text-base opacity-30"></i>
                                )}
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-tmuted">
                            Cari ikon referensi di{' '}
                            <a
                                href="https://fontawesome.com/search?o=r&m=free"
                                target="_blank"
                                rel="noreferrer"
                                className="text-accent hover:underline"
                            >
                                FontAwesome Free
                            </a>
                            .
                        </p>
                        {errors.icon && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.icon}
                            </p>
                        )}
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
                                        : 'Tambahkan Keahlian'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </LayoutAdmin>
    );
}
