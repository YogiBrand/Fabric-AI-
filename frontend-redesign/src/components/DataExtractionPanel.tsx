import React, { useState, useEffect } from 'react';
import { Download, FileText, FileJson, File, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface ExtractedFile {
  name: string;
  path: string;
  size: number;
  modified: string;
  type: string;
  category?: string;
  relative_path?: string;
}

interface ExtractionSession {
  session_id: string;
  files: ExtractedFile[];
  total: number;
}

interface DataExtractionPanelProps {
  className?: string;
}

export function DataExtractionPanel({ className = '' }: DataExtractionPanelProps) {
  const { state } = useAppContext();
  const [sessions, setSessions] = useState<Map<string, ExtractionSession>>(new Map());
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingFile, setProcessingFile] = useState<string | null>(null);

  // Listen for extraction events
  useEffect(() => {
    const handleExtractionEvent = (event: CustomEvent) => {
      console.log('DataExtractionPanel received event:', event.detail);
      if (event.detail && event.detail.session_id) {
        const { session_id } = event.detail;
        loadSessionFiles(session_id);
      }
    };

    // Listen for data extraction events
    window.addEventListener('data-extracted', handleExtractionEvent as any);
    
    // Also listen for task started events to track session
    const handleTaskStarted = (event: CustomEvent) => {
      const message = event.detail;
      if (message.type === 'task_started' && message.data?.session_id) {
        setSelectedSession(message.data.session_id);
      }
    };
    
    // Listen for file created events from browser-use sync
    const handleFileCreated = (event: CustomEvent) => {
      const message = event.detail;
      if (message.type === 'file_created' && message.data?.session_id) {
        console.log('File created:', message.data);
        // Reload files for the session
        loadSessionFiles(message.data.session_id);
      }
    };
    
    window.addEventListener('ws-message', handleTaskStarted as any);
    window.addEventListener('ws-message', handleFileCreated as any);

    return () => {
      window.removeEventListener('data-extracted', handleExtractionEvent as any);
      window.removeEventListener('ws-message', handleTaskStarted as any);
      window.removeEventListener('ws-message', handleFileCreated as any);
    };
  }, []);

  const loadSessionFiles = async (sessionId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agent-data/${sessionId}/files`);
      if (response.ok) {
        const data = await response.json();
        setSessions(prev => new Map(prev).set(sessionId, data));
        if (!selectedSession) {
          setSelectedSession(sessionId);
        }
      }
    } catch (error) {
      console.error('Error loading session files:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (sessionId: string, fileName: string, category?: string, relativePath?: string) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (relativePath) params.append('relative_path', relativePath);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const response = await fetch(`/api/agent-data/${sessionId}/download/${encodeURIComponent(fileName)}${queryString}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const processFile = async (sessionId: string, fileName: string, outputFormat: string) => {
    try {
      setProcessingFile(fileName);
      const response = await fetch('/api/agent-data/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          input_file: fileName,
          output_format: outputFormat,
          clean_data: true,
          remove_duplicates: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Reload files to show the processed version
        await loadSessionFiles(sessionId);
      }
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setProcessingFile(null);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case '.json':
        return <FileJson className="w-4 h-4 text-blue-500" />;
      case '.csv':
        return <FileText className="w-4 h-4 text-green-500" />;
      case '.md':
        return <File className="w-4 h-4 text-purple-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const currentSession = selectedSession ? sessions.get(selectedSession) : null;

  if (sessions.size === 0) {
    return (
      <div className={`bg-white rounded-lg shadow flex flex-col ${className}`}>
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Data Extraction</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No extraction sessions found</p>
            <p className="text-sm mt-2">Data will appear here when agents extract information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow flex flex-col overflow-hidden ${className}`}>
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Data Extraction</h3>
          <button
            onClick={() => selectedSession && loadSessionFiles(selectedSession)}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {sessions.size > 1 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session
            </label>
            <select
              value={selectedSession || ''}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from(sessions.entries()).map(([id, session]) => (
                <option key={id} value={id}>
                  {id.slice(0, 8)} - {session.total} files
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {currentSession && (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-4 space-y-3">
            {currentSession.files.map((file) => (
              <div
                key={file.path}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.modified).toLocaleString()}
                      {file.category && ` • ${file.category}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Process options for raw files */}
                  {file.category === 'raw' && (
                    <>
                      <button
                        onClick={() => processFile(selectedSession, file.name, 'json')}
                        disabled={processingFile === file.name}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                        title="Process as JSON"
                      >
                        {processingFile === file.name ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'JSON'
                        )}
                      </button>
                      <button
                        onClick={() => processFile(selectedSession, file.name, 'csv')}
                        disabled={processingFile === file.name}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                        title="Process as CSV"
                      >
                        CSV
                      </button>
                    </>
                  )}

                  {/* Download button */}
                  <button
                    onClick={() => downloadFile(selectedSession, file.name, file.category, file.relative_path)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {currentSession.total === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No files extracted in this session</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}