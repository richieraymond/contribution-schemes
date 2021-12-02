<?php

namespace App\Http\Controllers\Api\Scheme;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateSchemeRequest;
use App\Models\Scheme;
use App\Notifications\SchemeCreationNotification;
use Illuminate\Support\Facades\Auth;

class SchemeController extends BaseController
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

            $schemes = Scheme::all();
            return $this->sendResponse(
                true,
                'Contribution schemes retrieved successfully',
                200,
                ['schemes' => $schemes]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve schemes' . $ex,
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
    public function store(CreateSchemeRequest $request)
    {
        try {
            $maxschemeref =  Scheme::max('scheme_ref');
            $nextschemenumber = null;

            if ($maxschemeref) {
                $nextschemenumber = $maxschemeref + 1;
            } else {
                $nextschemenumber = 10000;
            }

            $data = $request->validated();
            $scheme = new Scheme();
            $scheme->name = $data['name'];
            $scheme->scheme_ref = $nextschemenumber;
            $scheme->location = $data['location'];
            $scheme->contact_person = $data['contact_person'];
            $scheme->email = $data['email'];
            $scheme->phone = $data['phone'];
            $scheme->category_id = $data['category_id'];
            $scheme->is_membership_based = $data['is_membership_based'];
            $scheme->user_agent = $request->header('User-Agent');
            $scheme->ip_address = $request->ip();
            $scheme->created_by = Auth::user()->id;
            $scheme->save();
            $scheme->notify(new SchemeCreationNotification($scheme));
            return $this->sendResponse(
                true,
                'Scheme saved successfully',
                200,
                ['scheme' => $scheme]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to create scheme' . $ex
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
            $scheme = Scheme::findOrFail($id);
            return $this->sendResponse(
                true,
                'Scheme retrieved successfully',
                200,
                ['scheme' => $scheme]
            );
        } catch (\Exception $ex) {
            $this->sendResponse(
                false,
                'Failed to find scheme',
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
    public function update(CreateSchemeRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $scheme = Scheme::findOrFail($id);
            if (array_key_exists('status', $data)) {
                $scheme->status = $data['status'];
            }
            $scheme->category_id = $data['category_id'];
            $scheme->name = $data['name'];
            $scheme->location = $data['location'];
            $scheme->contact_person = $data['contact_person'];
            $scheme->email = $data['email'];
            $scheme->is_membership_based = $data['is_membership_based'];
            $scheme->phone = $data['phone'];
            $scheme->updated_by = Auth::user()->id;
            $scheme->save();
            return $this->sendResponse(
                true,
                'Scheme updated successfully',
                200,
                ['scheme' => $scheme]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to update scheme' . $ex
            );
        }
    }
}
