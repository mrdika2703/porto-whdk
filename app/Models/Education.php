<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Education extends Model
{
    use HasFactory;

    // Mendefinisikan tabel secara manual untuk menghindari asumsi Laravel (educations)
    protected $table = 'education';

    protected $fillable = [
        'profile_id',
        'title',
        'origin',
        'description',
        'status',
        'start_date',
        'end_date',
        'visible',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
