import React, { useState } from 'react';
import { Play, Settings, Upload, Mail, Users } from 'lucide-react';
import { LLMSelector } from '../LLMSelector';
import { CredentialsForm } from '../CredentialsForm';
import { GoogleSheetsInput } from '../GoogleSheetsInput';
import { useAppContext } from '../../contexts/AppContext';

interface OutreachWorkflowProps {
  onClose?: () => void;
}

export function OutreachWorkflow({ onClose }: OutreachWorkflowProps) {
  const [step, setStep] = useState<'setup' | 'credentials' | 'running'>('setup');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [credentials, setCredentials] = useState<any>({});
  const [dataSource, setDataSource] = useState<'csv' | 'sheets' | null>(null);
  
  const { sendWebSocketMessage, wsConnected } = useAppContext();

  const handleSheetsSubmit = async (sheetId: string, worksheetName: string) => {
    try {
      const response = await fetch('/api/ingest-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheet_id: sheetId, worksheet_name: worksheetName }),
      });
      
      if (response.ok) {
        setDataSource('sheets');
        console.log('Sheets imported successfully');
      }
    } catch (error) {
      console.error('Failed to import sheets:', error);
    }
  };

  const startOutreachWorkflow = async () => {
    if (!wsConnected || !selectedModel || !credentials) return;
    
    setStep('running');
    
    // Send outreach task via API
    try {
      const response = await fetch('/api/outreach-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_description: 'Automated outreach campaign',
          credentials: credentials,
          llm_criteria: selectedModel,
        }),
      });
      
      if (response.ok) {
        console.log('Outreach workflow started');
      }
    } catch (error) {
      console.error('Failed to start outreach:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Outreach Workflow
        </h2>
        <p className="text-gray-600 mt-1">Configure and run automated outreach campaigns</p>
      </div>

      <div className="p-6">
        {step === 'setup' && (
          <div className="space-y-6">
            {/* Data Source Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">1. Select Data Source</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDataSource('csv')}
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                    dataSource === 'csv' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-600" />
                  <span className="font-medium">Upload CSV</span>
                </button>
                
                <button
                  onClick={() => setDataSource('sheets')}
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                    dataSource === 'sheets' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className="w-8 h-8 text-gray-600" />
                  <span className="font-medium">Google Sheets</span>
                </button>
              </div>
            </div>

            {/* Google Sheets Input */}
            {dataSource === 'sheets' && (
              <div className="mt-6">
                <GoogleSheetsInput onSubmit={handleSheetsSubmit} />
              </div>
            )}

            {/* LLM Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">2. Select AI Model</h3>
              <LLMSelector 
                onModelSelect={setSelectedModel}
                selectedModel={selectedModel}
              />
            </div>

            <button
              onClick={() => setStep('credentials')}
              disabled={!selectedModel || !dataSource}
              className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-all duration-150"
            >
              Next: Configure Credentials
            </button>
          </div>
        )}

        {step === 'credentials' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">3. Enter Service Credentials</h3>
            <CredentialsForm
              services={['chatgpt', 'gmail']}
              onSubmit={(creds) => {
                setCredentials(creds);
                startOutreachWorkflow();
              }}
            />
            
            <button
              onClick={() => setStep('setup')}
              className="w-full py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-150"
            >
              Back
            </button>
          </div>
        )}

        {step === 'running' && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Settings className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Outreach Workflow Running</h3>
            <p className="text-gray-600">Check the browser preview to see live progress</p>
            
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-150"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}