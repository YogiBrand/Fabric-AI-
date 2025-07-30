import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { WorkflowRun } from '../types';

interface LiveStatusTimelineProps {
  workflowRun: WorkflowRun;
}

export function LiveStatusTimeline({ workflowRun }: LiveStatusTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['step-2'])); // Expand current step by default

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'running':
        return <Clock size={16} className="text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = () => {
    const start = workflowRun.startTime.getTime();
    const end = workflowRun.endTime?.getTime() || Date.now();
    const duration = Math.floor((end - start) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(workflowRun.status)}`}>
            {workflowRun.status.charAt(0).toUpperCase() + workflowRun.status.slice(1)}
          </span>
          <span className="text-sm text-gray-600">
            Duration: {formatDuration()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${workflowRun.progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 min-w-0">{workflowRun.progress}%</span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {workflowRun.steps.map((step, index) => (
          <div key={step.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleStep(step.id)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(step.status)}
                <span className="font-medium text-gray-900">{step.title}</span>
                {step.status === 'running' && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {step.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {expandedSteps.has(step.id) ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </div>
            </button>
            
            {expandedSteps.has(step.id) && step.logs.length > 0 && (
              <div className="px-3 pb-3 border-t border-gray-100 bg-gray-50">
                <div className="mt-2 space-y-1">
                  {step.logs.map((log, logIndex) => (
                    <div key={logIndex} className="flex items-start gap-2 text-sm">
                      <span className="text-gray-400 font-mono">–</span>
                      <span className="text-gray-700">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}