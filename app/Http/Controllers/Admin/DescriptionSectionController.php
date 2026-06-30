<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\DescriptionSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DescriptionSectionController extends Controller
{
    /**
     * Get user profile.
     */
    private function getProfile()
    {
        $userId = Auth::id() ?? 1;
        return Profile::where('user_id', $userId)->first();
    }

    /**
     * Show description sections form.
     */
    public function index()
    {
        $profile = $this->getProfile();
        $descriptionSection = null;

        if ($profile) {
            $descriptionSection = DescriptionSection::where('profile_id', $profile->id)->first();
        }

        return Inertia::render('Admin/DescriptionSection/Form', [
            'descriptionSection' => $descriptionSection,
            'hasProfile' => !is_null($profile),
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    /**
     * Store new description section.
     */
    public function store(Request $request)
    {
        $profile = $this->getProfile();

        if (!$profile) {
            return redirect()->back()->with('error', 'Buat profil terlebih dahulu.');
        }

        $validated = $request->validate([
            'design_section'     => 'nullable|string',
            'photovideo_section' => 'nullable|string',
            'website_section'    => 'nullable|string',
            'other_section'      => 'nullable|string',
        ]);

        $validated['profile_id'] = $profile->id;

        DescriptionSection::create($validated);
        Cache::forget('description_sections_array');

        return redirect()->route('admin.description-sections.index')
            ->with('success', 'Deskripsi bagian berhasil ditambahkan!');
    }

    /**
     * Update existing description section.
     */
    public function update(Request $request, $id)
    {
        $descriptionSection = DescriptionSection::findOrFail($id);

        $validated = $request->validate([
            'design_section'     => 'nullable|string',
            'photovideo_section' => 'nullable|string',
            'website_section'    => 'nullable|string',
            'other_section'      => 'nullable|string',
        ]);

        $descriptionSection->update($validated);
        Cache::forget('description_sections_array');

        return redirect()->route('admin.description-sections.index')
            ->with('success', 'Deskripsi bagian berhasil diperbarui!');
    }
}
