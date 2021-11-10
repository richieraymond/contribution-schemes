<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBranchRequest extends FormRequest
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
            'name' => 'required|string|max:35',
            'contact_person' => 'nullable|string|max:35',
            'email' => 'nullable|string|email|max:255',
            'phone' => 'nullable|string|regex:/^\+?\d{3} ?\d{3} ?\d{3} ?\d{3}$/',
            'location' => 'nullable|string|max:100',
            'status' => 'nullable|boolean',
            'hierarchy_id' => 'nullable|exists:scheme_types,id',
            'parent_branch' => 'nullable|exists:branches,id',
            'scheme_id' => 'nullable|exists:schemes,id'
        ];
    }
}
