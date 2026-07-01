<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CertificateController extends Controller
{
    private function getProfile()
    {
        return Profile::where('user_id', Auth::id() ?? 1)->first();
    }

    public function index()
    {
        $profile = $this->getProfile();
        $certificates = $profile ? Certificate::where('profile_id', $profile->id)->latest()->get() : [];

        $categoryCounts = [];
        if ($profile) {
            $categoryCounts = Certificate::where('profile_id', $profile->id)
                ->selectRaw('category, count(*) as total')
                ->groupBy('category')
                ->get()
                ->pluck('total', 'category')
                ->toArray();
        }

        return Inertia::render('Admin/Certificate/Index', [
            'certificates' => $certificates,
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
            return redirect()->route('admin.certificate.index')->with('error', 'Buat profil terlebih dahulu sebelum menambah portofolio.');
        }

        // Ambil daftar kategori yang unik/tidak duplikat berdasarkan user profile
        $categories = Certificate::where('profile_id', $profile->id)
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/Certificate/Form', [
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
            'start_date'  => 'required|date',
            'end_date'    => 'nullable|date',
            'url_1'       => 'required|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'viewmode'    => 'nullable|in:All,Programming,Multimedia',
            'visible'     => 'required|in:yes,no',
        ]);

        try {
            $validated['profile_id'] = $profile->id;

            foreach (['url_1', 'url_2'] as $url) {
                if ($request->hasFile($url)) {
                    $validated[$url] = $request->file($url)->store('certificates', 'public');
                }
            }

            Certificate::create($validated);
            Cache::forget('all_certificate_array');

            return redirect()->route('admin.certificate.index')->with('success', 'Data sertifikat berhasil ditambahkan!');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $certificates = Certificate::findOrFail($id);
        $categories = Certificate::where('profile_id', $certificates->profile_id)
            ->select('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/Certificate/Form', [
            'certificates' => $certificates,
            'existingCategories' => $categories,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $certificates = Certificate::findOrFail($id);

        $validated = $request->validate([
            'category'    => 'required|string|max:255',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date'  => 'required|date',
            'end_date'    => 'nullable|date',
            'url_1'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240', // 10MB max
            'url_2'       => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov,avi|max:10240',
            'viewmode'    => 'nullable|in:All,Programming,Multimedia',
            'visible'     => 'required|in:yes,no',
        ]);

        try {
            foreach (['url_1', 'url_2'] as $url) {
                if ($request->hasFile($url)) {
                    // Hapus file lama jika ada
                    if ($certificates->$url) {
                        Storage::disk('public')->delete($certificates->$url);
                    }
                    $validated[$url] = $request->file($url)->store('certificates', 'public');
                } elseif ($request->input("clear_$url") === true || $request->input("clear_$url") === 'true' || $request->input("clear_$url") === 1 || $request->input("clear_$url") === '1') {
                    if ($certificates->$url) {
                        Storage::disk('public')->delete($certificates->$url);
                    }
                    $validated[$url] = null;
                } else {
                    // Mencegah nilai tertimpa null jika file tidak diunggah ulang
                    unset($validated[$url]);
                }
            }

            $certificates->update($validated);
            Cache::forget('all_certificate_array');

            return redirect()->route('admin.certificate.index')->with('success', 'Data sertifikat berhasil diperbarui!');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $certificates = Certificate::findOrFail($id);

        foreach (['url_1', 'url_2'] as $url) {
            if ($certificates->$url) {
                Storage::disk('public')->delete($certificates->$url);
            }
        }

        $certificates->delete();
        Cache::forget('all_certificate_array');

        return redirect()->route('admin.certificate.index')->with('success', 'Data sertifikat berhasil dihapus!');
    }
}
