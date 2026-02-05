<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reading extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'input_data',
        'result',
        'status',
    ];

    protected $casts = [
        'input_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
