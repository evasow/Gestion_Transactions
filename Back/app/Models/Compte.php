<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compte extends Model
{
    use HasFactory;

    protected $guarded = [
        'id',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
