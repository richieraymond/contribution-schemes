<?php

namespace App\Http\Controllers\Api\Scheme;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateBranchRequest;
use App\Models\Branch;
use Illuminate\Support\Facades\Auth;

class BranchController extends BaseController
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
            $branches = array();
            if (Auth::user()->scheme_id) {
                $branches = Branch::where(['scheme_id' => Auth::user()->scheme_id]);
            } else {
                $branches = Branch::all();
            }
            return $this->sendResponse(
                true,
                'Branches retrieved successfully',
                200,
                ['branches' => $branches]
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
    public function store(CreateBranchRequest $request)
    {
        try {
            $data = $request->validated();
            $branch = new Branch();
            $branch->name = $data['name'];
            $branch->location = $data['location'];
            $branch->contact_person = $data['contact_person'];
            $branch->email = $data['email'];
            $branch->phone = $data['phone'];
            $branch->hierarchy_id = $data['hierarchy_id'];
            $branch->parent_branch = $data['parent_branch'];
            $branch->scheme_id = $data['scheme_id'];
            $branch->user_agent = $request->header('User-Agent');
            $branch->ip_address = $request->ip();
            $branch->created_by = Auth::user()->id;
            $branch->save();
            return $this->sendResponse(
                true,
                'Branch saved successfully',
                200,
                ['branch' => $branch]
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
            $branch = Branch::findOrFail($id);
            if (Auth::user()->scheme_id) {
                $branch = Branch::where('scheme_id', Auth::user()->scheme_id)->findOrFail($id);
            }
            return $this->sendResponse(
                true,
                'Branch retrieved successfully',
                200,
                ['branch' => $branch]
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
    public function update(CreateBranchRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $branch = Branch::findOrFail($id);
            if (Auth::user()->scheme_id) {
                $branch = Branch::where('scheme_id', Auth::user()->scheme_id)->findOrFail($id);
            }
            if (array_key_exists('status', $data)) {
                $branch->status = $data['status'];
            }
            $branch->name = $data['name'];
            $branch->location = $data['location'];
            $branch->contact_person = $data['contact_person'];
            $branch->email = $data['email'];
            $branch->phone = $data['phone'];
            $branch->hierarchy_id = $data['hierarchy_id'];
            $branch->parent_branch = $data['parent_branch'];
            $branch->scheme_id = $data['scheme_id'];
            $branch->updated_by = Auth::user()->id;
            $branch->save();
            return $this->sendResponse(
                true,
                'Branch updated successfully',
                200,
                ['branch' => $branch]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to update branch' . $ex
            );
        }
    }

    /**
     * Display a listing of hierarchies by scheme.
     *
     * @return \Illuminate\Http\Response
     */
    public function getBranchByScheme($schemeId)
    {
        try {
            $branches = Branch::where(['scheme_id' => $schemeId])->get();
            return $this->sendResponse(
                true,
                'Branches retrieved successfully',
                200,
                ['branches' => $branches]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve branches' . $ex,
                400
            );
        }
    }
}
