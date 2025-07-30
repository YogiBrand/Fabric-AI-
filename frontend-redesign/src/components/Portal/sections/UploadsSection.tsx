import React, { useState } from 'react';
import { Upload, FileText, Archive, Image, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { DataTable } from '../DataTable';
import { mockUploads } from '../../../data/mockData';
import { Upload as UploadType } from '../../../types';

export function UploadsSection() {
  const [isDragOver, setIsDragOver] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image size={16} className="text-blue-500" />;
    if (type.includes('zip') || type.includes('archive')) return <Archive size={16} className="text-purple-500" />;
    return <FileText size={16} className="text-gray-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'processing':
        return <Clock size={16} className="text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      key: 'filename',
      label: 'File Name',
      sortable: true,
      render: (filename: string, row: UploadType) => (
        <div className="flex items-center gap-3">
          {getFileIcon(row.type)}
          <span className="font-medium">{filename}</span>
        </div>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      sortable: true,
      render: (size: number) => formatFileSize(size),
    },
    {
      key: 'uploadedAt',
      label: 'Uploaded',
      sortable: true,
      render: (date: Date) => date.toLocaleDateString(),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status: string) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === 'completed' ? 'bg-green-100 text-green-800' :
            status === 'processing' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      ),
    },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file upload logic here
    console.log('Files dropped:', e.dataTransfer.files);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Uploads</h1>
          <p className="text-gray-600 mt-1">Manage your uploaded files and documents</p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-150 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-gray-600 mb-4">
          Support for CSV, Excel, images, and documents up to 10MB
        </p>
        <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-150">
          Choose Files
        </button>
      </div>

      {/* Files Table */}
      <DataTable
        columns={columns}
        data={mockUploads}
        searchPlaceholder="Search files..."
      />
    </div>
  );
}