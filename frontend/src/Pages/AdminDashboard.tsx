import React, { useState } from "react";
import axios from "axios";
import SideBar from "../components/SideBar";
import FileUploader from "../components/FileUploader";

const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024; // 1GB limit

const AdminDashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);
    
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setMessage({ type: 'error', text: 'File size must be less than 1GB' });
        return;
      }

      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          selectedFile.type === "application/vnd.ms-excel") {
        setFile(selectedFile);
        setMessage(null);
      } else {
        setMessage({ type: 'error', text: 'Please select an Excel file (.xlsx or .xls)' });
      }
    }
  };



  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file.name);

      const response = await axios.post('https://sosafe.onrender.com/api/import', {raw_data : file}, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }});
      console.log(response);

      
      setMessage({ type: 'success', text: 'File uploaded successfully!' });
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading file. Please try again.' });
    } finally {
      setUploading(false);
    }
  };



  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <SideBar />
      <div className="flex-1">
        {/* Header */}
        <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
          OGUN SO-SAFE CORPS Admin Dashboard
        </header>

        {/* Main Content */}
        <div className="p-4 pb-20 h-[100vh] relative overflow-y-scroll">
          <div className="text-lg font-semibold mb-6">
            <h4>Welcome, <span className="text-yellow-300">Name of Admin</span></h4>
          </div>

          {/* File Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Import Excel File</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Excel files only (.xlsx or .xls)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {file && (
                <div className="text-sm text-gray-600 mt-2">
                  Selected file: {file.name}
                </div>
              )}
              
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium
                  ${!file || uploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#006838] hover:bg-[#005a30]'
                  } transition-colors duration-200`}
              >
                {uploading ? 'Uploading...' : 'Upload Excel File'}
              </button>


              {message && (
                <div className={`p-4 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}
            </div>
          </div>
          <FileUploader />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;