<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Menampilkan profil pengguna log in atau default ID 1.
     */
    public function index()
    {
        $userId = Auth::id() ?? 1;
        $profile = Profile::where('user_id', $userId)->first();

        return Inertia::render('Admin/Profile/Index', [
            'profile' => $profile,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    /**
     * Menyimpan profil baru jika belum ada.
     */
    public function store(Request $request)
    {
        $userId = Auth::id() ?? 1;

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'nickname'      => 'required|string|max:10',
            'passion'       => 'required|string|max:255',
            'about'         => 'required|string',
            'caption'       => 'required|string|max:255',
            'description'   => 'nullable|string',
            'description_coding'   => 'nullable|string',
            'description_multimedia'   => 'nullable|string',
            'passion_coding'   => 'nullable|string',
            'passion_multimedia'   => 'nullable|string',
            'ttl'           => 'required|date',
            'photo'         => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'whatsapp'      => 'required|string|max:255',
            'email'         => 'required|email|max:255',
            'linkedin'      => 'required|string|max:255',
            'linkedin_name' => 'required|string|max:255',
            'instagram'     => 'required|string|max:255',
            'github'        => 'required|string|max:255',
        ]);

        try {
            if ($request->hasFile('photo')) {
                $validated['photo'] = $request->file('photo')->store('profiles', 'public');
            }

            $validated['user_id'] = $userId;

            Profile::create($validated);
            Cache::forget('all_profile_array');

            return redirect()->route('admin.profiles.index')->with('success', 'Profil berhasil dibuat!');
        } catch (\Exception $e) {
            if (isset($validated['photo'])) {
                Storage::disk('public')->delete($validated['photo']);
            }
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Memperbarui profil yang sudah ada.
     */
    public function update(Request $request, Profile $profile)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'nickname'      => 'required|string|max:10',
            'passion'       => 'required|string|max:255',
            'about'         => 'required|string',
            'caption'       => 'required|string|max:255',
            'description'   => 'nullable|string',
            'description_coding'   => 'nullable|string',
            'description_multimedia'   => 'nullable|string',
            'passion_coding'   => 'nullable|string',
            'passion_multimedia'   => 'nullable|string',
            'ttl'           => 'required|date',
            'photo'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'whatsapp'      => 'required|string|max:255',
            'email'         => 'required|email|max:255',
            'linkedin'      => 'required|string|max:255',
            'linkedin_name' => 'required|string|max:255',
            'instagram'     => 'required|string|max:255',
            'github'        => 'required|string|max:255',
        ]);

        try {
            if ($request->hasFile('photo')) {
                $oldPhoto = $profile->photo;
                $validated['photo'] = $request->file('photo')->store('profiles', 'public');
            } else {
                unset($validated['photo']);
            }

            $profile->update($validated);
            Cache::forget('all_profile_array');

            if (isset($oldPhoto) && $oldPhoto) {
                Storage::disk('public')->delete($oldPhoto);
            }

            return redirect()->route('admin.profiles.index')->with('success', 'Profil berhasil diperbarui!');
        } catch (\Exception $e) {
            if (isset($validated['photo'])) {
                Storage::disk('public')->delete($validated['photo']);
            }
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}
