import React from 'react';
import { Sidebar } from './Sidebar';
import { ChatView } from './ChatView';
import { PortalView } from './PortalView';
import { TopNavigation } from './TopNavigation';
import { useApp } from '../contexts/AppContext';

export function MainLayout() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          state.sidebarCollapsed ? 'ml-18' : 'ml-60'
        }`}
      >
        {/* Main View */}
        <div className="flex-1 flex flex-col min-h-0">
          {state.activeTab === 'chat' ? <ChatView /> : <PortalView />}
        </div>
      </div>
    </div>
  );
}