<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShelterProfile extends Model
{
    use HasFactory;
    protected $table = 'shelter_profiles';


    protected $fillable = [
        'shelter_id',
        'profile_picture',
        'representative_name',
        'username',
    ];

    // Define the relationship with the Shelter model
    public function shelter()
    {
        return $this->belongsTo(Shelter::class);
    }
}
