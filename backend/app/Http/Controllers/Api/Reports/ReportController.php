<?php

namespace App\Http\Controllers\Api\RefData;

use App\Http\Controllers\BaseController;
use App\Http\Requests\FilterReportRequest;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Support\Facades\DB;

class ReportController extends BaseController
{

    public function __construct()
    {
        return $this->middleware(['auth:api']);
    }

    public function getMemberReports(FilterReportRequest $request)
    {
        try {
            $resultSql = "select C.*,s.name from contributors c left join schemes s on s.id = c.scheme_id WHERE C.scheme_id=?";

            $restrictionsArray = array();

            array_push($restrictionsArray, FacadesAuth::user()->scheme_id);

            $validated = $request->validated();

            if (array_key_exists('branches', $validated) && $validated['branches']) {
                $resultSql .= " and s.branch_id = ANY (?)";
                array_push($restrictionsArray, "{" . implode(",", $validated['branches']) . "}");
            }

            if (array_key_exists('from_dt', $validated) && $validated['from_dt']) {
                $resultSql .= " and C.created_at>=?";
                array_push($restrictionsArray, $validated['from_dt']);
            }


            if (array_key_exists('to_dt', $validated) && $validated['to_dt']) {
                $resultSql .= " and C.created_at<=?";
                array_push($restrictionsArray, $validated['to_dt']);
            }

            $resultSql .= " order by id desc ";
            if (array_key_exists('limit', $validated) && $validated['limit']) {
                $resultSql .= " limit " . $validated['limit'];
            }

            $contributors = DB::select($resultSql, $restrictionsArray);

            return $this->sendResponse(
                true,
                'Contributors retrieved successfully',
                200,
                [
                    'contributors' => $contributors,
                ]
            );
        } catch (\Exception $ex) {
            $this->reportException($ex);
            return $this->sendResponse(
                false,
                'Failed to retrieve records',
                400
            );
        }
    }


    public function getPaymentsReport(FilterReportRequest $request)
    {
        try {
            $resultSql = "select c.*,c2.first_name,c2.last_name,(select name from projects p where p.id=c.project_id) from contributions c join contributors c2 on c2.id = c.contributor_id WHERE c.scheme_id=?";

            $restrictionsArray = array();

            array_push($restrictionsArray, FacadesAuth::user()->scheme_id);

            $validated = $request->validated();

            if (array_key_exists('from_dt', $validated) && $validated['from_dt']) {
                $resultSql .= " and c.created_at>=?";
                array_push($restrictionsArray, $validated['from_dt']);
            }

            if (array_key_exists('project_id', $validated) && $validated['project_id']) {
                $resultSql .= " and c.project_id<=?";
                array_push($restrictionsArray, $validated['project_id']);
            }

            if (array_key_exists('to_dt', $validated) && $validated['to_dt']) {
                $resultSql .= " and c.created_at<=?";
                array_push($restrictionsArray, $validated['to_dt']);
            }

            $resultSql .= " order by id desc ";
            if (array_key_exists('limit', $validated) && $validated['limit']) {
                $resultSql .= " limit " . $validated['limit'];
            }

            $contributions = DB::select($resultSql, $restrictionsArray);

            return $this->sendResponse(
                true,
                'Contributors retrieved successfully',
                200,
                [
                    'contributions' => $contributions,
                ]
            );
        } catch (\Exception $ex) {
            $this->reportException($ex);
            return $this->sendResponse(
                false,
                'Failed to retrieve records',
                400
            );
        }
    }
}
