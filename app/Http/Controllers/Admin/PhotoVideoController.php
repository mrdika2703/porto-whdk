<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Profile;
use App\Models\PhotoVideo;
use App\Services\ImageService;
use App\Services\ThumbnaillService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PhotoVideoController extends Controller
{
    private function getProfile()
    {
        return Profile::where('user_id', Auth::id() ?? 1)->first();
    }

    public function index()
    {
        $profile = $this->getProfile();
        $photovideos = $profile ? PhotoVideo::where('profile_id', $profile->id)->latest()->paginate(15) : [];

        $categoryCounts = [];
        if ($profile) {
            $categoryCounts = PhotoVideo::where('profile_id', $profile->id)
                ->selectRaw('category, count(*) as total')
                ->groupBy('category')
                ->get()
                ->pluck('total', 'category')
                ->toArray();
        }

        return Inertia::render('Admin/PhotoVideo/Index', [
            'photovideos' => $photovideos,
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
        $categories = PhotoVideo::where('profile_id', $profile->id)
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/PhotoVideo/Form', [
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
            'type'        => 'required|in:photo,video',
            'link'        => 'nullable|string',
            'url_1'       => 'required|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:1024', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:1024',
            'url_3'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:1024',
            'url_4'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:1024',
            'url_5'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:1024',
            'visible'     => 'required|in:yes,no',
        ]);

        try {
            $validated['profile_id'] = $profile->id;

            foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5'] as $url) {
                if ($request->hasFile($url)) {
                    $validated[$url] = ImageService::compressAndStore($request->file($url), 'PhotoVideo');
                }
            }

            if ($request->hasFile('url_1')) {
                $validated['thumbnail'] = ThumbnaillService::compressAndStore($request->file('url_1'), 'PhotoVideo/thumbnail');
            }

            PhotoVideo::create($validated);
            Cache::forget('all_photovideo_array');

            return redirect()->route('admin.photo-video.index')->with('success', 'Data projek berhasil ditambahkan!');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $photovideos = PhotoVideo::findOrFail($id);
        $categories = PhotoVideo::where('profile_id', $photovideos->profile_id)
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/PhotoVideo/Form', [
            'photovideos' => $photovideos,
            'existingCategories' => $categories,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $photovideos = PhotoVideo::findOrFail($id);

        $validated = $request->validate([
            'category'    => 'required|string|max:255',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'type'        => 'required|in:photo,video',
            'link'        => 'nullable|string',
            'url_1'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:1024', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:1024',
            'url_3'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:1024',
            'url_4'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:1024',
            'url_5'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:1024',
            'visible'     => 'required|in:yes,no',
        ]);

        try {
            foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5'] as $url) {
                if ($request->hasFile($url)) {
                    // Hapus file lama jika ada
                    if ($photovideos->$url) {
                        Storage::disk('public')->delete($photovideos->$url);
                    }
                    $validated[$url] = ImageService::compressAndStore($request->file($url), 'PhotoVideo');
                } elseif ($request->input("clear_$url") === true || $request->input("clear_$url") === 'true' || $request->input("clear_$url") === 1 || $request->input("clear_$url") === '1') {
                    if ($photovideos->$url) {
                        Storage::disk('public')->delete($photovideos->$url);
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
                if ($photovideos->thumbnail) {
                    Storage::disk('public')->delete($photovideos->thumbnail);
                }
                $validated['thumbnail'] = ThumbnaillService::compressAndStore($request->file('url_1'), 'PhotoVideo/thumbnail');
            } elseif ($request->input('clear_url_1') === true || $request->input('clear_url_1') === 'true' || $request->input('clear_url_1') === 1 || $request->input('clear_url_1') === '1') {
                if ($photovideos->thumbnail) {
                    Storage::disk('public')->delete($photovideos->thumbnail);
                }
                $validated['thumbnail'] = null;
            }

            $photovideos->update($validated);
            Cache::forget('all_photovideo_array');

            return redirect()->route('admin.photo-video.index')->with('success', 'Data projek berhasil diperbarui!');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $photovideos = PhotoVideo::findOrFail($id);

        foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5'] as $url) {
            if ($photovideos->$url) {
                Storage::disk('public')->delete($photovideos->$url);
            }
        }

        $photovideos->delete();
        Cache::forget('all_photovideo_array');

        return redirect()->route('admin.photo-video.index')->with('success', 'Data projek berhasil dihapus!');
    }
}
