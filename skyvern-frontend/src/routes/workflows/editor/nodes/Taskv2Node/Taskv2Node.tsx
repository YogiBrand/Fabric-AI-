import { HelpTooltip } from "@/components/HelpTooltip";
import { WorkflowBlockInputTextarea } from "@/components/WorkflowBlockInputTextarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { helpTooltips, placeholders } from "../../helpContent";
import { useIsFirstBlockInWorkflow } from "../../hooks/useIsFirstNodeInWorkflow";
import { MAX_STEPS_DEFAULT, type Taskv2Node } from "./types";
import { ModelSelector } from "@/components/ModelSelector";
import { useDebugStore } from "@/store/useDebugStore";
import { cn } from "@/util/utils";
import { NodeHeader } from "../components/NodeHeader";
import { useParams } from "react-router-dom";

function Taskv2Node({ id, data, type }: NodeProps<Taskv2Node>) {
  const { debuggable, editable, label } = data;
  const debugStore = useDebugStore();
  const elideFromDebugging = debugStore.isDebugMode && !debuggable;
  const { blockLabel: urlBlockLabel } = useParams();
  const thisBlockIsPlaying =
    urlBlockLabel !== undefined && urlBlockLabel === label;
  const { updateNodeData } = useReactFlow();
  const isFirstWorkflowBlock = useIsFirstBlockInWorkflow({ id });

  const [inputs, setInputs] = useState({
    prompt: data.prompt,
    url: data.url,
    totpVerificationUrl: data.totpVerificationUrl,
    totpIdentifier: data.totpIdentifier,
    maxSteps: data.maxSteps,
    model: data.model,
  });

  function handleChange(key: string, value: unknown) {
    if (!editable) {
      return;
    }
    setInputs({ ...inputs, [key]: value });
    updateNodeData(id, { [key]: value });
  }

  return (
    <div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="opacity-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        className="opacity-0"
      />
      <div
        className={cn(
          "transform-origin-center w-[30rem] space-y-4 rounded-lg bg-white border border-gray-200 px-6 py-4 transition-all shadow-sm",
          {
            "pointer-events-none bg-gray-50 outline outline-2 outline-blue-400":
              thisBlockIsPlaying,
          },
        )}
      >
        <NodeHeader
          blockLabel={label}
          disabled={elideFromDebugging}
          editable={editable}
          nodeId={id}
          totpIdentifier={inputs.totpIdentifier}
          totpUrl={inputs.totpVerificationUrl}
          type="task_v2" // sic: the naming is not consistent
        />
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-gray-700">Prompt</Label>
              {isFirstWorkflowBlock ? (
                <div className="flex justify-end text-xs text-gray-500">
                  Tip: Use the {"+"} button to add parameters!
                </div>
              ) : null}
            </div>
            <WorkflowBlockInputTextarea
              nodeId={id}
              onChange={(value) => {
                handleChange("prompt", value);
              }}
              value={inputs.prompt}
              placeholder={placeholders[type]["prompt"]}
              className="nopan text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-gray-700">URL</Label>
            <WorkflowBlockInputTextarea
              nodeId={id}
              onChange={(value) => {
                handleChange("url", value);
              }}
              value={inputs.url}
              placeholder={placeholders[type]["url"]}
              className="nopan text-xs"
            />
          </div>
        </div>
        <Separator />
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced" className="border-b-0">
            <AccordionTrigger className="py-0">
              Advanced Settings
            </AccordionTrigger>
            <AccordionContent className="pl-6 pr-1 pt-4">
              <div className="space-y-4">
                <ModelSelector
                  className="nopan w-52 text-xs"
                  value={inputs.model}
                  onChange={(value) => {
                    handleChange("model", value);
                  }}
                />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label className="text-xs text-gray-700">Max Steps</Label>
                    <HelpTooltip content={helpTooltips[type]["maxSteps"]} />
                  </div>
                  <Input
                    type="number"
                    placeholder="10"
                    className="nopan text-xs"
                    value={data.maxSteps ?? MAX_STEPS_DEFAULT}
                    onChange={(event) => {
                      handleChange("maxSteps", Number(event.target.value));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label className="text-xs text-gray-700">
                      2FA Identifier
                    </Label>
                    <HelpTooltip
                      content={helpTooltips[type]["totpIdentifier"]}
                    />
                  </div>
                  <WorkflowBlockInputTextarea
                    nodeId={id}
                    onChange={(value) => {
                      handleChange("totpIdentifier", value);
                    }}
                    value={inputs.totpIdentifier ?? ""}
                    placeholder={placeholders["navigation"]["totpIdentifier"]}
                    className="nopan text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label className="text-xs text-gray-700">
                      2FA Verification URL
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["task"]["totpVerificationUrl"]}
                    />
                  </div>
                  <WorkflowBlockInputTextarea
                    nodeId={id}
                    onChange={(value) => {
                      handleChange("totpVerificationUrl", value);
                    }}
                    value={inputs.totpVerificationUrl ?? ""}
                    placeholder={placeholders["task"]["totpVerificationUrl"]}
                    className="nopan text-xs"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export { Taskv2Node };
