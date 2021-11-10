<?php

namespace App\Http\Controllers\Api\Contributions;

use App\Http\Controllers\BaseController;
use App\Http\Requests\ContributorSelfRegistrationRequest;
use App\Http\Requests\PostPaymentRequest;
use App\Models\Contribution;
use App\Models\Contributor;
use Illuminate\Support\Facades\DB;

class ContributionController extends BaseController
{
    public function __construct()
    {
        $this->middleware('guest');
    }

    public function getSchemes($name)
    {
        try {
            $schemes = DB::table('schemes')
                ->where('name', 'ilike', '%' . $name . '%')
                ->get();
            return $this->sendResponse(
                true,
                'Schemes Retrieved Successfully',
                200,
                ['schemes' => $schemes]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve products' . $ex,
                400
            );
        }
    }

    public function getBranches($schemeId)
    {
        try {
            $branches = DB::table('branches')
                ->where('scheme_id', $schemeId)
                ->get();
            return $this->sendResponse(
                true,
                'Branches Retrieved Successfully',
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

    public function getProjects($schemeId)
    {
        try {
            $projects = DB::table('projects')
                ->where('scheme_id', $schemeId)
                ->where('status', true)
                ->get();
            return $this->sendResponse(
                true,
                'Projects Retrieved Successfully',
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

    public function getContributorDetails($contributorTel)
    {
        try {
            $contributor = Contributor::with('scheme')->where([
                'phone' => $contributorTel,
                'status' => true
            ])->first();
            return $this->sendResponse(
                true,
                'Contributors Retrieved Successfully',
                200,
                ['contributor' => $contributor]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve contributor' . $ex,
                400
            );
        }
    }

    public function registerContributor(ContributorSelfRegistrationRequest $request)
    {
        try {
            $validated = $request->validated();
            $contributor = new Contributor();
            $contributor->first_name = $validated['first_name'];
            $contributor->last_name = $validated['last_name'];
            $contributor->phone = $validated['phone'];
            $contributor->email = $validated['email'];
            $contributor->user_agent = $request->header('User-Agent');
            $contributor->ip_address = $request->ip();
            $contributor->save();

            return $this->sendResponse(
                true,
                'You have been successfully registered',
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


    public function postPayment(PostPaymentRequest $request)
    {
        try {
            $sasula_ref = null;
            $max_sasula_ref =  Contribution::max('sasula_reference');
            if ($max_sasula_ref) {
                $sasula_ref = $max_sasula_ref + 1;
            } else {
                $sasula_ref = 1000000000;
            }
            $validated = $request->validated();
            $contribution = new Contribution();
            $contribution->contributor_id = $validated['contributor_id'];
            $contribution->scheme_id = $validated['scheme_id'];
            $contribution->branch_id = $validated['branch_id'];
            $contribution->project_id = $validated['project_id'];
            $contribution->payment_channel = $validated['payment_channel'];
            $contribution->payer_phone = $validated['payer_phone'];
            $contribution->sasula_reference =  $sasula_ref;
            $contribution->amount = $validated['amount'];
            $contribution->user_agent = $request->header('User-Agent');
            $contribution->ip_address = $request->ip();
            $contribution->save();

            $contributionWithDetails = Contribution::with([
                'contributor',
                'project',
                'scheme',
                'branch'
            ])->findOrFail($contribution->contributor_id);

            $message = 'Payment request processed successfully, move to any of our partner banks to make a payment!';

            if ($contribution->payment_channel === 'MOMO') {
                $message = 'Payment initiated successfully, please enter your mobile money pin to complete transaction!';
            }

            return $this->sendResponse(
                true,
                $message,
                200,
                [
                    'contribution' => $contributionWithDetails
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
