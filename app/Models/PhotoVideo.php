<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotoVideo extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'category',
        'title',
        'description',
        'type',
        'url_1',
        'url_2',
        'url_3',
        'url_4',
        'url_5',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
