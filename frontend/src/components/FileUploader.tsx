import React, { useState, useCallback, ChangeEvent } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

interface Message {
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ChunkUploadResponse {
  success: boolean;
  error?: string;
}

interface CompleteUploadResponse {
  success: boolean;
  error?: string;
}

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);

  const readChunk = useCallback((file: File, start: number, end: number): Promise<ArrayBuffer> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          resolve(e.target.result);
        }
      };
      reader.readAsArrayBuffer(file.slice(start, end));
    });
  }, []);

  const uploadChunk = useCallback(async (
    chunk: ArrayBuffer,
    chunkIndex: number,
    totalChunks: number
  ): Promise<boolean> => {
    const formData = new FormData();
    formData.append('chunk', new Blob([chunk]));
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('fileName', file?.name || '');

    try {
      const { data } = await axios.post<ChunkUploadResponse>(
        'https://sosafe.onrender.com/api/import',
        {raw_data : file},
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const chunkProgress = (progressEvent.loaded / (progressEvent.total || progressEvent.loaded)) * 100;
            // Update progress for this chunk
            setProgress(prev => prev + (chunkProgress / totalChunks));
          }
        }
      );
      return data.success;
    } catch (error) {
      console.error('Chunk upload failed:', error);
      return false;
    }
  }, [file]);

  const handleUpload = useCallback(async (): Promise<void> => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setMessage({ type: 'info', text: 'Starting upload...' });

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedChunks = 0;

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = await readChunk(file, start, end);
        
        const success = await uploadChunk(chunk, i, totalChunks);
        if (!success) throw new Error('Chunk upload failed');
        
        uploadedChunks++;
      }

      const { data } = await axios.post<CompleteUploadResponse>(
        'https://sosafe.onrender.com/api/import',
        {
          fileName: file.name,
          totalChunks
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!data.success) throw new Error(data.error || 'Failed to complete upload');

      setMessage({ type: 'success', text: 'File uploaded successfully!' });
      setFile(null);
      // Reset input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Upload failed. Please try again.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: error instanceof Error ? error.message : 'Upload failed. Please try again.' 
        });
      }
    } finally {
      setUploading(false);
    }
  }, [file, readChunk, uploadChunk]);

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

  const handleCheck = async() => {
    const data = await axios.get('https://sosafe.onrender.com/api/check');

    console.log(data);
    
  }

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

        <button
          onClick={handleCheck}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${!file || uploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
            } transition-colors duration-200`}
          type="button"
        >
          {uploading ? 'Uploading...' : 'Check File'}
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