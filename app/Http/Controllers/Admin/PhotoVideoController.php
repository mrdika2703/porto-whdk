<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Profile;
use App\Models\PhotoVideo;
use Illuminate\Support\Facades\Auth;
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
        $photovideos = $profile ? PhotoVideo::where('profile_id', $profile->id)->latest()->get() : [];

        return Inertia::render('Admin/PhotoVideo/Index', [
            'photovideos' => $photovideos,
            'hasProfile' => (bool) $profile,
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
            'url_1'       => 'required|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'url_3'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'url_4'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'url_5'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
        ]);

        try {
            $validated['profile_id'] = $profile->id;

            foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5'] as $url) {
                if ($request->hasFile($url)) {
                    $validated[$url] = $request->file($url)->store('PhotoVideo', 'public');
                }
            }

            PhotoVideo::create($validated);

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
            'url_1'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'url_3'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'url_4'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'url_5'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
        ]);

        try {
            foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5'] as $url) {
                if ($request->hasFile($url)) {
                    // Hapus file lama jika ada
                    if ($photovideos->$url) {
                        Storage::disk('public')->delete($photovideos->$url);
                    }
                    $validated[$url] = $request->file($url)->store('photo-video', 'public');
                } else {
                    // Mencegah nilai tertimpa null jika file tidak diunggah ulang
                    unset($validated[$url]);
                }
            }

            $photovideos->update($validated);

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

        return redirect()->route('admin.photo-video.index')->with('success', 'Data projek berhasil dihapus!');
    }
}
