import type { Node } from "@xyflow/react";

export type CRMNodeData = {
  editable: boolean;
  label: string;
  debuggable: boolean;
  crmAction: "create_contact" | "create_company" | "create_opportunity" | "log_activity";
  contactEmail?: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactPhone?: string;
  contactJobTitle?: string;
  contactCompanyId?: string;
  companyName?: string;
  companyDomain?: string;
  companyIndustry?: string;
  opportunityName?: string;
  opportunityContactId?: string;
  opportunityCompanyId?: string;
  opportunityValue?: number;
  activityType?: "automation_run" | "email" | "call" | "meeting" | "note";
  activitySubject?: string;
  activityDescription?: string;
  activityContactId?: string;
  activityCompanyId?: string;
};

export type CRMNode = Node<CRMNodeData, "crmNode">;