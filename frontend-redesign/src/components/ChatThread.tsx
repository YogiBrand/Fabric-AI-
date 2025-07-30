import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Send, Mic, Paperclip, Settings, Upload, ChevronDown, Plus } from 'lucide-react';
import { ChatMessage } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { BrowserActionCard } from './BrowserActionCard';
import { BrowserStepCard } from './BrowserStepCard';
import { LogEntry } from './TerminalLogs';
import { CustomTaskWizard } from './CustomTaskWizard';
import { CustomTaskBlock } from './CustomTaskBlock';
import { DataExportCard } from './DataExportCard';
import { formatCustomTaskPrompt } from '../utils/taskFormatter';

interface ChatThreadProps {
  isWelcomeMode: boolean;
  isDeepResearchMode?: boolean;
  onToggleDeepResearch?: () => void;
}

interface CustomTask {
  id: string;
  taskType: 'web_scrape' | 'form_submission' | 'lead_generation';
  dataInputType: 'urls' | 'companies' | 'contacts';
  data: string[];
  useCrawl4AI: boolean;
  llmProvider?: string;
  steps: Array<{ id: string; description: string; order: number }>;
  formFields: Array<{ id: string; name: string; label: string; type: string; required: boolean }>;
}

export function ChatThread({ isWelcomeMode, isDeepResearchMode, onToggleDeepResearch }: ChatThreadProps) {
  const [showCustomTaskWizard, setShowCustomTaskWizard] = useState(false);
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const { 
    state, 
    setSelectedModel, 
    sendWebSocketMessage, 
    browserStatus, 
    wsConnected, 
    wsConnecting, 
    taskProgress, 
    setCurrentWorkflowRun,
    currentConversation,
    addMessageToCurrentConversation,
    createNewConversation,
    agentLogs,
    dataExport
  } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Handle custom task completion
  const handleCustomTaskComplete = (taskConfig: any) => {
    const newTask: CustomTask = {
      id: Date.now().toString(),
      taskType: taskConfig.taskType,
      dataInputType: taskConfig.dataInputType,
      data: taskConfig.data,
      useCrawl4AI: taskConfig.useCrawl4AI,
      llmProvider: taskConfig.llmProvider,
      steps: taskConfig.steps,
      formFields: taskConfig.formFields
    };
    setCustomTasks([...customTasks, newTask]);
  };
  
  // Handle removing a custom task
  const handleRemoveTask = (taskId: string) => {
    setCustomTasks(customTasks.filter(task => task.id !== taskId));
  };
  
  // Use messages from current conversation
  const messages = currentConversation?.messages || [];
  
  // Don't group messages - show each browser_step message separately
  const processedMessages = useMemo(() => {
    return messages.map(message => {
      // Check if this is a browser_step message from backend
      if (message.metadata?.type === 'browser_step') {
        return { type: 'browser_step', data: message };
      }
      // Regular message
      return { type: 'message', data: message };
    });
  }, [messages]);

  const [models, setModels] = useState<Array<{value: string, label: string, icon: string, is_free?: boolean}>>([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  // Fetch models from backend
  useEffect(() => {
    const fetchModels = async () => {
      setModelsLoading(true);
      try {
        console.log('Fetching models from /api/models...');
        const response = await fetch('/api/models');
        console.log('Models response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Models endpoint error details:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            body: errorText
          });
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        
        const formattedModels = data.models.map((model: any) => ({
          value: model.id,
          label: model.is_free ? `${model.name} (FREE)` : model.name,
          icon: getProviderIcon(model.provider),
          is_free: model.is_free
        }));
        
        setModels(formattedModels);
        
        // Set default model if none selected
        if (!state.selectedModel && formattedModels.length > 0) {
          setSelectedModel(formattedModels[0].value);
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          type: error?.constructor?.name
        });
        // Fallback models
        setModels([
          { value: 'openai/gpt-4o-mini', label: 'GPT-4 Mini', icon: '⚡' },
          { value: 'openai/gpt-4o', label: 'GPT-4 Optimized', icon: '⚡' },
          { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', icon: '❋' },
        ]);
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, []);

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai': return '⚡';
      case 'anthropic': return '❋';
      case 'google': return '✨';
      case 'meta': return '🦙';
      case 'mistral': case 'mistralai': return '🌬️';
      case 'qwen': return '🔮';
      case 'deepseek': return '🧠';
      default: return '🤖';
    }
  };

  const selectedModel = models.find(m => m.value === state.selectedModel) || models[0] || { value: 'openai/gpt-4o-mini', label: 'GPT-4 Mini', icon: '⚡' };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for browser status updates and add them as chat messages
  useEffect(() => {
    if (browserStatus?.currentAction) {
      const actionMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `🤖 ${browserStatus.currentAction}`,
        sender: 'assistant',
        timestamp: new Date(),
      };
      // Temporarily disabled - should be shown as overlay
      // setMessages(prev => [...prev, actionMessage]);
    }
  }, [browserStatus?.currentAction]);

  // Show task progress
  useEffect(() => {
    if (taskProgress) {
      const progressMessage: ChatMessage = {
        id: 'task-progress',
        content: `📊 ${taskProgress.message} (${taskProgress.current}/${taskProgress.total})`,
        sender: 'assistant',
        timestamp: new Date(),
      };
      // Temporarily disabled - should be shown as overlay
      // setMessages(prev => {
      //   const filtered = prev.filter(m => m.id !== 'task-progress');
      //   return [...filtered, progressMessage];
      // });
    }
  }, [taskProgress]);

  // Show connection status
  useEffect(() => {
    if (!isWelcomeMode) {
      let statusMessage: ChatMessage | null = null;
      
      if (wsConnecting) {
        statusMessage = {
          id: 'ws-status',
          content: '🔄 Connecting to server...',
          sender: 'system',
          timestamp: new Date(),
        };
      } else if (!wsConnected) {
        statusMessage = {
          id: 'ws-status',
          content: '⚠️ Disconnected from server. Reconnecting...',
          sender: 'system',
          timestamp: new Date(),
        };
      } else if (browserStatus?.browserReady === false) {
        statusMessage = {
          id: 'browser-status',
          content: '🌐 Initializing browser...',
          sender: 'system',
          timestamp: new Date(),
        };
      }
      
      if (statusMessage) {
        // Temporarily disabled - should be shown as overlay
        // setMessages(prev => {
        //   const filtered = prev.filter(m => m.id !== 'ws-status' && m.id !== 'browser-status');
        //   return [...filtered, statusMessage];
        // });
      } else {
        // Remove status messages when connected
        // Temporarily disabled
        // setMessages(prev => prev.filter(m => m.id !== 'ws-status' && m.id !== 'browser-status'));
      }
    }
  }, [wsConnected, wsConnecting, isWelcomeMode, browserStatus?.browserReady]);

  // Reset processing state when task completes or errors
  useEffect(() => {
    // Check for task completion messages in the current conversation
    if (currentConversation?.messages.length > 0) {
      const lastMessage = currentConversation.messages[currentConversation.messages.length - 1];
      if (lastMessage.content.includes('Task completed') || 
          lastMessage.content.includes('Error:') || 
          lastMessage.content.includes('Failed')) {
        setIsProcessing(false);
      }
    }
  }, [currentConversation?.messages]);

  const handleSendMessage = () => {
    console.log('🔍 handleSendMessage called - Deep Research Mode:', isDeepResearchMode);
    if ((!inputValue.trim() && customTasks.length === 0) || isProcessing) return;
    
    // Create a new conversation if there isn't one and get the ID
    let conversationId = currentConversation?.id;
    if (!currentConversation) {
      console.log('No current conversation, creating new one');
      conversationId = createNewConversation();
      console.log('Created new conversation with ID:', conversationId);
    }
    
    if (!wsConnected) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: '❌ Cannot send message: Not connected to server',
        sender: 'system',
        timestamp: new Date(),
      };
      addMessageToCurrentConversation(errorMessage, conversationId);
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    console.log('Adding message to conversation:', conversationId);
    addMessageToCurrentConversation(newMessage, conversationId);
    setIsProcessing(true);
    
    // Create a workflow run to trigger the preview
    const workflowRun = {
      id: Date.now().toString(),
      workflowId: 'browser-task',
      status: 'running' as const,
      progress: 0,
      steps: [],
      startTime: new Date(),
    };
    setCurrentWorkflowRun(workflowRun);
    
    // Send task to backend via WebSocket after a small delay to ensure state is updated
    console.log('Sending task to backend, conversation ID:', conversationId);
    setTimeout(() => {
      // Check if we have custom tasks to send
      if (customTasks.length > 0) {
        // Format all custom tasks into a single prompt
        let fullPrompt = '';
        
        // Process each task and combine prompts
        customTasks.forEach((task, index) => {
          if (index > 0) fullPrompt += '\n\n---\n\n';
          fullPrompt += formatCustomTaskPrompt(task, index === 0 ? inputValue : '');
        });
        
        // Send as a regular task with formatted prompt
        sendWebSocketMessage({
          type: 'task',
          data: {
            task: fullPrompt,
            llm_model: state.selectedModel || 'openai/gpt-4o-mini',
            // Include metadata for backend processing
            metadata: {
              isCustomTask: true,
              tasks: customTasks,
              hasCrawl4AI: customTasks.some(t => t.useCrawl4AI),
              openRouterApiKey: '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'
            }
          }
        });
        
        // Clear custom tasks after sending
        setCustomTasks([]);
      } else if (isDeepResearchMode) {
        console.log('🔍 Deep Research Mode Active - Sending research request:', {
          type: 'deep_research',
          data: {
            action: 'start',
            topic: inputValue,
            task_id: `research-${Date.now()}`,
            llm_model: state.selectedModel || 'openai/gpt-4o-mini',
            max_parallel_browsers: 3
          }
        });
        sendWebSocketMessage({
          type: 'deep_research',
          data: {
            action: 'start',
            topic: inputValue,
            task_id: `research-${Date.now()}`,
            llm_model: state.selectedModel || 'openai/gpt-4o-mini',
            max_parallel_browsers: 3
          }
        });
      } else {
        sendWebSocketMessage({
          type: 'task',
          data: {
            task: inputValue,
            llm_model: state.selectedModel || 'openai/gpt-4o-mini'
          }
        });
      }
    }, 100);
    
    setInputValue('');
    
    // The actual AI response will come from the backend via WebSocket
    // No need for hardcoded responses anymore
  };

  return (
    <>
      {isWelcomeMode ? (
      <div className="w-full max-w-4xl mx-auto">
        {/* Welcome Mode Input */}
        <div className="space-y-4">
          {/* Main Input Field */}
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What would you like me to do?"
              className="w-full px-6 py-5 pr-14 text-lg text-gray-900 placeholder-gray-500 bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:shadow-lg focus:shadow-lg focus:border-gray-400 transition-all duration-200 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && customTasks.length === 0) || isProcessing}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-gray-400 hover:text-gray-600 disabled:text-gray-300 transition-all duration-150 hover:scale-110"
            >
              <Send size={24} />
            </button>
          </div>
          
          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Settings Button */}
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-150">
                <Settings size={20} />
              </button>
              
              {/* Model Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md"
                >
                  <span className="text-lg">{selectedModel.icon}</span>
                  <span className="font-medium text-sm">{selectedModel.label}</span>
                  <ChevronDown size={14} className={`transition-transform duration-150 text-gray-400 ${showModelDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showModelDropdown && (
                  <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 min-w-64 max-h-80 overflow-y-auto animate-in slide-in-from-top-2 duration-150">
                    {models.map((model) => (
                      <button
                        key={model.value}
                        onClick={() => {
                          setSelectedModel(model.value as any);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                          model.value === state.selectedModel ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{model.icon}</span>
                        <span className="font-medium">{model.label}</span>
                        {model.value === state.selectedModel && (
                          <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Upload Button */}
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-150">
                <Upload size={16} />
                <span>Upload</span>
              </button>
              
              {/* Custom Task Button */}
              <button 
                onClick={() => setShowCustomTaskWizard(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-150"
              >
                <Plus size={16} />
                <span>Custom Task</span>
              </button>
            </div>
            
            {/* Deep Research Toggle */}
            {onToggleDeepResearch && (
              <button
                onClick={onToggleDeepResearch}
                className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-150 ${
                  isDeepResearchMode
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>🔍</span>
                <span>Deep Research</span>
                {isDeepResearchMode && (
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}
          </div>
          
          {/* Custom Task Blocks */}
          {customTasks.length > 0 && (
            <div className="mt-4 space-y-3">
              {customTasks.map(task => (
                <CustomTaskBlock
                  key={task.id}
                  task={task}
                  onRemove={handleRemoveTask}
                />
              ))}
            </div>
          )}
          
          {/* Data Export Card in Welcome Mode */}
          {dataExport?.available && (
            <div className="mt-4">
              <DataExportCard
                filename={dataExport.filename || 'export.json'}
                itemCount={dataExport.itemCount || 0}
                preview={dataExport.preview}
                onExport={() => {
                  // Download the export file
                  if (dataExport.path) {
                    const link = document.createElement('a');
                    link.href = `/api/download/${dataExport.path}`;
                    link.download = dataExport.filename || 'export.json';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
      ) : (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 scroll-smooth">
          {/* Welcome message for new conversations */}
        {processedMessages.length === 0 && (
          <div className="flex justify-center py-8">
            <div className="text-center max-w-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl font-bold">F</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I help you today?</h3>
              <p className="text-gray-500 text-sm">I can browse the web, fill forms, extract data, and automate tasks for you.</p>
            </div>
          </div>
        )}
        
        {/* Data Export Card */}
        {dataExport?.available && (
          <DataExportCard
            filename={dataExport.filename || 'export.json'}
            itemCount={dataExport.itemCount || 0}
            preview={dataExport.preview}
            onExport={() => {
              // Download the export file
              if (dataExport.path) {
                const link = document.createElement('a');
                link.href = `/api/download/${dataExport.path}`;
                link.download = dataExport.filename || 'export.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
          />
        )}
        
        <div className="space-y-1">
        {processedMessages.map((item, index) => {
          if (item.type === 'browser_step') {
            // Skip rendering individual browser step cards to prevent spam
            // The user will see progress via the collapsible progress card instead
            return null;
          } else {
            const message = item.data;
            const isBrowserAction = message.metadata?.type === 'browser_action';
            const isComplete = message.metadata?.actionType === 'complete';
            
            // Skip rendering browser actions as well - they're shown in the progress card
            if (isBrowserAction) {
              return null;
            }
            
            // Render message with Claude-style design
            if (message.sender === 'user') {
              return (
                <div key={message.id} className="flex justify-end mb-6 animate-in slide-in-from-right duration-300">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="bg-gray-100 rounded-2xl px-5 py-3 text-gray-900 hover:bg-gray-200 transition-colors duration-150">
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">U</span>
                    </div>
                  </div>
                </div>
              );
            } else if (message.sender === 'assistant') {
              return (
                <div key={message.id} className="flex justify-start mb-6 animate-in slide-in-from-left duration-300">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">F</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md transition-shadow duration-150">
                        <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else if (message.sender === 'system') {
              return (
                <div key={message.id} className="flex justify-center mb-4 animate-in fade-in duration-300">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1.5 text-yellow-800 text-sm font-medium">
                    {message.content}
                  </div>
                </div>
              );
            }
            return null;
          }
        })}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input Area */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCustomTaskWizard(true)}
            className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-150"
            title="Create Custom Task"
          >
            <Plus size={20} />
          </button>
          {onToggleDeepResearch && (
            <button
              onClick={onToggleDeepResearch}
              className={`p-2.5 rounded-lg transition-all duration-150 ${
                isDeepResearchMode
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Toggle Deep Research Mode"
            >
              <span className="text-lg">🔍</span>
            </button>
          )}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Send a message"
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-white hover:border-gray-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-150 text-[15px] placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && customTasks.length === 0) || isProcessing}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 transition-colors duration-150"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        
        {/* Custom Task Blocks */}
        {customTasks.length > 0 && (
          <div className="mt-3 space-y-2">
            {customTasks.map(task => (
              <CustomTaskBlock
                key={task.id}
                task={task}
                onRemove={handleRemoveTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
      )}

      {/* Custom Task Wizard */}
      {showCustomTaskWizard && (
        <CustomTaskWizard
          onClose={() => setShowCustomTaskWizard(false)}
          onComplete={(taskConfig) => {
            handleCustomTaskComplete(taskConfig);
            setShowCustomTaskWizard(false);
          }}
        />
      )}
    </>
  );
}
