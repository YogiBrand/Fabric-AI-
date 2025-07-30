import React from 'react';
import { Zap, Play, Clock, Settings } from 'lucide-react';
import { mockWorkflows } from '../../../data/mockData';
import { NewWorkflowWizard } from '../NewWorkflowWizard';
import { Workflow } from '../../../types';

export function WorkflowsSection() {
  const [showNewWorkflowWizard, setShowNewWorkflowWizard] = React.useState(false);
  const [editingWorkflow, setEditingWorkflow] = React.useState<Workflow | null>(null);

  const categories = Array.from(new Set(mockWorkflows.map(w => w.category)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-1">Create and manage your automated workflows</p>
        </div>
        <button 
          onClick={() => setShowNewWorkflowWizard(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-150"
        >
          <Zap size={16} />
          New Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-gray-900">{mockWorkflows.length}</div>
          <div className="text-sm text-gray-600">Total Workflows</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-blue-600">{categories.length}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="text-2xl font-semibold text-green-600">143</div>
          <div className="text-sm text-gray-600">Total Runs</div>
        </div>
      </div>

      {/* Workflows by Category */}
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
          <div className="card-grid">
            {mockWorkflows
              .filter(workflow => workflow.category === category)
              .map(workflow => (
                <div
                  key={workflow.id}
                  className="workflow-card"
                >
                  <div className="card-header">
                    <div className="card-icon">{workflow.icon}</div>
                    <div className="card-content">
                      <h3 className="card-title">{workflow.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                          {workflow.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-description line-clamp-3">
                    {workflow.description}
                  </div>

                  <div className="card-metadata">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{workflow.estimatedTime}</span>
                    </div>
                    <span>{workflow.fields.length} fields</span>
                  </div>

                  <div className="card-actions">
                    <button className="card-button card-button-primary">
                      <Play size={14} />
                      Run
                    </button>
                    <button 
                      onClick={() => setEditingWorkflow(workflow)}
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

      {/* New Workflow Wizard */}
      {(showNewWorkflowWizard || editingWorkflow) && (
        <NewWorkflowWizard
          workflow={editingWorkflow}
          onClose={() => {
            setShowNewWorkflowWizard(false);
            setEditingWorkflow(null);
          }}
        />
      )}
    </div>
  );
}