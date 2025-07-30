import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef, useCallback } from 'react';
import { AppState, ModelType, WorkflowRun, Conversation, ChatMessage } from '../types';
import { LogEntry } from '../components/TerminalLogs';
import { recordToLog } from '../utils/recordToLog';

interface BrowserStatus {
  currentUrl?: string;
  isLoading?: boolean;
  currentAction?: string;
  browserReady?: boolean;
}

interface WebSocketMessage {
  type: string;
  data: any;
}

interface AppContextType {
  state: AppState;
  toggleSidebar: () => void;
  setActiveTab: (tab: 'chat' | 'portal') => void;
  setActivePortalSection: (section: 'uploads' | 'contacts' | 'companies' | 'workflows' | 'agents' | 'settings') => void;
  toggleDarkMode: () => void;
  setSelectedModel: (model: ModelType) => void;
  setCurrentWorkflowRun: (run: WorkflowRun | undefined) => void;
  togglePreview: () => void;
  
  // Conversation management
  createNewConversation: () => string;
  selectConversation: (conversationId: string) => void;
  addMessageToCurrentConversation: (message: ChatMessage, conversationId?: string) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  deleteConversation: (conversationId: string) => void;
  currentConversation: Conversation | undefined;
  
  // WebSocket and browser management
  wsConnected: boolean;
  wsConnecting: boolean;
  browserStatus: BrowserStatus | null;
  taskProgress?: { current: number; total: number; message: string };
  sendWebSocketMessage: (message: WebSocketMessage) => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  
  // Agent logs
  agentLogs: LogEntry[];
  clearAgentLogs: () => void;
  
  // Data export
  dataExport: AppState['dataExport'];
}

type AppAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ACTIVE_TAB'; payload: 'chat' | 'portal' }
  | { type: 'SET_ACTIVE_PORTAL_SECTION'; payload: 'uploads' | 'contacts' | 'companies' | 'workflows' | 'agents' | 'settings' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_SELECTED_MODEL'; payload: string }
  | { type: 'SET_CURRENT_WORKFLOW_RUN'; payload: WorkflowRun | undefined }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_WS_CONNECTED'; payload: boolean }
  | { type: 'SET_WS_CONNECTING'; payload: boolean }
  | { type: 'SET_BROWSER_STATUS'; payload: BrowserStatus | null }
  | { type: 'SET_TASK_PROGRESS'; payload: { current: number; total: number; message: string } | undefined }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'UPDATE_CONVERSATION'; payload: { id: string; conversation: Partial<Conversation> } }
  | { type: 'DELETE_CONVERSATION'; payload: string }
  | { type: 'SET_CURRENT_CONVERSATION_ID'; payload: string | undefined }
  | { type: 'ADD_MESSAGE_TO_CONVERSATION'; payload: { conversationId: string; message: ChatMessage } }
  | { type: 'ADD_AGENT_LOG'; payload: LogEntry }
  | { type: 'CLEAR_AGENT_LOGS' };

// Load conversations from localStorage
const loadConversations = (): Conversation[] => {
  try {
    const saved = localStorage.getItem('fabric_conversations');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: AppState & { wsConnected: boolean; wsConnecting: boolean; browserStatus: BrowserStatus | null; taskProgress?: { current: number; total: number; message: string } } = {
  sidebarCollapsed: false,
  activeTab: 'chat',
  activePortalSection: 'uploads',
  darkMode: false,
  selectedModel: 'openai/gpt-4o-mini',
  currentWorkflowRun: undefined,
  previewVisible: false,
  wsConnected: false,
  wsConnecting: false,
  browserStatus: null,
  taskProgress: undefined,
  conversations: loadConversations(),
  currentConversationId: undefined,
  agentLogs: [],
};

function appReducer(state: typeof initialState, action: AppAction): typeof initialState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_ACTIVE_PORTAL_SECTION':
      return { ...state, activePortalSection: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_SELECTED_MODEL':
      return { ...state, selectedModel: action.payload };
    case 'SET_CURRENT_WORKFLOW_RUN':
      return { ...state, currentWorkflowRun: action.payload, previewVisible: !!action.payload };
    case 'TOGGLE_PREVIEW':
      return { ...state, previewVisible: !state.previewVisible };
    case 'SET_WS_CONNECTED':
      return { ...state, wsConnected: action.payload };
    case 'SET_WS_CONNECTING':
      return { ...state, wsConnecting: action.payload };
    case 'SET_BROWSER_STATUS':
      return { ...state, browserStatus: action.payload };
    case 'SET_TASK_PROGRESS':
      return { ...state, taskProgress: action.payload };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'ADD_CONVERSATION':
      return { ...state, conversations: [...state.conversations, action.payload] };
    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.id
            ? { ...conv, ...action.payload.conversation }
            : conv
        )
      };
    case 'DELETE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.filter(conv => conv.id !== action.payload),
        currentConversationId: state.currentConversationId === action.payload ? undefined : state.currentConversationId
      };
    case 'SET_CURRENT_CONVERSATION_ID':
      return { ...state, currentConversationId: action.payload };
    case 'ADD_MESSAGE_TO_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.conversationId
            ? {
                ...conv,
                messages: [...conv.messages, action.payload.message],
                updatedAt: new Date()
              }
            : conv
        )
      };
    case 'ADD_AGENT_LOG':
      console.log('Adding agent log to state:', action.payload);
      console.log('Current logs count:', state.agentLogs.length);
      return { 
        ...state, 
        agentLogs: [...state.agentLogs, action.payload]
      };
    case 'CLEAR_AGENT_LOGS':
      console.log('Clearing agent logs');
      return { 
        ...state, 
        agentLogs: []
      };
    case 'SET_DATA_EXPORT':
      return { 
        ...state, 
        dataExport: action.payload 
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentConversationIdRef = useRef<string | undefined>(undefined);

  const connectWebSocket = useCallback(() => {
    // Check if already connected or connecting
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }
    
    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log('WebSocket already connecting...');
      return;
    }

    console.log('Starting new WebSocket connection...');
    dispatch({ type: 'SET_WS_CONNECTING', payload: true });
    dispatch({ type: 'SET_WS_CONNECTED', payload: false });
    
    // Use relative WebSocket URL to work with proxy
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    console.log('WebSocket URL:', wsUrl);
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      dispatch({ type: 'SET_WS_CONNECTED', payload: true });
      dispatch({ type: 'SET_WS_CONNECTING', payload: false });
      
      // Clear any reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Send hello message
      ws.send(JSON.stringify({ type: 'hello' }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WebSocket message type:', message.type);
        console.log('WebSocket message:', message);
        console.log('Current conversation ID in ref:', currentConversationIdRef.current);
        console.log('Current agentLogs count:', state.agentLogs.length);
        
        switch (message.type) {
          case 'ack':
            console.log('WebSocket handshake completed - received ack');
            break;
          case 'task_started':
            // Clear logs when a new task starts
            dispatch({ type: 'CLEAR_AGENT_LOGS' });
            
            dispatch({ 
              type: 'SET_BROWSER_STATUS', 
              payload: {
                isLoading: true,
                currentAction: message.data.message,
                browserReady: true
              }
            });
            break;
          case 'action':
            dispatch({ 
              type: 'SET_BROWSER_STATUS', 
              payload: {
                currentAction: message.data.action,
                isLoading: true
              }
            });
            break;
          case 'browser_action':
            console.log('Received browser_action:', message);
            // Add browser action as a chat message
            const actionMessage: ChatMessage = {
              id: `action-${message.data.sequence}-${Date.now()}`,
              content: message.data.description,
              sender: 'assistant',
              timestamp: new Date(message.data.timestamp),
              metadata: {
                type: 'browser_action',
                actionType: message.data.action_type,
                sequence: message.data.sequence
              }
            };
            
            // Add to current conversation if exists
            console.log('Browser action received, current conversation ID:', currentConversationIdRef.current);
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: { 
                  conversationId: currentConversationIdRef.current, 
                  message: actionMessage 
                }
              });
            } else {
              console.warn('No current conversation ID to add browser action to');
            }
            
            // Also add to agent logs for terminal display
            const actionLog: LogEntry = {
              id: `log-${Date.now()}-${Math.random()}`,
              timestamp: new Date(message.data.timestamp),
              level: 'action' as const,
              message: message.data.description || 'Browser action',
              metadata: {
                type: 'browser_action',
                actionType: message.data.action_type,
                element: message.data.element,
                value: message.data.value
              }
            };
            dispatch({ type: 'ADD_AGENT_LOG', payload: actionLog });
            
            // Also update browser status
            dispatch({ 
              type: 'SET_BROWSER_STATUS', 
              payload: {
                currentAction: message.data.description,
                isLoading: true,
                browserReady: true
              }
            });
            break;
          case 'task_complete':
            // Add completion message to chat
            const completionMessage: ChatMessage = {
              id: `complete-${Date.now()}`,
              content: message.data.summary || '✅ Task completed successfully',
              sender: 'assistant',
              timestamp: new Date(),
              metadata: {
                type: 'browser_action',
                actionType: 'complete'
              }
            };
            
            // Add to current conversation if exists
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: {
                  conversationId: currentConversationIdRef.current,
                  message: completionMessage
                }
              });
            }
            
            // Log task completion
            console.log('Task completed');
            
            // Don't automatically switch to portal tab - let user stay in chat
            // dispatch({ type: 'SET_ACTIVE_TAB', payload: 'portal' });
            
            dispatch({
              type: 'SET_BROWSER_STATUS',
              payload: {
                isLoading: false,
                browserReady: true,  // Keep browser ready state
                currentAction: 'Task completed - browser remains open'
              }
            });
            break;
            
          case 'task_cancelled':
            // Add cancellation message to chat
            const cancelMessage: ChatMessage = {
              id: `cancelled-${Date.now()}`,
              content: '⛔ Task was cancelled by user',
              sender: 'system',
              timestamp: new Date(),
              metadata: {
                type: 'browser_action',
                actionType: 'cancelled'
              }
            };
            
            // Add to current conversation if exists
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: { 
                  conversationId: currentConversationIdRef.current, 
                  message: cancelMessage 
                }
              });
            }
            
            dispatch({ 
              type: 'SET_BROWSER_STATUS', 
              payload: {
                isLoading: false,
                browserReady: true,
                currentAction: 'Task cancelled - browser remains open'
              }
            });
            break;
            
          case 'task_error':
            dispatch({ 
              type: 'SET_BROWSER_STATUS', 
              payload: {
                isLoading: false,
                browserReady: true,  // Keep browser ready even on error
                currentAction: `Error: ${message.data.error}`
              }
            });
            break;
          case 'status_update':
            dispatch({ 
              type: 'SET_BROWSER_STATUS', 
              payload: message.data
            });
            break;
          case 'task_progress':
            dispatch({ 
              type: 'SET_TASK_PROGRESS', 
              payload: message.data
            });
            break;
          case 'browser_closed':
            dispatch({ 
              type: 'SET_BROWSER_STATUS', 
              payload: {
                isLoading: false,
                browserReady: false,
                currentAction: null
              }
            });
            // Clear logs when browser closes
            dispatch({ type: 'CLEAR_AGENT_LOGS' });
            break;
          case 'agent_log':
            console.log('Received agent_log:', message);
            const logEntry: LogEntry = {
              id: `log-${Date.now()}-${Math.random()}`,
              timestamp: new Date(message.data.timestamp || Date.now()),
              level: message.data.level || 'info',
              message: message.data.message
            };
            dispatch({ 
              type: 'ADD_AGENT_LOG', 
              payload: logEntry
            });
            break;
          case 'browser_thought':
            console.log('Received browser_thought:', message);
            const thoughtLog: LogEntry = {
              id: `log-${Date.now()}-${Math.random()}`,
              timestamp: new Date(message.data.timestamp),
              level: 'thought' as const,
              message: 'Agent thinking...',
              metadata: {
                type: 'browser_thought',
                thought: message.data.thought
              }
            };
            dispatch({ type: 'ADD_AGENT_LOG', payload: thoughtLog });
            break;
          case 'browser_summary':
            console.log('Received browser_summary:', message);
            const summaryLog: LogEntry = {
              id: `log-${Date.now()}-${Math.random()}`,
              timestamp: new Date(message.data.timestamp),
              level: 'info' as const,
              message: `Task completed: ${message.data.task}`,
              metadata: {
                type: 'browser_summary',
                totalActions: message.data.total_actions,
                task: message.data.task
              }
            };
            dispatch({ type: 'ADD_AGENT_LOG', payload: summaryLog });
            break;
          
          case 'browser_step':
            console.log('Received browser_step:', message);
            // Add browser step as a chat message with detailed content
            const stepMessage: ChatMessage = {
              id: `step-${message.data.stepNumber}-${Date.now()}`,
              content: `Browser Step ${message.data.stepNumber}`,
              sender: 'assistant',
              timestamp: new Date(message.data.timestamp || Date.now()),
              metadata: {
                type: 'browser_step',
                stepNumber: message.data.stepNumber,
                status: message.data.status || 'in_progress',
                content: message.data.content || {},
                actionDetails: message.data.actionDetails
              }
            };
            
            // Add to current conversation if exists
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: { 
                  conversationId: currentConversationIdRef.current, 
                  message: stepMessage 
                }
              });
            }
            break;
          
          // New chat agent message types
          case 'assistant_thinking':
            console.log('Assistant thinking:', message);
            const thinkingMessage: ChatMessage = {
              id: `thinking-${Date.now()}`,
              content: message.data.message,
              sender: 'assistant',
              timestamp: new Date(message.data.timestamp)
            };
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: { 
                  conversationId: currentConversationIdRef.current, 
                  message: thinkingMessage 
                }
              });
            }
            break;
            
          case 'assistant_message_chunk':
            // Handle streaming response chunks
            console.log('Assistant chunk:', message.data.content);
            // TODO: Implement streaming message updates
            break;
            
          case 'assistant_message_complete':
            console.log('Assistant complete:', message);
            const completeMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              content: message.data.full_response,
              sender: 'assistant',
              timestamp: new Date(message.data.timestamp)
            };
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: { 
                  conversationId: currentConversationIdRef.current, 
                  message: completeMessage 
                }
              });
            }
            break;
            
          // Deep research message types
          case 'research.plan_created':
          case 'research.task_started':
          case 'research.task_progress':
          case 'research.task_completed':
          case 'research.report_ready':
            console.log('Research message:', message.type, message.data);
            // Dispatch a custom event that ChatView can listen to
            window.dispatchEvent(new CustomEvent('ws-message', { detail: message }));
            break;
            
          case 'browser_task_started':
            console.log('Browser task started:', message);
            const taskStartLog: LogEntry = {
              id: `log-${Date.now()}-${Math.random()}`,
              timestamp: new Date(message.data.timestamp),
              level: 'info' as const,
              message: `Starting browser task: ${message.data.task}`
            };
            dispatch({ type: 'ADD_AGENT_LOG', payload: taskStartLog });
            
            // Set browser status to show preview
            dispatch({ 
              type: 'SET_BROWSER_STATUS', 
              payload: {
                isLoading: true,
                currentAction: message.data.task || 'Starting browser automation...',
                browserReady: true
              }
            });
            
            // Show preview when browser task starts
            if (!state.previewVisible) {
              dispatch({ type: 'TOGGLE_PREVIEW' });
            }
            break;
            
          case 'browser_task_summary':
            console.log('Browser task summary:', message);
            const taskSummaryMessage: ChatMessage = {
              id: `summary-${Date.now()}`,
              content: message.data.summary,
              sender: 'assistant',
              timestamp: new Date(message.data.timestamp)
            };
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: { 
                  conversationId: currentConversationIdRef.current, 
                  message: taskSummaryMessage 
                }
              });
            }
            break;
            
          case 'browser_task_error':
            console.log('Browser task error:', message);
            const errorMessage: ChatMessage = {
              id: `error-${Date.now()}`,
              content: `Browser task error: ${message.data.error}`,
              sender: 'system',
              timestamp: new Date(message.data.timestamp)
            };
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: { 
                  conversationId: currentConversationIdRef.current, 
                  message: errorMessage 
                }
              });
            }
            break;
            
          case 'assistant_error':
            console.log('Assistant error:', message);
            const assistantErrorMessage: ChatMessage = {
              id: `assistant-error-${Date.now()}`,
              content: `Error: ${message.data.error}`,
              sender: 'system',
              timestamp: new Date(message.data.timestamp)
            };
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: { 
                  conversationId: currentConversationIdRef.current, 
                  message: assistantErrorMessage 
                }
              });
            }
            break;
            
          case 'step_record':
            console.log('Received step_record:', message);
            // Use recordToLog to convert step record to LogEntry
            const stepActionLog = recordToLog(message.data);
            console.log('Converted to LogEntry:', stepActionLog);
            dispatch({ type: 'ADD_AGENT_LOG', payload: stepActionLog });
            
            // Also add as chat message if it's a significant action
            const stepData = message.data;
            if (stepData.action !== 'wait' && stepData.action !== 'screenshot') {
              const stepMessage: ChatMessage = {
                id: `step-msg-${stepData.index}`,
                content: `🤖 ${stepData.action.toUpperCase()}: ${stepData.args?.text || stepData.args?.url || stepData.args?.selector || 'completed'}`,
                sender: 'system',
                timestamp: new Date(stepData.created_at),
                metadata: {
                  type: 'browser_action',
                  actionType: stepData.action,
                  sequence: stepData.index
                }
              };
              if (currentConversationIdRef.current) {
                dispatch({
                  type: 'ADD_MESSAGE_TO_CONVERSATION',
                  payload: { 
                    conversationId: currentConversationIdRef.current, 
                    message: stepMessage 
                  }
                });
              }
            }
            break;
            
          // Custom task message types
          case 'custom_task_complete':
            console.log('Custom task complete:', message);
            
            // Set data export availability if data was collected
            if (message.data.dataCollected > 0) {
              dispatch({
                type: 'SET_DATA_EXPORT',
                payload: {
                  available: true,
                  filename: message.data.exportFilename,
                  itemCount: message.data.dataCollected,
                  path: message.data.exportPath
                }
              });
            }
            
            // Add completion message
            const customTaskCompleteMsg: ChatMessage = {
              id: `custom-complete-${Date.now()}`,
              content: message.data.message || 'Custom task completed successfully',
              sender: 'assistant',
              timestamp: new Date()
            };
            
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: { 
                  conversationId: currentConversationIdRef.current, 
                  message: customTaskCompleteMsg 
                }
              });
            }
            break;
            
          case 'data_export_ready':
            console.log('Data export ready:', message);
            
            // Update data export state with preview
            dispatch({
              type: 'SET_DATA_EXPORT',
              payload: {
                available: true,
                filename: message.data.filename,
                itemCount: message.data.preview?.length || 0,
                preview: message.data.preview,
                path: message.data.filename
              }
            });
            break;
          
          case 'data_extracted':
            console.log('Data extracted:', message);
            
            // Add data extraction notification to logs
            const extractionLog: LogEntry = {
              id: `log-${Date.now()}-${Math.random()}`,
              timestamp: new Date().toISOString(),
              message: message.data.message || 'Data extracted',
              level: 'info',
              source: 'system'
            };
            
            dispatch({ type: 'ADD_AGENT_LOG', payload: extractionLog });
            
            // Dispatch custom event for DataExtractionPanel
            window.dispatchEvent(new CustomEvent('data-extracted', { 
              detail: {
                session_id: message.data.session_id,
                files: message.data.files
              }
            }));
            break;
          
          case 'extraction_logged':
            console.log('Extraction logged:', message);
            // Just log this for now - the DataExtractionPanel will handle updates
            break;
            
          case 'crawl4ai_progress':
            console.log('Crawl4AI progress:', message);
            
            // Add progress message
            const crawlProgressMsg: ChatMessage = {
              id: `crawl-progress-${Date.now()}`,
              content: `📊 ${message.data.message}`,
              sender: 'system',
              timestamp: new Date()
            };
            
            if (currentConversationIdRef.current) {
              dispatch({
                type: 'ADD_MESSAGE_TO_CONVERSATION',
                payload: { 
                  conversationId: currentConversationIdRef.current, 
                  message: crawlProgressMsg 
                }
              });
            }
            break;
            
          case 'file_created':
            console.log('File created:', message);
            
            // Dispatch event for DataExtractionPanel to update
            window.dispatchEvent(new CustomEvent('ws-message', { 
              detail: message 
            }));
            
            // Also dispatch as data-extracted for compatibility
            if (message.data?.session_id) {
              window.dispatchEvent(new CustomEvent('data-extracted', { 
                detail: {
                  session_id: message.data.session_id,
                  files: [message.data]
                }
              }));
            }
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.error('WebSocket readyState:', ws.readyState);
        console.error('WebSocket URL:', ws.url);
        dispatch({ type: 'SET_WS_CONNECTED', payload: false });
        dispatch({ type: 'SET_WS_CONNECTING', payload: false });
        
        // Clear the websocket reference on error
        if (wsRef.current === ws) {
          wsRef.current = null;
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected', { code: event.code, reason: event.reason });
        dispatch({ type: 'SET_WS_CONNECTED', payload: false });
        dispatch({ type: 'SET_WS_CONNECTING', payload: false });
        
        // Clear the websocket reference
        if (wsRef.current === ws) {
          wsRef.current = null;
        }
        
        // Only attempt to reconnect if it wasn't a clean close and we're not already reconnecting
        if (event.code !== 1000 && event.code !== 1001 && !reconnectTimeoutRef.current) {
          console.log('Scheduling reconnection in 3 seconds...');
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            console.log('Reconnecting WebSocket...');
            connectWebSocket();
          }, 3000);
        }
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      dispatch({ type: 'SET_WS_CONNECTED', payload: false });
      dispatch({ type: 'SET_WS_CONNECTING', payload: false });
      wsRef.current = null;
    }
  }, []);

  const disconnectWebSocket = useCallback(() => {
    console.log('Disconnecting WebSocket...');
    
    // Clear any reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Close the WebSocket if it exists
    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null; // Clear reference first
      
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1000, 'Component unmounting');
      }
    }
    
    // Update state
    dispatch({ type: 'SET_WS_CONNECTED', payload: false });
    dispatch({ type: 'SET_WS_CONNECTING', payload: false });
  }, []);

  const sendWebSocketMessage = useCallback((message: WebSocketMessage) => {
    console.log('Attempting to send WebSocket message:', message.type);
    
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected!', {
        exists: !!wsRef.current,
        state: wsRef.current?.readyState,
        stateString: wsRef.current ? ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][wsRef.current.readyState] : 'NO_SOCKET'
      });
      
      // Try to reconnect
      connectWebSocket();
      
      // Retry sending after a delay
      const retryCount = 3;
      let retries = 0;
      
      const retrySend = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          console.log('WebSocket connected, sending message now');
          wsRef.current.send(JSON.stringify(message));
        } else if (retries < retryCount) {
          retries++;
          console.log(`Retrying send (${retries}/${retryCount})...`);
          setTimeout(retrySend, 1000);
        } else {
          console.error('Failed to send message after multiple retries');
          // Notify user
          dispatch({
            type: 'ADD_MESSAGE_TO_CONVERSATION',
            payload: {
              conversationId: currentConversationIdRef.current || '',
              message: {
                id: Date.now().toString(),
                content: '❌ Failed to connect to server. Please refresh the page and try again.',
                sender: 'system',
                timestamp: new Date()
              }
            }
          });
        }
      };
      
      setTimeout(retrySend, 500);
    } else {
      console.log('WebSocket connected, sending message');
      wsRef.current.send(JSON.stringify(message));
    }
  }, [connectWebSocket, dispatch, currentConversationIdRef]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fabric_conversations', JSON.stringify(state.conversations));
  }, [state.conversations]);

  // Update the ref whenever currentConversationId changes
  useEffect(() => {
    currentConversationIdRef.current = state.currentConversationId;
    console.log('Updated currentConversationIdRef to:', state.currentConversationId);
  }, [state.currentConversationId]);

  // Connect WebSocket on mount
  useEffect(() => {
    let isCleanedUp = false;
    
    // Connect immediately
    console.log('AppContext mounted, connecting WebSocket...');
    connectWebSocket();
    
    // Set up periodic connection check
    const connectionCheckInterval = setInterval(() => {
      if (!isCleanedUp && (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)) {
        console.log('WebSocket not connected, attempting to reconnect...');
        connectWebSocket();
      }
    }, 5000); // Check every 5 seconds
    
    // Cleanup function
    return () => {
      isCleanedUp = true;
      clearInterval(connectionCheckInterval);
      console.log('AppContext unmounting, cleaning up...');
      disconnectWebSocket();
    };
  }, []); // Empty deps to run only once on mount/unmount

  // Conversation management methods
  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log('Creating new conversation with ID:', newConversation.id);
    dispatch({ type: 'ADD_CONVERSATION', payload: newConversation });
    dispatch({ type: 'SET_CURRENT_CONVERSATION_ID', payload: newConversation.id });
    // Clear browser status when starting new conversation
    dispatch({ type: 'SET_BROWSER_STATUS', payload: null });
    return newConversation.id;
  }, []);

  const selectConversation = useCallback((conversationId: string) => {
    dispatch({ type: 'SET_CURRENT_CONVERSATION_ID', payload: conversationId });
  }, []);

  const addMessageToCurrentConversation = useCallback((message: ChatMessage, conversationId?: string) => {
    const targetConversationId = conversationId || state.currentConversationId;
    console.log('Adding message to conversation:', targetConversationId, 'Message:', message.content);
    
    if (targetConversationId) {
      dispatch({
        type: 'ADD_MESSAGE_TO_CONVERSATION',
        payload: { conversationId: targetConversationId, message }
      });
      
      // Auto-update title based on first user message
      const currentConv = state.conversations.find(c => c.id === targetConversationId);
      if (currentConv && currentConv.messages.length === 0 && message.sender === 'user') {
        const title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
        dispatch({
          type: 'UPDATE_CONVERSATION',
          payload: { id: targetConversationId, conversation: { title } }
        });
      }
    } else {
      console.warn('No conversation ID provided to add message to');
    }
  }, [state.currentConversationId, state.conversations]);

  const updateConversationTitle = useCallback((conversationId: string, title: string) => {
    dispatch({
      type: 'UPDATE_CONVERSATION',
      payload: { id: conversationId, conversation: { title } }
    });
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    dispatch({ type: 'DELETE_CONVERSATION', payload: conversationId });
  }, []);

  const currentConversation = state.conversations.find(c => c.id === state.currentConversationId);

  const contextValue: AppContextType = {
    state,
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    setActiveTab: (tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
    setActivePortalSection: (section) => dispatch({ type: 'SET_ACTIVE_PORTAL_SECTION', payload: section }),
    toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
    setSelectedModel: (model) => dispatch({ type: 'SET_SELECTED_MODEL', payload: model }),
    setCurrentWorkflowRun: (run) => dispatch({ type: 'SET_CURRENT_WORKFLOW_RUN', payload: run }),
    togglePreview: () => dispatch({ type: 'TOGGLE_PREVIEW' }),
    
    // Conversation management
    createNewConversation,
    selectConversation,
    addMessageToCurrentConversation,
    updateConversationTitle,
    deleteConversation,
    currentConversation,
    
    // WebSocket methods
    wsConnected: state.wsConnected,
    wsConnecting: state.wsConnecting,
    browserStatus: state.browserStatus,
    taskProgress: state.taskProgress,
    sendWebSocketMessage,
    connectWebSocket,
    disconnectWebSocket,
    
    // Agent logs
    agentLogs: state.agentLogs,
    clearAgentLogs: () => dispatch({ type: 'CLEAR_AGENT_LOGS' }),
    
    // Data export
    dataExport: state.dataExport,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Export new hook for easier access to context
export function useAppContext() {
  return useApp();
}