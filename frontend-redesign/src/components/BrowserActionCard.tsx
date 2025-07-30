import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Activity, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface BrowserActionStep {
  id: string;
  sequence: number;
  mainAction: string;
  timestamp: Date;
  actionType?: string;
  element?: string;
  value?: string;
  subSteps: Array<{
    time: string;
    level: string;
    message: string;
  }>;
}

interface BrowserActionCardProps {
  step: BrowserActionStep;
  defaultExpanded?: boolean;
}

export const BrowserActionCard: React.FC<BrowserActionCardProps> = ({ 
  step, 
  defaultExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Determine icon and color based on action type
  const getActionStyle = () => {
    if (step.mainAction.includes('Error') || step.mainAction.includes('Failed')) {
      return { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    }
    if (step.mainAction.includes('complete') || step.mainAction.includes('success')) {
      return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    }
    return { icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
  };
  
  const { icon: Icon, color, bgColor, borderColor } = getActionStyle();
  
  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} overflow-hidden transition-all duration-200`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-opacity-70 transition-colors duration-150"
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
          <span className={`text-sm font-medium ${color}`}>
            {step.mainAction}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(step.timestamp).toLocaleTimeString()}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>
      
      {/* Expandable Content */}
      {isExpanded && step.subSteps.length > 0 && (
        <div className="px-4 pb-3 border-t border-gray-100">
          <div className="mt-3 space-y-1">
            {step.subSteps.map((subStep, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <span className="text-gray-400 font-mono w-20 flex-shrink-0">
                  [{subStep.time}]
                </span>
                <span className={`font-medium ${
                  subStep.level === 'ERROR' ? 'text-red-600' : 
                  subStep.level === 'DEBUG' ? 'text-gray-500' : 
                  'text-gray-700'
                }`}>
                  {subStep.level}
                </span>
                <span className="text-gray-600 flex-1">
                  {subStep.message}
                </span>
              </div>
            ))}
          </div>
          
          {/* Additional metadata if available */}
          {(step.element || step.value) && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              {step.element && (
                <div>Element: <span className="font-mono">{step.element}</span></div>
              )}
              {step.value && (
                <div>Value: <span className="font-mono">{step.value}</span></div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};