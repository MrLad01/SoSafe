public function handle()
{
    try {
        $dataToInsert = [];

        foreach ($this->records as $line) {
            // Normalize keys to uppercase to handle any case inconsistencies
            $line = array_change_key_case($line, CASE_UPPER);

            $dataToInsert[] = [
                'SNO'           => $line['SNO']           ?? null,
                'FNO'           => $line['FNO']           ?? null,
                'SNAME'         => $line['SNAME']         ?? null,
                'FNAME'         => $line['FNAME']         ?? null,
                'ONAME'         => $line['ONAME']         ?? null,
                'ADDRESS'       => $line['ADDRESS']       ?? null,
                'PHONE'         => $line['PHONE']         ?? null,
                'NIN'           => $line['NIN']           ?? null,
                'DOB'           => $line['DOB']           ?? null,
                'SEX'           => $line['SEX']           ?? null,
                'CITY'          => $line['CITY']          ?? null,
                'ZONE'          => $line['ZONE']          ?? null,
                'AREA'          => $line['AREA']          ?? null,
                'SERVNO'        => $line['SERVNO']        ?? null,
                'POSITION'      => $line['POSITION']      ?? null,
                'ENLISTED'      => $line['ENLISTED']      ?? null,
                'RANK'          => $line['RANK']          ?? null,
                'NOK'           => $line['NOK']           ?? null,
                'RELATION'      => $line['RELATION']      ?? null,
                'NOKNO'         => $line['NOKNO']         ?? null,
                'CAPTURED'      => $line['CAPTURED']      ?? null,
                'QUALIFICATION' => $line['QUALIFICATION'] ?? null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ];
        }

        Biodata::insert($dataToInsert);

        Log::info('Excel chunk processed successfully', [
            'records_count' => count($this->records),
            'chunk_size'    => count($dataToInsert)
        ]);

    } catch (\Exception $e) {
        Log::error('Failed to process Excel chunk', [
            'error'         => $e->getMessage(),
            'line'          => $e->getLine(),
            'records_count' => count($this->records ?? []),
        ]);
        
        throw $e;
    }
}