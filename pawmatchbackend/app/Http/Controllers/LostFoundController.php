<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon; // Import Carbon
class LostFoundController extends Controller
{

        public function store(Request $request)
        {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|integer', 
                'name' => 'required|string',
                'breed' => 'required|string',
                'colour' => 'required|string',
                'dateLost' => 'required|date',
                'location' => 'required|string',
                'description' => 'required|string',
                'species' => 'required|string',
                'age' => 'required|integer|min:0',
                'size' => 'required|integer|min:0',
                'contactEmail' => 'required|email',
                'contactPhone' => 'required|string',
                'image' => 'required|image|mimes:jpeg,png,gif|max:2048', // Max 2MB
            ]);
        
            if ($validator->fails()) {
                // Return validation errors with 422 status
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }
        
            try {
                // Handle the single image
                $imageBinary = file_get_contents($request->file('image')->getPathname());
        
                // Insert the new lost pet report into the database
                $lostPetId = DB::table('reportlostfound')->insertGetId([
                    'user_id' => $request->user_id,
                    'pet_name' => $request->name,
                    'breed' => $request->breed,
                    'color' => $request->colour,
                    'report_type' => "lost",
                    'status' => "active",
                    'dateLost' => $request->dateLost,
                    'last_seen_location' => $request->location,
                    'description' => $request->description,
                    'species' => $request->species,
                    'age' => $request->age,
                    'size' => $request->size,
                    'district' => $request->district,
                    'state' => $request->state,
                    'lat' => $request->lat,
                    'lng' => $request->lng,
                    'date_reported' => Carbon::today()->toDateString(),
                    'image' => $imageBinary, // Store the image as MEDIUMBLOB
                ]);
        
                // Return success message
                return response()->json([
                    'success' => true,
                    'lostPetId' => $lostPetId,
                ], 201);
        
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save lost pet report. Please try again.',
                    'error' => $e->getMessage(), // Optional: include the exception message for debugging
                ], 500);
            }
        }
        public function deleteLostReport(Request $request)
        {
            $reportID = $request->input('reportID');
            DB::table('reportlostfound')->where('report_id', $reportID)->delete();

            return response()->json(['success' => true, 'message' => 'Report deleted successfully']);
        }

        public function getAllReports(Request $request)
        {
            try {
                $reports = DB::table('reportlostfound')
                ->where('user_id', $request->userID)
                ->get();
        
                $reports = $reports->map(function ($report) {
                    if ($report->image !== null) {
                        $report->image = base64_encode($report->image);
                    } else {
                        $report->image = null; // Set image to null if it doesn't exist
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

        public function updateReport(Request $request)
        {
            // Validate incoming request
            $request->validate([
                'pet_name' => 'required|string|max:255',
                'species' => 'required|string|max:255',
                'lat' => 'required|numeric',
                'lng' => 'required|numeric',
                'breed' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:255',
                'age' => 'nullable|integer|min:0',
                'size' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'dateLost' => 'nullable|date',
            ]);
        
            // Collect the update data, excluding image initially
            $reportData = [
                'pet_name' => $request->pet_name,
                'species' => $request->species,
                'lat' => $request->lat,
                'lng' => $request->lng,
                'breed' => $request->breed,
                'last_seen_location' => $request->last_seen_location,
                'color' => $request->color,
                'age' => $request->age,
                'size' => $request->size,
                'description' => $request->description,
                'dateLost' => $request->dateLost,
            ];
        
            // Handle image upload if present
            if ($request->hasFile('image')) {
                $imageBinary = file_get_contents($request->file('image')->getPathname());
                $reportData['image'] = $imageBinary;
            }
        
            // Update the report in the database
            DB::table('reportlostfound')
                ->where('report_id', $request->id)
                ->update($reportData);
        
            // Retrieve the updated report, excluding the image
            $updatedReport = DB::table('reportlostfound')
                ->where('report_id', $request->id)
                ->select('report_id', 'pet_name', 'species', 'lat', 'lng', 'breed', 'color', 'age', 'size', 'description', 'dateLost') // Exclude the image column
                ->first();
        
            return response()->json([
                'message' => 'Report updated successfully',
                'report' => $updatedReport,
            ]);
        }


        public function getSpecificReport(Request $request)
        {
            try {
                $reportID = $request->input('reportID');
        
                // Fetch the specific report with user information using DB::table
                $report = DB::table('reportlostfound')
                    ->join('member', 'reportlostfound.user_id', '=', 'member.user_id')
                    ->where('reportlostfound.report_id', $reportID)
                    ->select(
                        // Report information
                        'reportlostfound.report_id as report_id',
                        'reportlostfound.date_reported',
                        'reportlostfound.last_seen_location',
                        'reportlostfound.district',
                        'reportlostfound.status',
                        
                        // User information
                        'member.name as name',
                        'member.email as email',
                        'member.phoneNumber as phoneNumber',
                        
                        // Pet information (from reportlostfound table)
                        'reportlostfound.pet_name',
                        'reportlostfound.species',
                        'reportlostfound.breed',
                        'reportlostfound.color',
                        'reportlostfound.age',
                        'reportlostfound.size',
                        'reportlostfound.description as description',
                        'reportlostfound.image'
                    )
                    ->first();
        
                // Check if report exists
                if (!$report) {
                    return response()->json(['success' => false, 'message' => 'Report not found'], 404);
                }
        
                // Fetch the replies related to this report and count the pending replies
                $noOfReplies = DB::table('replyLostReport')
                    ->where('report_id', $reportID)
                    ->where('status', 'pending') // Filter for pending replies
                    ->count();
        
                // Structure data as required by the frontend
                $data = [
                    'report_id' => $report->report_id,
                    'date_reported' => $report->date_reported,
                    'last_seen_location' => $report->last_seen_location,
                    'district' => $report->district,
                    'status' => $report->status,
                    'noOfReplies' => $noOfReplies, // Count of pending replies
        
                    // User information
                    'user' => [
                        'name' => $report->name,
                        'email' => $report->email,
                        'phoneNumber' => $report->phoneNumber,
                    ],
        
                    // Pet information
                    'pet' => [
                        'pet_name' => $report->pet_name,
                        'species' => $report->species,
                        'breed' => $report->breed,
                        'color' => $report->color,
                        'age' => $report->age,
                        'size' => $report->size,
                        'description' => $report->description,
                        'image' => $report->image ? base64_encode($report->image) : null, // Encode image if present
                    ],
                ];
        
                // Return structured data as JSON
                return response()->json(['success' => true, 'data' => $data], 200);
        
            } catch (\Exception $e) {
                // Handle any errors
                return response()->json(['success' => false, 'message' => 'Error retrieving report data'], 500);
            }
        }
        

        
        
}
