<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShelterDonation extends Model
{
    use HasFactory;
    public $timestamps = true; // Enable timestamps
    protected $table = 'shelterdonation';
    protected $primaryKey = 'shelter_id';

    protected $fillable = [
        'shelter_id',
        'qr_code',
        'account_owner_name',
        'account_number',
        'bank',
    ];

    public function shelter()
    {
        return $this->belongsTo(Shelter::class);
    }
}

