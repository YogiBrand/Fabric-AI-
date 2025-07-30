import React from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export function BrowserStatus() {
  const { browserStatus, wsConnected } = useAppContext();
  
  return (
    <div className="flex items-center gap-4">
      {/* WebSocket Connection Status */}
      <div className="flex items-center gap-2">
        {wsConnected ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <span className="text-sm text-gray-600">
          {wsConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      
      {/* Browser Activity Status */}
      {browserStatus?.isLoading && (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-sm text-gray-600">
            {browserStatus.currentAction || 'Processing...'}
          </span>
        </div>
      )}
    </div>
  );
}