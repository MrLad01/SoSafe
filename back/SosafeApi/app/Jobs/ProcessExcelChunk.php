private $records;
private $now;

public function __construct(array $records, $now)
{
    $this->records = $records;
    $this->now     = $now;
}

public function handle()
{
    try {
        $zones     = \App\Models\Zone::pluck('id', 'name')->toArray();
        $areas     = \App\Models\Area::pluck('id', 'name')->toArray();
        $divisions = \App\Models\Division::pluck('id', 'name')->toArray();

        $dataToInsert = [];

        foreach ($this->records as $line) {
            $line = array_change_key_case($line, CASE_UPPER);

            $zoneId     = isset($line['ZONE']) ? ($zones[strtoupper(trim($line['ZONE']))]     ?? null) : null;
            $areaId     = isset($line['AREA']) ? ($areas[strtoupper(trim($line['AREA']))]     ?? null) : null;
            $divisionId = isset($line['CITY']) ? ($divisions[strtoupper(trim($line['CITY']))] ?? null) : null;

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
                'CITY'          => $divisionId,
                'ZONE'          => $zoneId,
                'AREA'          => $areaId,
                'SERVNO'        => $line['SERVNO']        ?? null,
                'POSITION'      => $line['POSITION']      ?? null,
                'ENLISTED'      => $line['ENLISTED']      ?? null,
                'RANK'          => $line['RANK']          ?? null,
                'NOK'           => $line['NOK']           ?? null,
                'RELATION'      => $line['RELATION']      ?? null,
                'NOKNO'         => $line['NOKNO']         ?? null,
                'CAPTURED'      => $line['CAPTURED']      ?? null,
                'QUALIFICATION' => $line['QUALIFICATION'] ?? null,
                'created_at'    => $this->now,
                'updated_at'    => $this->now,
            ];
        }

        Biodata::insert($dataToInsert);

    } catch (\Exception $e) {
        Log::error('Failed to process Excel chunk', [
            'error'         => $e->getMessage(),
            'line'          => $e->getLine(),
            'records_count' => count($this->records ?? []),
        ]);
        throw $e;
    }
}