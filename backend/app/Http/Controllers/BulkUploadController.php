<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BaseController;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\TempGuardImport;
use App\Models\TempGuard;
use App\Models\Guard;
use App\Models\Site;
use App\Models\Company;

use App\Models\RfidCard;
use App\Models\TempSite;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\TempRfid;

class BulkUploadController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware(['auth:admins,companies']);
    }
    public function bulkUploadGuards(Request $request)
    {
        try {


            if ($request->hasFile('file')) {


                $array =  Excel::toArray(new TempGuardImport, request()->file('file'))[0];
                $data = [];
                $batch_no = $this->getMaxBatchNo();
                $user_id = null;
                $admin_id = null;

                if (Auth::user()->company_id) {
                    $user_id = Auth::user()->id;
                } else {
                    $admin_id = Auth::user()->id;
                }

                foreach ($array as $key => $row) {
                    if ($this->containsOnlyNull($row)) {
                        continue;
                    };
                    $is_supervisor = false;
                    $is_armed = false;

                    if ($row[6] == 'YES') {
                        $is_supervisor = true;
                    }

                    if ($row[7] == 'YES') {
                        $is_armed = true;
                    }

                    array_push($data, [
                        'first_name' => $row[0],
                        'last_name' => $row[1],
                        'phone' => $row[4],
                        'email' => $row[5],
                        'is_armed' => $is_armed,
                        'is_supervisor' => $is_supervisor,
                        'gun_serial_number' => $row[9],
                        'rfid_card' => $row[3],
                        'company_id' => $this->getCompanyId($row[8]),
                        'batch_no' => $batch_no,
                        'status' => 'Pending',
                        'user_id' => $user_id,
                        'admin_id' => $admin_id,
                        'created_at' => Carbon::now()

                    ]);
                }
                TempGuard::insert($data);
            }
            return $this->sendResponse(true, 'Guards Uploaded Successfully', 200, ['data' => $admin_id]);
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to process upload ' . $ex, 400);
        }
    }

    private function getMaxBatchNo(): int
    {
        $max = DB::table('temp_guards')->max('batch_no');
        if ($max) {
            return $max + 1;
        }
        return 1000000;
    }

    private function getCompanyId($name)
    {
        $companyId = Company::where(DB::raw('LOWER(name)'), '=', strtolower($name))->first();
        if ($companyId) {
            return $companyId->id;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getBatches()
    {
        try {

            if (Auth::user()->company_id) {


                $uploadedBatch = DB::table('temp_guards')
                    ->join('companies', function ($join) {
                        $join->on('companies.id', '=', 'temp_guards.company_id');
                    })
                    ->join('users', function ($join) {
                        $join->on('users.id', '=', 'temp_guards.user_id');
                    })
                    ->Select('temp_guards.batch_no', 'temp_guards.created_at', 'users.first_name', 'users.last_name', 'temp_guards.status')
                    ->where('temp_guards.status', 'Pending')
                    ->where('temp_guards.company_id', Auth::user()->company_id)
                    ->distinct()
                    ->get('temp_guards.batch_no');
            }




            return $this->sendResponse(
                true,
                'Batch retrieved successfully',
                200,
                ['batch' => $uploadedBatch]
            );
        } catch (\Exception $ex) {
            $this->sendResponse(
                false,
                'Failed to find batches',
                200
            );
        }
    }
    public function getBatchDetails($batch_no)
    {
        try {
            $batches_items = DB::table('temp_guards')
                ->where(['batch_no' => $batch_no])
                ->where(['status' => 'Pending'])
                ->get();
            return $this->sendResponse(
                true,
                'Data retrieved successfully',
                200,
                [
                    'batch_no' => $batch_no,
                    'batch_details' => $batches_items
                ]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to retrieve records' . $ex, 400);
        }
    }

    public function approveUpload(Request $request)
    {
        try {
            $selectedItems = $request->all();

            foreach ($selectedItems as $i) {

                $item = TempGuard::findOrFail($i['id']);
                $guard = new Guard();
                $guard->first_name = $item->first_name;
                $guard->last_name = $item->last_name;
                $guard->phone = $item->phone;
                $guard->email = $item->email;
                $guard->is_armed = $item->is_armed;
                $guard->is_supervisor = $item->is_supervisor;
                $guard->gun_serial_number = $item->gun_serial_number;
                $guard->rfid_card = $item->rfid_card;
                $guard->company_id = $item->company_id;
                $guard->created_by = $item->user_id;
                $guard->created_at = Carbon::now();
                $guard->save();
                $item->status = 'Processed';
                $item->updated_at = Carbon::now();
                $item->save();
            }

            return $this->sendResponse(true, 'Guards approved successfully', 200, ['request' =>  $item]);
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to approve upload' . $ex, 400);
        }
    }
    public function bulkUploadRfidCards(Request $request)
    {
        try {


            if ($request->hasFile('file')) {


                $array =  Excel::toArray(new TempGuardImport, request()->file('file'))[0];
                $data = [];
                $batch_no = $this->getRFidMaxBatchNo();
                $user_id = null;
                $admin_id = null;
                if (Auth::user()->company_id) {
                    $user_id = Auth::user()->id;
                } else {
                    $admin_id = Auth::user()->id;
                }

                foreach ($array as $key => $row) {
                    if ($this->containsOnlyNull($row)) {
                        continue;
                    };

                    array_push($data, [
                        'rfid_card_no' => $row[0],
                        'company_id' => $this->getCompanyId($row[1]),
                        // 'created_by' => Auth::user()->id,
                        'batch_no' => $batch_no,
                        'status' => 'Pending',
                        'user_id' => $user_id,
                        'admin_id' => $admin_id,
                        'created_at' => Carbon::now()

                    ]);
                }
                TempRfid::insert($data);
            }
            return $this->sendResponse(true, 'Upload successful', 200, ['data' => $request]);
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to process upload ' . $ex, 400);
        }
    }
    private function getRFidMaxBatchNo(): int
    {
        $max = DB::table('temp_rfids')->max('batch_no');
        if ($max) {
            return $max + 1;
        }
        return 1000000;
    }

    public function getCardBatches()
    {
        try {
            if (Auth::user()->company_id) {

                $uploadedBatch = DB::table('temp_rfids')
                    ->join('companies', function ($join) {
                        $join->on('companies.id', '=', Auth::user()->company_id);
                    })
                    ->join('users', function ($join) {
                        $join->on('users.id', '=', 'temp_rfids.user_id');
                    })
                    ->distinct()
                    ->Select('temp_rfids.batch_no', 'companies.name', 'temp_rfids.created_at', 'users.first_name', 'users.last_name', 'temp_rfids.status')
                    ->where('temp_rfids.status', 'Pending')
                    ->get('temp_rfids.batch_no');
            } else {
                $uploadedBatch = DB::table('temp_rfids')
                    ->join('companies', function ($join) {
                        $join->on('companies.id', '=', 'temp_rfids.company_id');
                    })
                    ->join('admins', function ($join) {
                        $join->on('admins.id', '=', 'temp_rfids.admin_id');
                    })
                    ->distinct()
                    ->Select('temp_rfids.batch_no', 'companies.name', 'temp_rfids.created_at', 'admins.first_name', 'admins.last_name', 'temp_rfids.status')
                    ->where('temp_rfids.status', 'Pending')
                    ->get('temp_rfids.batch_no');
            }
            return $this->sendResponse(
                true,
                'Batch retrieved successfully',
                200,
                ['batch' => $uploadedBatch]
            );
        } catch (\Exception $ex) {
            $this->sendResponse(
                false,
                'Failed to find batches',
                200
            );
        }
    }
    public function getBatchRfidDetails($batch_no)
    {
        try {
            $batches_items = DB::table('temp_rfids')
                ->where(['batch_no' => $batch_no])
                ->where(['status' => 'Pending'])
                ->get();
            return $this->sendResponse(
                true,
                'Data retrieved successfully',
                200,
                [
                    'batch_no' => $batch_no,
                    'batch_details' => $batches_items
                ]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to retrieve records' . $ex, 400);
        }
    }
    public function approveRfidUpload(Request $request)
    {
        try {
            $selectedItems = $request->all();

            foreach ($selectedItems as $i) {

                $item = TempRfid::findOrFail($i['id']);
                $rfid = new RfidCard();
                $rfid->rfid = $item->rfid_card_no;
                $rfid->company_id = $item->company_id;
                $rfid->created_at = Carbon::now();
                $rfid->save();
                $item->status = 'Processed';
                $item->updated_at = Carbon::now();
                $item->save();
            }

            return $this->sendResponse(true, 'Rfid Cards approved successfully', 200, ['request' =>  $item]);
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to approve upload' . $ex, 400);
        }
    }
    public function bulkUploadSites(Request $request)
    {
        try {


            if ($request->hasFile('file')) {
                $array =  Excel::toArray(new TempGuardImport, request()->file('file'))[0];
                $data = [];
                $batch_no = $this->getSiteMaxBatchNo();
                $user_id = null;
                $admin_id = null;
                if (Auth::user()->company_id) {
                    $user_id = Auth::user()->id;
                } else {
                    $admin_id = Auth::user()->id;
                }

                foreach ($array as $key => $row) {
                    if ($this->containsOnlyNull($row)) {
                        continue;
                    };

                    array_push($data, [
                        'site_name' => $row[0],
                        'gps_cordinates' => $row[2],
                        'phone' => $row[4],
                        'email' => $row[5],
                        'location' => $row[7],
                        'radio_number' => $row[6],
                        'contact_person' => $row[3],
                        'company_id' => $this->getCompanyId($row[1]),
                        'batch_no' => $batch_no,
                        'status' => 'Pending',
                        'user_id' => $user_id,
                        'admin_id' => $admin_id,
                        'created_at' => Carbon::now()

                    ]);
                }
                TempSite::insert($data);
            }
            return $this->sendResponse(true, 'Upload successful', 200, ['data' => $data]);
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to process upload ' . $ex, 400);
        }
    }
    private function getSiteMaxBatchNo(): int
    {
        $max = DB::table('temp_sites')->max('batch_no');
        if ($max) {
            return $max + 1;
        }
        return 1000000;
    }
    public function getSiteBatches()
    {
        try {
            if (Auth::user()->company_id) {


                $uploadedBatch = DB::table('temp_sites')
                    ->join('companies', function ($join) {
                        $join->on('companies.id', '=', 'temp_sites.company_id');
                    })
                    ->join('users', function ($join) {
                        $join->on('users.id', '=', 'temp_sites.user_id');
                    })
                    ->Select('temp_sites.batch_no', 'temp_sites.created_at', 'users.first_name', 'users.last_name', 'temp_sites.status', 'companies.name')
                    ->where('temp_sites.status', 'Pending')
                    ->where('temp_sites.company_id', Auth::user()->company_id)
                    ->distinct()
                    ->get('temp_sites.batch_no');
            } else {
                $uploadedBatch = DB::table('temp_sites')
                    ->join('companies', function ($join) {
                        $join->on('companies.id', '=', 'temp_sites.company_id');
                    })
                    ->join('admins', function ($join) {
                        $join->on('admins.id', '=', 'temp_sites.admin_id');
                    })
                    ->distinct()
                    ->Select('temp_sites.batch_no', 'companies.name', 'temp_sites.created_at', 'admins.first_name', 'admins.last_name', 'temp_sites.status')
                    ->where('temp_sites.status', 'Pending')
                    ->get('temp_sites.batch_no');
            }
            return $this->sendResponse(
                true,
                'Batch retrieved successfully',
                200,
                ['batch' => $uploadedBatch]
            );
        } catch (\Exception $ex) {
            $this->sendResponse(
                false,
                'Failed to find batches',
                200
            );
        }
    }
    public function getBatchSiteDetails($batch_no)
    {
        try {
            $batches_items = DB::table('temp_sites')
                ->where(['batch_no' => $batch_no])
                ->where(['status' => 'Pending'])
                ->get();
            return $this->sendResponse(
                true,
                'Data retrieved successfully',
                200,
                [
                    'batch_no' => $batch_no,
                    'batch_details' => $batches_items
                ]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to retrieve records' . $ex, 400);
        }
    }
    public function approveSiteUpload(Request $request)
    {
        try {
            $selectedItems = $request->all();

            foreach ($selectedItems as $i) {

                $item = TempSite::findOrFail($i['id']);
                $site = new Site();
                $site->name = $item->site_name;
                $site->company_id = $item->company_id;
                // $guard->created_by=$item->created_by;
                $site->created_at = Carbon::now();
                $site->gps_coordinates = $item->gps_cordinates;
                $site->radio_number = $item->radio_number;
                $site->contact_person = $item->contact_person;
                $site->location = $item->location;
                $site->phone = $item->phone;
                $site->email = $item->email;

                $site->save();
                $item->status = 'Processed';
                $item->updated_at = Carbon::now();
                $item->save();
            }

            return $this->sendResponse(true, 'Sites approved successfully', 200, ['request' =>  $item]);
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to approve upload' . $ex, 400);
        }
    }

    public function deleteGuards(Request $request)
    {
        try {
            $selectedItems = $request->all();

            foreach ($selectedItems as $i) {

                $item = TempGuard::findOrFail($i['id']);
                $item->status = 'Deleted';
                $item->updated_at = Carbon::now();
                $item->save();
            }

            return $this->sendResponse(true, 'Records deleted  successfully', 200, ['request' =>  $item]);
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to delete upload' . $ex, 400);
        }
    }

    public function deleteRfidCards(Request $request)
    {
        try {
            $selectedItems = $request->all();

            foreach ($selectedItems as $i) {

                $item = TempRfid::findOrFail($i['id']);
                $item->status = 'Deleted';
                $item->updated_at = Carbon::now();
                $item->save();
            }

            return $this->sendResponse(true, 'Records deleted  successfully', 200, ['request' =>  $item]);
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to delete upload' . $ex, 400);
        }
    }
    public function deleteSites(Request $request)
    {
        try {
            $selectedItems = $request->all();

            foreach ($selectedItems as $i) {

                $item = TempSite::findOrFail($i['id']);
                $item->status = 'Deleted';
                $item->updated_at = Carbon::now();
                $item->save();
            }

            return $this->sendResponse(true, 'Records deleted  successfully', 200, ['request' =>  $item]);
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to delete upload' . $ex, 400);
        }
    }
}
