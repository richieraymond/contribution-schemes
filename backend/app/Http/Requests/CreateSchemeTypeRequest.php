<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateSchemeTypeRequest extends FormRequest
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
            'name' => 'string|required',
            'status' => 'nullable|boolean',
            'max_dependents' => 'nullable|numeric|min:0',
            'has_children' => 'nullable|boolean',
            'gender' => 'nullable|in:MALE,FEMALE'
        ];
    }
}
