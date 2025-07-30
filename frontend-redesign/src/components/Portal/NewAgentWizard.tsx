import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Upload, Globe, Type, FileText, Trash2 } from 'lucide-react';
import { AgentKnowledge } from '../../types';

interface NewAgentWizardProps {
  agent?: Agent | null;
  onClose: () => void;
}

export function NewAgentWizard({ agent, onClose }: NewAgentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [instructions, setInstructions] = useState(agent?.instructions || '');
  const [knowledge, setKnowledge] = useState<AgentKnowledge[]>(agent?.knowledge || []);
  const [agentName, setAgentName] = useState(agent?.name || '');
  const [agentHandle, setAgentHandle] = useState(agent?.handle || '');
  const [agentDescription, setAgentDescription] = useState(agent?.description || '');
  const [showKnowledgeForm, setShowKnowledgeForm] = useState<'file' | 'url' | 'text' | null>(null);
  const [tempKnowledge, setTempKnowledge] = useState({
    name: '',
    content: '',
    url: '',
    urls: ['']
  });

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
    console.log('Saving agent:', {
      name: agentName,
      handle: agentHandle,
      description: agentDescription,
      instructions,
      knowledge
    });
    onClose();
  };

  const addKnowledge = (type: 'file' | 'url' | 'text') => {
    const newKnowledge: AgentKnowledge = {
      id: Date.now().toString(),
      type,
      name: tempKnowledge.name,
      uploadedAt: new Date()
    };

    if (type === 'text') {
      newKnowledge.content = tempKnowledge.content;
    } else if (type === 'url') {
      newKnowledge.url = tempKnowledge.url;
    }

    setKnowledge(prev => [...prev, newKnowledge]);
    setTempKnowledge({ name: '', content: '', url: '', urls: [''] });
    setShowKnowledgeForm(null);
  };

  const removeKnowledge = (id: string) => {
    setKnowledge(prev => prev.filter(k => k.id !== id));
  };

  const addUrlField = () => {
    setTempKnowledge(prev => ({
      ...prev,
      urls: [...prev.urls, '']
    }));
  };

  const updateUrl = (index: number, value: string) => {
    setTempKnowledge(prev => ({
      ...prev,
      urls: prev.urls.map((url, i) => i === index ? value : url)
    }));
  };

  const removeUrlField = (index: number) => {
    setTempKnowledge(prev => ({
      ...prev,
      urls: prev.urls.filter((_, i) => i !== index)
    }));
  };

  const steps = [
    { id: 1, name: 'Instructions', icon: '●' },
    { id: 2, name: 'Tools & Knowledge', icon: '■' },
    { id: 3, name: 'Settings', icon: '▲' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Agent</h2>
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
          {steps.map((step) => (
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
          {/* Step 1: Instructions */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 mb-6">
                  Command or guideline you provide to your agent to direct its responses.
                </p>
                
                <div className="mb-6">
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter instructions for your agent..."
                    className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150 resize-none"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Break down your instructions into steps to leverage the model's reasoning capabilities.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Give context on how you'd like the agent to act, e.g. 'Act like a senior analyst'.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Add instructions on the format of the answer, voice, answer in bullet points, in code blocks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tools & Knowledge */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 mb-6">
                  Configure the tools that your agent is able to use, such as <strong>searching</strong> in your Data Sources or <strong>navigating</strong> the Web.
                  Before replying, the agent can use multiple of those tools to gather information and provide you with the best possible answer.
                </p>

                {/* Knowledge Options */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setShowKnowledgeForm('file')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-150"
                  >
                    <Upload size={16} />
                    Upload Files
                  </button>
                  <button
                    onClick={() => setShowKnowledgeForm('url')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-150"
                  >
                    <Globe size={16} />
                    Website URL
                  </button>
                  <button
                    onClick={() => setShowKnowledgeForm('text')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-150"
                  >
                    <Type size={16} />
                    Input Text
                  </button>
                </div>

                {/* Knowledge Form */}
                {showKnowledgeForm && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Add {showKnowledgeForm === 'file' ? 'File' : showKnowledgeForm === 'url' ? 'Website URL' : 'Text'} Knowledge
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={tempKnowledge.name}
                          onChange={(e) => setTempKnowledge(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter a name for this knowledge"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                        />
                      </div>

                      {showKnowledgeForm === 'file' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Click to upload or drag and drop</p>
                            <input type="file" className="hidden" />
                          </div>
                        </div>
                      )}

                      {showKnowledgeForm === 'url' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">URLs</label>
                          {tempKnowledge.urls.map((url, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <input
                                type="url"
                                value={url}
                                onChange={(e) => updateUrl(index, e.target.value)}
                                placeholder="https://example.com"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                              />
                              {tempKnowledge.urls.length > 1 && (
                                <button
                                  onClick={() => removeUrlField(index)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={addUrlField}
                            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                          >
                            + Add another URL
                          </button>
                        </div>
                      )}

                      {showKnowledgeForm === 'text' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                          <textarea
                            value={tempKnowledge.content}
                            onChange={(e) => setTempKnowledge(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Enter your text content..."
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                          />
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => addKnowledge(showKnowledgeForm)}
                          disabled={!tempKnowledge.name}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors duration-150"
                        >
                          Add Knowledge
                        </button>
                        <button
                          onClick={() => setShowKnowledgeForm(null)}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-150"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Knowledge List */}
                {knowledge.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Added Knowledge</h3>
                    {knowledge.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.type === 'file' && <FileText size={16} className="text-blue-500" />}
                          {item.type === 'url' && <Globe size={16} className="text-green-500" />}
                          {item.type === 'text' && <Type size={16} className="text-purple-500" />}
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeKnowledge(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors duration-150"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {knowledge.length === 0 && !showKnowledgeForm && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Add knowledge and tools to enhance your agent's capabilities.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Handle</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Handles are used to mention (call) an agent. They must be descriptive and unique.
                  </p>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
                    <div className="flex gap-2 mb-4">
                      {['@SalesPulse', '@OutreachPro', '@PromoScribe'].map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => setAgentHandle(suggestion)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors duration-150"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={agentHandle}
                    onChange={(e) => setAgentHandle(e.target.value)}
                    placeholder="@AgentName"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Describe for others the agent's purpose.
                  </p>
                  <textarea
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    placeholder="Experienced sales assistant crafting concise, news-based outreach emails for company promotion."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Access</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="published"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-900">
                        Published
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Visible & usable by all members of the workspace.
                  </p>
                </div>
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
              Save Agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}