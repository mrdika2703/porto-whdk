<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use App\Models\Visitor;
use App\Models\GrapichDesign;
use App\Models\Profile;
use App\Models\Skill;
use App\Models\Experience;
use App\Models\Education;
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
            ->where('user_agent', $userAgent)
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
            return Skill::all()->toArray();
        });

        $experience = Cache::remember('all_experience_array', 3600, function () {
            return Experience::all()->toArray();
        });

        $education = Cache::remember('all_education_array', 3600, function () {
            return Education::all()->toArray();
        });

        // CARA TERBAIK: Cache data dalam bentuk Array (->toArray()), BUKAN objek Eloquent
        $design = Cache::remember('all_design_array', 3600, function () {
            // Kita gunakan toArray() agar yang disimpan di cache benar-benar murni data
            return GrapichDesign::all()->toArray();
        });

        $photovideo = Cache::remember('all_photovideo_array', 3600, function () {
            return PhotoVideo::all()->toArray();
        });

        $website = Cache::remember('all_website_array', 3600, function () {
            return Website::all()->map(function ($web) {
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
            })->toArray();
        });

        return Inertia::render('Home/index', [
            'profiles' => $profile,
            'skills' => $skill,
            'experiences' => $experience,
            'educations' => $education,
            'designs' => $design,
            'photovideos' => $photovideo,
            'websites' => $website,
            'footers' => $profile,
        ]);
    }
}
