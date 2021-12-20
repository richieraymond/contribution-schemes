<?php

namespace App\Http\Controllers\Api\RefData;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateSchemeTypeRequest;
use App\Models\Title;
use Illuminate\Support\Facades\Auth;

class TitleController extends BaseController
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

            $titles = Title::all();
            return $this->sendResponse(
                true,
                'Records retrieved successfully',
                200,
                ['titles' => $titles]
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
            $title = Title::where(['name' => $data['name']])->first();
            if ($title != null) {
                return $this->sendResponse(
                    false,
                    'Title ' . $data['name'] . ' already exists!',
                    200
                );
            }

            $title = new Title();
            $title->user_agent = $request->header('User-Agent');
            $title->ip_address = $request->ip();
            $title->name = $data['name'];
            $title->max_dependents = $data['max_dependents'];
            $title->has_children = $data['has_children'];
            $title->gender = $data['gender'];
            $title->created_by = Auth::user()->id;
            $title->save();

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
            $title = Title::findOrFail($id);
            return $this->sendResponse(
                true,
                'Record retrieved successfully!',
                200,
                ['title' => $title]
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
            $title = Title::findOrFail($id);
            $title->user_agent = $request->header('User-Agent');
            $title->ip_address = $request->ip();
            $title->name = $data['name'];
            $title->max_dependents = $data['max_dependents'];
            $title->has_children = $data['has_children'];
            $title->gender = $data['gender'];
            if (array_key_exists('status', $data)) {
                $title->status = $data['status'];
            }
            $title->save();
            return $this->sendResponse(
                true,
                'Record updated successfully',
                200,
                ['title' => $title]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to update scheme type' . $ex
            );
        }
    }
}
