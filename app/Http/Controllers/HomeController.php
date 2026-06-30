<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\DescriptionSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use App\Models\Visitor;
use App\Models\GrapichDesign;
use App\Models\Profile;
use App\Models\Skill;
use App\Models\Experience;
use App\Models\Education;
use App\Models\Other;
use App\Models\PhotoVideo;
use App\Models\Website;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // --- LOGIKA TRACKING PENGUNJUNG (UPDATE DATETIME) ---
        $ip = $request->ip();
        $userAgent = $request->userAgent();

        // Cek apakah pengunjung ini sudah terekam pada hari yang sama
        $hasVisitedToday = Visitor::where('ip_address', $ip)
            ->whereDate('visited_at', Carbon::today())
            ->exists();

        // Jika belum berkunjung hari ini, simpan data beserta jam spesifiknya
        if (!$hasVisitedToday) {
            Visitor::create([
                'ip_address' => $ip,
                'user_agent' => $userAgent,
                'visited_at' => Carbon::now(), // Menyimpan Y-m-d H:i:s
            ]);
        }

        $profile = Cache::remember('all_profile_array', 3600, function () {
            return Profile::all()->toArray();
        });

        $skill = Cache::remember('all_skill_array', 3600, function () {
            return Skill::where('visible', 'yes')
                ->orderByRaw("CASE WHEN category = 'Soft Skill' THEN 1 ELSE 2 END ASC")
                ->orderByRaw("CASE WHEN level = 'Expert' THEN 1 WHEN level = 'Intermediate' THEN 2 WHEN level = 'Beginner' THEN 3 ELSE 4 END ASC")
                ->orderBy('name_skills', 'asc')
                ->get()
                ->toArray();
        });

        $descriptionSections = Cache::remember(
            'all_description_sections_array',
            3600,
            function () {
                return DescriptionSection::first();
            }
        );

        $certificate = Cache::remember('all_certificate_array', 3600, function () {
            return Certificate::where('visible', 'yes')->orderBy('start_date', 'desc')->get()->toArray();
        });

        $experience = Cache::remember('all_experience_array', 3600, function () {
            return Experience::where('visible', 'yes')->orderBy('start_date', 'desc')->get()->toArray();
        });

        $education = Cache::remember('all_education_array', 3600, function () {
            return Education::where('visible', 'yes')->orderBy('start_date', 'desc')->get()->toArray();
        });

        // CARA TERBAIK: Cache data dalam bentuk Array (->toArray()), BUKAN objek Eloquent
        $design = Cache::remember('all_design_array', 3600, function () {
            // Kita gunakan toArray() agar yang disimpan di cache benar-benar murni data
            return GrapichDesign::where('visible', 'yes')
                ->get()
                ->groupBy('category')
                ->flatMap(function ($group) {
                    return $group->shuffle()->take(15);
                })
                ->values()
                ->toArray();
        });

        $photovideo = Cache::remember('all_photovideo_array', 3600, function () {
            return PhotoVideo::where('visible', 'yes')
                ->get()
                ->groupBy('category')
                ->flatMap(function ($group) {
                    return $group->shuffle()->take(15);
                })
                ->values()
                ->toArray();
        });

        $website = Cache::remember('all_website_array', 3600, function () {
            return Website::where('visible', 'yes')
                ->get()
                ->groupBy('category')
                ->flatMap(function ($group) {
                    return $group->shuffle()->take(15);
                })
                ->map(function ($web) {
                    // Menggabungkan semua kolom url ke dalam satu array
                    $rawImages = [
                        $web->url_1,
                        $web->url_2,
                        $web->url_3,
                        $web->url_4,
                        $web->url_5,
                        $web->url_6,
                        $web->url_7,
                        $web->url_8
                    ];
                    return [
                        'id' => $web->id,
                        'category' => $web->category,
                        'title' => $web->title,
                        'origin' => $web->origin,
                        'link' => $web->link,
                        'description' => $web->description,
                        'tech' => $web->tech,
                        'images' => array_values(array_filter($rawImages)),
                    ];
                })
                ->values()
                ->toArray();
        });

        $others = Cache::remember('all_others_array', 3600, function () {
            return Other::where('visible', 'yes')
                ->get()
                ->groupBy('category')
                ->flatMap(function ($group) {
                    return $group->shuffle()->take(15);
                })
                ->values()
                ->toArray();
        });

        return Inertia::render('Home/index', [
            'profiles' => $profile,
            'skills' => $skill,
            'description_sections' => $descriptionSections,
            'certificates' => $certificate,
            'experiences' => $experience,
            'educations' => $education,
            'designs' => $design,
            'photovideos' => $photovideo,
            'websites' => $website,
            'others' => $others,
            'footers' => $profile,
        ]);
    }
}
