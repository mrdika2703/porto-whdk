<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill; // Pastikan Model Skill sudah ada
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class SkillController extends Controller
{
    private function getProfile()
    {
        return Profile::where('user_id', Auth::id() ?? 1)->first();
    }

    public function index()
    {
        $profile = $this->getProfile();
        // Mengambil data skill terbaru berdasarkan profil
        $skills = $profile ? Skill::where('profile_id', $profile->id)->latest()->get() : [];

        return Inertia::render('Admin/Skills/Index', [
            'skills' => $skills,
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
            return redirect()->route('admin.skills.index')->with('error', 'Buat profil terlebih dahulu sebelum menambah keahlian.');
        }

        return Inertia::render('Admin/Skills/Form');
    }

    public function store(Request $request)
    {
        $profile = $this->getProfile();

        $validated = $request->validate([
            'name_skills' => 'required|string|max:20',
            'category'    => 'required|in:Soft Skill,Hard Skill',
            'level'       => 'nullable|in:Beginner,Intermediate,Expert',
            'icon'        => 'nullable|string|max:255',
            'viewmode'    => 'nullable|in:All,Programming,Multimedia',
        ]);

        $validated['profile_id'] = $profile->id;
        Skill::create($validated);
        Cache::forget('all_skill_array');

        return redirect()->route('admin.skills.index')->with('success', 'Keahlian berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $skill = Skill::findOrFail($id);
        return Inertia::render('Admin/Skills/Form', [
            'skill' => $skill
        ]);
    }

    public function update(Request $request, $id)
    {
        $skill = Skill::findOrFail($id);

        $validated = $request->validate([
            'name_skills' => 'required|string|max:20',
            'category'    => 'required|in:Soft Skill,Hard Skill',
            'level'       => 'nullable|in:Beginner,Intermediate,Expert',
            'icon'        => 'nullable|string|max:255',
            'viewmode'    => 'nullable|in:All,Programming,Multimedia',
        ]);

        $skill->update($validated);
        Cache::forget('all_skill_array');

        return redirect()->route('admin.skills.index')->with('success', 'Keahlian berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $skill = Skill::findOrFail($id);
        $skill->delete();
        Cache::forget('all_skill_array');

        return redirect()->route('admin.skills.index')->with('success', 'Keahlian berhasil dihapus!');
    }
}
