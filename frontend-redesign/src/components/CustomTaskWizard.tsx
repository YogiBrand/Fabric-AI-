import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { LLMSelector } from './LLMSelector';

interface CustomTaskWizardProps {
  onClose: () => void;
  onComplete?: (taskConfig: any) => void;
}

interface Step {
  id: string;
  description: string;
  order: number;
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required: boolean;
}

type TaskType = 'web_scrape' | 'form_submission' | 'lead_generation';
type DataInputType = 'urls' | 'companies' | 'contacts';

export function CustomTaskWizard({ onClose, onComplete }: CustomTaskWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // General tab state
  const [taskType, setTaskType] = useState<TaskType>('web_scrape');
  const [dataInputType, setDataInputType] = useState<DataInputType>('urls');
  const [dataInput, setDataInput] = useState('');
  const [useCrawl4AI, setUseCrawl4AI] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState('openai/gpt-4o-mini');
  
  // Steps tab state
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', description: '', order: 1 }
  ]);
  
  // Form fields tab state
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: '1', name: 'name', label: 'Name', type: 'text', required: true },
    { id: '2', name: 'email', label: 'Email', type: 'email', required: true },
    { id: '3', name: 'message', label: 'Message', type: 'textarea', required: false }
  ]);
  
  // Removed sendWebSocketMessage - no longer needed here

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

  // Step management
  const addStep = () => {
    const newOrder = steps.length + 1;
    setSteps([...steps, {
      id: Date.now().toString(),
      description: '',
      order: newOrder
    }]);
  };

  const updateStep = (id: string, description: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, description } : step
    ));
  };

  const removeStep = (id: string) => {
    if (steps.length === 1) return;
    
    const updatedSteps = steps
      .filter(step => step.id !== id)
      .map((step, index) => ({ ...step, order: index + 1 }));
    setSteps(updatedSteps);
  };

  // Form field management
  const addFormField = () => {
    setFormFields([...formFields, {
      id: Date.now().toString(),
      name: '',
      label: '',
      type: 'text',
      required: false
    }]);
  };

  const updateFormField = (id: string, field: Partial<FormField>) => {
    setFormFields(formFields.map(f => 
      f.id === id ? { ...f, ...field } : f
    ));
  };

  const removeFormField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Parse data input
      const dataList = dataInput.split('\n').filter(line => line.trim());
      
      // Prepare task configuration
      const taskConfig = {
        type: 'custom_task',
        taskType,
        dataInputType,
        data: dataList,
        useCrawl4AI,
        llmProvider: selectedLLM,
        openRouterApiKey: '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',
        steps: steps.filter(s => s.description.trim()),
        formFields: formFields.filter(f => f.name && f.label)
      };

      // Pass task configuration to parent component
      onComplete?.(taskConfig);
      onClose();
    } catch (error) {
      console.error('Task submission error:', error);
      setSubmitError('Failed to submit task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Custom Task</h2>
            <p className="text-gray-600 mt-1 font-medium">Step {currentStep} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-150"
          >
            <X size={22} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-5 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-sm transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <Check size={18} strokeWidth={3} /> : step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1.5 mx-4 rounded-full transition-all duration-500 ${
                    step < currentStep ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-sm font-medium">
            <span className={currentStep === 1 ? 'text-blue-600' : 'text-gray-600'}>General</span>
            <span className={currentStep === 2 ? 'text-blue-600' : 'text-gray-600'}>Steps</span>
            <span className={currentStep === 3 ? 'text-blue-600' : 'text-gray-600'}>Form Fields</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[450px] bg-white">
          {/* Step 1: General */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Task Configuration</h3>
                
                {/* Task Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Task Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as TaskType)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 font-medium"
                  >
                    <option value="web_scrape">Web Scrape</option>
                    <option value="form_submission">Form Submission</option>
                    <option value="lead_generation">Lead Generation</option>
                  </select>
                </div>

                {/* Data Input Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Data Input Type
                  </label>
                  <div className="space-y-3">
                    <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      dataInputType === 'urls' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        value="urls"
                        checked={dataInputType === 'urls'}
                        onChange={(e) => setDataInputType(e.target.value as DataInputType)}
                        className="mr-3 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-200"
                      />
                      <span className="font-medium">Web URLs</span>
                    </label>
                    <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      dataInputType === 'companies' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        value="companies"
                        checked={dataInputType === 'companies'}
                        onChange={(e) => setDataInputType(e.target.value as DataInputType)}
                        className="mr-3 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-200"
                      />
                      <span className="font-medium">Company Names</span>
                    </label>
                    <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      dataInputType === 'contacts' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        value="contacts"
                        checked={dataInputType === 'contacts'}
                        onChange={(e) => setDataInputType(e.target.value as DataInputType)}
                        className="mr-3 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-200"
                      />
                      <span className="font-medium">Contact Names</span>
                    </label>
                  </div>
                </div>

                {/* Data Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    {dataInputType === 'urls' ? 'URLs' : dataInputType === 'companies' ? 'Company Names' : 'Contact Names'}
                    <span className="text-gray-500 text-sm font-normal ml-2">(one per line)</span>
                  </label>
                  <textarea
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                    placeholder={dataInputType === 'urls' 
                      ? 'https://example.com\nhttps://another-site.com' 
                      : dataInputType === 'companies'
                      ? 'Company A\nCompany B\nCompany C'
                      : 'John Doe\nJane Smith\nBob Johnson'
                    }
                    className="w-full h-36 px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 hover:bg-white hover:border-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 font-mono text-sm"
                  />
                </div>

                {/* Crawl4AI Options */}
                <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCrawl4AI}
                      onChange={(e) => setUseCrawl4AI(e.target.checked)}
                      className="mr-3 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-200"
                    />
                    <span className="text-base font-medium text-gray-800">
                      Use Crawl4AI for web scraping
                    </span>
                  </label>
                  
                  {useCrawl4AI && (
                    <div className="mt-4 ml-8">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        LLM Provider for Crawl4AI
                      </label>
                      <div className="p-3 bg-white border-2 border-gray-300 rounded-lg">
                        <LLMSelector
                          value={selectedLLM}
                          onChange={setSelectedLLM}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Steps */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Task Steps</h3>
                <p className="text-gray-600 mb-6">
                  Define the steps to execute for this task
                </p>
              </div>

              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3 group">
                    <div className="flex items-center gap-2 mt-2">
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move group-hover:text-gray-600" />
                      <span className="text-sm font-bold text-gray-700 w-6">
                        {step.order}.
                      </span>
                    </div>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => updateStep(step.id, e.target.value)}
                      placeholder="Enter step description..."
                      className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                    />
                    <button
                      onClick={() => removeStep(step.id)}
                      disabled={steps.length === 1}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addStep}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-400 transition-all duration-150"
              >
                <Plus size={16} />
                Add Step
              </button>
            </div>
          )}

          {/* Step 3: Form Fields */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Form Fields</h3>
                <p className="text-gray-600 mb-6">
                  Configure form fields to pass through during task execution
                </p>
              </div>

              <div className="space-y-4">
                {formFields.map((field) => (
                  <div key={field.id} className="p-5 bg-gray-50 border-2 border-gray-300 rounded-lg hover:shadow-md transition-all duration-200">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Field Name
                        </label>
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateFormField(field.id, { name: e.target.value })}
                          placeholder="e.g., firstName"
                          className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Label
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                          placeholder="e.g., First Name"
                          className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => updateFormField(field.id, { type: e.target.value as any })}
                          className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="textarea">Textarea</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                          className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-200"
                        />
                        <span className="text-sm text-gray-700">Required</span>
                      </label>
                      <button
                        onClick={() => removeFormField(field.id)}
                        className="text-sm text-red-600 hover:text-red-700 transition-colors duration-150"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addFormField}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-400 transition-all duration-150"
              >
                <Plus size={16} />
                Add Field
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:bg-white border-2 border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 hover:bg-white border-2 border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-150"
            >
              Cancel
            </button>
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && !dataInput.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-300 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-150"
              >
                Next
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-300 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-150"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Task...
                  </>
                ) : (
                  <>
                    <Check size={18} strokeWidth={3} />
                    Create Task
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