<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateSchemeRequest extends FormRequest
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
            'contact_person' => 'required|string|max:35',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|regex:/^\+?\d{3} ?\d{3} ?\d{3} ?\d{3}$/',
            'location' => 'required|string|max:100',
            'status' => 'nullable|boolean',
            'category_id' => 'nullable|exists:scheme_types,id',
            'is_membership_based'=>'boolean'
        ];
    }
}
