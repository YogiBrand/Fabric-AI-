import { SwitchBar } from "@/components/SwitchBar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import CloudContext from "@/store/CloudContext";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useContext, useState } from "react";
import { CredentialParameterSourceSelector } from "../../components/CredentialParameterSourceSelector";
import { SourceParameterKeySelector } from "../../components/SourceParameterKeySelector";
import {
  WorkflowEditorParameterType,
  WorkflowParameterValueType,
} from "../../types/workflowTypes";
import { WorkflowParameterInput } from "../../WorkflowParameterInput";
import { ParametersState } from "../types";
import { getDefaultValueForParameterType } from "../workflowEditorUtils";
import { validateBitwardenLoginCredential } from "./util";

type Props = {
  type: WorkflowEditorParameterType;
  onClose: () => void;
  onSave: (value: ParametersState[number]) => void;
};

const workflowParameterTypeOptions = [
  { label: "string", value: WorkflowParameterValueType.String },
  { label: "float", value: WorkflowParameterValueType.Float },
  { label: "integer", value: WorkflowParameterValueType.Integer },
  { label: "boolean", value: WorkflowParameterValueType.Boolean },
  { label: "file", value: WorkflowParameterValueType.FileURL },
  { label: "JSON", value: WorkflowParameterValueType.JSON },
];

function header(type: WorkflowEditorParameterType) {
  if (type === "workflow") {
    return "Add Input Parameter";
  }
  if (type === "credential") {
    return "Add Credential Parameter";
  }
  if (type === "secret") {
    return "Add Secret Parameter";
  }
  if (type === "creditCardData") {
    return "Add Credit Card Parameter";
  }
  return "Add Context Parameter";
}

function WorkflowParameterAddPanel({ type, onClose, onSave }: Props) {
  const reservedKeys = ["current_item", "current_value", "current_index"];
  const isCloud = useContext(CloudContext);
  const [key, setKey] = useState("");
  const [urlParameterKey, setUrlParameterKey] = useState("");
  const [description, setDescription] = useState("");
  const [bitwardenCollectionId, setBitwardenCollectionId] = useState("");
  const [bitwardenLoginCredentialItemId, setBitwardenLoginCredentialItemId] =
    useState("");
  const [parameterType, setParameterType] =
    useState<WorkflowParameterValueType>("string");
  const [defaultValueState, setDefaultValueState] = useState<{
    hasDefaultValue: boolean;
    defaultValue: unknown;
  }>({
    hasDefaultValue: false,
    defaultValue: null,
  });
  const [sourceParameterKey, setSourceParameterKey] = useState<
    string | undefined
  >(undefined);

  const [credentialType, setCredentialType] = useState<
    "bitwarden" | "skyvern" | "onepassword"
  >("skyvern");
  const [vaultId, setVaultId] = useState("");
  const [itemId, setItemId] = useState("");

  const [identityKey, setIdentityKey] = useState("");
  const [identityFields, setIdentityFields] = useState("");
  const [sensitiveInformationItemId, setSensitiveInformationItemId] =
    useState("");

  const [credentialId, setCredentialId] = useState("");

  return (
    <ScrollArea>
      <ScrollAreaViewport className="max-h-[500px]">
        <div className="space-y-4 p-1">
          <header className="flex items-center justify-between">
            <span>{header(type)}</span>
            <Cross2Icon className="h-6 w-6 cursor-pointer" onClick={onClose} />
          </header>
          <div className="space-y-1">
            <Label className="text-xs text-gray-700">Key</Label>
            <Input value={key} onChange={(e) => setKey(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-700">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {type === "workflow" && (
            <>
              <div className="space-y-1">
                <Label className="text-xs">Value Type</Label>
                <Select
                  value={parameterType}
                  onValueChange={(value) => {
                    setParameterType(value as WorkflowParameterValueType);
                    setDefaultValueState((state) => {
                      return {
                        ...state,
                        defaultValue: getDefaultValueForParameterType(
                          value as WorkflowParameterValueType,
                        ),
                      };
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {workflowParameterTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={defaultValueState.hasDefaultValue}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        setDefaultValueState({
                          hasDefaultValue: false,
                          defaultValue: null,
                        });
                        return;
                      }
                      setDefaultValueState({
                        hasDefaultValue: true,
                        defaultValue:
                          getDefaultValueForParameterType(parameterType),
                      });
                    }}
                  />
                  <Label className="text-xs text-gray-700">
                    Use Default Value
                  </Label>
                </div>
                {defaultValueState.hasDefaultValue && (
                  <WorkflowParameterInput
                    onChange={(value) => {
                      if (
                        parameterType === "file_url" &&
                        typeof value === "object" &&
                        value &&
                        "s3uri" in value
                      ) {
                        setDefaultValueState((state) => {
                          return {
                            ...state,
                            defaultValue: value.s3uri,
                          };
                        });
                        return;
                      }
                      setDefaultValueState((state) => {
                        return {
                          ...state,
                          defaultValue: value,
                        };
                      });
                    }}
                    type={parameterType}
                    value={defaultValueState.defaultValue}
                  />
                )}
              </div>
            </>
          )}
          {type === "credential" && (
            <SwitchBar
              value={credentialType}
              onChange={(value) => {
                setCredentialType(
                  value as "bitwarden" | "skyvern" | "onepassword",
                );
              }}
              options={[
                { label: "Skyvern", value: "skyvern" },
                { label: "Bitwarden", value: "bitwarden" },
                { label: "1Password", value: "onepassword" },
              ]}
            />
          )}
          {type === "credential" && credentialType === "bitwarden" && (
            <>
              <div className="space-y-1">
                <Label className="text-xs text-gray-700">
                  URL Parameter Key
                </Label>
                <Input
                  value={urlParameterKey}
                  onChange={(e) => setUrlParameterKey(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-700">Collection ID</Label>
                <Input
                  value={bitwardenCollectionId}
                  onChange={(e) => setBitwardenCollectionId(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-700">Item ID</Label>
                <Input
                  value={bitwardenLoginCredentialItemId}
                  onChange={(e) =>
                    setBitwardenLoginCredentialItemId(e.target.value)
                  }
                />
              </div>
            </>
          )}
          {type === "credential" && credentialType === "onepassword" && (
            <>
              <div className="space-y-1">
                <Label className="text-xs text-gray-700">Vault ID</Label>
                <Input
                  value={vaultId}
                  onChange={(e) => setVaultId(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-700">Item ID</Label>
                <Input
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                />
              </div>
            </>
          )}
          {type === "context" && (
            <div className="space-y-1">
              <Label className="text-xs text-gray-700">Source Parameter</Label>
              <SourceParameterKeySelector
                value={sourceParameterKey}
                onChange={setSourceParameterKey}
              />
            </div>
          )}
          {type === "secret" && (
            <>
              <div className="space-y-1">
                <Label className="text-xs text-gray-700">Identity Key</Label>
                <Input
                  value={identityKey}
                  onChange={(e) => setIdentityKey(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-700">
                  Identity Fields
                </Label>
                <Input
                  value={identityFields}
                  onChange={(e) => setIdentityFields(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-700">Collection ID</Label>
                <Input
                  value={bitwardenCollectionId}
                  onChange={(e) => setBitwardenCollectionId(e.target.value)}
                />
              </div>
            </>
          )}
          {type === "creditCardData" && (
            <>
              <div className="space-y-1">
                <Label className="text-xs text-gray-700">Collection ID</Label>
                <Input
                  value={bitwardenCollectionId}
                  onChange={(e) => setBitwardenCollectionId(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-700">Item ID</Label>
                <Input
                  value={sensitiveInformationItemId}
                  onChange={(e) =>
                    setSensitiveInformationItemId(e.target.value)
                  }
                />
              </div>
            </>
          )}
          {
            // temporarily cloud only
            type === "credential" &&
              credentialType === "skyvern" &&
              isCloud && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-700">Credential</Label>
                  <CredentialParameterSourceSelector
                    value={credentialId}
                    onChange={(value) => setCredentialId(value)}
                  />
                </div>
              )
          }
          <div className="flex justify-end">
            <Button
              onClick={() => {
                if (!key) {
                  toast({
                    variant: "destructive",
                    title: "Failed to add parameter",
                    description: "Key is required",
                  });
                  return;
                }
                if (reservedKeys.includes(key)) {
                  toast({
                    variant: "destructive",
                    title: "Failed to add parameter",
                    description: `${key} is reserved, please use another key`,
                  });
                  return;
                }
                if (type === "workflow") {
                  if (
                    parameterType === "json" &&
                    typeof defaultValueState.defaultValue === "string"
                  ) {
                    try {
                      JSON.parse(defaultValueState.defaultValue);
                    } catch (e) {
                      toast({
                        variant: "destructive",
                        title: "Failed to add parameter",
                        description: "Invalid JSON for default value",
                      });
                      return;
                    }
                  }
                  const defaultValue =
                    parameterType === "json" &&
                    typeof defaultValueState.defaultValue === "string"
                      ? JSON.parse(defaultValueState.defaultValue)
                      : defaultValueState.defaultValue;
                  onSave({
                    key,
                    parameterType: "workflow",
                    dataType: parameterType,
                    description,
                    defaultValue: defaultValueState.hasDefaultValue
                      ? defaultValue
                      : null,
                  });
                }
                if (type === "credential" && credentialType === "bitwarden") {
                  const errorMessage = validateBitwardenLoginCredential(
                    bitwardenCollectionId,
                    bitwardenLoginCredentialItemId,
                    urlParameterKey,
                  );
                  if (errorMessage) {
                    toast({
                      variant: "destructive",
                      title: "Failed to save parameter",
                      description: errorMessage,
                    });
                    return;
                  }
                  onSave({
                    key,
                    parameterType: "credential",
                    collectionId:
                      bitwardenCollectionId === ""
                        ? null
                        : bitwardenCollectionId,
                    itemId:
                      bitwardenLoginCredentialItemId === ""
                        ? null
                        : bitwardenLoginCredentialItemId,
                    urlParameterKey:
                      urlParameterKey === "" ? null : urlParameterKey,
                    description,
                  });
                }
                if (type === "credential" && credentialType === "onepassword") {
                  if (vaultId.trim() === "" || itemId.trim() === "") {
                    toast({
                      variant: "destructive",
                      title: "Failed to add parameter",
                      description: "Vault ID and Item ID are required",
                    });
                    return;
                  }
                  onSave({
                    key,
                    parameterType: "onepassword",
                    vaultId,
                    itemId,
                    description,
                  });
                }
                if (type === "secret" || type === "creditCardData") {
                  if (!bitwardenCollectionId) {
                    toast({
                      variant: "destructive",
                      title: "Failed to save parameter",
                      description: "Collection ID is required",
                    });
                    return;
                  }
                }
                if (type === "secret") {
                  onSave({
                    key,
                    parameterType: "secret",
                    collectionId: bitwardenCollectionId,
                    identityFields: identityFields
                      .split(",")
                      .filter((s) => s.length > 0)
                      .map((field) => field.trim()),
                    identityKey,
                    description,
                  });
                }
                if (type === "creditCardData") {
                  onSave({
                    key,
                    parameterType: "creditCardData",
                    collectionId: bitwardenCollectionId,
                    itemId: sensitiveInformationItemId,
                    description,
                  });
                }
                if (type === "context") {
                  if (!sourceParameterKey) {
                    toast({
                      variant: "destructive",
                      title: "Failed to add parameter",
                      description: "Source parameter key is required",
                    });
                    return;
                  }
                  onSave({
                    key,
                    parameterType: "context",
                    sourceParameterKey,
                    description,
                  });
                }
                if (type === "credential" && credentialType === "skyvern") {
                  if (!credentialId) {
                    toast({
                      variant: "destructive",
                      title: "Failed to add parameter",
                      description: "Credential is required",
                    });
                    return;
                  }
                  onSave({
                    key,
                    parameterType: "credential",
                    credentialId,
                    description,
                  });
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </ScrollAreaViewport>
    </ScrollArea>
  );
}

export { WorkflowParameterAddPanel };
