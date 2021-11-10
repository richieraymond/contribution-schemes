<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends BaseController
{
    public function __construct()
    {
        $this->middleware(['auth:schemes,admins']);
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
            if (Auth::user()->scheme_id) {
                $contributors = DB::table('contributors')
                    ->where('scheme_id', Auth::user()->scheme_id)
                    ->count('id');
                $users = DB::table('users')
                    ->where('scheme_id', Auth::user()->scheme_id)
                    ->count('id');;
                $branches = DB::table('branches')
                    ->where('scheme_id', Auth::user()->scheme_id)
                    ->count('id');
                $projects = DB::table('projects')
                    ->where('scheme_id', Auth::user()->scheme_id)
                    ->count('id');
            } else {
                $contributors = DB::table('contributors')
                    ->count('id');
                $users = DB::table('users')
                    ->count('id');;
                $branches = DB::table('branches')
                    ->count('id');
                $projects = DB::table('projects')
                    ->count('id');
                $admins = DB::table('admins')
                    ->count('id');
                $schemes = DB::table('schemes')
                    ->count('id');
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
                    'schemes' => $schemes
                ]
            );
        } catch (\Exception $ex) {
            $this->sendResponse(false, 'Failed to fetch status' . $ex->getMessage(), 400);
        }
    }
}
