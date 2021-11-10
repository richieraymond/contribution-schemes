<?php

namespace App\Http\Controllers\Api\Scheme;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateProjectRequest;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware(['auth:schemes']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $projects = Project::where(['scheme_id' => Auth::user()->scheme_id])->get();
            return $this->sendResponse(
                true,
                'Projects retrieved successfully',
                200,
                ['projects' => $projects]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve projects' . $ex,
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
    public function store(CreateProjectRequest $request)
    {
        try {
            $data = $request->validated();
            $project = new Project();
            $project->name = $data['name'];
            $project->is_recurring = $data['is_recurring'];
            $project->frequency = $data['frequency'];
            $project->frequency_unit = $data['frequency_unit'];
            $project->amount = $data['amount'];
            $project->require_fixed_amounts = $data['require_fixed_amounts'];
            $project->allow_installments = $data['allow_installments'];
            $project->penalty_when_missed = $data['penalty_when_missed'];
            $project->scheme_id = Auth::user()->scheme_id;
            $project->user_agent = $request->header('User-Agent');
            $project->ip_address = $request->ip();
            $project->created_by = Auth::user()->id;
            $project->save();
            return $this->sendResponse(
                true,
                'Project saved successfully',
                200,
                ['project' => $project]
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
            $project = Project::where('scheme_id', Auth::user()->scheme_id)->findOrFail($id);
            return $this->sendResponse(
                true,
                'Project retrieved successfully',
                200,
                ['project' => $project]
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
    public function update(CreateProjectRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $project = Project::where('scheme_id', Auth::user()->scheme_id)->findOrFail($id);
            if (array_key_exists('status', $data)) {
                $project->status = $data['status'];
            }
            $project->name = $data['name'];
            $project->is_recurring = $data['is_recurring'];
            $project->frequency = $data['frequency'];
            $project->frequency_unit = $data['frequency_unit'];
            $project->require_fixed_amounts = $data['require_fixed_amounts'];
            $project->allow_installments = $data['allow_installments'];
            $project->amount = $data['amount'];
            $project->penalty_when_missed = $data['penalty_when_missed'];
            $project->save();
            return $this->sendResponse(
                true,
                'Project updated successfully',
                200,
                ['project' => $project]
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
    public function getProjectsByScheme($schemeId)
    {
        try {

            $projects = Project::where(['scheme_id' => $schemeId])->get();
            return $this->sendResponse(
                true,
                'Projects retrieved successfully',
                200,
                ['projects' => $projects]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve projects' . $ex,
                400
            );
        }
    }
}
