<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CvItem extends Model
{
    use HasFactory;

    protected $table = 'cv_items';

    protected $fillable = [
        'section',
        'title',
        'organization',
        'period',
        'description',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
