<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Profile;
use App\Models\Website;
use App\Services\ImageService;
use App\Services\ThumbnaillService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WebsiteController extends Controller
{
    private function getProfile()
    {
        return Profile::where('user_id', Auth::id() ?? 1)->first();
    }

    public function index()
    {
        $profile = $this->getProfile();
        $websites = $profile ? Website::where('profile_id', $profile->id)->latest()->paginate(15) : [];

        $categoryCounts = [];
        if ($profile) {
            $categoryCounts = Website::where('profile_id', $profile->id)
                ->selectRaw('category, count(*) as total')
                ->groupBy('category')
                ->get()
                ->pluck('total', 'category')
                ->toArray();
        }

        return Inertia::render('Admin/Website/Index', [
            'websites' => $websites,
            'hasProfile' => (bool) $profile,
            'categoryCounts' => (object) $categoryCounts,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function create()
    {
        $profile = $this->getProfile();
        if (!$profile) {
            return redirect()->route('admin.photo-video.index')->with('error', 'Buat profil terlebih dahulu sebelum menambah portofolio.');
        }

        // Ambil daftar kategori yang unik/tidak duplikat berdasarkan user profile
        $categories = Website::where('profile_id', $profile->id)
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/Website/Form', [
            'existingCategories' => $categories,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $profile = $this->getProfile();

        $validated = $request->validate([
            'category'    => 'required|string|max:255',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'tech'        => 'nullable|string',
            'link'        => 'nullable|string',
            'origin'      => 'nullable|string',
            'url_1'       => 'required|file|mimes:jpeg,png,jpg,webp|max:2048', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_3'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_4'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_5'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_6'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_7'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_8'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'visible'     => 'required|in:yes,no',
        ]);

        try {
            $validated['profile_id'] = $profile->id;

            foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5', 'url_6', 'url_7', 'url_8'] as $url) {
                if ($request->hasFile($url)) {
                    $validated[$url] = ImageService::compressAndStore($request->file($url), 'Website');
                }
            }

            if ($request->hasFile('url_1')) {
                $validated['thumbnail'] = ThumbnaillService::compressAndStore($request->file('url_1'), 'Website/thumbnail');
            }

            Website::create($validated);
            Cache::forget('all_website_array');

            return redirect()->route('admin.website.index')->with('success', 'Data projek berhasil ditambahkan!');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $websites = Website::findOrFail($id);
        $categories = Website::where('profile_id', $websites->profile_id)
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/Website/Form', [
            'websites' => $websites,
            'existingCategories' => $categories,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $websites = Website::findOrFail($id);

        $validated = $request->validate([
            'category'    => 'required|string|max:255',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'tech'        => 'nullable|string',
            'link'        => 'nullable|string',
            'origin'      => 'nullable|string',
            'url_1'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_3'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_4'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_5'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_6'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_7'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'url_8'       => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'visible'     => 'required|in:yes,no',
        ]);

        try {
            foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5', 'url_6', 'url_7', 'url_8'] as $url) {
                if ($request->hasFile($url)) {
                    // Hapus file lama jika ada
                    if ($websites->$url) {
                        Storage::disk('public')->delete($websites->$url);
                    }
                    $validated[$url] = ImageService::compressAndStore($request->file($url), 'Website');
                } elseif ($request->input("clear_$url") === true || $request->input("clear_$url") === 'true' || $request->input("clear_$url") === 1 || $request->input("clear_$url") === '1') {
                    if ($websites->$url) {
                        Storage::disk('public')->delete($websites->$url);
                    }
                    $validated[$url] = null;
                } else {
                    // Mencegah nilai tertimpa null jika file tidak diunggah ulang
                    unset($validated[$url]);
                }
            }

            // Update thumbnail based on url_1 changes
            if ($request->hasFile('url_1')) {
                // Delete old thumbnail
                if ($websites->thumbnail) {
                    Storage::disk('public')->delete($websites->thumbnail);
                }
                $validated['thumbnail'] = ThumbnaillService::compressAndStore($request->file('url_1'), 'graphic-websitess/thumbnail');
            } elseif ($request->input('clear_url_1') === true || $request->input('clear_url_1') === 'true' || $request->input('clear_url_1') === 1 || $request->input('clear_url_1') === '1') {
                if ($websites->thumbnail) {
                    Storage::disk('public')->delete($websites->thumbnail);
                }
                $validated['thumbnail'] = null;
            }

            $websites->update($validated);
            Cache::forget('all_website_array');

            return redirect()->route('admin.website.index')->with('success', 'Data projek berhasil diperbarui!');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $websites = Website::findOrFail($id);

        foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5'] as $url) {
            if ($websites->$url) {
                Storage::disk('public')->delete($websites->$url);
            }
        }

        $websites->delete();
        Cache::forget('all_website_array');

        return redirect()->route('admin.website.index')->with('success', 'Data projek berhasil dihapus!');
    }
}
