<?php

namespace App\Http\Controllers;

use App\Models\Shelter;
use Illuminate\Http\Request;
use App\Models\ShelterDonation;

class DonationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            //'shelterId' => 'required|integer',
            'accountOwnerName' => 'required|string',
            'accountNumber' => 'required|string',
            'qrImage' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            
        ]);

        // Handle file upload
        $qrCodePath = file_get_contents(($request->file('qrImage'))->getPathname());
        // ->store('qrcodes', 'public');

        $shelterId = 5;

        \Log::info($qrCodePath);

        // Create donation record
        ShelterDonation::create([
            'shelter_id' => $shelterId,
            'qr_code' => $qrCodePath,
            'account_owner_name' => $request->accountOwnerName,
            'account_number' => $request->accountNumber,
        ]);

        return response()->json(['message' => 'Donation details added successfully'], 201);
    }

    // Fetch donation details by shelter ID
    public function show($shelter_id)
    {
        $donation = ShelterDonation::where('shelter_id', $shelter_id)->first();

        if (!$donation) {
            return response()->json(['message' => 'Donation not found'], 404);
        }
        
        // Determine MIME type dynamically
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_buffer($finfo, $donation->qr_code);
        finfo_close($finfo);
        
        return response()->json([
            'account_owner_name' => $donation->account_owner_name,
            'account_number' => $donation->account_number,
            'qr_code' => 'data:' . $mimeType . ';base64,' . base64_encode($donation->qr_code)
        ], 200);
        
    }

    // Update donation details
    public function update(Request $request, $shelter_id)
    {
        \Log::info('Request data: ', $request->all());
        \Log::info('id is ',['shelter_id' => $shelter_id]);
        $request->validate([
            'accountOwnerName' => 'required|string',
            'accountNumber' => 'required|string',
            'qr_code' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        

        //$donation = ShelterDonation::where('shelter_id', $shelter_id)->first();
        $donation = ShelterDonation::where('shelter_id', $shelter_id)->firstOrFail();       


        if (!$donation) {
            return response()->json(['message' => 'Donation not found'], 404);
        }

        $donation->account_owner_name = $request->accountOwnerName;
        $donation->account_number = $request->accountNumber;

        // Update QR code image if a new one is uploaded
        if ($request->hasFile('qr_code')) {
            $qrCodePath = file_get_contents($request->file('qr_code')->getRealPath());
            $donation->qr_code = $qrCodePath;
        }

        $donation->save();

        return response()->json(['message' => 'Donation details updated successfully'], 200);
    }

    public function fetchShelters()
    {
        $shelter = \App\Models\Shelter::select('shelter_id', 'shelter_name', 'phone_number', 'description', 'detailed_address', 'district', 'state')->get();
        //Log::info('Shelters Data:', $shelter->toArray());
        return response()->json($shelter, 200);
    }

    // public function fetchShelterDonations($shelter_id)
    // {
    //     $donation = \App\Models\ShelterDonation::where('shelter_id', $shelter_id)->first();

    //     if (!$donation) {
    //         return response()->json(['message' => 'Donation not found'], 404);
    //     }

    //     return response()->json([
    //         'account_owner_name' => $donation->account_owner_name,
    //         'account_number' => $donation->account_number,
    //         'qr_code' => 'data:image/png;base64,' . base64_encode($donation->qr_code),
    //     ], 200);
    // }

    public function fetchShelterDonations($shelter_id)
{
    \Log::info('Fetching donation for shelter_id:', ['shelter_id' => $shelter_id]);
    $donation = \App\Models\ShelterDonation::where('shelter_id', $shelter_id)->first();
    
    if (!$donation) {
        \Log::info('No donation found for shelter_id:', ['shelter_id' => $shelter_id]);
        return response()->json(['message' => 'Donation not found'], 404);
    }

    return response()->json([
        'account_owner_name' => $donation->account_owner_name,
        'account_number' => $donation->account_number,
        'qr_code' => 'data:image/png;base64,' . base64_encode($donation->qr_code),
    ], 200);
}

}


