import React from 'react';
import { Play, Settings, Clock, FileText } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient } from "@/api/AxiosClient";
import { useCredentialGetter } from "@/hooks/useCredentialGetter";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { WorkflowApiResponse } from "../workflows/types/workflowTypes";
import { ProxyLocation } from "@/api/types";

type Props = {
  workflow: WorkflowApiResponse;
  icon?: string;
  estimatedTime?: string;
};

function WorkflowCard({ workflow, icon, estimatedTime }: Props) {
  const navigate = useNavigate();
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();

  // Count workflow parameters as "fields"
  const fieldsCount = workflow.workflow_definition.parameters.filter(
    p => p.parameter_type === "workflow"
  ).length;

  const runWorkflowMutation = useMutation({
    mutationFn: async () => {
      const client = await getClient(credentialGetter);
      // Get default values for workflow parameters
      const defaultParameters = workflow.workflow_definition.parameters
        .filter(p => p.parameter_type === "workflow")
        .reduce((acc, param: any) => {
          acc[param.key] = param.default_value || "";
          return acc;
        }, {} as Record<string, unknown>);

      return client.post<
        { data: Record<string, unknown>; proxy_location: string | null },
        { data: { workflow_run_id: string } }
      >(
        `/workflows/${workflow.workflow_permanent_id}/run`,
        {
          data: defaultParameters,
          proxy_location: workflow.proxy_location || ProxyLocation.Residential,
        }
      );
    },
    onSuccess: (response) => {
      toast({
        variant: "success",
        title: "Workflow Run Created",
        description: `${workflow.title} is running.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["workflowRuns"],
      });
      navigate(
        `/workflows/${workflow.workflow_permanent_id}/${response.data.workflow_run_id}/overview`,
      );
    },
    onError: (error: AxiosError) => {
      const detail = (error.response?.data as { detail?: string })?.detail;
      toast({
        variant: "destructive",
        title: "Error running workflow",
        description: detail || error.message,
      });
    },
  });

  const handleRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    runWorkflowMutation.mutate();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/workflows/${workflow.workflow_permanent_id}/edit`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
      {/* Header with icon and title */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-3xl flex-shrink-0">
          {icon || '🔧'}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {workflow.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {workflow.description || "Automate your workflow with this template"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{estimatedTime || "2-3 minutes"}</span>
        </div>
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          <span>{fieldsCount} fields</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleRun}
          disabled={runWorkflowMutation.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <Play className="w-3 h-3" />
          Run
        </button>
        <button
          onClick={handleEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 border border-gray-300 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-3 h-3" />
          Edit
        </button>
      </div>
    </div>
  );
}

export { WorkflowCard };