import { HelpTooltip } from "@/components/HelpTooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { WorkflowBlockInputTextarea } from "@/components/WorkflowBlockInputTextarea";
import { CodeEditor } from "@/routes/workflows/components/CodeEditor";
import {
  Handle,
  NodeProps,
  Position,
  useEdges,
  useNodes,
  useReactFlow,
} from "@xyflow/react";
import { useState } from "react";
import { helpTooltips, placeholders } from "../../helpContent";
import { errorMappingExampleValue } from "../types";
import type { FileDownloadNode } from "./types";
import { AppNode } from "..";
import { getAvailableOutputParameterKeys } from "../../workflowEditorUtils";
import { ParametersMultiSelect } from "../TaskNode/ParametersMultiSelect";
import { useIsFirstBlockInWorkflow } from "../../hooks/useIsFirstNodeInWorkflow";
import { RunEngineSelector } from "@/components/EngineSelector";
import { ModelSelector } from "@/components/ModelSelector";
import { useDebugStore } from "@/store/useDebugStore";
import { cn } from "@/util/utils";
import { NodeHeader } from "../components/NodeHeader";
import { useParams } from "react-router-dom";

const urlTooltip =
  "The URL Skyvern is navigating to. Leave this field blank to pick up from where the last block left off.";
const urlPlaceholder = "https://";
const navigationGoalTooltip =
  "Give Skyvern an objective that describes how to download the file.";
const navigationGoalPlaceholder = "Tell Skyvern which file to download.";

function FileDownloadNode({ id, data }: NodeProps<FileDownloadNode>) {
  const { updateNodeData } = useReactFlow();
  const { debuggable, editable, label } = data;
  const debugStore = useDebugStore();
  const { blockLabel: urlBlockLabel } = useParams();
  const thisBlockIsPlaying =
    urlBlockLabel !== undefined && urlBlockLabel === label;
  const elideFromDebugging = debugStore.isDebugMode && !debuggable;
  const [inputs, setInputs] = useState({
    url: data.url,
    navigationGoal: data.navigationGoal,
    errorCodeMapping: data.errorCodeMapping,
    maxStepsOverride: data.maxStepsOverride,
    continueOnFailure: data.continueOnFailure,
    cacheActions: data.cacheActions,
    downloadSuffix: data.downloadSuffix,
    totpVerificationUrl: data.totpVerificationUrl,
    totpIdentifier: data.totpIdentifier,
    engine: data.engine,
    model: data.model,
  });
  const nodes = useNodes<AppNode>();
  const edges = useEdges();
  const outputParameterKeys = getAvailableOutputParameterKeys(nodes, edges, id);
  const isFirstWorkflowBlock = useIsFirstBlockInWorkflow({ id });
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
          type="file_download" // sic: the naming for this block is not consistent
        />
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Label className="text-xs text-gray-700">URL</Label>
                <HelpTooltip content={urlTooltip} />
              </div>
              {isFirstWorkflowBlock ? (
                <div className="flex justify-end text-xs text-gray-500">
                  Tip: Use the {"+"} button to add parameters!
                </div>
              ) : null}
            </div>
            <WorkflowBlockInputTextarea
              nodeId={id}
              onChange={(value) => {
                handleChange("url", value);
              }}
              value={inputs.url}
              placeholder={urlPlaceholder}
              className="nopan text-xs"
            />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Label className="text-xs text-gray-700">Download Goal</Label>
              <HelpTooltip content={navigationGoalTooltip} />
            </div>
            <WorkflowBlockInputTextarea
              nodeId={id}
              onChange={(value) => {
                handleChange("navigationGoal", value);
              }}
              value={inputs.navigationGoal}
              placeholder={navigationGoalPlaceholder}
              className="nopan text-xs"
            />
          </div>
          <div className="rounded-md bg-blue-50 border border-blue-200 p-2 text-xs text-gray-500">
            Once the file is downloaded, this block will complete.
          </div>
        </div>
        <Separator />
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced" className="border-b-0">
            <AccordionTrigger className="py-0">
              Advanced Settings
            </AccordionTrigger>
            <AccordionContent className="pl-6 pr-1 pt-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <ModelSelector
                    className="nopan w-52 text-xs"
                    value={inputs.model}
                    onChange={(value) => {
                      handleChange("model", value);
                    }}
                  />
                  <ParametersMultiSelect
                    availableOutputParameters={outputParameterKeys}
                    parameters={data.parameterKeys}
                    onParametersChange={(parameterKeys) => {
                      updateNodeData(id, { parameterKeys });
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-gray-700">
                      Engine
                    </Label>
                  </div>
                  <RunEngineSelector
                    value={inputs.engine}
                    onChange={(value) => {
                      handleChange("engine", value);
                    }}
                    className="nopan w-52 text-xs"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-gray-700">
                      Max Steps Override
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["download"]["maxStepsOverride"]}
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder={placeholders["download"]["maxStepsOverride"]}
                    className="nopan w-52 text-xs"
                    min="0"
                    value={inputs.maxStepsOverride ?? ""}
                    onChange={(event) => {
                      const value =
                        event.target.value === ""
                          ? null
                          : Number(event.target.value);
                      handleChange("maxStepsOverride", value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-4">
                    <div className="flex gap-2">
                      <Label className="text-xs font-normal text-gray-700">
                        Error Messages
                      </Label>
                      <HelpTooltip
                        content={helpTooltips["download"]["errorCodeMapping"]}
                      />
                    </div>
                    <Checkbox
                      checked={inputs.errorCodeMapping !== "null"}
                      disabled={!editable}
                      onCheckedChange={(checked) => {
                        handleChange(
                          "errorCodeMapping",
                          checked
                            ? JSON.stringify(errorMappingExampleValue, null, 2)
                            : "null",
                        );
                      }}
                    />
                  </div>
                  {inputs.errorCodeMapping !== "null" && (
                    <div>
                      <CodeEditor
                        language="json"
                        value={inputs.errorCodeMapping}
                        onChange={(value) => {
                          handleChange("errorCodeMapping", value);
                        }}
                        className="nowheel nopan"
                        fontSize={8}
                      />
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-gray-700">
                      Continue on Failure
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["download"]["continueOnFailure"]}
                    />
                  </div>
                  <div className="w-52">
                    <Switch
                      checked={inputs.continueOnFailure}
                      onCheckedChange={(checked) => {
                        handleChange("continueOnFailure", checked);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-gray-700">
                      Cache Actions
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["download"]["cacheActions"]}
                    />
                  </div>
                  <div className="w-52">
                    <Switch
                      checked={inputs.cacheActions}
                      onCheckedChange={(checked) => {
                        handleChange("cacheActions", checked);
                      }}
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-gray-700">
                      File Suffix
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["download"]["fileSuffix"]}
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder={placeholders["download"]["downloadSuffix"]}
                    className="nopan w-52 text-xs"
                    value={inputs.downloadSuffix ?? ""}
                    onChange={(event) => {
                      handleChange("downloadSuffix", event.target.value);
                    }}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label className="text-xs text-gray-700">
                      2FA Identifier
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["download"]["totpIdentifier"]}
                    />
                  </div>
                  <WorkflowBlockInputTextarea
                    nodeId={id}
                    onChange={(value) => {
                      handleChange("totpIdentifier", value);
                    }}
                    value={inputs.totpIdentifier ?? ""}
                    placeholder={placeholders["download"]["totpIdentifier"]}
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

export { FileDownloadNode };
