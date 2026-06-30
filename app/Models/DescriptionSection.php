<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DescriptionSection extends Model
{
    protected $table = 'description_sections';

    protected $fillable = [
        'profile_id',
        'design_section',
        'photovideo_section',
        'website_section',
        'other_section',
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
