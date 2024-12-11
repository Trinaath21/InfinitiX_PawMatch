<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shelter extends Model
{
    use HasFactory;
    protected $table = 'shelter'; // if the table name is different


    protected $fillable = ['shelter_name', 'phone_number', 'description', 'address', 'district', 'state'];

    public function shelterDonation()
    {
        return $this->hasOne(ShelterDonation::class, 'shelter_id');
    }
}
