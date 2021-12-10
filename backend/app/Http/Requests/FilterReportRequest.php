<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilterReportRequest extends FormRequest
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
            'from_dt' => 'nullable|date',
            'to_dt' => 'nullable|date',
            'limit' => 'nullable|integer',
            'branches' => 'nullable',
            'project_id' => 'nullable|exists:projects,id'
        ];
    }
}
