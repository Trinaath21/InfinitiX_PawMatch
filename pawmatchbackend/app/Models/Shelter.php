<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
class Shelter extends Model
{
    //
    use HasFactory,HasApiTokens;
    protected $table = 'shelter';
    protected $fillable=[
        'shelter_name',
        'state',
        'district',
        'detailed_address',
        'NoOfPets',
        'phone_number',
        'email',
        'website_url',	
        'description',
        'profile_picture',
        'password',
    ];
    public function profile()
    {
        return $this->hasOne(ShelterProfile::class, 'shelter_id', 'id');  // 外键是 member_id，主键是 id
    }
    public function shelterDonation()
    {
        return $this->hasOne(ShelterDonation::class, 'shelter_id');
    }
}
