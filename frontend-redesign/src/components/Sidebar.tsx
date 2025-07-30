import React from 'react';
import { MessageSquare, Search, Plus, ChevronLeft, ChevronRight, Settings, Zap, Upload, Users, Building2, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function Sidebar() {
  const { 
    state, 
    toggleSidebar, 
    setActiveTab, 
    setActivePortalSection,
    createNewConversation,
    selectConversation,
    deleteConversation
  } = useApp();
  const { sidebarCollapsed, activeTab, activePortalSection, conversations, currentConversationId } = state;

  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  const portalNavItems = [
    { id: 'uploads', label: 'Uploads', icon: Upload },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'workflows', label: 'Workflows', icon: Zap },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  if (sidebarCollapsed) {
    return (
      <div className="fixed left-0 top-0 bottom-0 w-18 bg-white border-r border-gray-200 flex flex-col items-center py-4 z-40">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-150"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={20} />
        </button>
        
        <div className="flex-1 flex flex-col gap-2 mt-4">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`p-2 rounded-lg transition-all duration-150 ${
              activeTab === 'chat' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('portal')}
            className={`p-2 rounded-lg transition-all duration-150 ${
              activeTab === 'portal' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Zap size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Fabric</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-all duration-150"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 flex-1 justify-center ${
              activeTab === 'chat'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={16} />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 flex-1 justify-center ${
              activeTab === 'portal'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap size={16} />
            Portal
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'chat' ? (
        <>
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
              />
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b border-gray-200">
            <button 
              onClick={createNewConversation}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-150"
            >
              <Plus size={16} />
              New Conversation
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Recent Conversations</h3>
              <div className="space-y-1">
                {conversations.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No conversations yet</p>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`relative group ${
                        conversation.id === currentConversationId
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 rounded-lg'
                          : 'text-gray-700 hover:bg-gray-50 rounded-lg'
                      }`}
                    >
                      <button
                        onClick={() => selectConversation(conversation.id)}
                        className="w-full text-left px-3 py-2 pr-10"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare size={14} className={conversation.id === currentConversationId ? 'text-blue-500' : 'text-gray-400'} />
                          <span className="text-sm font-medium truncate">{conversation.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">{formatTimestamp(conversation.updatedAt)}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all duration-150"
                        aria-label="Delete conversation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Portal Navigation */}
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Portal</h3>
            <nav className="space-y-1">
              {portalNavItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActivePortalSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                    activePortalSection === id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}