<?php

namespace App\Http\Controllers\Api\Scheme;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateContributorRequest;
use App\Models\BiologicalChildren;
use App\Models\Contributor;
use Illuminate\Support\Facades\Auth;

class ContributorController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware(['auth:schemes,admins']);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $contributors = array();
            if (Auth::user()->scheme_id) {
                $contributors = Contributor::with([
                    'children',
                    'title',
                    'maritalstatus',
                    'educationlevel'
                ])->where(['scheme_id' => Auth::user()->scheme_id])->get();
            } else {
                $contributors = Contributor::with([
                    'children',
                    'title',
                    'maritalstatus',
                    'educationlevel'
                ])->get();
            }
            return $this->sendResponse(
                true,
                'Contributors retrieved successfully',
                200,
                [
                    'contributors' => $contributors
                ]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to get contributors' . $ex,
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
    public function store(CreateContributorRequest $request)
    {
        try {
            $validated = $request->validated();
            $contributor = null;
            if ($validated['contributor_id'] !== 'null') {
                $contributor = Contributor::findOrFail($validated['contributor_id']);
            } else {
                $contributor = new Contributor();
            }

            $contributor->first_name = $validated['first_name'];
            $contributor->last_name = $validated['last_name'];
            $contributor->phone = $validated['phone'];
            if ($validated['email'] === 'null') {
                $contributor->email = '';
            } else {
                $contributor->email = $validated['email'];
            }
            $contributor->scheme_id = Auth::user()->scheme_id;
            $contributor->created_by = Auth::user()->id;

            $contributor->branch_id = Auth::user()->branch_id;
            $contributor->title = $validated['title'];
            $contributor->gender = $validated['gender'];
            $contributor->dob = $validated['dob'];
            $contributor->maritalstatus = $validated['maritalstatus'];
            $contributor->other_phone = $validated['other_phone'];
            $contributor->title = $validated['title'];
            $contributor->home_parish = $validated['home_parish'];
            $contributor->center = $validated['center'];
            $contributor->residence = $validated['residence'];
            $contributor->biological_mother = $validated['biological_mother'];
            $contributor->biological_father = $validated['biological_father'];
            $contributor->spouse = $validated['spouse'];
            $contributor->next_of_kin = $validated['next_of_kin'];
            $contributor->kin_telephone = $validated['kin_telephone'];
            $contributor->other_kin_telephone = $validated['other_kin_telephone'];
            $contributor->kin_email = $validated['kin_email'];
            $contributor->other_kin_email = $validated['other_kin_email'];
            $contributor->education_level = $validated['education_level'];
            $contributor->user_agent = $request->header('User-Agent');
            $contributor->ip_address = $request->ip();
            if ($request->hasFile('profile_pic')) {
                $imageName = $contributor->first_name . $contributor->scheme_id . $contributor->id;
                $validated['profile_pic']->move(public_path('images'), $imageName);
                $contributor->profile_pic = $imageName;
            } else {
                $contributor->profile_pic = "";
            }
            if ($contributor->save()) {
                $biologicalChildren = json_decode($validated['children']);
                $biologicalChild = null;
                if (sizeof($biologicalChildren) > 0) {
                    foreach ($biologicalChildren as $child) {
                        if (property_exists($child, 'created_at')) {
                            $biologicalChild = BiologicalChildren::where(
                                'contributor_id',
                                $contributor->id
                            )->findOrFail($child->id);
                        } else {
                            $biologicalChild = new BiologicalChildren();
                        }
                        $biologicalChild->name = $child->name;
                        $biologicalChild->dob = $child->dob;
                        $biologicalChild->contributor_id = $contributor->id;
                        $biologicalChild->save();
                    }
                }
            }
            return $this->sendResponse(
                true,
                'Contributor created successfully',
                200,
                [
                    'contributor' => $contributor
                ]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to create contributor' . $ex->getMessage(),
                400
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

            $contributor = null;
            if (Auth::user()->scheme_id) {
                $contributor = Contributor::with([
                    'children',
                    'title',
                    'maritalstatus',
                    'educationlevel'
                ])->where(['scheme_id' => Auth::user()->scheme_id])->findOrFail($id);
            } else {
                $contributor = Contributor::with([
                    'children',
                    'title',
                    'maritalstatus',
                    'educationlevel'
                ])->findOrFail($id);
            }
            return $this->sendResponse(
                true,
                'Contributor retrieved successfully',
                200,
                [
                    'contributor' => $contributor
                ]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve contributor' . $ex,
                400
            );
        }
    }
}
