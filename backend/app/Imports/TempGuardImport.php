<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithStartRow;

class TempGuardImport implements WithStartRow
{
 

     /**
     * @return int
     */
    public function startRow(): int
    {
        return 2;
    }
}
