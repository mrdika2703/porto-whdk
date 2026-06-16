<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\GrapichDesignController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\EducationController;
use App\Http\Controllers\Admin\PhotoVideoController;
use App\Http\Controllers\Admin\WebsiteController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\OtherController;

Route::name('guest')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
});

Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

Route::get('/admin', function () {
    if (Auth::check()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('admin.login');
});

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profiles', [ProfileController::class, 'index'])->name('profiles.index');
    Route::post('/profiles', [ProfileController::class, 'store'])->name('profiles.store');
    Route::post('/profiles/{profile}', [ProfileController::class, 'update'])->name('profiles.update');

    Route::get('/grapich-design', [GrapichDesignController::class, 'index'])->name('grapich-design.index');
    Route::get('/grapich-design/create', [GrapichDesignController::class, 'create'])->name('grapich-design.create');
    Route::post('/grapich-design', [GrapichDesignController::class, 'store'])->name('grapich-design.store');
    Route::get('/grapich-design/{id}/edit', [GrapichDesignController::class, 'edit'])->name('grapich-design.edit');
    Route::post('/grapich-design/{id}', [GrapichDesignController::class, 'update'])->name('grapich-design.update');
    Route::delete('/grapich-design/{id}', [GrapichDesignController::class, 'destroy'])->name('grapich-design.destroy');

    Route::get('/skills', [SkillController::class, 'index'])->name('skills.index');
    Route::get('/skills/create', [SkillController::class, 'create'])->name('skills.create');
    Route::post('/skills', [SkillController::class, 'store'])->name('skills.store');
    Route::get('/skills/{id}/edit', [SkillController::class, 'edit'])->name('skills.edit');
    Route::put('/skills/{id}', [SkillController::class, 'update'])->name('skills.update');
    Route::delete('/skills/{id}', [SkillController::class, 'destroy'])->name('skills.destroy');

    Route::get('/experience', [ExperienceController::class, 'index'])->name('experience.index');
    Route::get('/experience/create', [ExperienceController::class, 'create'])->name('experience.create');
    Route::post('/experience', [ExperienceController::class, 'store'])->name('experience.store');
    Route::get('/experience/{id}/edit', [ExperienceController::class, 'edit'])->name('experience.edit');
    Route::put('/experience/{id}', [ExperienceController::class, 'update'])->name('experience.update');
    Route::delete('/experience/{id}', [ExperienceController::class, 'destroy'])->name('experience.destroy');

    Route::get('/education', [EducationController::class, 'index'])->name('education.index');
    Route::get('/education/create', [EducationController::class, 'create'])->name('education.create');
    Route::post('/education', [EducationController::class, 'store'])->name('education.store');
    Route::get('/education/{id}/edit', [EducationController::class, 'edit'])->name('education.edit');
    Route::put('/education/{id}', [EducationController::class, 'update'])->name('education.update');
    Route::delete('/education/{id}', [EducationController::class, 'destroy'])->name('education.destroy');

    Route::get('/photo-video', [PhotoVideoController::class, 'index'])->name('photo-video.index');
    Route::get('/photo-video/create', [PhotoVideoController::class, 'create'])->name('photo-video.create');
    Route::post('/photo-video', [PhotoVideoController::class, 'store'])->name('photo-video.store');
    Route::get('/photo-video/{id}/edit', [PhotoVideoController::class, 'edit'])->name('photo-video.edit');
    Route::post('/photo-video/{id}', [PhotoVideoController::class, 'update'])->name('photo-video.update');
    Route::delete('/photo-video/{id}', [PhotoVideoController::class, 'destroy'])->name('photo-video.destroy');

    Route::get('/website', [WebsiteController::class, 'index'])->name('website.index');
    Route::get('/website/create', [WebsiteController::class, 'create'])->name('website.create');
    Route::post('/website', [WebsiteController::class, 'store'])->name('website.store');
    Route::get('/website/{id}/edit', [WebsiteController::class, 'edit'])->name('website.edit');
    Route::post('/website/{id}', [WebsiteController::class, 'update'])->name('website.update');
    Route::delete('/website/{id}', [WebsiteController::class, 'destroy'])->name('website.destroy');

    Route::get('/certificate', [CertificateController::class, 'index'])->name('certificate.index');
    Route::get('/certificate/create', [CertificateController::class, 'create'])->name('certificate.create');
    Route::post('/certificate', [CertificateController::class, 'store'])->name('certificate.store');
    Route::get('/certificate/{id}/edit', [CertificateController::class, 'edit'])->name('certificate.edit');
    Route::post('/certificate/{id}', [CertificateController::class, 'update'])->name('certificate.update');
    Route::delete('/certificate/{id}', [CertificateController::class, 'destroy'])->name('certificate.destroy');

    Route::get('/others', [OtherController::class, 'index'])->name('others.index');
    Route::get('/others/create', [OtherController::class, 'create'])->name('others.create');
    Route::post('/others', [OtherController::class, 'store'])->name('others.store');
    Route::get('/others/{id}/edit', [OtherController::class, 'edit'])->name('others.edit');
    Route::post('/others/{id}', [OtherController::class, 'update'])->name('others.update');
    Route::delete('/others/{id}', [OtherController::class, 'destroy'])->name('others.destroy');
});

Route::fallback(function () {
    return redirect('/');
});
