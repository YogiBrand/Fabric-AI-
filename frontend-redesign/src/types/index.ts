export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  workflowId?: string;
  metadata?: {
    type?: 'browser_action';
    actionType?: string;
    sequence?: number;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  fields: WorkflowField[];
  estimatedTime?: string;
}

export interface WorkflowField {
  name: string;
  label: string;
  type: 'text' | 'url' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  steps: WorkflowStep[];
  startTime: Date;
  endTime?: Date;
  previewUrl?: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  logs: string[];
  timestamp: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  title?: string;
  phone?: string;
  status: 'active' | 'inactive';
  tags: string[];
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  status: 'prospect' | 'contacted' | 'qualified' | 'customer';
  contacts: Contact[];
  notes: string;
  createdAt: Date;
}

export interface Upload {
  id: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'processing' | 'completed' | 'failed';
  url?: string;
}

export type ModelType = string;

export interface AppState {
  sidebarCollapsed: boolean;
  activeTab: 'chat' | 'portal';
  activePortalSection: 'uploads' | 'contacts' | 'companies' | 'workflows' | 'agents' | 'settings';
  darkMode: boolean;
  selectedModel: string;
  currentWorkflowRun?: WorkflowRun;
  previewVisible: boolean;
  conversations: Conversation[];
  currentConversationId?: string;
  agentLogs: any[]; // Using any[] to match LogEntry[] from TerminalLogs component
  dataExport: {
    available: boolean;
    filename?: string;
    itemCount?: number;
    preview?: any[];
    path?: string;
  } | null;
}

export interface DataUpload {
  id: string;
  filename: string;
  type: 'contacts' | 'companies';
  recordCount: number;
  uploadedAt: Date;
  status: 'uploaded' | 'processing' | 'enriched';
  columns: string[];
  mappedFields: Record<string, string>;
}

export interface EnrichmentAgent {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface EnrichmentField {
  id: string;
  label: string;
  description: string;
  category: 'basic' | 'contact' | 'social' | 'financial' | 'technology';
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  handle: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  instructions?: string;
  knowledge?: AgentKnowledge[];
}

export interface AgentKnowledge {
  id: string;
  type: 'file' | 'url' | 'text';
  name: string;
  content?: string;
  url?: string;
  filename?: string;
  size?: number;
  uploadedAt: Date;
}

export interface WorkflowStep {
  id: string;
  type: 'search_web' | 'enrich_data' | 'send_email' | 'draft_email' | 'create_message' | 'use_chatgpt';
  title: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  createdAt: Date;
}

export interface StepRecord {
  index: number;
  action: string;
  args: Record<string, any>;
  status: 'ok' | 'error';
  duration_ms: number;
  url?: string;
  screenshot_b64?: string;
  created_at: string;
  error_message?: string;
}