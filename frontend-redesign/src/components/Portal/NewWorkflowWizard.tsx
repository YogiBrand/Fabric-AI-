import React, { useState } from 'react';
import { X, Plus, Trash2, ArrowRight, ArrowLeft, Check, Search, Mail, MessageSquare, Sparkles, Database, Globe } from 'lucide-react';
import { WorkflowStep, WorkflowTemplate } from '../../types';

interface NewWorkflowWizardProps {
  workflow?: WorkflowTemplate | null;
  onClose: () => void;
}

const stepTypes = [
  {
    type: 'search_web',
    title: 'Search Web',
    description: 'Search the web for information',
    icon: Search,
    color: 'bg-blue-500',
    fields: [
      { name: 'query', label: 'Search Query', type: 'text', required: true },
      { name: 'urls', label: 'Specific URLs (optional)', type: 'textarea' },
      { name: 'maxResults', label: 'Max Results', type: 'number', defaultValue: 10 }
    ]
  },
  {
    type: 'enrich_data',
    title: 'Enrich Data',
    description: 'Enhance data with additional information',
    icon: Database,
    color: 'bg-green-500',
    fields: [
      { name: 'dataSource', label: 'Data Source', type: 'select', options: ['LinkedIn', 'Company Database', 'Email Finder'] },
      { name: 'enrichmentType', label: 'Enrichment Type', type: 'select', options: ['Contact Info', 'Company Data', 'Social Media'] },
      { name: 'fields', label: 'Fields to Enrich', type: 'multiselect', options: ['Email', 'Phone', 'Title', 'Company', 'LinkedIn'] }
    ]
  },
  {
    type: 'send_email',
    title: 'Send Email',
    description: 'Send an email to recipients',
    icon: Mail,
    color: 'bg-purple-500',
    fields: [
      { name: 'to', label: 'Recipients', type: 'text', required: true },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'template', label: 'Email Template', type: 'textarea', required: true },
      { name: 'attachments', label: 'Attachments', type: 'file' }
    ]
  },
  {
    type: 'draft_email',
    title: 'Draft Email',
    description: 'Create an email draft',
    icon: Mail,
    color: 'bg-orange-500',
    fields: [
      { name: 'recipient', label: 'Recipient', type: 'text', required: true },
      { name: 'subject', label: 'Subject Template', type: 'text', required: true },
      { name: 'bodyTemplate', label: 'Body Template', type: 'textarea', required: true },
      { name: 'personalization', label: 'Personalization Fields', type: 'multiselect', options: ['Name', 'Company', 'Title', 'Recent News'] }
    ]
  },
  {
    type: 'create_message',
    title: 'Create Message',
    description: 'Generate a custom message',
    icon: MessageSquare,
    color: 'bg-indigo-500',
    fields: [
      { name: 'platform', label: 'Platform', type: 'select', options: ['LinkedIn', 'Twitter', 'Slack', 'SMS'] },
      { name: 'messageType', label: 'Message Type', type: 'select', options: ['Connection Request', 'Follow-up', 'Introduction', 'Thank You'] },
      { name: 'template', label: 'Message Template', type: 'textarea', required: true },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Friendly', 'Formal'] }
    ]
  },
  {
    type: 'use_chatgpt',
    title: 'Use ChatGPT',
    description: 'Process content with AI',
    icon: Sparkles,
    color: 'bg-pink-500',
    fields: [
      { name: 'prompt', label: 'AI Prompt', type: 'textarea', required: true },
      { name: 'model', label: 'Model', type: 'select', options: ['GPT-4', 'GPT-3.5', 'Claude'] },
      { name: 'temperature', label: 'Creativity Level', type: 'range', min: 0, max: 1, step: 0.1, defaultValue: 0.7 },
      { name: 'maxTokens', label: 'Max Response Length', type: 'number', defaultValue: 1000 }
    ]
  }
];

export function NewWorkflowWizard({ workflow, onClose }: NewWorkflowWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [workflowName, setWorkflowName] = useState(workflow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(workflow?.description || '');
  const [workflowCategory, setWorkflowCategory] = useState(workflow?.category || 'Lead Generation');
  const [steps, setSteps] = useState<WorkflowStep[]>(workflow?.steps || []);
  const [selectedStepType, setSelectedStepType] = useState<string>('');
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [stepConfig, setStepConfig] = useState<Record<string, any>>({});

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

  const handleSave = () => {
    console.log('Saving workflow:', {
      name: workflowName,
      description: workflowDescription,
      category: workflowCategory,
      steps
    });
    onClose();
  };

  const addStep = () => {
    if (!selectedStepType) return;

    const stepType = stepTypes.find(t => t.type === selectedStepType);
    if (!stepType) return;

    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type: selectedStepType as any,
      title: stepType.title,
      description: stepType.description,
      config: stepConfig,
      position: { x: steps.length * 200, y: 100 },
      connections: []
    };

    setSteps(prev => [...prev, newStep]);
    setSelectedStepType('');
    setStepConfig({});
  };

  const removeStep = (stepId: string) => {
    setSteps(prev => prev.filter(step => step.id !== stepId));
  };

  const updateStepConfig = (field: string, value: any) => {
    setStepConfig(prev => ({ ...prev, [field]: value }));
  };

  const selectedStepTypeData = stepTypes.find(t => t.type === selectedStepType);

  const wizardSteps = [
    { id: 1, name: 'Basic Info', icon: '●' },
    { id: 2, name: 'Workflow Steps', icon: '■' },
    { id: 3, name: 'Review & Save', icon: '▲' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {workflow ? 'Edit Workflow' : 'New Workflow'}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-150"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-150"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {wizardSteps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-150 ${
                currentStep === step.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg">{step.icon}</span>
              {step.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      placeholder="Enter workflow name..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                      placeholder="Describe what this workflow does..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={workflowCategory}
                      onChange={(e) => setWorkflowCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                    >
                      <option value="Lead Generation">Lead Generation</option>
                      <option value="Research">Research</option>
                      <option value="Outreach">Outreach</option>
                      <option value="Content">Content</option>
                      <option value="Analysis">Analysis</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Workflow Steps */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Build Your Workflow</h3>
                <p className="text-gray-600 mb-6">
                  Add and configure steps for your workflow. Each step will be executed in sequence.
                </p>

                {/* Step Type Selection */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Step</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {stepTypes.map((stepType) => {
                      const Icon = stepType.icon;
                      return (
                        <button
                          key={stepType.type}
                          onClick={() => setSelectedStepType(stepType.type)}
                          className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all duration-150 ${
                            selectedStepType === stepType.type
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-8 h-8 ${stepType.color} rounded-lg flex items-center justify-center`}>
                            <Icon size={16} className="text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900 text-sm">{stepType.title}</div>
                            <div className="text-xs text-gray-600">{stepType.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Step Configuration */}
                  {selectedStepTypeData && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-gray-900 mb-3">Configure {selectedStepTypeData.title}</h5>
                      <div className="space-y-3">
                        {selectedStepTypeData.fields.map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            
                            {field.type === 'text' && (
                              <input
                                type="text"
                                value={stepConfig[field.name] || ''}
                                onChange={(e) => updateStepConfig(field.name, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                              />
                            )}
                            
                            {field.type === 'textarea' && (
                              <textarea
                                value={stepConfig[field.name] || ''}
                                onChange={(e) => updateStepConfig(field.name, e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                              />
                            )}
                            
                            {field.type === 'select' && (
                              <select
                                value={stepConfig[field.name] || ''}
                                onChange={(e) => updateStepConfig(field.name, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                              >
                                <option value="">Select an option</option>
                                {field.options?.map((option) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            )}
                            
                            {field.type === 'number' && (
                              <input
                                type="number"
                                value={stepConfig[field.name] || field.defaultValue || ''}
                                onChange={(e) => updateStepConfig(field.name, parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={addStep}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-150"
                      >
                        <Plus size={16} />
                        Add Step
                      </button>
                    </div>
                  )}
                </div>

                {/* Current Steps */}
                {steps.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Workflow Steps ({steps.length})</h4>
                    <div className="space-y-3">
                      {steps.map((step, index) => {
                        const stepTypeData = stepTypes.find(t => t.type === step.type);
                        const Icon = stepTypeData?.icon || Search;
                        
                        return (
                          <div key={step.id} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-sm font-medium text-gray-500">
                                {index + 1}
                              </div>
                              <div className={`w-8 h-8 ${stepTypeData?.color || 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                                <Icon size={16} className="text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{step.title}</div>
                                <div className="text-sm text-gray-600">{step.description}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeStep(step.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {steps.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>No steps added yet. Select a step type above to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review & Save */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Workflow</h3>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{workflowName}</h4>
                  <p className="text-gray-600 mb-4">{workflowDescription}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                      {workflowCategory}
                    </span>
                    <span>{steps.length} steps</span>
                  </div>
                </div>

                {steps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Workflow Steps</h4>
                    <div className="space-y-2">
                      {steps.map((step, index) => {
                        const stepTypeData = stepTypes.find(t => t.type === step.type);
                        const Icon = stepTypeData?.icon || Search;
                        
                        return (
                          <div key={step.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="text-sm font-medium text-gray-500 w-6">
                              {index + 1}.
                            </div>
                            <div className={`w-6 h-6 ${stepTypeData?.color || 'bg-gray-500'} rounded flex items-center justify-center`}>
                              <Icon size={12} className="text-white" />
                            </div>
                            <div className="font-medium text-gray-900">{step.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
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
            Previous
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-150"
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-150"
            >
              <Check size={16} />
              Save Workflow
            </button>
          )}
        </div>
      </div>
    </div>
  );
}