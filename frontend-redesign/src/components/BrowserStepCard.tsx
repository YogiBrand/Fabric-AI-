import React from 'react';
import { Activity, Brain, Target, ThumbsUp, Link, FileText, Loader2 } from 'lucide-react';

interface StepContent {
  thinking?: string;
  eval?: string;
  memory?: string;
  nextGoal?: string;
  navigation?: string;
  extraction?: string;
  action?: string;
}

interface BrowserStepCardProps {
  stepNumber: number;
  status: 'in_progress' | 'completed' | 'failed';
  content: StepContent;
  timestamp: Date;
  actionDetails?: string;
}

export const BrowserStepCard: React.FC<BrowserStepCardProps> = ({
  stepNumber,
  status,
  content,
  timestamp,
  actionDetails
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'in_progress':
        return 'border-blue-300 bg-blue-50';
      case 'completed':
        return 'border-green-300 bg-green-50';
      case 'failed':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'completed':
        return <Activity className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <Activity className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className={`rounded-lg border ${getStatusColor()} p-4 mb-3 transition-all duration-200`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <h3 className="text-sm font-semibold text-gray-900">
            📍 Step {stepNumber}
          </h3>
          {status === 'in_progress' && (
            <span className="text-xs text-blue-600 font-medium">In Progress...</span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>

      {/* Content Sections */}
      <div className="space-y-2 text-sm">
        {content.thinking && (
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div className="flex-1">
              <span className="font-medium text-gray-700">Thinking:</span>
              <p className="text-gray-600 mt-0.5">{content.thinking}</p>
            </div>
          </div>
        )}

        {content.eval && (
          <div className="flex items-start gap-2">
            <span className="text-lg">👍</span>
            <div className="flex-1">
              <span className="font-medium text-gray-700">Eval:</span>
              <p className="text-gray-600 mt-0.5">{content.eval}</p>
            </div>
          </div>
        )}

        {content.memory && (
          <div className="flex items-start gap-2">
            <span className="text-lg">🧠</span>
            <div className="flex-1">
              <span className="font-medium text-gray-700">Memory:</span>
              <p className="text-gray-600 mt-0.5">{content.memory}</p>
            </div>
          </div>
        )}

        {content.nextGoal && (
          <div className="flex items-start gap-2">
            <span className="text-lg">🎯</span>
            <div className="flex-1">
              <span className="font-medium text-gray-700">Next goal:</span>
              <p className="text-gray-600 mt-0.5">{content.nextGoal}</p>
            </div>
          </div>
        )}

        {content.navigation && (
          <div className="flex items-start gap-2">
            <span className="text-lg">🔗</span>
            <div className="flex-1">
              <span className="font-medium text-gray-700">Navigation:</span>
              <p className="text-gray-600 mt-0.5">{content.navigation}</p>
            </div>
          </div>
        )}

        {content.extraction && (
          <div className="flex items-start gap-2">
            <span className="text-lg">📄</span>
            <div className="flex-1">
              <span className="font-medium text-gray-700">Extraction:</span>
              <p className="text-gray-600 mt-0.5">{content.extraction}</p>
            </div>
          </div>
        )}

        {content.action && (
          <div className="flex items-start gap-2">
            <span className="text-lg">☑️</span>
            <div className="flex-1">
              <span className="font-medium text-gray-700">Action:</span>
              <p className="text-gray-600 mt-0.5">{content.action}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Details (if any) */}
      {actionDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">{actionDetails}</p>
        </div>
      )}
    </div>
  );
};