<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShelterProfile extends Model
{
    use HasFactory;
    protected $table = 'shelter_profile';

    protected $fillable = [
        'shelter_id',
       // 'website_url',
        //'description',
        'representative_name',
        'username',
        'contact_number',
        //'state',
        //'district',
        //'detailed_address',
        //'phone_number',
        //'NoOfPets'
    ];

    // Define the relationship with the Shelter model
    public function shelter()
    {
        return $this->belongsTo(Shelter::class);
    }
}
