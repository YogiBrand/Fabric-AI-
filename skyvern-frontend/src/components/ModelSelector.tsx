import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getClient } from "@/api/AxiosClient";
import { useCredentialGetter } from "@/hooks/useCredentialGetter";

interface Model {
  id: string;
  name: string;
  supports_vision: boolean;
  context_length?: number;
  pricing?: {
    prompt: string;
    completion: string;
  };
}

// OpenRouter models that support vision and are compatible with Skyvern
const COMPATIBLE_MODELS: Model[] = [
  // Anthropic models
  { id: "anthropic/claude-3-5-sonnet", name: "Claude 3.5 Sonnet", supports_vision: true },
  { id: "anthropic/claude-3-5-haiku", name: "Claude 3.5 Haiku", supports_vision: true },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus", supports_vision: true },
  { id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet", supports_vision: true },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", supports_vision: true },
  
  // OpenAI models
  { id: "openai/gpt-4o", name: "GPT-4o", supports_vision: true },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", supports_vision: true },
  { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo", supports_vision: true },
  
  // Google models
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", supports_vision: true },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", supports_vision: true },
  { id: "google/gemini-pro-vision", name: "Gemini Pro Vision", supports_vision: true },
  
  // Other vision-capable models
  { id: "mistralai/mistral-small-3.2-24b-instruct", name: "Mistral Small 3.2 24B", supports_vision: true },
  { id: "mistralai/mistral-medium-3", name: "Mistral Medium 3", supports_vision: true },
  { id: "x-ai/grok-4", name: "xAI Grok 4", supports_vision: true },
  { id: "bytedance/ui-tars-1.5-7b", name: "Bytedance UI-TARS 7B", supports_vision: true },
];

interface ModelSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  const credentialGetter = useCredentialGetter();
  
  const { data: modelsResponse, isLoading } = useQuery({
    queryKey: ["available-models"],
    queryFn: async () => {
      const client = await getClient(credentialGetter);
      const response = await client.get("/models");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Convert backend response to Model format and add default fallbacks
  const models: Model[] = modelsResponse?.models 
    ? Object.entries(modelsResponse.models).map(([id, label]) => ({
        id,
        name: label as string,
        supports_vision: true,
      }))
    : COMPATIBLE_MODELS;

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  // Default to first available model or OpenRouter GPT-4o Mini if available
  const defaultModel = models.find(m => m.id.includes("gpt-4o-mini")) || models[0];
  const currentModel = value || defaultModel?.id || "openrouter/openai/gpt-4o-mini";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="model-select">AI Model</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircledIcon className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Select the AI model to use for this task. All models support vision capabilities required for browser automation.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select
        value={currentModel}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id="model-select">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}