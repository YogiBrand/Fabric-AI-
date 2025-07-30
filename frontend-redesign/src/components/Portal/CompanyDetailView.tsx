import React, { useState, useEffect } from 'react';
import { X, Globe, Building2, Users, Package, Calendar, Mail, Phone, Linkedin, Twitter, Facebook, RefreshCw, Check, AlertCircle, Loader2 } from 'lucide-react';

interface CompanyDetailViewProps {
  companyId: number;
  onClose: () => void;
}

interface Company {
  id: number;
  name: string;
  domain?: string;
  website_url?: string;
  industry?: string;
  size?: string;
  linkedin_url?: string;
  description?: string;
  enriched_data?: any;
  enrichment_status: string;
  created_at: string;
  enriched_at?: string;
}

interface EnrichmentLog {
  step: string;
  status: string;
  started_at: string;
  completed_at?: string;
  details?: any;
  error?: string;
}

export function CompanyDetailView({ companyId, onClose }: CompanyDetailViewProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [logs, setLogs] = useState<EnrichmentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'logs'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/companies/${companyId}/enrichment-status`);
      if (!response.ok) throw new Error('Failed to fetch company data');
      
      const data = await response.json();
      setCompany(data.company);
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshEnrichment = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/companies/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_ids: [companyId],
          batch_size: 1
        }),
      });
      
      if (!response.ok) throw new Error('Failed to start enrichment');
      
      alert('Enrichment started. Please refresh in a few moments to see updated data.');
      
      // Refresh data after a delay
      setTimeout(() => {
        fetchCompanyData();
      }, 3000);
    } catch (error) {
      console.error('Error refreshing enrichment:', error);
      alert('Failed to start enrichment. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
    
    // Poll for updates if enrichment is in progress
    const interval = setInterval(() => {
      if (company?.enrichment_status === 'processing') {
        fetchCompanyData();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [companyId, company?.enrichment_status]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl w-full max-w-6xl p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2">Loading company data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!company) return null;

  const enrichedData = company.enriched_data || {};
  const personalizationHooks = enrichedData.personalization_hooks || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Building2 className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
              <div className="flex items-center gap-4 mt-1">
                {company.website_url && (
                  <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                    <Globe className="w-4 h-4" />
                    {company.domain || new URL(company.website_url).hostname}
                  </a>
                )}
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  company.enrichment_status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                  company.enrichment_status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  company.enrichment_status === 'failed' ? 'bg-red-100 text-red-800 border-red-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {company.enrichment_status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshEnrichment}
              disabled={refreshing || company.enrichment_status === 'processing'}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Re-enrich
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-150"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'data'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Enriched Data
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'logs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Enrichment Logs
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Industry</dt>
                      <dd className="text-gray-900">{enrichedData.overview?.industry || company.industry || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Company Size</dt>
                      <dd className="text-gray-900">{enrichedData.overview?.size || company.size || 'Unknown'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Description</dt>
                      <dd className="text-gray-900">{enrichedData.overview?.description || company.description || 'No description available'}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Social</h3>
                  <dl className="space-y-3">
                    {enrichedData.contact?.email && (
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Email</dt>
                        <dd className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${enrichedData.contact.email}`} className="text-blue-600 hover:underline">
                            {enrichedData.contact.email}
                          </a>
                        </dd>
                      </div>
                    )}
                    {enrichedData.contact?.phone && (
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Phone</dt>
                        <dd className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a href={`tel:${enrichedData.contact.phone}`} className="text-blue-600 hover:underline">
                            {enrichedData.contact.phone}
                          </a>
                        </dd>
                      </div>
                    )}
                    {(company.linkedin_url || enrichedData.social_media?.linkedin) && (
                      <div>
                        <dt className="text-sm font-medium text-gray-600">LinkedIn</dt>
                        <dd className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-gray-400" />
                          <a href={company.linkedin_url || enrichedData.social_media.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Profile
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Products & Services */}
              {enrichedData.products_services && enrichedData.products_services.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Products & Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrichedData.products_services.map((product: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <Package className="w-5 h-5 text-blue-500 mb-2" />
                        <h4 className="font-medium text-gray-900">{product.name || product.type}</h4>
                        {product.description && (
                          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personalization Hooks */}
              {Object.keys(personalizationHooks).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalization Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personalizationHooks.technologies?.length > 0 && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Technologies Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {personalizationHooks.technologies.map((tech: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-white text-sm rounded-md border border-blue-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {personalizationHooks.growth_indicators?.length > 0 && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Growth Indicators</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {personalizationHooks.growth_indicators.map((indicator: string, index: number) => (
                            <li key={index}>{indicator}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(enrichedData, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No enrichment logs available</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {log.status === 'completed' ? (
                          <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : log.status === 'failed' ? (
                          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        ) : (
                          <Loader2 className="w-5 h-5 text-blue-500 mt-0.5 animate-spin" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{log.step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Started: {new Date(log.started_at).toLocaleString()}
                            {log.completed_at && ` • Completed: ${new Date(log.completed_at).toLocaleString()}`}
                          </p>
                          {log.error && (
                            <p className="text-sm text-red-600 mt-2">{log.error}</p>
                          )}
                          {log.details && Object.keys(log.details).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-sm text-gray-600 cursor-pointer">View details</summary>
                              <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}