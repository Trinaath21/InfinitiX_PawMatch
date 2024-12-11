<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


class StrayReportController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Incoming Data:', $request->all());
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'breed' => 'required|string',
            'colour' => 'required|string',
            'dateSighting' => 'required|date',
            'location' => 'required|string',
            'description' => 'required|string',
            'contactPhone' => 'required|string',
            // 'district' => 'required|string',
            // 'state' => 'required|string',
            'species' => 'required|string',
            'images' => 'required|image|mimes:jpeg,png,gif|max:1000000', // Max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Handle the single image upload
            $imageBinary = file_get_contents($request->file('images')->getPathname());

            // Insert the stray animal report into the database
            $reportId = DB::table('strayanimalreport')->insertGetId([
                'user_id' => $request->user_id,
                'breed' => $request->breed,
                'colour' => $request->colour,
                'status' => "active",
                'dateSighting' => $request->dateSighting,
                'location' => $request->location,
                'description' => $request->description,
                'contactPhone' => $request->contactPhone,
                'lat' => $request->lat,
                'lng' => $request->lng,
                'district' => $request->district,
                'state' => $request->state,
                'species' => $request->species,
                'images' => $imageBinary, // Store the image as MEDIUMBLOB
            ]);

            // Return success message
            return response()->json([
                'success' => true,
                'reportId' => $reportId,
                'message' => 'Stray animal report added successfully!',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save stray animal report. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAllStrayReports(Request $request)
    {
        try {
            $excludedUserId = $request->input('user_id'); // Assuming 'user_id' is sent in the request

            $reports = DB::table('strayanimalreport')
                ->join('member', 'strayanimalreport.user_id', '=', 'member.user_id')
                ->where('strayanimalreport.status', 'active')
                ->where('strayanimalreport.user_id', '!=', $excludedUserId)
                ->select('strayanimalreport.*', 'member.*') // Fetches all fields from both tables
                ->get();
            
            
        
    
            $reports = $reports->map(function ($report) {
                if ($report->images !== null) {
                    $report->images = base64_encode($report->images);
                } else {
                    $report->image = null;
                }
                return $report;
            });
    
            // Return the reports as a JSON response
            return response()->json(['success' => true, 'data' => $reports], 200);
        } catch (\Exception $e) {
            // Handle any errors and return a 500 response
            return response()->json(['success' => false, 'message' => 'Error retrieving reports'], 500);
        }
    }

    public function deleteStrayReport(Request $request)
    {
        $reportID = $request->input('reportID');
        DB::table('strayanimalreport')->where('report_id', $reportID)->delete();

        return response()->json(['success' => true, 'message' => 'Report deleted successfully']);
    }

    public function getAllStrayReportsByUserID(Request $request)
    {
        try {
            $reports = DB::table('strayanimalreport')
            ->where('user_id', $request->userID)
            ->get();

            Log::info('Fetched reports:', $reports->toArray());
    
            $reports = $reports->map(function ($report) {
                if ($report->images !== null) {
                    $report->images = base64_encode($report->images);
                } else {
                    $report->images = null; // Set image to null if it doesn't exist
                }

                Log::info('Report ID ' . $report->report_id . ' - dateSighting: ' . $report->dateSighting);

                // if (!empty($report->dateSighting)) {
                //     $report->dateSighting = Carbon::parse($report->dateSighting)->format('Y-m-d');
                // }

                return $report;
            });
            
    
            // Return the reports as a JSON response
            return response()->json(['success' => true, 'data' => $reports], 200);
        } catch (\Exception $e) {
            // Handle any errors and return a 500 response
            return response()->json(['success' => false, 'message' => 'Error retrieving reports'], 500);
        }
    }

    public function updateStrayReport(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'breed' => 'required|string',
            'colour' => 'required|string',
            'dateSighting' => 'required|date',
            'location' => 'required|string',
            'description' => 'required|string',
            'contactPhone' => 'required|string',
            // 'district' => 'required|string',
            // 'state' => 'required|string',
            'species' => 'required|string',
            //'images' => 'required|image|mimes:jpeg,png,gif|max:1000000', // Max 2MB
        ]);
    
        // Collect the update data, excluding image initially
        $reportData = [
            'breed' => $request->breed,
            'colour' => $request->colour,
           // 'status' => "active",
            'dateSighting' => $request->dateSighting,
            'location' => $request->location,
            'description' => $request->description,
            'contactPhone' => $request->contactPhone,
            'lat' => $request->lat,
            'lng' => $request->lng,
            //'district' => $request->district,
            //'state' => $request->state,
            'species' => $request->species,
            //'images' => $imageBinary, // Store the image as MEDIUMBLOB
        ];
    
        // Handle image upload if present
        if ($request->hasFile('images')) {
            $imageBinary = file_get_contents($request->file('images')->getPathname());
            $reportData['images'] = $imageBinary;
        }
    
        // Update the report in the database
        DB::table('strayanimalreport')
            ->where('report_id', $request->id)
            ->update($reportData);
    
        // Retrieve the updated report, excluding the image
        $updatedReport = DB::table('strayanimalreport')
            ->where('report_id', $request->id)
            ->select('report_id', 'breed', 'colour', 'dateSighting', 'description', 'contactPhone', 'lat', 'lng', 'species') // Exclude the image column
            ->first();

            // if ($updatedReport && $updatedReport->dateSighting) {
            //     $updatedReport->dateSighting = Carbon::parse($updatedReport->dateSighting)->format('Y-m-d');
            // }
    
        return response()->json([
            'message' => 'Report updated successfully',
            'report' => $updatedReport,
        ]);
    }

    public function getSpecificStrayReport(Request $request)
    {
        try {
            $reportID = $request->input('reportID');
            \Log::info('Received Report ID: ' . $reportID);

    
            //Fetch the specific report with user information using DB::table
            $report = DB::table('strayanimalreport')
                ->join('member', 'strayanimalreport.user_id', '=', 'member.user_id')
                ->where('strayanimalreport.report_id', $reportID)
                ->select(
                    // Report information
                    'strayanimalreport.report_id as report_id',
                    'strayanimalreport.created_at',
                    'strayanimalreport.location',
                    'strayanimalreport.district',
                    'strayanimalreport.status',
                    
                    // User information
                    'member.user_id as user_id',
                    'member.name as name',
                    'member.email as email',
                    'member.phoneNumber as phoneNumber',
                    
                    // Pet information (from reportlostfound table)
                    'strayanimalreport.breed',
                    'strayanimalreport.colour',
                    'strayanimalreport.species',
                    'strayanimalreport.description as description',
                    'strayanimalreport.images'
                )
                ->first();

                // $report = DB::table('strayanimalreport')
                // ->join('member', 'strayanimalreport.user_id', '=', 'member.user_id')
                // ->where('strayanimalreport.report_id', $reportID)
                // ->select('strayanimalreport.report_id as report_id', 'strayanimalreport.created_at')
                // ->first();

                // dd($report); // Check the result

    
            // Check if report exists
            if (!$report) {
                return response()->json(['success' => false, 'message' => 'Report not found'], 404);
            }
    
            // Fetch the replies related to this report and count the pending replies
            // $noOfReplies = DB::table('replyLostReport')
            //     ->where('report_id', $reportID)
            //     ->where('status', 'pending') // Filter for pending replies
            //     ->count();
    
            // Initialize "found" as null
            //$found = null;
    
            // If the report status is "Resolved", fetch the related "Completed" reply
            // if ($report->status == 'resolved') {
            //     $found = DB::table('replylostreport')
            //         ->where('report_id', $reportID)
            //         ->where('status', 'Completed')
            //         ->select(
            //             'id',
            //             'name as name',
            //             'phoneNumber as phoneNumber',
            //             'last_seen_location as last_seen_location',
            //             'reportedDate as reportedDate',
            //             'detailed_address as detailed_address',
            //             'email as email',
            //             'description as description',
            //             'image as image'
            //         )
            //         ->first();
    
            //     // If a "Completed" reply exists, encode its image if present
            //     if ($found) {
            //         $found->image = $found->image ? base64_encode($found->image) : null;
            //     }
            // }
    
            // Structure data as required by the frontend
            // $data = [
            //     'report_id' => $report->report_id,
            //     'date_reported' => $report->date_reported,
            //     'last_seen_location' => $report->last_seen_location,
            //     'district' => $report->district,
            //     'status' => $report->status,
            //     'noOfReplies' => $noOfReplies, // Count of pending replies
    
            //     // User information
            //     'user' => [
            //         'name' => $report->name,
            //         'email' => $report->email,
            //         'phoneNumber' => $report->phoneNumber,
            //         'user_id' => $report->user_id,
            //     ],
    
            //     // Pet information
            //     'pet' => [
            //         'pet_name' => $report->pet_name,
            //         'species' => $report->species,
            //         'breed' => $report->breed,
            //         'color' => $report->color,
            //         'age' => $report->age,
            //         'size' => $report->size,
            //         'description' => $report->description,
            //         'image' => $report->image ? base64_encode($report->image) : null, // Encode image if present
            //     ],
    
            //     // Found information
            //     'found' => $found,
            // ];
    
            // Return structured data as JSON
            // return response()->json(['success' => true, 'data' => $data], 200);
    
        } catch (\Exception $e) {
            // Handle any errors
            return response()->json(['success' => false, 'message' => 'Error retrieving report data'], 500);
        }
    }
}
