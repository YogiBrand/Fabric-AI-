import React, { useState, useEffect } from 'react';
import { ResearchCategoryCard } from './ResearchStepCard';
import { FileDown, RefreshCw, StopCircle } from 'lucide-react';

interface ResearchTask {
  task_description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  results?: any[];
  error?: string;
}

interface ResearchCategory {
  category_name: string;
  tasks: ResearchTask[];
}

interface ResearchPlan {
  categories: ResearchCategory[];
  topic: string;
  taskId: string;
}

interface ResearchProgressProps {
  plan: ResearchPlan | null;
  isActive: boolean;
  finalReport?: string;
  onStop?: () => void;
  onDownload?: () => void;
  onResume?: (taskId: string) => void;
}

export const ResearchProgress: React.FC<ResearchProgressProps> = ({
  plan,
  isActive,
  finalReport,
  onStop,
  onDownload,
  onResume
}) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  
  // Calculate overall progress
  const calculateProgress = () => {
    if (!plan) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    plan.categories.forEach(category => {
      totalTasks += category.tasks.length;
      completedTasks += category.tasks.filter(t => t.status === 'completed').length;
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  
  // Transform plan data for the category cards
  const transformPlanForDisplay = () => {
    if (!plan) return [];
    
    return plan.categories.map((category, catIdx) => ({
      name: category.category_name,
      index: catIdx,
      tasks: category.tasks.map((task, taskIdx) => ({
        id: `${catIdx}-${taskIdx}`,
        category: category.category_name,
        categoryIndex: catIdx,
        taskIndex: taskIdx,
        task: task.task_description,
        status: task.status,
        results: task.results,
        error: task.error,
        progress: task.status === 'in_progress' ? 50 : undefined
      }))
    }));
  };
  
  const overallProgress = calculateProgress();
  const displayCategories = transformPlanForDisplay();
  
  if (!plan) {
    return (
      <div className="text-center py-8 text-gray-500">
        No research plan available
      </div>
    );
  }
  
  return (
    <div className="research-progress max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Research Progress</h1>
            <p className="text-gray-600 mt-1">Topic: {plan.topic}</p>
            {plan.taskId && (
              <p className="text-xs text-gray-500 mt-1">Task ID: {plan.taskId}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {isActive && onStop && (
              <button
                onClick={onStop}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <StopCircle className="w-4 h-4" />
                Stop Research
              </button>
            )}
            
            {!isActive && plan.taskId && onResume && (
              <button
                onClick={() => onResume(plan.taskId)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Resume
              </button>
            )}
            
            {finalReport && onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Download Report
              </button>
            )}
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium text-gray-900">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
        
        {/* Status Summary */}
        <div className="mt-4 grid grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900">
              {plan.categories.reduce((acc, cat) => acc + cat.tasks.length, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">
              {plan.categories.reduce((acc, cat) => 
                acc + cat.tasks.filter(t => t.status === 'completed').length, 0
              )}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">
              {plan.categories.reduce((acc, cat) => 
                acc + cat.tasks.filter(t => t.status === 'in_progress').length, 0
              )}
            </div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-600">
              {plan.categories.reduce((acc, cat) => 
                acc + cat.tasks.filter(t => t.status === 'pending').length, 0
              )}
            </div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
        </div>
      </div>
      
      {/* Categories and Tasks */}
      <div className="space-y-4">
        {displayCategories.map((category, idx) => (
          <ResearchCategoryCard 
            key={idx} 
            category={category}
            defaultExpanded={idx === currentCategoryIndex}
          />
        ))}
      </div>
      
      {/* Final Report Preview */}
      {finalReport && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Final Report</h2>
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: finalReport }} />
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for managing research progress state
export const useResearchProgress = () => {
  const [researchPlan, setResearchPlan] = useState<ResearchPlan | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [finalReport, setFinalReport] = useState<string | undefined>();
  
  // Update task status
  const updateTaskStatus = (
    categoryIndex: number, 
    taskIndex: number, 
    status: ResearchTask['status'],
    results?: any[],
    error?: string
  ) => {
    setResearchPlan(prev => {
      if (!prev) return null;
      
      const newPlan = { ...prev };
      newPlan.categories = [...prev.categories];
      newPlan.categories[categoryIndex] = { ...prev.categories[categoryIndex] };
      newPlan.categories[categoryIndex].tasks = [...prev.categories[categoryIndex].tasks];
      
      const task = { ...prev.categories[categoryIndex].tasks[taskIndex] };
      task.status = status;
      if (results) task.results = results;
      if (error) task.error = error;
      
      newPlan.categories[categoryIndex].tasks[taskIndex] = task;
      
      return newPlan;
    });
  };
  
  // Initialize plan from data
  const initializePlan = (planData: any, topic: string, taskId: string) => {
    setResearchPlan({
      categories: planData,
      topic,
      taskId
    });
  };
  
  return {
    researchPlan,
    isActive,
    finalReport,
    setIsActive,
    setFinalReport,
    updateTaskStatus,
    initializePlan,
    setResearchPlan
  };
};