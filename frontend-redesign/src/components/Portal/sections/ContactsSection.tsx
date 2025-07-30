import React from 'react';
import { Upload, FileText, Calendar, Users, Zap, Sparkles } from 'lucide-react';
import { mockDataUploads } from '../../../data/mockData';
import { DataUpload } from '../../../types';
import { UploadWizard } from '../UploadWizard';
import { WorkflowWizard } from '../WorkflowWizard';
import { EnrichmentWizard } from '../EnrichmentWizard';

export function ContactsSection() {
  const [showUploadWizard, setShowUploadWizard] = React.useState(false);
  const [showWorkflowWizard, setShowWorkflowWizard] = React.useState(false);
  const [showEnrichmentWizard, setShowEnrichmentWizard] = React.useState(false);
  const [selectedUpload, setSelectedUpload] = React.useState<DataUpload | null>(null);

  const contactUploads = mockDataUploads.filter(upload => upload.type === 'contacts');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enriched':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Upload and manage your contact lists</p>
        </div>
        <button 
          onClick={() => setShowUploadWizard(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-150"
        >
          <Upload size={16} />
          Upload Contact List
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-gray-900">{contactUploads.length}</div>
          <div className="text-sm text-gray-600">Contact Lists</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-green-600">
            {contactUploads.reduce((acc, upload) => acc + upload.recordCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Records</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-gray-600">
            {contactUploads.filter(u => u.status === 'enriched').length}
          </div>
          <div className="text-sm text-gray-600">Enriched Lists</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-blue-600">
            {contactUploads.filter(u => u.status === 'processing').length}
          </div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactUploads.map((upload) => (
          <div key={upload.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-150">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{upload.filename}</h3>
                <p className="text-sm text-gray-600">{upload.recordCount} contacts</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(upload.status)}`}>
                {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Calendar size={12} />
              {upload.uploadedAt.toLocaleDateString()}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setSelectedUpload(upload);
                  setShowWorkflowWizard(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors duration-150"
              >
                <Zap size={12} />
                Workflows
              </button>
              <button 
                onClick={() => {
                  setSelectedUpload(upload);
                  setShowEnrichmentWizard(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 text-sm font-medium rounded-md transition-colors duration-150"
              >
                <Sparkles size={12} />
                Enrich Data
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Wizards */}
      {showUploadWizard && (
        <UploadWizard
          type="contacts"
          onClose={() => setShowUploadWizard(false)}
        />
      )}
      
      {showWorkflowWizard && selectedUpload && (
        <WorkflowWizard
          upload={selectedUpload}
          onClose={() => {
            setShowWorkflowWizard(false);
            setSelectedUpload(null);
          }}
        />
      )}
      
      {showEnrichmentWizard && selectedUpload && (
        <EnrichmentWizard
          upload={selectedUpload}
          onClose={() => {
            setShowEnrichmentWizard(false);
            setSelectedUpload(null);
          }}
        />
      )}
    </div>
  );
}