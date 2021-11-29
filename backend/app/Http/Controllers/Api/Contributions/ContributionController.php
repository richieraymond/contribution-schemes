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

    public function getContributorPaymentDetails(){

        try {

            // $contributorsDetails = DB::table('contributions C')
            // ->join('contributors U', 'C.contributor_id', '=', 'U.id')
            // ->join('schemes S', 'C.scheme_id', '=', 'S.id')
            // ->join('projects P', 'C.project_id', '=', 'P.id')
            // // ->join('contributors U', 'C.contributor_id', '=', 'U.id')
            // ->leftJoin('branches B', 'C.branch_id', '=', 'B.id')
            // ->select('C.id', 'C.contributor_id', 'C.scheme_id', 'C.branch_id', 'C.project_id', 'C.amount', 'C.sasula_reference',
            // 'C.payer_phone', 'C.payment_channel', 'C.status', 'C.channel_tran_id', 'C.channel_tran_date', 'C.teal_id', 
            // 'C.ip_address', 'C.user_agent', 'C.created_at', 'C.updated_at', "CONCAT(U.first_name,' ',U.last_name) AS contributer_name", 'U.email',
            // 'S.name AS scheme_name', 'S.location', 'B.name AS branch_name', "'CSM' AS branch_cd", 'P.name AS project_name')
            // ->get();

            $contributorsDetails = DB::select("SELECT C.id, C.contributor_id, C.scheme_id, C.branch_id, C.project_id, C.amount, C.sasula_reference,
                                            C.payer_phone, C.payment_channel, C.status, C.channel_tran_id, C.channel_tran_date, C.teal_id, 
                                            C.ip_address, C.user_agent, C.created_at, C.updated_at, CONCAT(U.first_name,' ',U.last_name) AS contributer_name, U.email,
                                            S.name AS scheme_name, S.location, B.name AS branch_name, 'CSM' AS branch_cd, P.name AS project_name
                                            FROM contributions C INNER JOIN contributors U on C.contributor_id = U.id INNER JOIN schemes S ON C.scheme_id = S.id
                                            LEFT JOIN branches B ON C.branch_id = B.id INNER JOIN projects P ON C.project_id = P.id WHERE C.sasula_reference= '1000000001' ");

        return $this->sendResponse(true, 'Customer details', 200, ['Details'=>$contributorsDetails]);
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve Details' . $ex,
                400
            );
        }

        public function receivePayments(Contribution $request){

        }

        
    }

}
