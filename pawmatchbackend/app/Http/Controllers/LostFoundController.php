<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon; // Import Carbon
use Illuminate\Support\Facades\Mail;
class LostFoundController extends Controller
{

        public function store(Request $request)
        {
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
                'image' => 'required|image|mimes:jpeg,png,gif|max:1000000', // Max 2MB
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
        public function addReplyReport(Request $request)
        {
            // Validation rules
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|integer',
                'name' => 'required|string|max:255',
                'report_id' => 'required|integer',
                'reportedDate' => 'required|date',
                'phoneNumber' => 'required|string|max:15',
                'email' => 'required|email|max:255',
                'detailed_address' => 'required|string',
                'location' => 'required|string',
                'district' => 'required|string',
                'state' => 'required|string',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'description' => 'required|string',
            ]);
        
            // Handle validation failure
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 400);
            }
        
            try {
                $imageBinary = null; // Default to null if no file is provided

                // Process the uploaded file
                if ($request->hasFile('images')) {
                    $file = $request->file('images');
                    
                    // Convert the file to binary and encode it as Base64
                    $imageBinary = file_get_contents($request->file('images')->getRealPath());

                }
        
                // Insert data into the replylostreport table
                DB::table('replylostreport')->insert([
                    'user_id' => $request->user_id,
                    'name' => $request->name,
                    'report_id' => $request->report_id,
                    'reportedDate' => $request->reportedDate,
                    'phoneNumber' => $request->phoneNumber,
                    'email' => $request->email,
                    'detailed_address' => $request->detailed_address,
                    'last_seen_location' => $request->location,
                    'district' => $request->district,
                    'state' => $request->state,
                    'lat' => $request->lat,
                    'lng' => $request->lng,
                    'description' => $request->description,
                    'image' => $imageBinary, // Store binary image data directly
                ]);
        
                return response()->json([
                    'success' => true,
                    'message' => 'Reply report added successfully.',
                ], 201);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to add reply report.',
                    'error' => $e->getMessage(),
                    'value'=>$request->input('images')
                ], 500);
            }
        }
        

        public function deleteLostReport(Request $request)
        {
            $reportID = $request->input('reportID');
            DB::table('reportlostfound')->where('report_id', $reportID)->delete();

            return response()->json(['success' => true, 'message' => 'Report deleted successfully']);
        }

        public function getAllReportsByUserID(Request $request)
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
                        'member.user_id as user_id',
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
        
                // Initialize "found" as null
                $found = null;
        
                // If the report status is "Resolved", fetch the related "Completed" reply
                if ($report->status == 'resolved') {
                    $found = DB::table('replylostreport')
                        ->where('report_id', $reportID)
                        ->where('status', 'Completed')
                        ->select(
                            'id',
                            'name as name',
                            'phoneNumber as phoneNumber',
                            'last_seen_location as last_seen_location',
                            'reportedDate as reportedDate',
                            'detailed_address as detailed_address',
                            'email as email',
                            'description as description',
                            'image as image'
                        )
                        ->first();
        
                    // If a "Completed" reply exists, encode its image if present
                    if ($found) {
                        $found->image = $found->image ? base64_encode($found->image) : null;
                    }
                }
        
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
                        'user_id' => $report->user_id,
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
        
                    // Found information
                    'found' => $found,
                ];
        
                // Return structured data as JSON
                return response()->json(['success' => true, 'data' => $data], 200);
        
            } catch (\Exception $e) {
                // Handle any errors
                return response()->json(['success' => false, 'message' => 'Error retrieving report data'], 500);
            }
        }
        
        public function getAllReports(Request $request)
        {
            try {
                $excludedUserId = $request->input('userID'); // Get the excluded user ID from the request
        
                $reports = DB::table('reportlostfound')
                    ->join('member', 'reportlostfound.user_id', '=', 'member.user_id')
                    ->where('reportlostfound.status', 'active')
                    ->whereNotIn('reportlostfound.report_id', function ($subquery) use ($excludedUserId) {
                        $subquery->select('replylostreport.report_id')
                                 ->from('replylostreport')
                                 ->where('replylostreport.user_id', $excludedUserId);
                    })
                    ->select(
                        'reportlostfound.*',
                        'member.*',
                        'reportlostfound.district as district',
                        'reportlostfound.state as state'
                    )
                    ->get();
        
                // Encode images in the reports
                $reports = $reports->map(function ($report) {
                    $report->image = $report->image ? base64_encode($report->image) : null;
                    return $report;
                });
        
                // Return the reports as a JSON response
                return response()->json(['success' => true, 'data' => $reports], 200);
        
            } catch (\Exception $e) {
                // Log the exception for debugging purposes (optional)
                //\Log::error('Error retrieving reports: ' . $e->getMessage());
        
                // Return an error response with a message
                return response()->json(['success' => false, 'message' => 'Error retrieving reports. ' . $e->getMessage()], 500);
            }
        }
        
        


        public function getReplyReportsByReportID(Request $request)
        {
            $reportID = $request->input('reportID');
    
            if (!$reportID) {
                return response()->json([
                    'success' => false,
                    'message' => 'reportID is required',
                ], 400);
            }
    
            try {
                $replyReports = DB::table('replylostreport')
                    ->where('report_id', $reportID)
                    ->where('status', 'pending')
                    ->get();
    
                
                $replyReports = $replyReports->map(function ($report) {
                        if ($report->image !== null) {
                            $report->image = base64_encode($report->image);
                        } else {
                            $report->image = null;
                        }
                        return $report;
                    });
                return response()->json([
                    'success' => true,
                    'data' => $replyReports,
                ]);

                
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to fetch reply reports: ' . $e->getMessage(),
                ], 500);
            }
        }
        
        
        public function notifyUsers(Request $request)
        {
            $reportID = $request->input('reportID');
        
            // Step 1: Get report details using DB::
            $report = DB::table('reportlostfound')
                ->where('report_id', $reportID)
                ->first();
        
            if (!$report) {
                return response()->json(['error' => 'Report not found'], 404);
            }
        
            $reportUserID = $report->user_id;
            $district = $report->district;
        
            // Step 2: Get users in the same district (excluding the report creator) using DB::
            $users = DB::table('member')
                ->where('district', $district)
                ->where('user_id', '!=', $reportUserID)
                ->pluck('email');
        
            if ($users->isEmpty()) {
                return response()->json(['message' => 'No users to notify in this district']);
            }
        
            // Step 3: Send notification emails
            foreach ($users as $email) {
                Mail::send('new_report', [
                    'name' => $report->pet_name,
                    'location' => $report->last_seen_location,
                    'dateLost' => $report->dateLost,
                    'link' => "http://localhost:3000/viewMoreDetails/{$reportID}"
                ], function ($message) use ($email) {
                    $message->to($email)
                            ->subject('New Lost Pet Report');
                });
            }
        
            return response()->json(['message' => 'Notification emails sent successfully','email'=>$users]);
        }
   
        

        public function notifyReportOwner(Request $request)
        {
            $reportID = $request->input('reportID');
            $founderName = $request->input('founderName');
            $dateReplied = $request->input('dateReplied');
        
            // Step 1: Get report details using DB::
            $report = DB::table('reportlostfound')
                ->where('report_id', $reportID)
                ->first();
        
            if (!$report) {
                return response()->json(['error' => 'Report not found'], 404);
            }
        
            $reportUserID = $report->user_id;
            $district = $report->district;
        
            // Step 2: Get one user in the same district (excluding the report creator) using DB::
            $user = DB::table('member')
                ->where('user_id', $reportUserID)
                ->first();
        
            if (!$user) {
                return response()->json(['message' => 'No user to notify.']);
            }
        
            // Step 3: Send notification email to the selected user
            Mail::send('reply_report', [
                'name' => $report->pet_name,
                'location' => $report->last_seen_location,
                'dateLost' => $report->dateLost,
                'founderName' => $founderName,
                'dateReplied' => $dateReplied,
                'link' => "http://localhost:3000/login"
            ], function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('New Reply Lost Pet Report');
            });
        
            return response()->json([
                'message' => 'Notification email sent successfully',
                'email' => $user->email
            ]);
        }
        
        
        public function getSpecificUser(Request $request)
        {
            $user_id = $request->input('user_id');
            try {
                // Fetch the user details from the `member` table
                $user = DB::table('member')
                    ->select('user_id', 'phoneNumber', 'email', 'name', 'detailed_address','district','state')
                    ->where('user_id', $user_id)
                    ->first();
    
                // Check if user exists
                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'User not found',
                    ], 404);
                }
    
                return response()->json([
                    'success' => true,
                    'data' => $user,
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'An error occurred while fetching the user details.',
                    'error' => $e->getMessage(),
                ], 500);
            }
        }

        public function approveReplyReport(Request $request)
        {
            $replyReportID = $request->input('replyReportID');
            $reportID = $request->input('reportID');
        
            try {
                DB::table('replylostReport')
                    ->where('id', $replyReportID)
                    ->update(['status' => 'Completed']);
                
                DB::table('reportlostfound')
                    ->where('report_id', $reportID)
                    ->update(['status' => 'resolved']);
        
                DB::table('replylostReport')
                    ->where('report_id', $reportID)
                    ->where('id', '!=', $replyReportID)
                    ->update(['status' => 'Rejected']);
        
                return response()->json(['message' => 'Reply report approved and others rejected successfully.'], 200);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['error' => 'Failed to approve reply report. Please try again.', 'details' => $e->getMessage()], 500);
            }
        }

        public function rejectReplyReport(Request $request)
        {
            $replyReportID = $request->input('replyReportID');
        
            try {
                // Update the status of the specified reply report to "Rejected"
                $updated = DB::table('replylostReport')
                    ->where('id', $replyReportID)
                    ->update(['status' => 'Rejected']);
        
                if ($updated) {
                    return response()->json(['message' => 'Reply report rejected successfully.'], 200);
                } else {
                    return response()->json(['error' => 'No report found with the provided ID.'], 404);
                }
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to reject the reply report. Please try again.', 'details' => $e->getMessage()], 500);
            }
        }
        
        
}
