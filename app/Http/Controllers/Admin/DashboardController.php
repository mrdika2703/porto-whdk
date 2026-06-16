<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Carbon\Carbon;
use App\Models\Education;
use App\Models\Profile;
use App\Models\Certificate;
use App\Models\Experience;
use App\Models\Skill;
use App\Models\GrapichDesign;
use App\Models\PhotoVideo;
use App\Models\Website;
use App\Models\Other;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    private function getProfile()
    {
        return Profile::where('user_id', Auth::id() ?? 1)->first();
    }
    public function index()
    {
        $profile = $this->getProfile();
        $certificate = $profile ? Certificate::where('profile_id', $profile->id)->count() : 0;
        $experience = $profile ? Experience::where('profile_id', $profile->id)->count() : 0;
        $education = $profile ? Education::where('profile_id', $profile->id)->count() : 0;
        $skill = $profile ? Skill::where('profile_id', $profile->id)->count() : 0;
        $grapichDesign = $profile ? GrapichDesign::where('profile_id', $profile->id)->count() : 0;
        $photoVideo = $profile ? PhotoVideo::where('profile_id', $profile->id)->count() : 0;
        $website = $profile ? Website::where('profile_id', $profile->id)->count() : 0;
        $other = $profile ? Other::where('profile_id', $profile->id)->count() : 0;

        // --- DATA VISITOR UNTUK CHART & CARD ---
        $today = Carbon::today();

        // Menggunakan visited_at
        $todayVisitors = Visitor::whereDate('visited_at', $today)->count();

        // 1. Data Mingguan (7 Hari Terakhir)
        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = $today->copy()->subDays($i);
            $weeklyData[] = [
                'name' => $date->translatedFormat('l'),
                'visitors' => Visitor::whereDate('visited_at', $date)->count()
            ];
        }

        // 2. Data Bulanan (30 Hari Terakhir)
        $monthlyData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = $today->copy()->subDays($i);
            $monthlyData[] = [
                'name' => $date->format('d M'),
                'visitors' => Visitor::whereDate('visited_at', $date)->count()
            ];
        }

        // 3. Data Tahunan (12 Bulan Terakhir)
        $yearlyData = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = $today->copy()->startOfMonth()->subMonths($i);
            $yearlyData[] = [
                'name' => $date->translatedFormat('M Y'),
                'visitors' => Visitor::whereYear('visited_at', $date->year)
                    ->whereMonth('visited_at', $date->month)
                    ->count()
            ];
        }
        $visitorsList = Visitor::orderBy('visited_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Dashboard/index', [
            'profile' => $profile,
            'certificate' => $certificate,
            'experience' => $experience,
            'education' => $education,
            'skill' => $skill,
            'grapichDesign' => $grapichDesign,
            'photoVideo' => $photoVideo,
            'website' => $website,
            'other' => $other,
            'todayVisitors' => $todayVisitors, // Card baru
            'chartData' => [
                'weekly' => $weeklyData,
                'monthly' => $monthlyData,
                'yearly' => $yearlyData,
            ],
            'visitorsList' => $visitorsList,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }
}
