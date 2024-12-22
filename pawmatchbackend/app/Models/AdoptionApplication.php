<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdoptionApplication extends Model
{
    use HasFactory;

    // Define the table name if it doesn't follow the default Laravel naming convention
    protected $table = 'adoptionapplication';

    // Specify the primary key if it's not `id`
    protected $primaryKey = 'application_id';

    // Indicate that the primary key is not auto-incrementing if it's set manually
    public $incrementing = true;

    // Define the attributes that are mass assignable
    protected $fillable = [
        'adoption_post_id',
        'user_id',
        'applicant_name',
        'applicant_age',
        'phone_number',
        'current_pets_count',
        'previous_pet_experience',
        'application_date',
        'status',
    ];

    // protected $hidden = ['petImage'];

    // Disable timestamps if your table doesn't have `created_at` and `updated_at` columns
    // public $timestamps = false;
}

