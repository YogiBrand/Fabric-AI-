import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Terminal, ArrowDown } from 'lucide-react';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug' | 'action' | 'thought';
  message: string;
  metadata?: {
    type?: 'browser_action' | 'browser_thought' | 'browser_summary';
    actionType?: string;
    element?: string;
    value?: string;
    thought?: string;
    totalActions?: number;
    task?: string;
  };
}

interface TerminalLogsProps {
  logs: LogEntry[];
  className?: string;
}

export function TerminalLogs({ logs, className = '' }: TerminalLogsProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  
  // Clean implementation - debug logs removed

  // Check if user is at the bottom of the scroll area
  const checkIfAtBottom = useCallback(() => {
    if (!scrollContainerRef.current) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const threshold = 100; // Consider "at bottom" if within 100px of bottom
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Handle scroll events to detect manual scrolling
  const handleScroll = useCallback(() => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
    setShowScrollToBottom(!atBottom);
  }, [checkIfAtBottom]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    const scrollBehavior = logs.length > 500 ? 'instant' : 'smooth';
    logsEndRef.current?.scrollIntoView({ behavior: scrollBehavior as ScrollBehavior });
    setIsAtBottom(true);
    setShowScrollToBottom(false);
  }, [logs.length]);

  // Smart auto-scroll: only scroll when user is already at bottom
  useEffect(() => {
    if (isAtBottom) {
      const scrollBehavior = logs.length > 500 ? 'instant' : 'smooth';
      logsEndRef.current?.scrollIntoView({ behavior: scrollBehavior as ScrollBehavior });
    }
  }, [logs, isAtBottom]);

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'debug':
        return 'text-gray-400';
      case 'action':
        return 'text-blue-400';
      case 'thought':
        return 'text-purple-400';
      default:
        return 'text-green-400';
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  return (
    <div className={`bg-gray-900 text-gray-100 rounded-lg overflow-hidden flex flex-col ${className} relative`}>
      {/* Terminal Header */}
      <div className="flex-shrink-0 bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-gray-400" />
          <span className="text-sm font-medium">Agent Logs ({logs.length})</span>
          {!isAtBottom && (
            <span className="ml-2 px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30">
              Paused
            </span>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 min-h-0 p-4 font-mono text-xs overflow-y-auto terminal-scrollbar"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Waiting for agent activity...
          </div>
        ) : (
          <>
            {logs.map((log) => {
              // Special formatting for browser actions
              if (log.metadata?.type === 'browser_action') {
                return (
                  <div key={log.id} className="mb-2 break-all bg-blue-900/20 p-2 rounded">
                    <div className="flex items-start">
                      <span className="text-gray-500">[{formatTimestamp(log.timestamp)}]</span>
                      <span className="ml-2 text-blue-400">🤖 ACTION</span>
                      <span className="ml-2 text-blue-300">{log.metadata.actionType?.toUpperCase()}</span>
                    </div>
                    {log.metadata.element && (
                      <div className="ml-4 text-gray-400 text-xs mt-1">
                        Element: {log.metadata.element}
                      </div>
                    )}
                    {log.metadata.value && (
                      <div className="ml-4 text-gray-400 text-xs">
                        Value: {log.metadata.value}
                      </div>
                    )}
                  </div>
                );
              }
              
              // Special formatting for browser thoughts
              if (log.metadata?.type === 'browser_thought') {
                return (
                  <div key={log.id} className="mb-2 break-all bg-purple-900/20 p-2 rounded">
                    <div className="flex items-start">
                      <span className="text-gray-500">[{formatTimestamp(log.timestamp)}]</span>
                      <span className="ml-2 text-purple-400">💭 THOUGHT</span>
                    </div>
                    <div className="ml-4 text-gray-300 text-xs mt-1">
                      {log.metadata.thought || log.message}
                    </div>
                  </div>
                );
              }
              
              // Special formatting for browser summary
              if (log.metadata?.type === 'browser_summary') {
                return (
                  <div key={log.id} className="mb-2 break-all bg-green-900/20 p-2 rounded">
                    <div className="flex items-start">
                      <span className="text-gray-500">[{formatTimestamp(log.timestamp)}]</span>
                      <span className="ml-2 text-green-400">📊 SUMMARY</span>
                    </div>
                    <div className="ml-4 text-gray-300 text-xs mt-1">
                      Task: {log.metadata.task} - Total Actions: {log.metadata.totalActions}
                    </div>
                  </div>
                );
              }
              
              // Default formatting
              return (
                <div key={log.id} className="mb-1 break-all">
                  <span className="text-gray-500">[{formatTimestamp(log.timestamp)}]</span>
                  <span className={`ml-2 ${getLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="ml-2 text-gray-200">{log.message}</span>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 animate-in slide-in-from-bottom-2 fade-in"
          title="Scroll to bottom"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  );
}