<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Other; // Pastikan Model sudah dibuat
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class OtherController extends Controller
{
    private function getProfile()
    {
        return Profile::where('user_id', Auth::id() ?? 1)->first();
    }

    public function index()
    {
        $profile = $this->getProfile();
        $others = $profile ? Other::where('profile_id', $profile->id)->latest()->get() : [];

        return Inertia::render('Admin/Others/Index', [
            'others' => $others,
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
            return redirect()->route('admin.grapich-design.index')->with('error', 'Buat profil terlebih dahulu sebelum menambah portofolio.');
        }

        // Ambil daftar kategori yang unik/tidak duplikat berdasarkan user profile
        $categories = Other::where('profile_id', $profile->id)
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/Others/Form', [
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
            'url_1'       => 'required|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:3076',
            'url_3'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:3076',
            'url_4'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:3076',
            'url_5'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:3076',
        ]);

        try {
            $validated['profile_id'] = $profile->id;

            foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5'] as $url) {
                if ($request->hasFile($url)) {
                    $validated[$url] = $request->file($url)->store('others', 'public');
                }
            }

            Other::create($validated);
            Cache::forget('all_others_array');

            return redirect()->route('admin.others.index')->with('success', 'Data Lainnya berhasil ditambahkan!');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $others = Other::findOrFail($id);
        $categories = Other::where('profile_id', $others->profile_id)
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/Others/Form', [
            'others' => $others,
            'existingCategories' => $categories,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $others = Other::findOrFail($id);

        $validated = $request->validate([
            'category'    => 'required|string|max:255',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'url_1'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:3076',
            'url_3'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:3076',
            'url_4'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:3076',
            'url_5'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:3076',
        ]);

        try {
            foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5'] as $url) {
                if ($request->hasFile($url)) {
                    // Hapus file lama jika ada
                    if ($others->$url) {
                        Storage::disk('public')->delete($others->$url);
                    }
                    $validated[$url] = $request->file($url)->store('others', 'public');
                } else {
                    // Mencegah nilai tertimpa null jika file tidak diunggah ulang
                    unset($validated[$url]);
                }
            }

            $others->update($validated);
            Cache::forget('all_others_array');

            return redirect()->route('admin.others.index')->with('success', 'Data Lainnya berhasil diperbarui!');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $others = Other::findOrFail($id);

        foreach (['url_1', 'url_2', 'url_3', 'url_4', 'url_5'] as $url) {
            if ($others->$url) {
                Storage::disk('public')->delete($others->$url);
            }
        }

        $others->delete();
        Cache::forget('all_others_array');

        return redirect()->route('admin.others.index')->with('success', 'Data lainnya berhasil dihapus!');
    }
}
