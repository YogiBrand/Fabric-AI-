import React from 'react';
import { X, Globe, Building2, Users, FileText, List, FormInput } from 'lucide-react';

interface CustomTask {
  id: string;
  taskType: 'web_scrape' | 'form_submission' | 'lead_generation';
  dataInputType: 'urls' | 'companies' | 'contacts';
  data: string[];
  useCrawl4AI: boolean;
  llmProvider?: string;
  steps: Array<{ id: string; description: string; order: number }>;
  formFields: Array<{ id: string; name: string; label: string; type: string; required: boolean }>;
}

interface CustomTaskBlockProps {
  task: CustomTask;
  onRemove: (id: string) => void;
}

export function CustomTaskBlock({ task, onRemove }: CustomTaskBlockProps) {
  const getTaskIcon = () => {
    switch (task.taskType) {
      case 'web_scrape':
        return <Globe className="w-5 h-5" />;
      case 'form_submission':
        return <FormInput className="w-5 h-5" />;
      case 'lead_generation':
        return <Users className="w-5 h-5" />;
    }
  };

  const getDataIcon = () => {
    switch (task.dataInputType) {
      case 'urls':
        return <Globe className="w-4 h-4" />;
      case 'companies':
        return <Building2 className="w-4 h-4" />;
      case 'contacts':
        return <Users className="w-4 h-4" />;
    }
  };

  const getTaskTypeLabel = () => {
    switch (task.taskType) {
      case 'web_scrape':
        return 'Web Scrape';
      case 'form_submission':
        return 'Form Submission';
      case 'lead_generation':
        return 'Lead Generation';
    }
  };

  const getDataInputLabel = () => {
    switch (task.dataInputType) {
      case 'urls':
        return 'URLs';
      case 'companies':
        return 'Companies';
      case 'contacts':
        return 'Contacts';
    }
  };

  return (
    <div className="relative group animate-in slide-in-from-bottom-2 duration-200">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {getTaskIcon()}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{getTaskTypeLabel()}</h4>
              <p className="text-sm text-gray-600">Custom Task</p>
            </div>
          </div>
          <button
            onClick={() => onRemove(task.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 opacity-0 group-hover:opacity-100"
            title="Remove task"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Data Summary */}
          <div className="flex items-center gap-2 text-sm">
            {getDataIcon()}
            <span className="font-medium text-gray-700">{task.data.length} {getDataInputLabel()}</span>
            {task.useCrawl4AI && (
              <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                Crawl4AI
              </span>
            )}
          </div>

          {/* Steps Preview */}
          {task.steps.length > 0 && (
            <div className="bg-white/70 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <List className="w-4 h-4" />
                <span>{task.steps.length} Steps</span>
              </div>
              <div className="space-y-1">
                {task.steps.slice(0, 2).map((step) => (
                  <div key={step.id} className="text-xs text-gray-600 truncate">
                    {step.order}. {step.description}
                  </div>
                ))}
                {task.steps.length > 2 && (
                  <div className="text-xs text-gray-500 italic">
                    +{task.steps.length - 2} more steps...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Fields Preview */}
          {task.taskType === 'form_submission' && task.formFields.length > 0 && (
            <div className="bg-white/70 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                <span>{task.formFields.length} Form Fields</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {task.formFields.map((field) => (
                  <span
                    key={field.id}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Data Preview */}
          <div className="bg-white/70 rounded-lg p-3">
            <div className="text-xs text-gray-600 space-y-0.5">
              {task.data.slice(0, 3).map((item, index) => (
                <div key={index} className="truncate">
                  • {item}
                </div>
              ))}
              {task.data.length > 3 && (
                <div className="text-gray-500 italic">
                  +{task.data.length - 3} more items...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-blue-200/50 flex items-center justify-between">
          <span className="text-xs text-gray-500">Click send to execute task</span>
          {task.llmProvider && (
            <span className="text-xs text-gray-600 font-medium">
              {task.llmProvider.split('/')[1] || task.llmProvider}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}