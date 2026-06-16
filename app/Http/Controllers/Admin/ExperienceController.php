<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Experience;
use App\Models\Profile;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    private function getProfile()
    {
        return Profile::where('user_id', Auth::id() ?? 1)->first();
    }

    public function index()
    {
        $profile = $this->getProfile();
        $experience = $profile ? Experience::where('profile_id', $profile->id)->latest()->get() : [];

        return Inertia::render('Admin/Experience/Index', [
            'experience' => $experience,
            'hasProfile' => (bool) $profile,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function create()
    {
        if (!$this->getProfile()) {
            return redirect()->route('admin.experience.index')->with('error', 'Buat profil terlebih dahulu sebelum menambah pengalaman.');
        }

        return Inertia::render('Admin/Experience/Form');
    }

    public function store(Request $request)
    {
        $profile = $this->getProfile();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'origin' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'status' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'duration' => 'nullable|string|max:255',
        ]);

        $validated['profile_id'] = $profile->id;
        Experience::create($validated);

        return redirect()->route('admin.experience.index')->with('success', 'Pengalaman berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $experience = Experience::findOrFail($id);
        return Inertia::render('Admin/Experience/Form', [
            'experience' => $experience
        ]);
    }

    public function update(Request $request, $id)
    {
        $experience = Experience::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'origin' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'status' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'duration' => 'nullable|string|max:255',
        ]);

        $experience->update($validated);

        return redirect()->route('admin.experience.index')->with('success', 'Pengalaman berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $experience = Experience::findOrFail($id);
        $experience->delete();

        return redirect()->route('admin.experience.index')->with('success', 'Pengalaman berhasil dihapus!');
    }
}
