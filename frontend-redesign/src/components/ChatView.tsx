import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WorkflowCards } from './WorkflowCards';
import { ChatThread } from './ChatThread';
import { LiveStatusTimeline } from './LiveStatusTimeline';
import { ChromiumPreview } from './ChromiumPreview';
import { BrowserStatus } from './BrowserStatus';
import { TerminalLogs } from './TerminalLogs';
import { DataExtractionPanel } from './DataExtractionPanel';
import { ResearchProgress, useResearchProgress } from './ResearchProgress';
import AgentProgressCard from './AgentProgressCard';
import { useAppContext } from '../contexts/AppContext';
import { api } from '../utils/api';

export function ChatView() {
  const { state, sendWebSocketMessage, browserStatus, agentLogs } = useAppContext();
  const {
    researchPlan,
    isActive: isResearchActive,
    finalReport,
    setIsActive: setResearchActive,
    setFinalReport,
    updateTaskStatus,
    initializePlan,
  } = useResearchProgress();
  
  const [isDeepResearchMode, setIsDeepResearchMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'extraction'>('terminal');
  const [previewHeight, setPreviewHeight] = useState(65); // Preview takes 65% by default
  const [isResizing, setIsResizing] = useState(false);
  
  // Show preview when task is running or when browser has completed a task (but not on initial load)
  const hasActiveWorkflow = (browserStatus?.isLoading || (browserStatus?.browserReady && browserStatus?.currentAction)) || false;
  const showResearchProgress = isDeepResearchMode && researchPlan;
  const resizePanelRef = useRef<HTMLDivElement>(null);
  
  // Handle resize mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizePanelRef.current) return;
    
    const containerRect = resizePanelRef.current.getBoundingClientRect();
    const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;
    
    // Constrain between 30% and 80%
    if (newHeight >= 30 && newHeight <= 80) {
      setPreviewHeight(newHeight);
    }
  }, [isResizing]);
  
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);
  
  // Add/remove mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.classList.add('resizing');
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.classList.remove('resizing');
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);
  
  console.log('🔍 ChatView state:', {
    isDeepResearchMode,
    researchPlan: !!researchPlan,
    showResearchProgress
  });

  // Handle research-related WebSocket messages
  useEffect(() => {
    const handleResearchMessage = (event: CustomEvent) => {
      console.log('🔍 Received research event:', event.detail);
      try {
        const message = event.detail;
        
        switch (message.type) {
          case 'research.plan_created':
            console.log('🔍 Creating research plan:', message.data);
            // The plan is nested in data.data.plan due to ResearchProgress structure
            const planData = message.data.data?.plan || message.data.plan;
            if (planData && planData.categories) {
              initializePlan(
                planData.categories,
                planData.topic || message.data.topic,
                message.data.task_id
              );
              setResearchActive(true);
            } else {
              console.error('🔍 Invalid research plan format:', message.data);
            }
            break;
            
          case 'research.task_started':
            updateTaskStatus(
              message.data.category_index,
              message.data.task_index,
              'in_progress'
            );
            break;
            
          case 'research.task_progress':
            // Could add progress updates if needed
            break;
            
          case 'research.task_completed':
            updateTaskStatus(
              message.data.category_index,
              message.data.task_index,
              'completed',
              message.data.results
            );
            break;
            
          case 'research.report_ready':
            setFinalReport(message.data.report);
            setResearchActive(false);
            break;
        }
      } catch (error) {
        console.error('Error handling research message:', error);
      }
    };

    // This is a simplified approach - ideally this would be integrated into AppContext
    // For now, we'll listen directly to WebSocket messages here
    window.addEventListener('ws-message', handleResearchMessage as any);
    
    return () => {
      window.removeEventListener('ws-message', handleResearchMessage as any);
    };
  }, [initializePlan, setResearchActive, updateTaskStatus, setFinalReport]);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Compact Header - only show when workflow is active */}
      {hasActiveWorkflow && (
        <div className="h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-gray-200 bg-gray-50">
          <BrowserStatus />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-700">Live Browser</span>
            </div>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-150">
              Share
            </button>
            <button 
              onClick={() => {
                sendWebSocketMessage({ type: 'control', data: { action: 'close' } });
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {!hasActiveWorkflow ? (
          // Welcome screen - no panels needed
          <div className="h-full flex flex-col items-center w-full px-8 pt-24 overflow-y-auto">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-4xl">
              <h1 className="text-4xl font-semibold text-gray-900 mb-4">
                What do you want done?
              </h1>
              <p className="text-lg text-gray-600 mb-12">
                Prompt, run, and let the agent do the rest.
              </p>
              
              {/* Chat Input Area */}
              <div className="mb-12 w-full">
                <ChatThread 
                  isWelcomeMode={true} 
                  isDeepResearchMode={isDeepResearchMode}
                  onToggleDeepResearch={() => {
                    console.log('🔍 Toggle deep research from:', isDeepResearchMode, 'to:', !isDeepResearchMode);
                    setIsDeepResearchMode(!isDeepResearchMode);
                  }}
                />
              </div>
              
              <p className="text-sm text-gray-500 mb-8">
                Fabric can make mistakes. Please monitor its work.
              </p>
            </div>
            
            {/* Popular Workflows Section */}
            <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              <WorkflowCards />
            </div>
          </div>
        ) : (
          // Active workflow - fixed layout without resize
          <div className="h-full flex">
            {/* Chat Panel - 40% width */}
            <div className="w-2/5 flex flex-col overflow-hidden">
              {/* Agent Progress Card - Collapsible */}
              <div className="flex-shrink-0 border-b border-gray-200 bg-white">
                <AgentProgressCard />
              </div>
              
              <div className="flex-1 min-h-0 flex flex-col animate-in slide-in-from-left duration-500 overflow-hidden">
                {/* Research Progress or Chat Thread */}
                {showResearchProgress ? (
                  <div className="flex-1 overflow-y-auto p-4">
                    <ResearchProgress
                      plan={researchPlan}
                      isActive={isResearchActive}
                      finalReport={finalReport}
                      onStop={() => {
                        sendWebSocketMessage({ type: 'control', data: { action: 'stop_research' } });
                        setResearchActive(false);
                      }}
                      onDownload={() => {
                        // Handle download logic
                        if (finalReport) {
                          const blob = new Blob([finalReport], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `research-report-${Date.now()}.html`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }
                      }}
                      onResume={(taskId) => {
                        sendWebSocketMessage({ type: 'control', data: { action: 'resume_research', taskId } });
                        setResearchActive(true);
                      }}
                    />
                  </div>
                ) : (
                  <ChatThread 
                    isWelcomeMode={false} 
                    isDeepResearchMode={isDeepResearchMode}
                    onToggleDeepResearch={() => {
                      console.log('🔍 Toggle deep research from:', isDeepResearchMode, 'to:', !isDeepResearchMode);
                      setIsDeepResearchMode(!isDeepResearchMode);
                    }}
                  />
                )}
              </div>
            </div>
            
            {/* Browser Panel - 60% width */}
            <div ref={resizePanelRef} className="w-3/5 bg-gray-50 flex flex-col overflow-hidden relative z-10">
              {/* Browser Preview - dynamic height based on previewHeight */}
              <div className="p-4 pb-2 overflow-hidden" style={{ height: `${previewHeight}%` }}>
                <ChromiumPreview 
                  url={browserStatus?.currentUrl} 
                  className="h-full"
                  onPause={async () => {
                    const result = await api.pauseTask();
                    if (!result.success) {
                      console.error('Failed to pause task:', result.error);
                    }
                  }}
                  onResume={async () => {
                    const result = await api.resumeTask();
                    if (!result.success) {
                      console.error('Failed to resume task:', result.error);
                    }
                  }}
                  onStop={async () => {
                    const result = await api.stopTask();
                    if (!result.success) {
                      console.error('Failed to stop task:', result.error);
                    }
                  }}
                />
              </div>
              
              {/* Resize Handle */}
              <div 
                className={`h-1 bg-gray-300 hover:bg-blue-500 cursor-ns-resize transition-colors relative resize-handle ${
                  isResizing ? 'bg-blue-500' : ''
                }`}
                onMouseDown={handleMouseDown}
              >
                <div className="absolute inset-x-0 -top-2 -bottom-2" />
              </div>
              
              {/* Terminal/Data Extraction - remaining space */}
              <div className="flex flex-col overflow-hidden bg-white" style={{ height: `calc(${100 - previewHeight}% - 4px)` }}>
                {/* Tab Headers */}
                <div className="flex-shrink-0 flex border-b border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'terminal'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    Terminal Logs
                  </button>
                  <button
                    onClick={() => setActiveTab('extraction')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'extraction'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    Extracted Data
                  </button>
                </div>
                
                
                {/* Tab Content */}
                <div className="flex-1 min-h-0 overflow-hidden bg-gray-50">
                  <div className="h-full p-4 pb-8">
                    {activeTab === 'terminal' ? (
                      <TerminalLogs logs={agentLogs} className="h-full" />
                    ) : (
                      <DataExtractionPanel className="h-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}