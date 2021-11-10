<?php

namespace App\Http\Controllers\Api\Scheme;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateSchemeHierarchyRequest;
use App\Models\SchemeHierarchy;
use Illuminate\Support\Facades\Auth;

class SchemeHierarchyController extends BaseController
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

            $hierarchy = SchemeHierarchy::with(['scheme'])->get();
            return $this->sendResponse(
                true,
                'Hierarchies retrieved successfully',
                200,
                ['hierarchy' => $hierarchy]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve hierarchies' . $ex,
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
    public function store(CreateSchemeHierarchyRequest $request)
    {
        try {
            $data = $request->validated();
            $existing = SchemeHierarchy::where([
                'name' => $data['name'],
                'scheme_id' => $data['scheme_id']
            ])->first();
            if ($existing != null) {
                return $this->sendResponse(
                    false,
                    'A hierarchy with the same name has already been created for this scheme!',
                    200
                );
            }
            $hierarchy = new SchemeHierarchy();
            $hierarchy->scheme_id = $data['scheme_id'];
            $hierarchy->name = $data['name'];
            $hierarchy->created_by = Auth::user()->id;
            $hierarchy->user_agent = $request->header('User-Agent');
            $hierarchy->ip_address = $request->ip();
            $hierarchy->save();
            return $this->sendResponse(
                true,
                'Hierarchy saved successfully',
                200,
                [
                    'hierarchy' => $hierarchy
                ]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to create hierarchy' . $ex
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
            $hierarchy = SchemeHierarchy::with(['scheme'])->findOrFail($id);
            return $this->sendResponse(
                true,
                'Schemes retrieved successfully',
                200,
                ['hierarchy' => $hierarchy]
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
    public function update(CreateSchemeHierarchyRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $hierarchy = SchemeHierarchy::findOrFail($id);
            $hierarchy->scheme_id = $data['scheme_id'];
            $hierarchy->name = $data['name'];
            $hierarchy->user_agent = $request->header('User-Agent');
            $hierarchy->ip_address = $request->ip();
            if (array_key_exists('status', $data)) {
                $hierarchy->status = $data['status'];
            }
            $hierarchy->save();
            return $this->sendResponse(
                true,
                'Hierarchy updated successfully',
                200,
                [
                    'hierarchy' => $hierarchy
                ]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to update user' . $ex
            );
        }
    }


    /**
     * Display a listing of hierarchies by scheme.
     *
     * @return \Illuminate\Http\Response
     */
    public function getHierarchyByScheme($schemeId)
    {
        try {

            $hierarchies = SchemeHierarchy::where(['scheme_id' => $schemeId])->get();
            return $this->sendResponse(
                true,
                'Scheme hierarchies retrieved successfully',
                200,
                ['hierarchies' => $hierarchies]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve scheme hierarchies' . $ex,
                400
            );
        }
    }
}
