<?php

namespace App\Http\Controllers\Api\RefData;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateSchemeTypeRequest;
use App\Models\MaritalStatus;
use Illuminate\Support\Facades\Auth;

class MaritalStatusController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware(['auth:admins,schemes']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $maritalstatus = MaritalStatus::all();
            return $this->sendResponse(
                true,
                'Records retrieved successfully',
                200,
                ['maritalstatus' => $maritalstatus]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve records' . $ex,
                400
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateSchemeTypeRequest $request)
    {
        try {
            $data = $request->validated();
            $existingmaritalstatus = MaritalStatus::where(['name' => $data['name']])->first();
            if ($existingmaritalstatus != null) {
                return $this->sendResponse(
                    false,
                    'Record ' . $data['name'] . ' already exists!',
                    200
                );
            }

            $maritalstatus = new MaritalStatus();
            $maritalstatus->user_agent = $request->header('User-Agent');
            $maritalstatus->ip_address = $request->ip();
            $maritalstatus->name = $data['name'];
            $maritalstatus->created_by = Auth::user()->id;
            $maritalstatus->save();

            return $this->sendResponse(
                true,
                'Record saved successfully',
                200
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to create marital status' . $ex
            );
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $maritalstatus = MaritalStatus::findOrFail($id);
            return $this->sendResponse(
                true,
                'Record retrieved successfully!',
                200,
                ['maritalstatus' => $maritalstatus]
            );
        } catch (\Exception $ex) {
            $this->sendResponse(
                false,
                'Failed to find education level!',
                200
            );
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CreateSchemeTypeRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $maritalstatus = MaritalStatus::findOrFail($id);
            $maritalstatus->user_agent = $request->header('User-Agent');
            $maritalstatus->ip_address = $request->ip();
            $maritalstatus->name = $data['name'];
            if (array_key_exists('status', $data)) {
                $maritalstatus->status = $data['status'];
            }
            $maritalstatus->save();
            return $this->sendResponse(
                true,
                'Record updated successfully',
                200,
                ['maritalstatus' => $maritalstatus]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to update scheme type' . $ex
            );
        }
    }
}
