<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
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
            'use_phone' => 'required|boolean',
            'email' => 'nullable|string|email|max:255',
            'phone' => 'nullable|string|regex:/^\+?\d{3} ?\d{3} ?\d{3} ?\d{3}$/',
            'model' => 'required|in:company,admin'
        ];
    }
}
