<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetAdoptionPost extends Model
{
    use HasFactory;

    // Define the table name if it doesn't follow the default Laravel naming convention
    protected $table = 'petadoptionposts';

    // Specify the primary key if it's not `id`
    protected $primaryKey = 'adoption_post_id';

    // Indicate that the primary key is not auto-incrementing if it's set manually
    public $incrementing = true;

    // Define the attributes that are mass assignable
    protected $fillable = [
        'id', 
        'name', 
        'species', 
        'breed', 
        'age', 
        'gender', 
        'size', 
        'weight', 
        'behavioral_traits', 
        'vaccination_status', 
        'spayed_neutered_status', 
        'health_issues', 
        'state', 
        'district', 
        'current_location', 
        'adoption_fee', 
        'status', 
        'isFromShelter',
        'petImage',
         // This attribute will store the image as a BLOB
    ];

    // protected $hidden = ['petImage'];

    // Disable timestamps if your table doesn't have `created_at` and `updated_at` columns
    // public $timestamps = false;
}

