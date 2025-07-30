import React, { useState } from 'react';
import { Users, Plus, Clock, Settings, Play } from 'lucide-react';
import { mockAgents } from '../../../data/mockData';
import { Agent } from '../../../types';
import { NewAgentWizard } from '../NewAgentWizard';

export function AgentsSection() {
  const [showNewAgentWizard, setShowNewAgentWizard] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Group agents by category
  const agentsByCategory = mockAgents.reduce((acc, agent) => {
    if (!acc[agent.category]) {
      acc[agent.category] = [];
    }
    acc[agent.category].push(agent);
    return acc;
  }, {} as Record<string, typeof mockAgents>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agents</h1>
          <p className="text-gray-600 mt-1">Create and manage your AI agents</p>
        </div>
        <button 
          onClick={() => setShowNewAgentWizard(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-150"
        >
          <Plus size={16} />
          New Agent
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-gray-900">{mockAgents.length}</div>
          <div className="text-sm text-gray-600">Total Agents</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-blue-600">{Object.keys(agentsByCategory).length}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-green-600">{mockAgents.filter(a => a.published).length}</div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
      </div>

      {/* Agents by Category */}
      {Object.entries(agentsByCategory).map(([category, agents]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
          <div className="card-grid">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="agent-card"
              >
                <div className="card-header">
                  <div className="card-icon">{agent.icon}</div>
                  <div className="card-content">
                    <h3 className="card-title">{agent.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users size={12} />
                      <span className="font-mono">{agent.handle}</span>
                    </div>
                  </div>
                </div>

                <div className="card-description line-clamp-3">
                  {agent.description}
                </div>

                <div className="card-tags">
                  {agent.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="card-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="card-actions">
                  <button className="card-button card-button-primary">
                    <Play size={14} />
                    Run
                  </button>
                  <button 
                    onClick={() => setEditingAgent(agent)}
                    className="card-button card-button-secondary"
                  >
                    <Settings size={14} />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Wizards */}
      {showNewAgentWizard && (
        <NewAgentWizard
          onClose={() => setShowNewAgentWizard(false)}
        />
      )}
      
      {editingAgent && (
        <NewAgentWizard
          agent={editingAgent}
          onClose={() => setEditingAgent(null)}
        />
      )}
    </div>
  );
}