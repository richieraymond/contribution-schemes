<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProjectRequest extends FormRequest
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
            'name' => 'required|string',
            'is_recurring' => 'boolean',
            'frequency' => 'nullable|numeric',
            'frequency_unit' => 'nullable|string',
            'require_fixed_amounts' => 'boolean|required',
            'allow_installments' => 'boolean|required',
            'amount' => 'numeric|min:1',
            'penalty_when_missed' => 'numeric|required',
        ];
    }
}
