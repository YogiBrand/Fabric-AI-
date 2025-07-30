import { LogEntry } from '../components/TerminalLogs';

// Simple ID generator without external dependencies
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function recordToLog(r: any): LogEntry {
  return {
    id: generateId(),
    timestamp: new Date(r.created_at),            // ISO → Date
    level: r.status === 'error' ? 'error' : 'action',
    message: `${r.action} (${r.duration_ms} ms)`,
    metadata: {
      type: 'browser_action',
      actionType: r.action,
      element: r.args?.selector ?? '',
      value: r.args?.text ?? ''
    }
  };
}