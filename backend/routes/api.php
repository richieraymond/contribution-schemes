<?php

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Response as FacadesResponse;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'auth'], function () {
    Route::post('profile-reset', 'App\Http\Controllers\Api\Users\UserProfileController@resetPassword');
    Route::post('login', 'App\Http\Controllers\Api\Auth\LoginController@processLogin');
    Route::resource('admin', 'App\Http\Controllers\Api\Users\AdminController');
    Route::resource('roles', 'App\Http\Controllers\Api\Users\RoleController');
    Route::post('forgot', 'App\Http\Controllers\Api\Users\PasswordController@forgotPassword');
    Route::post('reset', 'App\Http\Controllers\Api\Users\PasswordController@resetPassword');
    Route::post('assignpermission', 'App\Http\Controllers\Api\Users\PrivilegeController@addPermission');
    Route::post('revokepermission', 'App\Http\Controllers\Api\Users\PrivilegeController@revokePermission');
    Route::get('permissions/{roleid}', 'App\Http\Controllers\Api\Users\PrivilegeController@index');
});

Route::group(['prefix' => 'scheme'], function () {
    Route::resource('scheme', 'App\Http\Controllers\Api\Scheme\SchemeController');
    Route::resource('user', 'App\Http\Controllers\Api\Scheme\UserController');
    Route::get('getrolebyscheme/{schemeId}', 'App\Http\Controllers\Api\Users\RoleController@getRoleBySchemeId');
    Route::resource('contributor', 'App\Http\Controllers\Api\Scheme\ContributorController');

    Route::resource('type', 'App\Http\Controllers\Api\Scheme\SchemeTypeController');
    Route::resource('hierarchy', 'App\Http\Controllers\Api\Scheme\SchemeHierarchyController');
    Route::get('hierarchy-by-scheme/{schemeId}', 'App\Http\Controllers\Api\Scheme\SchemeHierarchyController@getHierarchyByScheme');
    Route::get('branch-by-scheme/{schemeId}', 'App\Http\Controllers\Api\Scheme\BranchController@getBranchByScheme');
    Route::resource('branch', 'App\Http\Controllers\Api\Scheme\BranchController');
    Route::resource('project', 'App\Http\Controllers\Api\Scheme\ProjectController');
});


Route::group(['prefix' => 'contribution'], function () {
    Route::get('verify-contributor/{contributorTel}', 'App\Http\Controllers\Api\Contributions\ContributionController@getContributorDetails');
    Route::post('register-contributor', 'App\Http\Controllers\Api\Contributions\ContributionController@registerContributor');
    Route::get('get-scheme-by-name/{name}', 'App\Http\Controllers\Api\Contributions\ContributionController@getSchemes');
    Route::get('get-branches/{schemeId}', 'App\Http\Controllers\Api\Contributions\ContributionController@getBranches');
    Route::get('get-projects/{schemeId}', 'App\Http\Controllers\Api\Contributions\ContributionController@getProjects');
    Route::post('make-payment', 'App\Http\Controllers\Api\Contributions\ContributionController@postPayment');
    Route::get('get-contributor-details/{sasulaRef}', 'App\Http\Controllers\Api\Contributions\ContributionController@getContributorPaymentDetails');
    Route::post('receive-payment', 'App\Http\Controllers\Api\Contributions\ContributionController@receivePayments');
});


Route::group(['prefix' => 'reports'], function () {
    Route::post('contributors', 'App\Http\Controllers\Api\RefData\ReportController@getMemberReports');
    Route::post('contributions', 'App\Http\Controllers\Api\RefData\ReportController@getPaymentsReport');
});


Route::group(['prefix' => 'reports'], function () {
    Route::get('dashboard', 'App\Http\Controllers\Api\Dashboard\DashboardController@index');
});

Route::group(['prefix' => 'refdata'], function () {
    Route::resource('title', 'App\Http\Controllers\Api\RefData\TitleController');
    Route::resource('maritalstatus', 'App\Http\Controllers\Api\RefData\MaritalStatusController');
    Route::resource('educationlevel', 'App\Http\Controllers\Api\RefData\EducationLevelController');
});

Route::group(['prefix' => 'uploads'], function () {
    Route::post('upload-contributors', 'App\Http\Controllers\BulkUploadController@bulkUploadGuards');
    Route::get('uploaded-contributors', 'App\Http\Controllers\BulkUploadController@getBatches');
    Route::get('uploaded-contributor-details/{batchNo}', 'App\Http\Controllers\BulkUploadController@getBatchDetails');
    Route::post('approve-contributors', 'App\Http\Controllers\BulkUploadController@approveUpload');
});

Route::get('contributor-image/{filename}', function ($fileName) {
    $path = public_path() . '/images/' . $fileName;
    return FacadesResponse::download($path);
});
