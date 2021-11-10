<?php

namespace App\Http\Controllers\Api\RefData;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateSchemeTypeRequest;
use App\Models\EducationLevel;
use Illuminate\Support\Facades\Auth;

class EducationLevelController extends BaseController
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

            $educationlevels = EducationLevel::all();
            return $this->sendResponse(
                true,
                'Records retrieved successfully',
                200,
                ['educationlevels' => $educationlevels]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve scheme types' . $ex,
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
            $existingeducationlevel = EducationLevel::where(['name' => $data['name']])->first();
            if ($existingeducationlevel != null) {
                return $this->sendResponse(
                    false,
                    'Education level with the name ' . $data['name'] . ' already exists!',
                    200
                );
            }

            $level = new EducationLevel();
            $level->user_agent = $request->header('User-Agent');
            $level->ip_address = $request->ip();
            $level->name = $data['name'];
            $level->created_by = Auth::user()->id;
            $level->save();

            return $this->sendResponse(
                true,
                'Record saved successfully',
                200
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to create scheme type' . $ex
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
            $educationlevel = EducationLevel::findOrFail($id);
            return $this->sendResponse(
                true,
                'Record retrieved successfully!',
                200,
                ['educationlevel' => $educationlevel]
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
            $educationlevel = EducationLevel::findOrFail($id);
            $educationlevel->user_agent = $request->header('User-Agent');
            $educationlevel->ip_address = $request->ip();
            $educationlevel->name = $data['name'];

            if (array_key_exists('status', $data)) {
                $educationlevel->status = $data['status'];
            }
            $educationlevel->save();
            return $this->sendResponse(
                true,
                'Record updated successfully',
                200,
                ['educationlevel' => $educationlevel]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to update scheme type' . $ex
            );
        }
    }
}
