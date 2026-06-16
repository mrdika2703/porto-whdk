import { Head, Link } from '@inertiajs/react';
import LayoutAdmin from '../Layout/AdminLayout';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ProfileData {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface ChartDataItem {
    name: string;
    visitors: number;
}

interface VisitorData {
    id: number;
    ip_address: string;
    user_agent: string;
    visited_at: string;
}

interface PaginatedVisitors {
    data: VisitorData[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

interface DashboardProps {
    profile: ProfileData | null;
    certificate: number;
    experience: number;
    education: number;
    skill: number;
    grapichDesign: number;
    photoVideo: number;
    website: number;
    other: number;
    todayVisitors: number;
    chartData: {
        weekly: ChartDataItem[];
        monthly: ChartDataItem[];
        yearly: ChartDataItem[];
    };
    visitorsList: PaginatedVisitors;
    flash?: {
        success: string | null;
        error: string | null;
    };
}

export default function Dashboard({
    profile,
    certificate,
    experience,
    education,
    skill,
    grapichDesign,
    photoVideo,
    website,
    other,
    todayVisitors,
    chartData,
    visitorsList,
    flash,
}: DashboardProps) {
    const hasProfile = !!profile;

    const [chartFilter, setChartFilter] = useState<
        'weekly' | 'monthly' | 'yearly'
    >('weekly');

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
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
        if (flash?.error) {
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

    const statCards = [
        {
            title: 'Hari ini',
            count: todayVisitors,
            icon: 'fa-users',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
        },
        {
            title: 'Graphic Design',
            count: grapichDesign,
            icon: 'fa-palette',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            title: 'Skills',
            count: skill,
            icon: 'fa-code',
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
        {
            title: 'Websites',
            count: website,
            icon: 'fa-globe',
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
        },
        {
            title: 'Experiences',
            count: experience,
            icon: 'fa-briefcase',
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
        },
        {
            title: 'Certificates',
            count: certificate,
            icon: 'fa-award',
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
        },
        {
            title: 'Educations',
            count: education,
            icon: 'fa-graduation-cap',
            color: 'text-teal-500',
            bg: 'bg-teal-500/10',
        },
        {
            title: 'Photos & Videos',
            count: photoVideo,
            icon: 'fa-camera',
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
        },
        {
            title: 'Others',
            count: other,
            icon: 'fa-ellipsis',
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
        },
    ];

    // Tooltip kustom agar sesuai dengan tema Dark/Light mode
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-xl border border-bmain/20 bg-bcard p-3 shadow-lg">
                    <p className="mb-1 text-xs text-tmuted">{label}</p>
                    <p className="font-bold text-accent">
                        {payload[0].value} Pengunjung
                    </p>
                </div>
            );
        }
        return null;
    };

    const formatDateTime = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <LayoutAdmin>
            <Head title="Admin Dashboard" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-htext dark:text-tmain">
                    Dashboard Overview
                </h2>
                <p className="mt-1 text-sm text-tmuted">
                    Selamat datang kembali di panel administrasi.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 rounded-2xl border border-tmuted/10 bg-bcard p-6 shadow-sm transition-shadow hover:shadow-md md:gap-4"
                    >
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color} md:h-14 md:w-14`}
                        >
                            <i
                                className={`fa-solid ${stat.icon} text-md md:text-2xl`}
                            ></i>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-htext md:text-3xl dark:text-tmain">
                                {stat.count}
                            </h3>
                            <p className="text-xs font-medium text-tmuted md:text-sm">
                                {stat.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* SECTION GRAFIK PENGUNJUNG */}
            <div className="mt-8 rounded-2xl border border-tmuted/10 bg-bcard p-6 shadow-sm">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-bmain/20 px-4 py-2 text-sm font-semibold text-htext transition-colors hover:bg-bmain/40 dark:text-tmain"
                    >
                        <i className="fa-solid fa-list-ul"></i> Lihat Data
                    </button>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-htext dark:text-tmain">
                            Statistik Pengunjung
                        </h3>
                        <p className="text-sm text-tmuted">
                            Jumlah tayangan portofolio unik per perangkat.
                        </p>
                    </div>

                    {/* Filter Chart */}
                    <div className="flex overflow-hidden rounded-xl border border-bmain/20 bg-main/20">
                        <button
                            onClick={() => setChartFilter('weekly')}
                            className={`px-4 py-2 text-sm font-semibold transition-colors ${chartFilter === 'weekly' ? 'bg-accent text-white' : 'text-tmuted hover:text-htext dark:hover:text-tmain'}`}
                        >
                            Minggu
                        </button>
                        <button
                            onClick={() => setChartFilter('monthly')}
                            className={`border-r border-l border-bmain/20 px-4 py-2 text-sm font-semibold transition-colors ${chartFilter === 'monthly' ? 'bg-accent text-white' : 'text-tmuted hover:text-htext dark:hover:text-tmain'}`}
                        >
                            Bulan
                        </button>
                        <button
                            onClick={() => setChartFilter('yearly')}
                            className={`px-4 py-2 text-sm font-semibold transition-colors ${chartFilter === 'yearly' ? 'bg-accent text-white' : 'text-tmuted hover:text-htext dark:hover:text-tmain'}`}
                        >
                            Tahun
                        </button>
                    </div>
                </div>

                {/* Area Chart Rendering */}
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData[chartFilter]}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -20,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorVisitors"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#8C7A6B"
                                        stopOpacity={0.4}
                                    />{' '}
                                    {/* Warna Aksen (Bisa diganti var CSS Tailwind) */}
                                    <stop
                                        offset="95%"
                                        stopColor="#8C7A6B"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                strokeOpacity={0.1}
                            />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#888888' }}
                                dy={10}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#888888' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="visitors"
                                stroke="#8C7A6B" // Warna garis aksen
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorVisitors)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* MODAL LIHAT DATA PENGUNJUNG */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-bcard shadow-2xl">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between border-b border-bmain/20 px-6 py-4">
                            <h3 className="text-lg font-bold text-htext dark:text-tmain">
                                <i className="fa-solid fa-server mr-2 text-accent"></i>{' '}
                                Detail Log Pengunjung
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-tmuted transition-colors hover:text-red-500"
                            >
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        {/* Body Modal (Tabel) */}
                        <div className="custom-scrollbar flex-1 overflow-x-auto overflow-y-auto p-6">
                            <table className="w-full text-left text-sm text-htext dark:text-tmain">
                                <thead className="border-b border-bmain/20 text-xs text-tmuted uppercase">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Waktu Berkunjung
                                        </th>
                                        <th className="px-4 py-3">
                                            IP Address
                                        </th>
                                        <th className="px-4 py-3">
                                            Perangkat / Browser
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitorsList.data.length > 0 ? (
                                        visitorsList.data.map((visitor) => (
                                            <tr
                                                key={visitor.id}
                                                className="border-b border-bmain/10 transition-colors hover:bg-main/20"
                                            >
                                                <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap text-accent">
                                                    {formatDateTime(
                                                        visitor.visited_at,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    {visitor.ip_address}
                                                </td>
                                                <td
                                                    className="max-w-xs truncate px-4 py-3 text-xs"
                                                    title={visitor.user_agent}
                                                >
                                                    {visitor.user_agent}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-4 py-8 text-center text-tmuted"
                                            >
                                                Belum ada data pengunjung yang
                                                tercatat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Modal (Pagination) */}
                        <div className="flex items-center justify-between border-t border-bmain/20 bg-main/10 px-6 py-4">
                            <span className="hidden text-xs text-tmuted sm:inline-block">
                                Menampilkan {visitorsList.from || 0} -{' '}
                                {visitorsList.to || 0} dari {visitorsList.total}{' '}
                                data
                            </span>

                            <div className="flex gap-1">
                                {visitorsList.links.map((link, index) => {
                                    // Me-render link paginasi Inertia dengan preserveState
                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveState={true} // INI KUNCI UTAMA AGAR MODAL TIDAK TERTUTUP!
                                            preserveScroll={true}
                                            className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                                                link.active
                                                    ? 'border-accent bg-accent text-white'
                                                    : 'border-bmain/30 text-tmuted hover:bg-bmain/20 hover:text-htext dark:hover:text-tmain'
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="cursor-not-allowed rounded-lg border border-bmain/10 px-3 py-1 text-xs font-semibold text-tmuted/40"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </LayoutAdmin>
    );
}
