import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Globe, Search } from 'lucide-react';
import { enrichmentAgents, enrichmentFields } from '../../data/mockData';
import { DataUpload, EnrichmentAgent, EnrichmentField } from '../../types';

interface EnrichmentWizardProps {
  upload: DataUpload;
  onClose: () => void;
}

export function EnrichmentWizard({ upload, onClose }: EnrichmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [scrapeWebsite, setScrapeWebsite] = useState(false);
  const [webSearch, setWebSearch] = useState(false);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      console.log('Starting enrichment:', {
        upload: upload,
        uploadId: upload?.id,
        agent: selectedAgent,
        fields: selectedFields,
        scrapeWebsite,
        webSearch
      });

      // Check if upload has a valid ID
      if (!upload?.id) {
        console.error('No valid upload ID found:', upload);
        throw new Error('Invalid upload data. Please try uploading the company list again.');
      }

      // Get companies from the upload
      const url = upload.id === 'all' 
        ? '/api/companies' // Get all companies
        : `/api/companies?upload_id=${upload.id}`; // Get companies for specific upload
      
      const response = await fetch(url);
      
      // Handle response errors with details
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error('Failed to fetch companies:', response.status, errorData);
        throw new Error(errorData.detail || `Failed to fetch companies (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Companies response:', data);
      
      const companies = data.companies || [];
      
      if (companies.length === 0) {
        // If no companies found, it might be because they haven't been saved yet
        console.warn('No companies found for upload ID:', upload.id);
        throw new Error('No companies found for this upload. The upload may still be processing or failed to save companies.');
      }
      
      // Start enrichment process
      console.log('Starting enrichment for companies:', companies);
      const enrichResponse = await fetch('/api/companies/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_ids: companies.map((c: any) => c.id),
          batch_size: 5,
          enrichment_fields: selectedFields
        }),
      });
      
      if (!enrichResponse.ok) {
        const errorData = await enrichResponse.json().catch(() => ({ detail: 'Enrichment failed' }));
        console.error('Enrichment failed:', enrichResponse.status, errorData);
        throw new Error(errorData.detail || `Failed to start enrichment (${enrichResponse.status})`);
      }
      
      const enrichResult = await enrichResponse.json();
      console.log('Enrichment started:', enrichResult);
      
      // Show success message or notification
      alert(`Started enriching ${companies.length} companies. Check the progress in the companies section.`);
      
      onClose();
    } catch (error: any) {
      console.error('Error in enrichment process:', error);
      
      // Show detailed error message
      const errorMessage = error.message || 'Failed to start enrichment. Please try again.';
      alert(`Error: ${errorMessage}`);
      
      // Don't close the dialog on error so user can try again
    }
  };

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const fieldsByCategory = enrichmentFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, EnrichmentField[]>);

  const categoryLabels = {
    basic: 'Basic Information',
    contact: 'Contact Details',
    social: 'Social Media',
    financial: 'Financial Data',
    technology: 'Technology Stack'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Enrich Data</h2>
            <p className="text-gray-600 mt-1">
              Enhance {upload.recordCount} {upload.type} from {upload.filename}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-150"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            {[1, 2].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < 2 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Select Agent</span>
            <span>Choose Fields</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Step 1: Select Agent */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Choose enrichment agent
                </h3>
                <p className="text-gray-600">
                  Select which AI agent will gather additional data for your {upload.type}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {enrichmentAgents.map((agent) => (
                  <label
                    key={agent.id}
                    className={`flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition-all duration-150 ${
                      selectedAgent === agent.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="agent"
                      value={agent.id}
                      checked={selectedAgent === agent.id}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-3xl mb-3">{agent.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-2">{agent.name}</h4>
                    <p className="text-sm text-gray-600 text-center">{agent.description}</p>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Fields */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select data to enrich
                </h3>
                <p className="text-gray-600">
                  Choose which information you'd like to gather for your {upload.type}
                </p>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                  <input
                    type="checkbox"
                    checked={scrapeWebsite}
                    onChange={(e) => setScrapeWebsite(e.target.checked)}
                    className="rounded"
                  />
                  <Globe className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">Scrape Company Website</div>
                    <div className="text-sm text-gray-600">Extract comprehensive data from the company's website</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                  <input
                    type="checkbox"
                    checked={webSearch}
                    onChange={(e) => setWebSearch(e.target.checked)}
                    className="rounded"
                  />
                  <Search className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">Web Search Enhancement</div>
                    <div className="text-sm text-gray-600">Search and scrape top 10 results for additional company data</div>
                  </div>
                </label>
              </div>

              {/* Field Categories */}
              <div className="space-y-6">
                {Object.entries(fieldsByCategory).map(([category, fields]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {fields.map((field) => (
                        <label
                          key={field.id}
                          className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFields.includes(field.id)}
                            onChange={() => toggleField(field.id)}
                            className="mt-1 rounded"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{field.label}</div>
                            <div className="text-sm text-gray-600">{field.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedFields.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Ready to enrich</h4>
                  </div>
                  <p className="text-sm text-green-800">
                    {selectedFields.length} fields selected for {upload.recordCount} {upload.type}
                    {scrapeWebsite && ' • Website scraping enabled'}
                    {webSearch && ' • Web search enabled'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-150"
            >
              Cancel
            </button>
            {currentStep < 2 ? (
              <button
                onClick={handleNext}
                disabled={!selectedAgent}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-all duration-150"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={selectedFields.length === 0 && !scrapeWebsite && !webSearch}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-all duration-150"
              >
                <Sparkles size={16} />
                Start Enrichment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}