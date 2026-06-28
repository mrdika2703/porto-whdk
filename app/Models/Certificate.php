<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'profile_id',
        'category',
        'title',
        'description',
        'start_date',
        'end_date',
        'url_1',
        'url_2',
        'viewmode',
    ];
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
