import React, { useState, useEffect } from 'react';
import { Zap, DollarSign, TrendingUp, ChevronDown } from 'lucide-react';

interface LLMModel {
  id: string;
  name: string;
  provider: string;
}

interface LLMSelectorProps {
  onModelSelect?: (modelId: string) => void;
  selectedModel?: string;
  criteria?: 'performance' | 'price' | 'usage';
  value?: string;
  onChange?: (value: string) => void;
}

export function LLMSelector({ onModelSelect, selectedModel, criteria = 'performance', value, onChange }: LLMSelectorProps) {
  const [models, setModels] = useState<LLMModel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState(criteria);

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    if (selectedCriteria !== criteria) {
      selectModelByCriteria(selectedCriteria);
    }
  }, [selectedCriteria]);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/models');
      const data = await response.json();
      setModels(data.models);
      
      // Auto-select based on criteria if no model selected
      const currentValue = value || selectedModel;
      if (!currentValue && data.models.length > 0) {
        selectModelByCriteria(selectedCriteria);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectModelByCriteria = async (criterion: string) => {
    try {
      const response = await fetch('/api/select-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteria: criterion }),
      });
      const data = await response.json();
      if (onChange) {
        onChange(data.selected_model);
      } else if (onModelSelect) {
        onModelSelect(data.selected_model);
      }
    } catch (error) {
      console.error('Failed to select model:', error);
    }
  };

  const criteriaConfig = {
    performance: { icon: Zap, label: 'Performance', color: 'text-purple-600' },
    price: { icon: DollarSign, label: 'Price', color: 'text-green-600' },
    usage: { icon: TrendingUp, label: 'Usage', color: 'text-blue-600' },
  };

  const currentValue = value || selectedModel;
  const currentModel = models.find(m => m.id === currentValue);

  return (
    <div className="relative">
      {/* Criteria Selector */}
      <div className="flex gap-2 mb-3">
        {Object.entries(criteriaConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setSelectedCriteria(key as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                selectedCriteria === key
                  ? `bg-gray-100 ${config.color}`
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Model Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-150"
        >
          <div className="flex items-center gap-3">
            {loading ? (
              <span className="text-gray-500">Loading models...</span>
            ) : currentModel ? (
              <>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentModel.provider.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{currentModel.name}</div>
                  <div className="text-xs text-gray-500">{currentModel.provider}</div>
                </div>
              </>
            ) : (
              <span className="text-gray-500">Select a model</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && !loading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10 animate-in slide-in-from-top-2 duration-150">
            <div className="max-h-64 overflow-y-auto">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    if (onChange) {
                      onChange(model.id);
                    } else if (onModelSelect) {
                      onModelSelect(model.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                    model.id === currentValue ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold ${
                    model.provider === 'openai' ? 'from-green-500 to-emerald-600' :
                    model.provider === 'anthropic' ? 'from-orange-500 to-red-600' :
                    model.provider === 'deepseek' ? 'from-blue-500 to-indigo-600' :
                    'from-gray-500 to-gray-600'
                  }`}>
                    {model.provider.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-900">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.provider}</div>
                  </div>
                  {model.id === currentValue && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Model Info */}
      {currentModel && (
        <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Selected for {selectedCriteria}:</span>
            <span className="font-medium text-gray-900">{currentModel.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}