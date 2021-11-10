<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContributorSelfRegistrationRequest extends FormRequest
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
        ];
    }
}
