import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Loader2, Globe, FileText } from 'lucide-react';

interface ResearchResult {
  title: string;
  url: string;
  summary: string;
  content?: string;
}

interface ResearchStep {
  id: string;
  category: string;
  categoryIndex: number;
  taskIndex: number;
  task: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress?: number;
  results?: ResearchResult[];
  error?: string;
}

interface ResearchStepCardProps {
  step: ResearchStep;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const ResearchStepCard: React.FC<ResearchStepCardProps> = ({ 
  step, 
  isExpanded = false,
  onToggle 
}) => {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  
  useEffect(() => {
    setLocalExpanded(isExpanded);
  }, [isExpanded]);
  
  const handleToggle = () => {
    const newState = !localExpanded;
    setLocalExpanded(newState);
    onToggle?.();
  };
  
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };
  
  const getStepNumber = () => {
    return `${step.categoryIndex + 1}.${step.taskIndex + 1}`;
  };
  
  return (
    <div className="research-step-card border rounded-lg mb-4 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div 
        className="flex items-center p-4 cursor-pointer hover:bg-gray-50"
        onClick={handleToggle}
      >
        <button className="mr-3 p-0 focus:outline-none">
          {localExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        <div className="mr-3">
          {getStatusIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Step {getStepNumber()}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
              {step.category}
            </span>
          </div>
          <h3 className="text-base font-medium text-gray-900 mt-1">
            {step.task}
          </h3>
        </div>
        
        {step.status === 'in_progress' && step.progress !== undefined && (
          <div className="ml-4 w-32">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${step.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{step.progress}%</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Expandable Content */}
      {localExpanded && (
        <div className="border-t bg-gray-50 p-4">
          {step.status === 'pending' && (
            <p className="text-sm text-gray-500 italic">Waiting to start...</p>
          )}
          
          {step.status === 'in_progress' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Searching for information...</p>
              {step.progress !== undefined && step.progress > 0 && (
                <p className="text-xs text-gray-500">
                  Processing search results...
                </p>
              )}
            </div>
          )}
          
          {step.status === 'failed' && (
            <div className="space-y-2">
              <p className="text-sm text-red-600 font-medium">Task failed</p>
              {step.error && (
                <p className="text-sm text-gray-600">{step.error}</p>
              )}
            </div>
          )}
          
          {step.status === 'completed' && step.results && step.results.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Found {step.results.length} relevant sources:
              </p>
              
              {step.results.map((result, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Globe className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </h4>
                      <a 
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 truncate block"
                      >
                        {result.url}
                      </a>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {result.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {step.status === 'completed' && (!step.results || step.results.length === 0) && (
            <p className="text-sm text-gray-500 italic">
              No specific results recorded for this step.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Research Category Card Component
interface ResearchCategory {
  name: string;
  index: number;
  tasks: ResearchStep[];
}

interface ResearchCategoryCardProps {
  category: ResearchCategory;
  defaultExpanded?: boolean;
}

export const ResearchCategoryCard: React.FC<ResearchCategoryCardProps> = ({ 
  category, 
  defaultExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const completedTasks = category.tasks.filter(t => t.status === 'completed').length;
  const totalTasks = category.tasks.length;
  
  return (
    <div className="mb-6">
      <div 
        className="flex items-center justify-between mb-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <button className="p-0 focus:outline-none">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {category.index + 1}. {category.name}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {completedTasks} / {totalTasks} completed
          </span>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="ml-8">
          {category.tasks.map((task) => (
            <ResearchStepCard key={task.id} step={task} />
          ))}
        </div>
      )}
    </div>
  );
};