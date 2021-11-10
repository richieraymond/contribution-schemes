<?php

namespace App\Http\Controllers\Api\Maps;

use App\Http\Controllers\BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MapsController extends BaseController
{

    public function __construct()
    {
        $this->middleware(['auth:companies,admins']);
    }

    public function getSiteMapData()
    {
        try {
            $siteMapData = null;
            if (Auth::user()->company_id) {
                $siteMapData =  DB::select("select concat('Name: ', Q.name, 
                '\nZone: ',(select name from zones Z where Z.id=Q.zone_id),
                '\nContact Person: ',Q.contact_person,
                '\nPhone: ',Q.phone,'\nRadio Number: ',Q.radio_number,'\nCurrent Guard Name:',
                (select concat(g.first_name,' ',g.last_name, '\nGuard Phone: ',g.phone) as guard_details from guards g where g.id=(select CG.guard_id from guard_check_ins CG where CG.site_id=Q.id order by id desc limit 1)),
                '\nShift:',
                (select CS.shift from guard_check_ins CS where CS.site_id=Q.id order by id desc limit 1),
                '\n Guard checkin count: ',
                (select C.checkin_number from guard_check_ins C where C.site_id=Q.id order by id desc limit 1)
                ) as site_details,
                split_part(Q.gps_coordinates,',',1) as lat,
                split_part(Q.gps_coordinates,',',2) as lng,
                (select CI.created_at from guard_check_ins CI where CI.site_id=Q.id order by id desc limit 1) as last_checkin
                from sites Q WHERE Q.company_id=:companyId", ['companyId' => Auth::user()->company_id]);
            } else {
                $siteMapData =  DB::select("select concat('Name: ', Q.name, 
                '\nZone: ',(select name from zones Z where Z.id=Q.zone_id),
                '\nContact Person: ',Q.contact_person,
                '\nPhone: ',Q.phone,'\nRadio Number: ',Q.radio_number,'\nCurrent Guard Name:',
                (select concat(g.first_name,' ',g.last_name, '\nGuard Phone: ',g.phone) as guard_details from guards g where g.id=(select CG.guard_id from guard_check_ins CG where CG.site_id=Q.id order by id desc limit 1)),
                '\nShift:',
                (select CS.shift from guard_check_ins CS where CS.site_id=Q.id order by id desc limit 1),
                '\n Guard checkin count: ',
                (select C.checkin_number from guard_check_ins C where C.site_id=Q.id order by id desc limit 1)
                ) as site_details,
                split_part(Q.gps_coordinates,',',1) as lat,
                split_part(Q.gps_coordinates,',',2) as lng,
                (select CI.created_at from guard_check_ins CI where CI.site_id=Q.id order by id desc limit 1) as last_checkin
                from sites Q");
            }
            return $this->sendResponse(
                true,
                'Site map data retrieved successfully',
                200,
                [
                    'siteMapData' => $siteMapData,
                ]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve site map data' . $ex,
                400
            );
        }
    }
}
