<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'nickname',
        'about',
        'caption',
        'description',
        'passion',
        'ttl',
        'photo',
        'whatsapp',
        'email',
        'linkedin',
        'instagram',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function grapichDesigns(): HasMany
    {
        return $this->hasMany(GrapichDesign::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(Education::class);
    }

    public function photoVideos(): HasMany
    {
        return $this->hasMany(PhotoVideo::class);
    }

    public function websites(): HasMany
    {
        return $this->hasMany(Website::class);
    }
}
