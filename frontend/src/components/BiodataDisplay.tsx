import React, { useState, useEffect } from 'react';
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


  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
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
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, form number, or code..."
              value={search}
              onChange={handleSearchChange}
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
              </button>
            </div>
          </>
        )}
      </div>

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
        </div>
      )}
    </div>
  );
};

export default BiodataDisplay;