<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Other extends Model
{
    protected $fillable = [
        'profile_id',
        'category',
        'title',
        'description',
        'url_1',
        'url_2',
        'url_3',
        'url_4',
        'url_5',
        'visible',
    ];
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
