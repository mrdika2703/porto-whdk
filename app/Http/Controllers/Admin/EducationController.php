<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Education;
use App\Models\Profile;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EducationController extends Controller
{
    private function getProfile()
    {
        return Profile::where('user_id', Auth::id() ?? 1)->first();
    }

    public function index()
    {
        $profile = $this->getProfile();
        $education = $profile ? Education::where('profile_id', $profile->id)->latest()->get() : [];

        return Inertia::render('Admin/Education/Index', [
            'education' => $education,
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
            return redirect()->route('admin.education.index')->with('error', 'Buat profil terlebih dahulu sebelum menambah pengalaman.');
        }

        return Inertia::render('Admin/Education/Form');
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
        ]);

        $validated['profile_id'] = $profile->id;
        Education::create($validated);

        return redirect()->route('admin.education.index')->with('success', 'Pendidikan berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $education = Education::findOrFail($id);
        return Inertia::render('Admin/Education/Form', [
            'education' => $education
        ]);
    }

    public function update(Request $request, $id)
    {
        $education = Education::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'origin' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'status' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
        ]);

        $education->update($validated);

        return redirect()->route('admin.education.index')->with('success', 'Pendidikan berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $education = Education::findOrFail($id);
        $education->delete();

        return redirect()->route('admin.education.index')->with('success', 'Pendidikan berhasil dihapus!');
    }
}
