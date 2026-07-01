<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GrapichDesign; // Pastikan Model sudah dibuat
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GrapichDesignController extends Controller
{
    private function getProfile()
    {
        return Profile::where('user_id', Auth::id() ?? 1)->first();
    }

    public function index()
    {
        $profile = $this->getProfile();
        $designs = $profile ? GrapichDesign::where('profile_id', $profile->id)->latest()->paginate(15) : [];
        
        $categoryCounts = [];
        if ($profile) {
            $categoryCounts = GrapichDesign::where('profile_id', $profile->id)
                ->selectRaw('category, count(*) as total')
                ->groupBy('category')
                ->get()
                ->pluck('total', 'category')
                ->toArray();
        }

        return Inertia::render('Admin/GrapichDesign/Index', [
            'designs' => $designs,
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
            return redirect()->route('admin.grapich-design.index')->with('error', 'Buat profil terlebih dahulu sebelum menambah portofolio.');
        }

        // Ambil daftar kategori yang unik/tidak duplikat berdasarkan user profile
        $categories = GrapichDesign::where('profile_id', $profile->id)
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/GrapichDesign/Form', [
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
            'type'        => 'required|in:image,video',
            'link'        => 'nullable|string',
            'url_1'       => 'required|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'url_3'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'visible'     => 'required|in:yes,no',
        ]);

        try {
            $validated['profile_id'] = $profile->id;

            foreach (['url_1', 'url_2', 'url_3'] as $url) {
                if ($request->hasFile($url)) {
                    $validated[$url] = $request->file($url)->store('graphic-designs', 'public');
                }
            }

            GrapichDesign::create($validated);
            Cache::forget('all_design_array');

            return redirect()->route('admin.grapich-design.index')->with('success', 'Data desain berhasil ditambahkan!');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $design = GrapichDesign::findOrFail($id);
        $categories = GrapichDesign::where('profile_id', $design->profile_id)
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/GrapichDesign/Form', [
            'design' => $design,
            'existingCategories' => $categories,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $design = GrapichDesign::findOrFail($id);

        $validated = $request->validate([
            'category'    => 'required|string|max:255',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'type'        => 'required|in:image,video',
            'link'        => 'nullable|string',
            'url_1'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'url_3'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'visible'     => 'required|in:yes,no',
        ]);

        try {
            foreach (['url_1', 'url_2', 'url_3'] as $url) {
                if ($request->hasFile($url)) {
                    // Hapus file lama jika ada
                    if ($design->$url) {
                        Storage::disk('public')->delete($design->$url);
                    }
                    $validated[$url] = $request->file($url)->store('graphic-designs', 'public');
                } elseif ($request->input("clear_$url") === true || $request->input("clear_$url") === 'true' || $request->input("clear_$url") === 1 || $request->input("clear_$url") === '1') {
                    if ($design->$url) {
                        Storage::disk('public')->delete($design->$url);
                    }
                    $validated[$url] = null;
                } else {
                    // Mencegah nilai tertimpa null jika file tidak diunggah ulang
                    unset($validated[$url]);
                }
            }

            $design->update($validated);
            Cache::forget('all_design_array');

            return redirect()->route('admin.grapich-design.index')->with('success', 'Data desain berhasil diperbarui!');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $design = GrapichDesign::findOrFail($id);

        foreach (['url_1', 'url_2', 'url_3'] as $url) {
            if ($design->$url) {
                Storage::disk('public')->delete($design->$url);
            }
        }

        $design->delete();
        Cache::forget('all_design_array');

        return redirect()->route('admin.grapich-design.index')->with('success', 'Data desain berhasil dihapus!');
    }
}
