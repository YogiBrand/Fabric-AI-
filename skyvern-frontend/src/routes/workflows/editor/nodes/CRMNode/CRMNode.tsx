import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import type { CRMNode } from "./types";
import { NodeHeader } from "../components/NodeHeader";

function CRMNode({ id, data }: NodeProps<CRMNode>) {
  const { updateNodeData } = useReactFlow();
  const { editable, label } = data;

  const [inputs, setInputs] = useState({
    crmAction: data.crmAction || "create_contact",
    contactEmail: data.contactEmail || "",
    contactFirstName: data.contactFirstName || "",
    contactLastName: data.contactLastName || "",
    contactPhone: data.contactPhone || "",
    contactJobTitle: data.contactJobTitle || "",
    contactCompanyId: data.contactCompanyId || "",
    companyName: data.companyName || "",
    companyDomain: data.companyDomain || "",
    companyIndustry: data.companyIndustry || "",
    opportunityName: data.opportunityName || "",
    opportunityContactId: data.opportunityContactId || "",
    opportunityCompanyId: data.opportunityCompanyId || "",
    opportunityValue: data.opportunityValue || 0,
    activityType: data.activityType || "automation_run",
    activitySubject: data.activitySubject || "",
    activityDescription: data.activityDescription || "",
    activityContactId: data.activityContactId || "",
    activityCompanyId: data.activityCompanyId || "",
  });

  function handleInputChange(key: string, value: string | number) {
    if (!editable) {
      return;
    }

    const newInputs = {
      ...inputs,
      [key]: value,
    };
    setInputs(newInputs);
    updateNodeData(id, newInputs);
  }

  const renderContactFields = () => (
    <div className="space-y-3">
      <div>
        <Label htmlFor="contactEmail">Email *</Label>
        <Input
          id="contactEmail"
          placeholder="john.doe@example.com"
          value={inputs.contactEmail}
          onChange={(e) => handleInputChange("contactEmail", e.target.value)}
          disabled={!editable}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="contactFirstName">First Name</Label>
          <Input
            id="contactFirstName"
            placeholder="John"
            value={inputs.contactFirstName}
            onChange={(e) => handleInputChange("contactFirstName", e.target.value)}
            disabled={!editable}
          />
        </div>
        <div>
          <Label htmlFor="contactLastName">Last Name</Label>
          <Input
            id="contactLastName"
            placeholder="Doe"
            value={inputs.contactLastName}
            onChange={(e) => handleInputChange("contactLastName", e.target.value)}
            disabled={!editable}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="contactPhone">Phone</Label>
        <Input
          id="contactPhone"
          placeholder="+1 (555) 123-4567"
          value={inputs.contactPhone}
          onChange={(e) => handleInputChange("contactPhone", e.target.value)}
          disabled={!editable}
        />
      </div>
      <div>
        <Label htmlFor="contactJobTitle">Job Title</Label>
        <Input
          id="contactJobTitle"
          placeholder="Marketing Director"
          value={inputs.contactJobTitle}
          onChange={(e) => handleInputChange("contactJobTitle", e.target.value)}
          disabled={!editable}
        />
      </div>
      <div>
        <Label htmlFor="contactCompanyId">Company ID (optional)</Label>
        <Input
          id="contactCompanyId"
          placeholder="cmp_123456"
          value={inputs.contactCompanyId}
          onChange={(e) => handleInputChange("contactCompanyId", e.target.value)}
          disabled={!editable}
        />
      </div>
    </div>
  );

  const renderCompanyFields = () => (
    <div className="space-y-3">
      <div>
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          placeholder="Acme Corp"
          value={inputs.companyName}
          onChange={(e) => handleInputChange("companyName", e.target.value)}
          disabled={!editable}
        />
      </div>
      <div>
        <Label htmlFor="companyDomain">Domain</Label>
        <Input
          id="companyDomain"
          placeholder="acme.com"
          value={inputs.companyDomain}
          onChange={(e) => handleInputChange("companyDomain", e.target.value)}
          disabled={!editable}
        />
      </div>
      <div>
        <Label htmlFor="companyIndustry">Industry</Label>
        <Input
          id="companyIndustry"
          placeholder="Technology"
          value={inputs.companyIndustry}
          onChange={(e) => handleInputChange("companyIndustry", e.target.value)}
          disabled={!editable}
        />
      </div>
    </div>
  );

  const renderOpportunityFields = () => (
    <div className="space-y-3">
      <div>
        <Label htmlFor="opportunityName">Opportunity Name *</Label>
        <Input
          id="opportunityName"
          placeholder="Enterprise Software License"
          value={inputs.opportunityName}
          onChange={(e) => handleInputChange("opportunityName", e.target.value)}
          disabled={!editable}
        />
      </div>
      <div>
        <Label htmlFor="opportunityValue">Value</Label>
        <Input
          id="opportunityValue"
          type="number"
          placeholder="50000"
          value={inputs.opportunityValue}
          onChange={(e) => handleInputChange("opportunityValue", parseFloat(e.target.value) || 0)}
          disabled={!editable}
        />
      </div>
      <div>
        <Label htmlFor="opportunityContactId">Contact ID</Label>
        <Input
          id="opportunityContactId"
          placeholder="cnt_123456"
          value={inputs.opportunityContactId}
          onChange={(e) => handleInputChange("opportunityContactId", e.target.value)}
          disabled={!editable}
        />
      </div>
      <div>
        <Label htmlFor="opportunityCompanyId">Company ID</Label>
        <Input
          id="opportunityCompanyId"
          placeholder="cmp_123456"
          value={inputs.opportunityCompanyId}
          onChange={(e) => handleInputChange("opportunityCompanyId", e.target.value)}
          disabled={!editable}
        />
      </div>
    </div>
  );

  const renderActivityFields = () => (
    <div className="space-y-3">
      <div>
        <Label htmlFor="activityType">Activity Type</Label>
        <Select
          value={inputs.activityType}
          onValueChange={(value) => handleInputChange("activityType", value)}
          disabled={!editable}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automation_run">Automation Run</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="note">Note</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="activitySubject">Subject</Label>
        <Input
          id="activitySubject"
          placeholder="Activity subject"
          value={inputs.activitySubject}
          onChange={(e) => handleInputChange("activitySubject", e.target.value)}
          disabled={!editable}
        />
      </div>
      <div>
        <Label htmlFor="activityDescription">Description</Label>
        <Textarea
          id="activityDescription"
          placeholder="Activity description"
          value={inputs.activityDescription}
          onChange={(e) => handleInputChange("activityDescription", e.target.value)}
          disabled={!editable}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="activityContactId">Contact ID</Label>
          <Input
            id="activityContactId"
            placeholder="cnt_123456"
            value={inputs.activityContactId}
            onChange={(e) => handleInputChange("activityContactId", e.target.value)}
            disabled={!editable}
          />
        </div>
        <div>
          <Label htmlFor="activityCompanyId">Company ID</Label>
          <Input
            id="activityCompanyId"
            placeholder="cmp_123456"
            value={inputs.activityCompanyId}
            onChange={(e) => handleInputChange("activityCompanyId", e.target.value)}
            disabled={!editable}
          />
        </div>
      </div>
    </div>
  );

  const renderActionFields = () => {
    switch (inputs.crmAction) {
      case "create_contact":
        return renderContactFields();
      case "create_company":
        return renderCompanyFields();
      case "create_opportunity":
        return renderOpportunityFields();
      case "log_activity":
        return renderActivityFields();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm w-[400px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 !w-2 !h-2"
      />
      
      <NodeHeader
        icon="👥"
        title="CRM Action"
        label={label}
        editable={editable}
      />

      <div className="p-4 space-y-4">
        <div>
          <Label htmlFor="crmAction">CRM Action</Label>
          <Select
            value={inputs.crmAction}
            onValueChange={(value) => handleInputChange("crmAction", value)}
            disabled={!editable}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create_contact">Create Contact</SelectItem>
              <SelectItem value="create_company">Create Company</SelectItem>
              <SelectItem value="create_opportunity">Create Opportunity</SelectItem>
              <SelectItem value="log_activity">Log Activity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {renderActionFields()}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400 !w-2 !h-2"
      />
    </div>
  );
}

export { CRMNode };