import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Search, ChevronLeft, ChevronRight, Loader2, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface BiodataRecord {
  id: number;
  form_no: string;
  code: string;
  firstname: string;
  lastname: string;
  [key: string]: string | number; 
=======
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { Search, ChevronLeft, ChevronRight, Loader2, Download, Lock } from 'lucide-react';

// The sentinel value the backend sends when DOB is restricted
const MASKED_DOB = '****-**-**';

interface BiodataRecord {
  id: number;
  sno: string;
  fno: string;
  sname: string;
  fname: string;
  oname: string;
  address: string;
  phone: string;
  nin: string;
  dob: string;
  sex: string;
  city: number | string;
  zone: number | string;
  area: number | string;
  servno: string;
  position: string;
  enlisted: string;
  rank: string;
  nok: string;
  relation: string;
  nokno: string;
  captured: string;
  qualification: string;
  [key: string]: string | number;
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
}

interface ApiResponse {
  data: BiodataRecord[];
  meta: {
    last_page: number;
    current_page: number;
    total: number;
    per_page: number;
  };
}

interface SingleRecordResponse {
  data: BiodataRecord;
}

interface AllRecordsResponse {
<<<<<<< HEAD
    data: BiodataRecord[];
    total: number;
  }

const BiodataDisplay: React.FC = () => {
  const { token } = useAuth()
  const [records, setRecords] = useState<BiodataRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedRecord, setSelectedRecord] = useState<BiodataRecord | null>(null);
  const [perPage] = useState<number>(100);
  const [allRecords, setAllRecords] = useState<BiodataRecord[]>([]);

  const fetchRecords = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<ApiResponse>(`https://sosafe.onrender.com/api/biodata2`, {
        params: {
          page: currentPage,
          per_page: perPage,
          search: search.toUpperCase() || undefined
        },
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );
      setRecords(response.data.data);
      setTotalPages(response.data.meta.last_page);
    } catch (err) {
      setError('Failed to fetch records. Please try again.');
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentPage, search]);

  const fetchSingleRecord = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<SingleRecordResponse>(`https://sosafe.onrender.com/api/biodata2/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setSelectedRecord(response.data.data);
    } catch (err) {
      setError('Failed to fetch record details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = (): void => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  
  const fetchAllRecords = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<AllRecordsResponse>('https://sosafe.onrender.com/api/biodata2/all', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(response.data.data);
      setAllRecords(response.data.data);
      
      // Optional: Export to JSON file
      const jsonStr = JSON.stringify(response.data.data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'biodata_records.json';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to fetch all records. Please try again.');
      console.error('Error fetching all records:', err);
    } finally {
      setLoading(false);
      console.log(allRecords);
      
    }
  };

=======
  data: BiodataRecord[];
  total: number;
}


const safeDateFormat = ( dateStr: string | null | undefined, fmt = 'M/d/yyyy' ): string => {
  if ( !dateStr ) return '';
  if ( dateStr === MASKED_DOB ) return MASKED_DOB;
  
  try {
    return format( parseISO( dateStr ), fmt );
  } catch {
    return dateStr;
  }
};

const BiodataDisplay: React.FC = () => {
  const { token, user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  const [ currentPage, setCurrentPage ]       =  useState< number >(1);
  const [ error, setError ]                   =  useState< string | null >( null );
  const [ loading, setLoading ]               =  useState< boolean >( false );
  const [ perPage ]                           =  useState< number >(100);
  const [ records, setRecords ]               =  useState< BiodataRecord[] >( [] );
  const [ search, setSearch ]                 =  useState< string >( '' );
  const [ selectedRecord, setSelectedRecord ] =  useState< BiodataRecord | null >( null );
  const [ totalPages, setTotalPages ]         =  useState< number >(1);

  const [ editForm, setEditForm ]             = useState< Partial< BiodataRecord >>( {} );
  const [ filteredAreas, setFilteredAreas ]   = useState< any[] >( [] );
  const [ filteredDivisions, setFilteredDivisions ] = useState< any[] >( [] );
  const [ isEditing, setIsEditing ] = useState( false );
  const [ saving, setSaving ]                 = useState( false );
  const [ zones, setZones ]                   = useState< any[] >( [] );

  const [ areaMap, setAreaMap ]     = useState< Record< number, string >>( {} );
  const [ divisionMap, setDivisionMap ] = useState< Record< number, string >>( {} );
  const [ zoneMap, setZoneMap ]     = useState< Record< number, string >>( {} );

  const formatRecord = ( record: any ) => ({
    ...record,
    dob:      safeDateFormat( record.dob ),
    enlisted: safeDateFormat( record.enlisted ),
  });

  const buildLocationMaps = ( zones: any[] ) => {
    const zoneMap:     Record< number, string > = {};
    const areaMap:     Record< number, string > = {};
    const divisionMap: Record< number, string > = {};

    zones.forEach( zone => {
      zoneMap[ zone.id ] = zone.name;
      zone.areas.forEach( ( area: any ) => {
        areaMap[ area.id ] = area.name;
        area.divisions.forEach( ( division: any ) => {
          divisionMap[ division.id ] = division.name;
        });
      });
    });

    return { zoneMap, areaMap, divisionMap };
  };

  const fetchRecords = async (): Promise<void> => {
    try {
      setLoading( true );
      setError( null );

      const [ recordsRes, zonesRes ] = await Promise.all([
        axios.get< ApiResponse >( 'https://sosafe.onrender.com/api/biodata2', {
          params: {
            page: currentPage,
            per_page: perPage,
            search: search.toUpperCase() || undefined,
          },
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get( 'https://sosafe.onrender.com/api/zones', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRecords( recordsRes.data.data );
      setTotalPages( recordsRes.data.meta.last_page );

      setZones( zonesRes?.data );

      const maps = buildLocationMaps( zonesRes?.data );
      setAreaMap( maps.areaMap );
      setDivisionMap( maps.divisionMap );
      setZoneMap( maps.zoneMap );

    } catch {
      setError( 'Failed to fetch records. Please try again.' );
    } finally {
      setLoading( false );
    }
  };

  useEffect(() => { fetchRecords(); }, [ currentPage, search ]);

  const fetchSingleRecord = async ( id: number ): Promise<void> => {
    try {
      setLoading( true );
      setIsEditing( false );

      const response = await axios.get< SingleRecordResponse >(
        `https://sosafe.onrender.com/api/biodata2/${ id }`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedRecord( formatRecord( response.data.data ));
    } catch {
      setError( 'Failed to fetch record details. Please try again.' );
    } finally {
      setLoading( false );
    }
  };

  const fetchAllRecords = async (): Promise<void> => {
    try {
      setLoading( true );
      setError( null );

      const [ recordsRes, zonesRes ] = await Promise.all([
        axios.get< AllRecordsResponse >( 'https://sosafe.onrender.com/api/old/records/all', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get( 'https://sosafe.onrender.com/api/zones', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setZones( zonesRes?.data );

      const { zoneMap, areaMap, divisionMap } = buildLocationMaps( zonesRes?.data );

      const formatted = recordsRes.data.data
      .slice() 
      .sort( ( a: any, b: any ) => {
        return a.id - b.id; 
      })
      .map( ( row: any ) => ({
        ...row,
        dob:        safeDateFormat( row.dob ),
        enlisted:   safeDateFormat( row.enlisted ),
        zone:       zoneMap[ row.zone ]     || row.zone || '',
        area:       areaMap[ row.area ]     || row.area || '',
        city:       divisionMap[ row.city ] || row.city || '',
        created_at: safeDateFormat( row.created_at ),
        updated_at: safeDateFormat( row.updated_at ),
      }));

      const worksheet = XLSX.utils.json_to_sheet( formatted );
      const workbook  = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet( workbook, worksheet, 'Biodata Records' );
      XLSX.writeFile( workbook, 'biodata_records.xlsx' );
    } catch {
      setError( 'Failed to fetch all records. Please try again.' );
    } finally {
      setLoading( false );
    }
  };

  const fieldLabels: Record<string, string> = {
    sno: 'S/N', 
    fno: 'Form No', 
    sname: 'Surname', 
    fname: 'First Name',
    oname: 'Other Name', 
    address: 'Address', 
    phone: 'Phone', 
    nin: 'NIN',
    dob: 'Date of Birth', 
    sex: 'Sex', 
    city: 'Division', 
    zone: 'Zone',
    area: 'Area', 
    servno: 'Service No', 
    position: 'Position',
    enlisted: 'Date Enlisted', 
    rank: 'Rank', 
    nok: 'Next of Kin',
    relation: 'Relationship', 
    nokno: 'NOK Phone', 
    captured: 'Photo',
    qualification: 'Qualification',
  };

  const syncCascade = ( form: Partial< BiodataRecord >, allZones: any[]) => {
    const zone = allZones.find( z => z.id === Number( form.zone ));

    const areas = zone?.areas ?? [];
    setFilteredAreas( areas );

    const area = areas.find(( a: any ) => a.id === Number( form.area ));
    setFilteredDivisions( area?.divisions ?? [] );
  };

  const openEdit = () => {
    if ( !selectedRecord ) return;
    const form = { ...selectedRecord };

    if ( form.area && ( !form.zone || form.zone === '' || form.zone === 0 )) {
      const parentZone = zones.find(z =>
        z.areas?.some( ( a: any ) => a.id === Number( form.area ))
      );
      if ( parentZone ) {
        form.zone = parentZone.id;
      }
    }

    if ( form.city && !form.area ) {
      zones.forEach( z => {
        z.areas?.forEach( ( a: any ) => {
          if ( a.divisions?.some( ( d: any ) => d.id === Number( form.city ))) {
            form.zone = z.id;
            form.area = a.id;
          }
        });
      });
    }

    setEditForm( form );
    syncCascade( form, zones );
    setIsEditing( true );
  };

  const handleEditChange = ( key: string, value: string ) => {
    setEditForm( prev => {
      const updated = { ...prev, [ key ] : value };
      if (key === 'zone') { updated.area = ''; updated.city = ''; }
      if (key === 'area') { updated.city = ''; }
      syncCascade( updated, zones );

      return updated;
    });
  };

  const handleSave = async () => {
    if ( !selectedRecord ) return;
    setSaving( true );

    try {
      await axios.put(
        `https://sosafe.onrender.com/api/biodata2/${selectedRecord.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRecords();
      // Refresh the detail view with updated data
      await fetchSingleRecord( selectedRecord.id );
      setIsEditing( false );
    } catch {
      setError( 'Failed to save record. Please try again.' );
    } finally {
      setSaving( false );
    }
  };

  const renderFieldValue = ( key: string, record: BiodataRecord ) => {
    const raw = record[ key ]?.toString() ?? '';

    if (raw === MASKED_DOB) {
      return (
        <span className="inline-flex items-center gap-1 text-gray-400 italic text-xs">
          <Lock className="h-3 w-3 shrink-0" />
          Restricted
        </span>
      );
    }

    // Resolve IDs to human-readable names
    if ( key === 'zone' )   return <span className="text-gray-900"> { zoneMap[ Number(raw) ]     || raw || '—'} </span>;
    if ( key === 'area' )   return <span className="text-gray-900"> { areaMap[ Number(raw) ]     || raw || '—'} </span>;
    if ( key === 'city' )   return <span className="text-gray-900"> { divisionMap[ Number(raw) ] || raw || '—'} </span>;

    return <span className="text-gray-900"> { raw || '—' } </span>;
  };
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
<<<<<<< HEAD
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Biodata Records</h2>
          <button
            onClick={fetchAllRecords}
=======

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold"> Biodata Records </h2>
          <button
            onClick = { fetchAllRecords }
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
            className="flex items-center px-4 py-2 bg-[#006838] text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download All Records
          </button>
        </div>
<<<<<<< HEAD
=======

        {/* Search */}
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
<<<<<<< HEAD
              placeholder="Search by name, form number, or code..."
              value={search}
              onChange={handleSearchChange}
=======
              placeholder="Search by name, form number, service no..."
              value = { search }
              onChange = { e => { setSearch( e.target.value ); setCurrentPage(1); }}
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

<<<<<<< HEAD
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
=======
        { loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : 
        error ? 
        (
          <div className="text-red-500 text-center p-4"> { error } </div>
        ) : 
        (
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
          <>
            <div className="overflow-x-auto h-[40vh] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
<<<<<<< HEAD
                    <th className="p-2 text-left font-semibold">Form No</th>
                    <th className="p-2 text-left font-semibold">Code</th>
                    <th className="p-2 text-left font-semibold">Name</th>
                    <th className="p-2 text-left font-semibold">Rank</th>
                    <th className="p-2 text-left font-semibold">Sex</th>
                    <th className="p-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50 text-[0.82rem]">
                      <td className="p-2">{record.form_no}</td>
                      <td className="p-2">{record.service_code}</td>
                      <td className="p-2">{`${record.firstname} ${record.lastname} ${record.othername}`}</td>
                      <td className="p-2">{record.rank}</td>
                      <td className="p-2">{record.sex}</td>
                      <td className="p-2">
                        <button
                          onClick={() => fetchSingleRecord(record.id)}
=======
                    <th className="p-2 text-left font-semibold"> Form No </th>
                    <th className="p-2 text-left font-semibold"> Service No </th>
                    <th className="p-2 text-left font-semibold"> Name </th>
                    <th className="p-2 text-left font-semibold"> Rank </th>
                    <th className="p-2 text-left font-semibold"> Sex </th>
                    <th className="p-2 text-left font-semibold"> Actions </th>
                  </tr>
                </thead>
                <tbody>
                  { records.map( record => (
                    <tr key = { record.id } className="border-b hover:bg-gray-50 text-[0.82rem]">
                      <td className="p-2"> { record.fno } </td>
                      <td className="p-2"> { record.servno } </td>
                      <td className="p-2"> {`${ record.fname } ${ record.sname } ${ record.oname ?? ''}`.trim() } </td>
                      <td className="p-2"> { record.rank } </td>
                      <td className="p-2"> { record.sex } </td>
                      <td className="p-2">
                        <button
                          onClick = { () => fetchSingleRecord( record.id ) }
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

<<<<<<< HEAD
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-1 text-[0.8rem] border border-gray-300 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
              <span className='text-[0.7rem]'>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-1 text-[0.8rem] border border-gray-300 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
=======
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick = { () => setCurrentPage( p => p - 1 )}
                disabled = { currentPage === 1 }
                className="px-4 py-1 text-[0.8rem] border border-gray-300 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </button>
              <span className="text-[0.7rem]"> Page { currentPage } of { totalPages } </span>
              <button
                onClick = { () => setCurrentPage( p => p + 1 ) }
                disabled = { currentPage === totalPages }
                className="px-4 py-1 text-[0.8rem] border border-gray-300 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
              </button>
            </div>
          </>
        )}
      </div>

<<<<<<< HEAD
      {selectedRecord && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Record Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[0.8rem]">
            {Object.entries(selectedRecord).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="font-medium capitalize">{key.replace('_', ' ')}</div>
                <div className="text-gray-600">{value?.toString() || '-'}</div>
              </div>
            ))}
          </div>
          <button
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setSelectedRecord(null)}
          >
            Close Details
          </button>
=======
      {/* Detail view */}
      { selectedRecord && (
        <div className="bg-white rounded-lg shadow-lg p-6">

          {/* Detail/Edit header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">
                { isEditing ? 'Edit Record' : 'Record Details'}
              </h2>
              { 
                  isEditing && 
                  !isSuperAdmin && 
                (
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Some fields are restricted to superadmin
                  </p>
                )
              }
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <button
                  onClick = { openEdit }
                  className="px-4 py-2 text-sm font-medium text-white bg-[#006838] hover:bg-[#004d28] rounded-lg transition-colors"
                >
                  Edit Record
                </button>
              )}
              <button
                onClick = { () => { setSelectedRecord( null ); setIsEditing( false ); }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          { isEditing ? ( 
            /* ── Edit mode ── */
            <div>
              <div className="grid grid-cols-2 gap-4 text-[0.8rem]">

                {/* Restricted fields */}
                {([
                  { key: 'fno',      label: 'Form No'      },
                  { key: 'sname',    label: 'Surname'       },
                  { key: 'dob',      label: 'Date of Birth' },
                  { key: 'nok',      label: 'Next of Kin'   },
                  { key: 'relation', label: 'Relationship'  },
                  { key: 'nokno',    label: 'NOK Phone'     },
                ] as const).map(({ key, label }) => (
                  <div key = { key } className="space-y-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                      { label }
                      { !isSuperAdmin && <Lock className="h-3 w-3 text-gray-400" />}
                    </label>
                    <input
                      value = { editForm[ key ]?.toString() ?? ''}
                      disabled = { !isSuperAdmin }
                      onChange = { e => handleEditChange( key, e.target.value ) }
                      className="w-full border border-gray-300 focus:border-[#006838] focus:ring-1 focus:ring-green-200 rounded-md px-3 py-1.5 text-sm outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                ))}

                {/* Zone dropdown */}
                <div className="space-y-1">
                  <label className="font-medium text-gray-500"> Zone </label>
                  <select
                    value = { editForm.zone ?? '' }
                    onChange = { e => handleEditChange( 'zone', e.target.value )}
                    className="w-full border border-gray-300 focus:border-[#006838] rounded-md px-3 py-1.5 text-sm outline-none transition-all"
                  >
                    <option value = ""> — Select Zone — </option>
                    { zones.map( ( z: any  ) => (
                      <option key = { z.id } value = { z.id }> { z.name } </option>
                    ))}
                  </select>
                </div>

                {/* Area dropdown */}
                <div className="space-y-1">
                  <label className="font-medium text-gray-500"> Area </label>
                  <select
                    value = { editForm.area ?? '' }
                    onChange = { e => handleEditChange( 'area', e.target.value )}
                    disabled = { !filteredAreas.length }
                    className="w-full border border-gray-300 focus:border-[#006838] rounded-md px-3 py-1.5 text-sm outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value = "" > — Select Area — </option>
                    { filteredAreas.map( ( a: any ) => (
                      <option key = { a.id } value = { a.id }> { a.name } </option>
                    ))}
                  </select>
                </div>

                {/* Division dropdown */}
                <div className="space-y-1">
                  <label className="font-medium text-gray-500"> Division </label>
                  <select
                    value = { editForm.city ?? '' }
                    onChange = { e => handleEditChange( 'city', e.target.value )}
                    disabled = { !filteredDivisions.length }
                    className="w-full border border-gray-300 focus:border-[#006838] rounded-md px-3 py-1.5 text-sm outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value = ""> — Select Division — </option>
                    { filteredDivisions.map( ( d: any ) => (
                      <option key = { d.id } value = { d.id}> { d.name } </option>
                    ))}
                  </select>
                </div>

                {/* Freely editable fields */}
                {([
                  { key: 'fname',         label: 'First Name'    },
                  { key: 'oname',         label: 'Other Name'    },
                  { key: 'address',       label: 'Address'       },
                  { key: 'phone',         label: 'Phone'         },
                  { key: 'nin',           label: 'NIN'           },
                  { key: 'sex',           label: 'Sex'           },
                  { key: 'servno',        label: 'Service No'    },
                  { key: 'position',      label: 'Position'      },
                  { key: 'enlisted',      label: 'Date Enlisted' },
                  { key: 'rank',          label: 'Rank'          },
                  { key: 'qualification', label: 'Qualification' },
                ] as const).map(( { key, label } ) => (
                  <div key = { key } className="space-y-1">
                    <label className="font-medium text-gray-500"> { label } </label>
                    <input
                      value = { editForm[ key ]?.toString() ?? '' }
                      onChange = { e => handleEditChange( key, e.target.value )}
                      className="w-full border border-gray-300 focus:border-[#006838] focus:ring-1 focus:ring-green-200 rounded-md px-3 py-1.5 text-sm outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Save / Cancel */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick = { () => setIsEditing( false )}
                  className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick = { handleSave }
                  disabled = { saving }
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#006838] hover:bg-[#004d28] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  { saving && <Loader2 className="h-4 w-4 animate-spin" /> }
                  { saving ? 'Saving…' : 'Save Changes' }
                </button>
              </div>
            </div>
          ) : (
            /* ── Read-only mode ── */
            <div className="grid grid-cols-2 gap-4 text-[0.8rem]">
              { Object.entries( fieldLabels ).map(( [ key, label ] ) => (
                <div key = { key } className="space-y-1">
                  <div className="font-medium text-gray-500"> { label } </div>
                  <div> { renderFieldValue( key, selectedRecord ) } </div>
                </div>
              ))}
            </div>
          )}
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
        </div>
      )}
    </div>
  );
};

export default BiodataDisplay;