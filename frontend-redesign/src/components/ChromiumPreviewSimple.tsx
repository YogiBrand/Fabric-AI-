import React, { useState } from 'react';
import { ExternalLink, Maximize2, Minimize2, Pause, Play, Square, Globe, Activity } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface ChromiumPreviewProps {
  url?: string;
  className?: string;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
}

export function ChromiumPreviewSimple({ 
  className = '',
  onPause,
  onResume,
  onStop
}: ChromiumPreviewProps) {
  const [isPaused, setIsPaused] = useState(false);
  const { browserStatus, taskProgress } = useAppContext();
  
  // For external window opening, we still need the direct URL
  const vncUrl = 'http://localhost:6080/vnc.html?autoconnect=true&resize=scale';

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

  const openPreview = () => {
    window.open(vncUrl, 'fabric-browser-preview', 'width=1280,height=800');
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm ${className}`}>
      {/* Browser Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
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
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="truncate">{browserStatus?.currentUrl || 'Ready for automation'}</span>
            </div>
          </div>
        </div>
        
        {/* Browser Controls */}
        <div className="flex items-center gap-1">
          {/* Task Control Buttons */}
          <div className="flex items-center gap-1 mr-2 px-2 border-r border-gray-200">
            {!isPaused ? (
              <button
                title="Pause"
                onClick={handlePause}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-150"
              >
                <Pause size={14} />
              </button>
            ) : (
              <button
                title="Resume"
                onClick={handleResume}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-150"
              >
                <Play size={14} />
              </button>
            )}
            <button
              title="Stop"
              onClick={handleStop}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-150"
            >
              <Square size={14} />
            </button>
          </div>
          
          {/* Browser Actions */}
          <button
            title="Open browser preview"
            onClick={openPreview}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-150"
          >
            <ExternalLink size={14} />
          </button>
          <button
            title="Fullscreen"
            onClick={() => window.open(vncUrl, '_blank')}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-150"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
        <div className="text-center">
          {/* Status Icon */}
          <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
            {browserStatus?.isLoading ? (
              <Activity className="w-10 h-10 text-blue-500 animate-pulse" />
            ) : browserStatus?.browserReady ? (
              <Globe className="w-10 h-10 text-green-500" />
            ) : (
              <Globe className="w-10 h-10 text-gray-400" />
            )}
          </div>
          
          {/* Status Text */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {browserStatus?.currentAction || 'Browser Automation Ready'}
          </h3>
          
          {/* Progress */}
          {taskProgress && (
            <p className="text-sm text-gray-600 mb-4">
              {taskProgress.message}
            </p>
          )}
          
          {/* Action Button */}
          <button
            onClick={openPreview}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ExternalLink size={18} />
            Open Live Browser View
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Click to see the browser in action
          </p>
          
          {/* Docker Status Notice */}
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
            <p className="text-xs text-yellow-800">
              Note: Browser preview requires Docker to be running. 
              Make sure Docker Desktop is started and run: <code className="bg-yellow-100 px-1 rounded">docker-compose up</code>
            </p>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse delay-500" />
        
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