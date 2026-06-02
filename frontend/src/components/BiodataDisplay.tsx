import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface BiodataRecord {
  id: number;
  SNO: string;
  FNO: string;
  SNAME: string;
  FNAME: string;
  ONAME: string;
  ADDRESS: string;
  PHONE: string;
  NIN: string;
  DOB: string;
  SEX: string;
  CITY: number;
  ZONE: number;
  AREA: number;
  SERVNO: string;
  POSITION: string;
  ENLISTED: string;
  RANK: string;
  NOK: string;
  RELATION: string;
  NOKNO: string;
  CAPTURED: string;
  QUALIFICATION: string;
  [key: string]: string | number;
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
  data: BiodataRecord[];
  total: number;
}

const BiodataDisplay: React.FC = () => {
  const { token } = useAuth();
  const [records, setRecords]               = useState<BiodataRecord[]>([]);
  const [loading, setLoading]               = useState<boolean>(false);
  const [error, setError]                   = useState<string | null>(null);
  const [search, setSearch]                 = useState<string>('');
  const [currentPage, setCurrentPage]       = useState<number>(1);
  const [totalPages, setTotalPages]         = useState<number>(1);
  const [selectedRecord, setSelectedRecord] = useState<BiodataRecord | null>(null);
  const [perPage]                           = useState<number>(100);


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
      });
      setRecords(response.data.data);
      setTotalPages(response.data.meta.last_page);
    } catch {
      setError('Failed to fetch records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [currentPage, search]);

  const fetchSingleRecord = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<SingleRecordResponse>(`https://sosafe.onrender.com/api/biodata2/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setSelectedRecord(response.data.data);
    } catch {
      setError('Failed to fetch record details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRecords = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<AllRecordsResponse>(`https://sosafe.onrender.com/api/old/records/all`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const jsonStr  = JSON.stringify(response.data.data, null, 2);
      const blob     = new Blob([jsonStr], { type: 'application/json' });
      const url      = window.URL.createObjectURL(blob);
      const link     = document.createElement('a');
      link.href      = url;
      link.download  = 'biodata_records.json';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Failed to fetch all records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Labels for the detail view
  const fieldLabels: Record<string, string> = {
    SNO: 'S/N', FNO: 'Form No', SNAME: 'Surname', FNAME: 'First Name',
    ONAME: 'Other Name', ADDRESS: 'Address', PHONE: 'Phone', NIN: 'NIN',
    DOB: 'Date of Birth', SEX: 'Sex', CITY: 'Division', ZONE: 'Zone',
    AREA: 'Area', SERVNO: 'Service No', POSITION: 'Position',
    ENLISTED: 'Date Enlisted', RANK: 'Rank', NOK: 'Next of Kin',
    RELATION: 'Relationship', NOKNO: 'NOK Phone', CAPTURED: 'Photo',
    QUALIFICATION: 'Qualification',
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Biodata Records</h2>
          <button
            onClick={fetchAllRecords}
            className="flex items-center px-4 py-2 bg-[#006838] text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download All Records
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, form number, service no..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto h-[40vh] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left font-semibold">Form No</th>
                    <th className="p-2 text-left font-semibold">Service No</th>
                    <th className="p-2 text-left font-semibold">Name</th>
                    <th className="p-2 text-left font-semibold">Rank</th>
                    <th className="p-2 text-left font-semibold">Sex</th>
                    <th className="p-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(record => (
                    <tr key={record.id} className="border-b hover:bg-gray-50 text-[0.82rem]">
                      <td className="p-2">{record.FNO}</td>
                      <td className="p-2">{record.SERVNO}</td>
                      <td className="p-2">{`${record.FNAME} ${record.SNAME} ${record.ONAME ?? ''}`.trim()}</td>
                      <td className="p-2">{record.RANK}</td>
                      <td className="p-2">{record.SEX}</td>
                      <td className="p-2">
                        <button
                          onClick={() => fetchSingleRecord(record.id)}
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

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                className="px-4 py-1 text-[0.8rem] border border-gray-300 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </button>
              <span className="text-[0.7rem]">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-1 text-[0.8rem] border border-gray-300 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Detail view */}
      {selectedRecord && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Record Details</h2>
          <div className="grid grid-cols-2 gap-4 text-[0.8rem]">
            {Object.entries(fieldLabels).map(([key, label]) => (
              <div key={key} className="space-y-1">
                <div className="font-medium text-gray-500">{label}</div>
                <div className="text-gray-900">{selectedRecord[key]?.toString() || '—'}</div>
              </div>
            ))}
          </div>
          <button
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setSelectedRecord(null)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default BiodataDisplay;