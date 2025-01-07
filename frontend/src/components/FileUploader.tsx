import React, { useState, ChangeEvent } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";

interface Message {
  type: 'success' | 'error' | 'info';
  text: string;
}

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleUpload = async (): Promise<void> => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('raw_data', file);

    console.log(formData);
    

    try {
      await axios.post('https://sosafe.onrender.com/api/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / (progressEvent.total || progressEvent.loaded)) * 100;
          setProgress(Math.min(progress, 100));
        }
      });

      setMessage({ type: 'success', text: 'File uploaded successfully!' });
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: axios.isAxiosError(error) 
          ? error.response?.data?.message || 'Upload failed. Please try again.'
          : 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          selectedFile.type === "application/vnd.ms-excel") {
        setFile(selectedFile);
        setMessage(null);
        setProgress(0);
      } else {
        setMessage({ type: 'error', text: 'Please select an Excel file (.xlsx or .xls)' });
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Upload Excel File</h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-600">Drop files to upload</span>
              <span className="text-sm text-gray-500">or click to select</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        {file && (
          <div className="text-sm text-gray-600">
            Selected file: {file.name}
          </div>
        )}

        {progress > 0 && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{Math.min(Math.round(progress), 100)}% uploaded</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${!file || uploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
            } transition-colors duration-200`}
          type="button"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>

        {message && (
          <div className={`flex items-center gap-2 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800' 
              : message.type === 'error'
              ? 'bg-red-50 text-red-800'
              : 'bg-blue-50 text-blue-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;