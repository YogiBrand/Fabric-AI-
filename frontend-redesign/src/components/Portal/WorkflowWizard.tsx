import React, { useState } from 'react';
import { X, Play, Clock, Zap } from 'lucide-react';
import { mockWorkflows } from '../../data/mockData';
import { DataUpload } from '../../types';

interface WorkflowWizardProps {
  upload: DataUpload;
  onClose: () => void;
}

export function WorkflowWizard({ upload, onClose }: WorkflowWizardProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');

  const handleStart = () => {
    if (selectedWorkflow) {
      console.log('Starting workflow:', selectedWorkflow, 'for upload:', upload.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Run Workflow</h2>
            <p className="text-gray-600 mt-1">
              Process {upload.recordCount} {upload.type} from {upload.filename}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-150"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a workflow
              </h3>
              <p className="text-gray-600">
                Choose which workflow to run on your {upload.type} data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockWorkflows.map((workflow) => (
                <label
                  key={workflow.id}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-150 ${
                    selectedWorkflow === workflow.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="workflow"
                    value={workflow.id}
                    checked={selectedWorkflow === workflow.id}
                    onChange={(e) => setSelectedWorkflow(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{workflow.icon}</span>
                      <h4 className="font-semibold text-gray-900">{workflow.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {workflow.estimatedTime}
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {workflow.category}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {selectedWorkflow && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Ready to start</h4>
                </div>
                <p className="text-sm text-blue-800">
                  This workflow will process all {upload.recordCount} records in your {upload.type} list.
                </p>
              </div>
            )}
          </div>
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
            onClick={handleStart}
            disabled={!selectedWorkflow}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-all duration-150"
          >
            <Play size={16} />
            Start Workflow
          </button>
        </div>
      </div>
    </div>
  );
}