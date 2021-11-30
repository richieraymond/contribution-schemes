<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateContributorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => 'required|string|max:35',
            'last_name' => 'required|string|max:35',
            'email' => 'nullable|string|max:255',
            'phone' => 'required|string|regex:/^\+?\d{3} ?\d{3} ?\d{3} ?\d{3}$/',
            'status' => 'nullable|boolean',
            'profile_pic' => 'sometimes|nullable|image|mimes:jpeg,png,jpg|max:2048',
            'contributor_id' => 'nullable',
            'branch_id' => 'nullable',
            'title' => 'required',
            'gender' => 'required',
            'dob' => 'required',
            'maritalstatus' => 'required',
            'other_phone' => 'nullable|regex:/^\+?\d{3} ?\d{3} ?\d{3} ?\d{3}$/',
            'home_parish' => 'required',
            'center' => 'required',
            'residence' => 'required',
            'biological_mother' => 'required',
            'biological_father' => 'required',
            'spouse' => 'nullable',
            'next_of_kin' => 'required',
            'kin_telephone' => 'required',
            'other_kin_telephone' => 'nullable|regex:/^\+?\d{3} ?\d{3} ?\d{3} ?\d{3}$/',
            'kin_email' => 'required',
            'other_kin_email' => 'nullable',
            'education_level' => 'required',
            'children' => 'nullable'
        ];
    }
}
