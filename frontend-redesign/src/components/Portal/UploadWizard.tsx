import React, { useState } from 'react';
import { X, Upload, FileText, ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { mockWorkflows } from '../../data/mockData';
import { useAppContext } from '../../contexts/AppContext';

interface UploadWizardProps {
  type: 'contacts' | 'companies';
  onClose: () => void;
  onComplete?: () => void;
}

interface ColumnMapping {
  csvColumn: string;
  fieldName: string;
}

export function UploadWizard({ type, onClose, onComplete }: UploadWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [selectedAction, setSelectedAction] = useState<'workflow' | 'enrich' | 'save'>('save');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  
  const { sendWebSocketMessage } = useAppContext();

  const fieldOptions = type === 'contacts' 
    ? ['name', 'email', 'company', 'title', 'phone', 'linkedin_url']
    : ['name', 'domain', 'website_url', 'industry', 'size', 'linkedin_url', 'description'];

  // Auto-mapping suggestions
  const getFieldSuggestion = (csvColumn: string): string => {
    const columnLower = csvColumn.toLowerCase().replace(/[_\s]+/g, '');
    
    const mappings: { [key: string]: string } = {
      // Contact mappings
      'name': 'name',
      'fullname': 'name',
      'firstname': 'name',
      'email': 'email',
      'emailaddress': 'email',
      'company': 'company',
      'companyname': 'company',
      'organization': 'company',
      'title': 'title',
      'jobtitle': 'title',
      'position': 'title',
      'phone': 'phone',
      'phonenumber': 'phone',
      'linkedin': 'linkedin_url',
      'linkedinurl': 'linkedin_url',
      // Company mappings
      'domain': 'domain',
      'website': 'website_url',
      'websiteurl': 'website_url',
      'url': 'website_url',
      'industry': 'industry',
      'size': 'size',
      'employeecount': 'size',
      'employees': 'size',
      'description': 'description',
    };
    
    return mappings[columnLower] || '';
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadError(null);
      
      try {
        // Parse CSV locally first
        const text = await file.text();
        setFileContent(text);
        
        Papa.parse(text, {
          header: true,
          complete: async (results) => {
            if (results.data.length > 0) {
              const columns = Object.keys(results.data[0]);
              setCsvColumns(columns);
              setSampleData(results.data.slice(0, 5));
              
              // Initialize mappings with auto-suggestions
              const initialMappings = columns.map(col => ({
                csvColumn: col,
                fieldName: getFieldSuggestion(col)
              }));
              setColumnMappings(initialMappings);
              
              // Call preview endpoint
              const formData = new FormData();
              formData.append('file', file);
              
              try {
                const response = await fetch('/api/upload-csv/preview', {
                  method: 'POST',
                  body: formData,
                });
                
                if (response.ok) {
                  const preview = await response.json();
                  setFileId(preview.file_id);
                }
              } catch (error) {
                console.error('Preview error:', error);
              }
            }
          },
          error: (error) => {
            setUploadError(`Failed to parse CSV: ${error.message}`);
          }
        });
      } catch (error) {
        setUploadError('Failed to read file');
      }
    }
  };

  const updateMapping = (csvColumn: string, fieldName: string) => {
    setColumnMappings(prev => 
      prev.map(mapping => 
        mapping.csvColumn === csvColumn 
          ? { ...mapping, fieldName }
          : mapping
      )
    );
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate required fields are mapped
  const isStep2Valid = () => {
    const mappedFields = columnMappings
      .filter(m => m.fieldName)
      .map(m => m.fieldName);
    
    if (type === 'contacts') {
      // Must have email and either company or name
      return mappedFields.includes('email') && 
        (mappedFields.includes('company') || mappedFields.includes('name'));
    } else {
      // Companies must have name
      return mappedFields.includes('name');
    }
  };

  const handleFinish = async () => {
    if (!uploadedFile || !fileContent) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Build column mappings object
      const mappings: { [key: string]: string } = {};
      columnMappings.forEach(mapping => {
        if (mapping.fieldName) {
          mappings[mapping.csvColumn] = mapping.fieldName;
        }
      });
      
      // Process CSV with mappings
      const response = await fetch('/api/upload-csv/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_content: fileContent,
          column_mappings: mappings,
          data_type: type,
          action: selectedAction,
          workflow_id: selectedAction === 'workflow' ? selectedWorkflow : undefined,
          filename: uploadedFile?.name || 'upload.csv',
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }
      
      const result = await response.json();
      console.log('Upload successful:', result);
      
      // If it was companies and enrich was selected, trigger the enrichment wizard
      if (type === 'companies' && selectedAction === 'enrich' && result.upload_id) {
        // Create an upload object to pass to enrichment wizard
        const uploadData = {
          id: result.upload_id,
          filename: uploadedFile?.name || 'Company Upload',
          type: 'companies' as const,
          recordCount: result.rows_processed,
          status: 'ready' as const,
          uploadedAt: new Date()
        };
        
        // Pass the upload data to parent for enrichment
        onComplete?.(uploadData);
      } else {
        onComplete?.();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Upload {type === 'contacts' ? 'Contact' : 'Company'} List
            </h2>
            <p className="text-gray-600 mt-1">Step {currentStep} of 3</p>
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
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Upload File</span>
            <span>Map Columns</span>
            <span>Configure Action</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Step 1: File Upload */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload your {type} file
                </h3>
                <p className="text-gray-600 mb-6">
                  Support for CSV and JSON files up to 10MB
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-150">
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FileText className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-900 mb-2">
                    Choose file or drag and drop
                  </span>
                  <span className="text-gray-600">CSV, JSON up to 10MB</span>
                </label>
              </div>

              {uploadedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{uploadedFile.name}</p>
                      <p className="text-sm text-green-700">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • {csvColumns.length} columns detected
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Map your columns to fields
                </h3>
                <p className="text-gray-600">
                  Match your CSV columns to the appropriate {type} fields
                </p>
                <p className="text-sm text-amber-600 mt-2">
                  Required fields: {type === 'contacts' 
                    ? 'Email and either Company or Name' 
                    : 'Name'}
                </p>
              </div>

              <div className="space-y-4">
                {columnMappings.map((mapping) => (
                  <div key={mapping.csvColumn} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CSV Column
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                        {mapping.csvColumn}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field
                      </label>
                      <select
                        value={mapping.fieldName}
                        onChange={(e) => updateMapping(mapping.csvColumn, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                      >
                        <option value="">Select field...</option>
                        {fieldOptions.map((field) => (
                          <option key={field} value={field}>
                            {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Action Configuration */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What would you like to do next?
                </h3>
                <p className="text-gray-600">
                  Choose how to process your uploaded {type}
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                  <input
                    type="radio"
                    name="action"
                    value="save"
                    checked={selectedAction === 'save'}
                    onChange={(e) => setSelectedAction(e.target.value as any)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Save and Close</div>
                    <div className="text-sm text-gray-600">Just upload the data for later use</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                  <input
                    type="radio"
                    name="action"
                    value="workflow"
                    checked={selectedAction === 'workflow'}
                    onChange={(e) => setSelectedAction(e.target.value as any)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Run Workflow</div>
                    <div className="text-sm text-gray-600 mb-3">Process the data through a workflow</div>
                    {selectedAction === 'workflow' && (
                      <select
                        value={selectedWorkflow}
                        onChange={(e) => setSelectedWorkflow(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                      >
                        <option value="">Select workflow...</option>
                        {mockWorkflows.map((workflow) => (
                          <option key={workflow.id} value={workflow.id}>
                            {workflow.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                  <input
                    type="radio"
                    name="action"
                    value="enrich"
                    checked={selectedAction === 'enrich'}
                    onChange={(e) => setSelectedAction(e.target.value as any)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Enrich Data</div>
                    <div className="text-sm text-gray-600">Add additional information to your {type}</div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        )}

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
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={(currentStep === 1 && !uploadedFile) || (currentStep === 2 && !isStep2Valid())}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-all duration-150"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-all duration-150"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Finish
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}