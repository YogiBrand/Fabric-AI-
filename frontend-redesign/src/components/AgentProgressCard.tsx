import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface AgentStep {
  id: string;
  action: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp: Date;
  humanReadable: string;
  progress?: number;
}

const AgentProgressCard: React.FC = () => {
  const { state, agentLogs, browserStatus } = useAppContext();
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [currentTask, setCurrentTask] = useState<string>('');
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Human-readable action translations
  const translateAction = (action: string, element?: string, value?: string, details?: any): string => {
    const key = action.toLowerCase();
    
    switch (key) {
      case 'click':
        if (element?.includes('button') || element?.includes('btn')) {
          return `Clicking "${element}" button`;
        } else if (element?.includes('link') || element?.includes('a ')) {
          return `Clicking link: ${element}`;
        } else if (element) {
          return `Clicking on ${element}`;
        }
        return 'Clicking an element on the page';
        
      case 'type':
        if (value && value.length > 30) {
          return `Typing text into ${element || 'field'} (${value.length} characters)`;
        } else if (value) {
          return `Typing "${value}" into ${element || 'field'}`;
        }
        return `Entering text into ${element || 'input field'}`;
        
      case 'scroll':
        return details?.direction ? `Scrolling ${details.direction} on the page` : 'Scrolling to find content';
        
      case 'navigate':
      case 'go_to_url':
        return value ? `Navigating to ${new URL(value).hostname}` : 'Opening a new page';
        
      case 'wait':
        return details?.timeout ? `Waiting ${details.timeout}ms for page to load` : 'Waiting for page elements to appear';
        
      case 'extract':
        return details?.selector ? `Extracting data using "${details.selector}"` : 'Extracting information from the page';
        
      case 'search':
        return value ? `Searching for "${value}"` : 'Performing a search';
        
      case 'fill_form':
        return `Filling out form on ${element || 'the page'}`;
        
      case 'select':
        return value ? `Selecting "${value}" from ${element || 'dropdown'}` : `Making selection in ${element || 'dropdown'}`;
        
      case 'hover':
        return `Hovering over ${element || 'page element'}`;
        
      case 'screenshot':
        return 'Capturing screenshot of current page';
        
      case 'download':
        return value ? `Downloading ${value}` : 'Downloading content from page';
        
      case 'upload':
        return value ? `Uploading file: ${value}` : 'Uploading a file';
        
      default:
        return element ? `${action} on ${element}` : `Performing ${action}`;
    }
  };

  // Convert browser actions to human-readable steps
  useEffect(() => {
    const newSteps: AgentStep[] = [];
    let currentProgress = 0;

    agentLogs.forEach((log, index) => {
      if (log.metadata?.type === 'browser_action') {
        const actionType = log.metadata.actionType || 'action';
        const element = log.metadata.element;
        const value = log.metadata.value;
        const details = log.metadata.details;
        
        const humanReadable = translateAction(actionType, element, value, details);
        
        newSteps.push({
          id: log.id,
          action: actionType,
          description: log.message,
          status: 'completed',
          timestamp: log.timestamp,
          humanReadable,
          progress: ((index + 1) / agentLogs.length) * 100
        });
      } else if (log.level === 'info' && log.message.includes('Starting')) {
        setIsActive(true);
      }
    });

    // Add current action if browser is active
    if (browserStatus?.currentAction && browserStatus?.isLoading) {
      const currentActionHuman = translateAction('current', '', browserStatus.currentAction);
      newSteps.push({
        id: 'current',
        action: 'current',
        description: browserStatus.currentAction,
        status: 'in_progress',
        timestamp: new Date(),
        humanReadable: currentActionHuman,
        progress: currentProgress
      });
    }

    setSteps(newSteps);
    
    // Set current task to the most recent action or browser status
    if (newSteps.length > 0) {
      const currentStep = newSteps[newSteps.length - 1];
      setCurrentTask(currentStep.humanReadable);
    } else if (browserStatus?.currentAction) {
      setCurrentTask(translateAction('current', '', browserStatus.currentAction));
    }
    
    // Calculate overall progress
    const completedSteps = newSteps.filter(s => s.status === 'completed').length;
    const totalSteps = newSteps.length;
    const newProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    setOverallProgress(newProgress);

    // Check if task is complete
    if (!browserStatus?.isLoading && newSteps.length > 0) {
      setIsActive(false);
    }
  }, [agentLogs, browserStatus]);

  // Don't render if no steps
  if (steps.length === 0 && !isActive) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isActive ? 'Agent Working...' : 'Task Completed'}
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {steps.filter(s => s.status === 'completed').length} / {steps.length} steps
            </div>
            {steps.length > 1 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg 
                  className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Current task description */}
        {currentTask && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {currentTask}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step (Always Visible) */}
      {steps.length > 0 && (
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700">
          {(() => {
            const currentStep = steps[steps.length - 1];
            return (
              <div className="flex items-start space-x-3">
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {currentStep.status === 'completed' ? (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  ) : currentStep.status === 'in_progress' ? (
                    <div className="w-5 h-5 bg-blue-500 rounded-full animate-spin">
                      <svg className="w-3 h-3 text-white m-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </div>
                  ) : currentStep.status === 'failed' ? (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentStep.humanReadable}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {currentStep.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {/* Show original description */}
                  {currentStep.description !== currentStep.humanReadable && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {currentStep.description}
                    </p>
                  )}

                  {/* Individual step progress (for current step) */}
                  {currentStep.status === 'in_progress' && currentStep.progress !== undefined && (
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${currentStep.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Previous Steps (Expandable) */}
      {isExpanded && steps.length > 1 && (
        <div className="max-h-96 overflow-y-auto border-t border-gray-100 dark:border-gray-700">
          <div className="px-6 py-2 bg-gray-50 dark:bg-gray-900">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Previous Steps ({steps.length - 1})
            </h4>
          </div>
          {steps.slice(0, -1).reverse().map((step, index) => (
            <div key={step.id} className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div className="flex items-start space-x-3">
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {step.status === 'completed' ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  ) : step.status === 'failed' ? (
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {step.humanReadable}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {step.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {/* Show original description */}
                  {step.description !== step.humanReadable && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {!isActive && steps.length > 0 && (
        <div className="px-6 py-3 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              Task completed successfully!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentProgressCard;