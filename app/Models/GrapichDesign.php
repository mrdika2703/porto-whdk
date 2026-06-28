<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrapichDesign extends Model
{
    use HasFactory;

    // Mendefinisikan nama tabel secara manual karena menggunakan strip (-)
    protected $table = 'grapich-design';

    protected $fillable = [
        'profile_id',
        'category',
        'title',
        'description',
        'type',
        'link',
        'url_1',
        'url_2',
        'url_3',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
