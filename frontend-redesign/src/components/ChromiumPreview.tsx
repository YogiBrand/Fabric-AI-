import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Maximize2, Minimize2, RotateCcw, Pause, Play, Square } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface ChromiumPreviewProps {
  url?: string;
  className?: string;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
}

export function ChromiumPreview({ 
  url = 'about:blank', 
  className = '',
  onPause,
  onResume,
  onStop
}: ChromiumPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { browserStatus } = useAppContext();

  // VNC connection URL - connect directly to VNC server
  const vncUrl = `http://localhost:6080/vnc.html?autoconnect=true&resize=scale`;
  const externalVncUrl = `http://localhost:6080/vnc.html?autoconnect=true&resize=scale`;

  useEffect(() => {
    // Check VNC connection status
    const checkConnection = async () => {
      try {
        // Since VNC is on a different port, we can't check it due to CORS
        // Assume it's connected if we reach this point
        setIsConnected(true);
        setIsLoading(false);
      } catch (error) {
        setIsConnected(false);
        setIsLoading(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setIsPaused(false);
    onResume?.();
  };

  const handleStop = () => {
    onStop?.();
  };

  const handleFullscreen = () => {
    if (!isFullscreen && iframeRef.current) {
      iframeRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col ${className}`}>
      {/* Browser Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          {/* Traffic Light Buttons */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="w-3 h-3 bg-green-400 rounded-full" />
          </div>
          
          {/* URL Bar */}
          <div className="ml-4 flex-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-600 max-w-md">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              <span className="truncate">{browserStatus?.currentUrl || url}</span>
            </div>
          </div>
          
          {/* Agent Control Indicator */}
          {browserStatus?.isLoading && (
            <div className="ml-3 flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Agent controlling browser</span>
            </div>
          )}
        </div>
        
        {/* Browser Controls */}
        <div className="flex items-center gap-1">
          {/* Task Control Buttons */}
          <div className="flex items-center gap-1.5 mr-3 px-3 border-r border-gray-200">
            {!isPaused ? (
              <button
                title="Pause"
                onClick={handlePause}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-all duration-150 flex items-center gap-1.5"
              >
                <Pause size={16} />
                <span className="text-xs font-medium">Pause</span>
              </button>
            ) : (
              <button
                title="Resume"
                onClick={handleResume}
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-all duration-150 flex items-center gap-1.5"
              >
                <Play size={16} />
                <span className="text-xs font-medium">Resume</span>
              </button>
            )}
            <button
              title="Stop"
              onClick={handleStop}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-150 flex items-center gap-1.5"
            >
              <Square size={16} />
              <span className="text-xs font-medium">Stop</span>
            </button>
          </div>
          
          {/* Browser Actions */}
          <button
            title="Refresh"
            onClick={handleRefresh}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-150"
          >
            <RotateCcw size={14} />
          </button>
          <button
            title="Open in new tab"
            onClick={() => window.open(externalVncUrl, '_blank')}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-150"
          >
            <ExternalLink size={14} />
          </button>
          <button
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={handleFullscreen}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-150"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 min-h-0 bg-white flex items-center justify-center relative overflow-hidden">
        {isConnected ? (
          <iframe
            ref={iframeRef}
            src={vncUrl}
            className="w-full h-full border-0"
            title="Browser Preview"
            allow="fullscreen"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            {isLoading ? (
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-600">Connecting to browser...</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                  <ExternalLink className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Browser preview unavailable</p>
                <p className="text-xs text-gray-500">Make sure the backend is running</p>
              </div>
            )}
          </div>
        )}
        
        {/* Paused Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <Pause className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-medium">Task Paused</p>
              <p className="text-sm opacity-80">Click resume to continue</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}