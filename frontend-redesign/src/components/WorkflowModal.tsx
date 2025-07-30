import React, { useState } from 'react';
import { X, Play, Clock, AlertCircle } from 'lucide-react';
import { Workflow, WorkflowRun } from '../types';
import { useApp } from '../contexts/AppContext';
import { mockWorkflowRun } from '../data/mockData';

interface WorkflowModalProps {
  workflow: Workflow;
  onClose: () => void;
}

export function WorkflowModal({ workflow, onClose }: WorkflowModalProps) {
  const { setCurrentWorkflowRun } = useApp();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleRunWorkflow = () => {
    // Validate required fields
    const missingFields = workflow.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsRunning(true);
    
    // Start workflow run
    setCurrentWorkflowRun(mockWorkflowRun);
    
    // Close modal
    onClose();
    
    // Simulate workflow completion after some time
    setTimeout(() => {
      setIsRunning(false);
    }, 10000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{workflow.icon}</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {workflow.title}
              </h2>
              <p className="text-gray-600 mb-2">{workflow.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  Estimated time: {workflow.estimatedTime}
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                  {workflow.category}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-150"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-4">
            {workflow.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                  />
                )}
              </div>
            ))}
          </div>

          {workflow.fields.some(field => field.required) && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Fields marked with <span className="text-red-500">*</span> are required.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleRunWorkflow}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-all duration-150"
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run Workflow'}
          </button>
        </div>
      </div>
    </div>
  );
}