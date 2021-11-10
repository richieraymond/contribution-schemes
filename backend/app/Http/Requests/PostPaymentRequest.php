<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PostPaymentRequest extends FormRequest
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
            'contributor_id' => 'required|exists:contributors,id',
            'scheme_id' => 'required|exists:schemes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'project_id' => 'nullable|exists:projects,id',
            'amount' => 'numeric|min:1',
            'payment_channel' => 'required|string',
            'payer_phone' => 'required|string'
        ];
    }
}
