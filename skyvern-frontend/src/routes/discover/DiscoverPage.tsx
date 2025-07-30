import React, { useState } from 'react';
import { WorkflowTemplates } from "./WorkflowTemplates";
import { Settings, Upload, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient } from "@/api/AxiosClient";
import { Createv2TaskRequest, TaskV2, ProxyLocation } from "@/api/types";
import { useCredentialGetter } from "@/hooks/useCredentialGetter";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { ModelSelector } from "@/components/ModelSelector";

function DiscoverPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();

  const startWorkflowMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const client = await getClient(credentialGetter, "v2");
      return client.post<Createv2TaskRequest, { data: TaskV2 }>(
        "/tasks",
        {
          user_prompt: prompt,
          proxy_location: ProxyLocation.Residential,
        },
      );
    },
    onSuccess: (response) => {
      toast({
        variant: "success",
        title: "Workflow Run Created",
        description: `Workflow run created successfully.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["workflowRuns"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
      queryClient.invalidateQueries({
        queryKey: ["runs"],
      });
      navigate(
        `/workflows/${response.data.workflow_permanent_id}/${response.data.workflow_run_id}`,
      );
    },
    onError: (error: AxiosError) => {
      toast({
        variant: "destructive",
        title: "Error creating workflow run",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      startWorkflowMutation.mutate(prompt);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12 w-full max-w-4xl">
          <h1 className="text-5xl font-semibold text-gray-900 mb-4">
            What do you want done?
          </h1>
          <p className="text-xl text-gray-600">
            Prompt, run, and let the agent do the rest.
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-4xl mb-8">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What would you like me to do?"
              className="w-full px-6 py-5 pr-12 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || startWorkflowMutation.isPending}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            </button>
          </form>

          {/* Model Selection and Quick Actions */}
          <div className="flex flex-col gap-4 mt-4">
            {/* Model Selector */}
            <div className="w-full max-w-md">
              <ModelSelector 
                value={selectedModel} 
                onChange={setSelectedModel}
                disabled={startWorkflowMutation.isPending}
              />
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                Custom Task
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Search className="w-4 h-4" />
                Deep Research
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-gray-500 mb-12">
          Fabric can make mistakes. Please monitor its work.
        </p>

        {/* Workflows Section */}
        <div className="w-full max-w-6xl">
          <WorkflowTemplates />
        </div>
      </div>
    </div>
  );
}

export { DiscoverPage };
