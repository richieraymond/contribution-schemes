<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
Use \Carbon\Carbon;

class DashboardController extends BaseController
{
    public function __construct()
    {
        $this->middleware(['auth:admins, schemes']);
    }

    public function index()
    {
        try {
            $contributors = 0;
            $users = 0;
            $branches = 0;

            $projects = 0;
            $admins = 0;
            $schemes = 0;

            $tomorrow= '12-31-2021'; //date("m-d-Y", strtotime("+1 day"));
            $todayYearBack =  '12-31-2020';// date("m-d-Y", strtotime("-1 year"));
            if (Auth::user()->scheme_id) {
                $contributors = DB::table('contributors')
                    ->where('scheme_id', Auth::user()->scheme_id)
                    ->count('id');
                $users = DB::table('users')
                    ->where('scheme_id', Auth::user()->scheme_id)
                    ->count('id');
                $branches = DB::table('branches')
                    ->where('scheme_id', Auth::user()->scheme_id)
                    ->count('id');
                $projects = DB::table('projects')
                    ->where('scheme_id', Auth::user()->scheme_id)
                    ->count('id');
                $contributorsGrowthGraph = DB::select("SELECT COUNT(C.id) AS total, EXTRACT(YEAR from C.created_at) AS year, EXTRACT(MONTH from C.created_at) AS month FROM contributors C
                    WHERE C.created_at >= ? AND C.created_at <= ? AND C.scheme_id = ? GROUP BY EXTRACT(YEAR from C.created_at), EXTRACT(MONTH from C.created_at)
                    ORDER BY EXTRACT(YEAR from C.created_at) DESC, EXTRACT(MONTH from C.created_at) DESC", [$todayYearBack, $tomorrow, Auth::user()->scheme_id]);

                $totalContributions = DB::select("SELECT SUM(C.amount) AS total, EXTRACT(YEAR from C.created_at) AS year, EXTRACT(MONTH from C.created_at) AS month FROM contributions C
                    WHERE C.created_at >= ? AND C.created_at <= ? AND status = ? AND C.scheme_id = ? GROUP BY EXTRACT(YEAR from C.created_at), EXTRACT(MONTH from C.created_at)
                    ORDER BY EXTRACT(YEAR from C.created_at) DESC, EXTRACT(MONTH from C.created_at) DESC", [$todayYearBack, $tomorrow, true, Auth::user()->scheme_id]);
            } else {
                $contributors = DB::table('contributors')
                    ->count('id');
                $users = DB::table('users')
                    ->count('id');
                $branches = DB::table('branches')
                    ->count('id');
                $projects = DB::table('projects')
                    ->count('id');
                $admins = DB::table('admins')
                    ->count('id');
                $schemes = DB::table('schemes')
                    ->count('id');
                $contributorsGrowthGraph = DB::select("SELECT COUNT(C.id) AS total, EXTRACT(YEAR from C.created_at) AS year, EXTRACT(MONTH from C.created_at) AS month FROM contributors C
                    WHERE C.created_at >= ? AND C.created_at <= ? GROUP BY EXTRACT(YEAR from C.created_at), EXTRACT(MONTH from C.created_at)
                    ORDER BY EXTRACT(YEAR from C.created_at) DESC, EXTRACT(MONTH from C.created_at) DESC", [$todayYearBack, $tomorrow]);

                $totalContributions = DB::select("SELECT SUM(C.amount) AS total, EXTRACT(YEAR from C.created_at) AS year, EXTRACT(MONTH from C.created_at) AS month FROM contributions C
                    WHERE C.created_at >= ? AND C.created_at <= ? AND status = ? GROUP BY EXTRACT(YEAR from C.created_at), EXTRACT(MONTH from C.created_at)
                    ORDER BY EXTRACT(YEAR from C.created_at) DESC, EXTRACT(MONTH from C.created_at) DESC", [$todayYearBack, $tomorrow, true]);
            }
            return $this->sendResponse(
                true,
                'Stats retrieved successfully',
                200,
                [
                    'users' => $users,
                    'projects' => $projects,
                    'branches' => $branches,
                    'admins' => $admins,
                    'contributors' => $contributors,
                    'schemes' => $schemes,
                    'contributorsGrowthGraph' => $contributorsGrowthGraph,
                    'totalContributions'=> $totalContributions,
                ]
            );
        } catch (\Exception $ex) {
            $this->sendResponse(false, 'Failed to fetch status' . $ex->getMessage(), 400);
        }
    }
}
