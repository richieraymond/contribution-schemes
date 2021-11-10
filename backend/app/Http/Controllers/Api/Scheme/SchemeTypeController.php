<?php

namespace App\Http\Controllers\Api\Scheme;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateSchemeTypeRequest;
use App\Models\SchemeType;
use Illuminate\Support\Facades\Auth;

class SchemeTypeController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware(['auth:admins']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $types = SchemeType::all();
            return $this->sendResponse(
                true,
                'Scheme types retrieved successfully',
                200,
                ['types' => $types]
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
            $existingScheme = SchemeType::where(['name' => $data['name']])->first();
            if ($existingScheme != null) {
                return $this->sendResponse(
                    false,
                    'A scheme type with the name ' . $data['name'] . ' already exists!',
                    200
                );
            }

            $type = new SchemeType();
            $type->user_agent = $request->header('User-Agent');
            $type->ip_address = $request->ip();
            $type->name = $data['name'];
            $type->created_by = Auth::user()->id;
            $type->save();
            return $this->sendResponse(
                true,
                'Scheme type saved successfully',
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
            $type = SchemeType::findOrFail($id);
            return $this->sendResponse(
                true,
                'Scheme type retrieved successfully!',
                200,
                ['type' => $type]
            );
        } catch (\Exception $ex) {
            $this->sendResponse(
                false,
                'Failed to find scheme type!',
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
            $type = SchemeType::findOrFail($id);
            $type->user_agent = $request->header('User-Agent');
            $type->ip_address = $request->ip();
            $type->name = $data['name'];

            if (array_key_exists('status', $data)) {
                $type->status = $data['status'];
            }
            $type->save();
            return $this->sendResponse(
                true,
                'Scheme type updated successfully',
                200,
                ['type' => $type]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to update scheme type' . $ex
            );
        }
    }
}
