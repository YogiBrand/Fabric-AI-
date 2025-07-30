import React, { useState, useEffect } from 'react';
import { Upload, FileText, Calendar, Building2, Zap, Sparkles, Eye, Loader2, Check, AlertCircle } from 'lucide-react';
import { mockDataUploads } from '../../../data/mockData';
import { DataUpload } from '../../../types';
import { UploadWizard } from '../UploadWizard';
import { WorkflowWizard } from '../WorkflowWizard';
import { EnrichmentWizard } from '../EnrichmentWizard';
import { CompanyDetailView } from '../CompanyDetailView';

interface Company {
  id: number;
  name: string;
  domain?: string;
  website_url?: string;
  industry?: string;
  size?: string;
  enrichment_status: string;
  created_at: string;
  upload_id?: number;
}

export function CompaniesSection() {
  const [showUploadWizard, setShowUploadWizard] = useState(false);
  const [showWorkflowWizard, setShowWorkflowWizard] = useState(false);
  const [showEnrichmentWizard, setShowEnrichmentWizard] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<DataUpload | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  const companyUploads = mockDataUploads.filter(upload => upload.type === 'companies');

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/companies?limit=50');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // Refresh every 30 seconds if any company is processing
    const interval = setInterval(() => {
      if (companies.some(c => c.enrichment_status === 'processing')) {
        fetchCompanies();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [companies]);

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
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">Upload and manage your company lists</p>
        </div>
        <button 
          onClick={() => setShowUploadWizard(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-150"
        >
          <Upload size={16} />
          Upload Company List
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-gray-900">{companyUploads.length}</div>
          <div className="text-sm text-gray-600">Company Lists</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-green-600">
            {companyUploads.reduce((acc, upload) => acc + upload.recordCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Records</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-gray-600">
            {companyUploads.filter(u => u.status === 'enriched').length}
          </div>
          <div className="text-sm text-gray-600">Enriched Lists</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-blue-600">
            {companyUploads.filter(u => u.status === 'processing').length}
          </div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>
      </div>

      {/* Companies List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">All Companies</h3>
          {companies.length > 0 && (
            <button
              onClick={() => {
                // Create a virtual upload object for all companies
                const allCompaniesUpload = {
                  id: 'all',
                  filename: 'All Companies',
                  type: 'companies' as const,
                  recordCount: companies.length,
                  status: 'ready' as const,
                  uploadedAt: new Date()
                };
                setSelectedUpload(allCompaniesUpload);
                setShowEnrichmentWizard(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              <Sparkles size={14} />
              Enrich All
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600">Loading companies...</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p>No companies uploaded yet</p>
              <p className="text-sm mt-2">Upload a CSV file to get started</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Industry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{company.name}</div>
                        {company.website_url && (
                          <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            {company.domain || new URL(company.website_url).hostname}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {company.industry || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {company.size || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
                        company.enrichment_status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        company.enrichment_status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        company.enrichment_status === 'failed' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {company.enrichment_status === 'completed' && <Check className="w-3 h-3" />}
                        {company.enrichment_status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
                        {company.enrichment_status === 'failed' && <AlertCircle className="w-3 h-3" />}
                        {company.enrichment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedCompany(company.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companyUploads.map((upload) => (
          <div key={upload.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-150">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{upload.filename}</h3>
                <p className="text-sm text-gray-600">{upload.recordCount} companies</p>
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
          type="companies"
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
            fetchCompanies(); // Refresh companies after enrichment
          }}
        />
      )}
      
      {selectedCompany && (
        <CompanyDetailView
          companyId={selectedCompany}
          onClose={() => {
            setSelectedCompany(null);
            fetchCompanies(); // Refresh in case enrichment happened
          }}
        />
      )}
    </div>
  );
}