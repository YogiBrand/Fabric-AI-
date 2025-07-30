import React, { useState } from 'react';
import { ArrowRight, Clock, Play, Settings } from 'lucide-react';
import { mockWorkflows } from '../data/mockData';
import { WorkflowModal } from './WorkflowModal';
import { Workflow } from '../types';

export function WorkflowCards() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  // Group workflows by category
  const workflowsByCategory = mockWorkflows.reduce((acc, workflow) => {
    if (!acc[workflow.category]) {
      acc[workflow.category] = [];
    }
    acc[workflow.category].push(workflow);
    return acc;
  }, {} as Record<string, typeof mockWorkflows>);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-8">
        {Object.entries(workflowsByCategory).map(([category, workflows]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
            
            {/* Workflow Grid for Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.map((workflow) => (
                <button
                  key={workflow.id}
                  onClick={() => setSelectedWorkflow(workflow)}
                  className="text-left p-4 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-lg transition-all duration-150 group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{workflow.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-150">
                        {workflow.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">
                        {workflow.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {workflow.estimatedTime}
                        </div>
                        <div>{workflow.fields.length} fields</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                      <Play size={10} />
                      Run
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 text-gray-600 border border-gray-200 text-xs font-medium rounded">
                      <Settings size={10} />
                      Edit
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {/* View All Link */}
        <div className="text-center pt-4">
          <button className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-150">
            View All Workflows
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {selectedWorkflow && (
        <WorkflowModal
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
        />
      )}
    </div>
  );
}