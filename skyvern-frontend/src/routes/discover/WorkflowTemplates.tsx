import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalWorkflowsQuery } from "../workflows/hooks/useGlobalWorkflowsQuery";
import { WorkflowCard } from "./WorkflowCard";
import { WorkflowApiResponse } from "../workflows/types/workflowTypes";

/**
 * WorkflowTemplates component displays workflow cards on the discovery page.
 * 
 * For workflows to appear here:
 * 1. They must be template workflows (template=true in API)
 * 2. They should have descriptive titles for proper categorization
 * 3. They should have a description field explaining what they do
 * 
 * See WORKFLOW_SETUP_GUIDE.md for detailed instructions.
 */

// Workflow metadata including icons and estimated times
// Map by keywords in titles to provide metadata for any workflow
const getWorkflowMetadata = (title: string): { icon: string; estimatedTime: string; category: string } => {
  const lowerTitle = title.toLowerCase();
  
  // Lead Generation workflows
  if (lowerTitle.includes('linkedin') || lowerTitle.includes('lead')) {
    return { icon: "👤", estimatedTime: "2-3 minutes", category: "Lead Generation" };
  }
  if (lowerTitle.includes('email') && (lowerTitle.includes('find') || lowerTitle.includes('verif'))) {
    return { icon: "📧", estimatedTime: "1-2 minutes", category: "Lead Generation" };
  }
  
  // Research workflows
  if (lowerTitle.includes('company') && (lowerTitle.includes('intelligence') || lowerTitle.includes('research'))) {
    return { icon: "🏢", estimatedTime: "3-5 minutes", category: "Research" };
  }
  if (lowerTitle.includes('competitor') || lowerTitle.includes('analysis')) {
    return { icon: "🔍", estimatedTime: "5-8 minutes", category: "Research" };
  }
  if (lowerTitle.includes('content') || lowerTitle.includes('scrap')) {
    return { icon: "📄", estimatedTime: "3-6 minutes", category: "Research" };
  }
  
  // Data Processing workflows
  if (lowerTitle.includes('data') || lowerTitle.includes('extract')) {
    return { icon: "📊", estimatedTime: "2-4 minutes", category: "Data Processing" };
  }
  
  // Automation workflows
  if (lowerTitle.includes('automat') || lowerTitle.includes('bot')) {
    return { icon: "🤖", estimatedTime: "3-5 minutes", category: "Automation" };
  }
  
  // Default
  return { icon: "🔧", estimatedTime: "2-3 minutes", category: "Other" };
};

function WorkflowTemplates() {
  const { data: workflowTemplates, isLoading, error } = useGlobalWorkflowsQuery();
  
  // Debug logging
  console.log('WorkflowTemplates - Loading:', isLoading);
  console.log('WorkflowTemplates - Data:', workflowTemplates);
  console.log('WorkflowTemplates - Error:', error);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Generation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load workflows. Please try again later.</p>
      </div>
    );
  }

  if (!workflowTemplates || workflowTemplates.length === 0) {
    console.log('No template workflows found. To create workflows that appear here:');
    console.log('1. Create a workflow in the workflow editor');
    console.log('2. Ensure it is marked as a template workflow');
    console.log('3. Give it a descriptive title and description');
    console.log('See src/routes/discover/WORKFLOW_SETUP_GUIDE.md for more details');
    
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No workflows available yet. Create your first workflow to get started!</p>
        <p className="text-sm text-gray-400 mt-2">Workflows must be marked as templates to appear here.</p>
      </div>
    );
  }

  // Group workflows by category using metadata
  const workflowsByCategory = workflowTemplates.reduce((acc, workflow) => {
    const metadata = getWorkflowMetadata(workflow.title);
    const category = metadata.category;
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({
      workflow,
      metadata
    });
    return acc;
  }, {} as Record<string, Array<{ workflow: WorkflowApiResponse; metadata: ReturnType<typeof getWorkflowMetadata> }>>);

  // Sort categories to ensure Lead Generation and Research come first
  const categoryOrder = ["Lead Generation", "Research", "Data Processing", "Automation", "Other"];
  const sortedCategories = Object.entries(workflowsByCategory).sort(([a], [b]) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="space-y-8">
      {sortedCategories.map(([category, workflows]) => (
        <div key={category}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map(({ workflow, metadata }) => (
              <WorkflowCard
                key={workflow.workflow_permanent_id}
                workflow={workflow}
                icon={metadata.icon}
                estimatedTime={metadata.estimatedTime}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { WorkflowTemplates };