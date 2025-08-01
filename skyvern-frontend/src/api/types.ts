export const ArtifactType = {
  Recording: "recording",
  ActionScreenshot: "screenshot_action",
  LLMScreenshot: "screenshot_llm",
  LLMResponseRaw: "llm_response",
  LLMResponseParsed: "llm_response_parsed",
  VisibleElementsTree: "visible_elements_tree",
  VisibleElementsTreeTrimmed: "visible_elements_tree_trimmed",
  VisibleElementsTreeInPrompt: "visible_elements_tree_in_prompt",
  LLMPrompt: "llm_prompt",
  LLMRequest: "llm_request",
  HTMLScrape: "html_scrape",
  SkyvernLog: "skyvern_log",
  SkyvernLogRaw: "skyvern_log_raw",
} as const;

export type ArtifactType = (typeof ArtifactType)[keyof typeof ArtifactType];

export const Status = {
  Created: "created",
  Running: "running",
  Failed: "failed",
  Terminated: "terminated",
  Completed: "completed",
  Queued: "queued",
  TimedOut: "timed_out",
  Canceled: "canceled",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const ProxyLocation = {
  Residential: "RESIDENTIAL",
  ResidentialIE: "RESIDENTIAL_IE",
  ResidentialES: "RESIDENTIAL_ES",
  ResidentialIN: "RESIDENTIAL_IN",
  ResidentialJP: "RESIDENTIAL_JP",
  ResidentialGB: "RESIDENTIAL_GB",
  ResidentialFR: "RESIDENTIAL_FR",
  ResidentialDE: "RESIDENTIAL_DE",
  ResidentialNZ: "RESIDENTIAL_NZ",
  ResidentialZA: "RESIDENTIAL_ZA",
  ResidentialAR: "RESIDENTIAL_AR",
  ResidentialAU: "RESIDENTIAL_AU",
  ResidentialISP: "RESIDENTIAL_ISP",
  None: "NONE",
} as const;

export type ProxyLocation = (typeof ProxyLocation)[keyof typeof ProxyLocation];

export type ArtifactApiResponse = {
  created_at: string;
  modified_at: string;
  artifact_id: string;
  task_id: string;
  step_id: string;
  artifact_type: ArtifactType;
  uri: string;
  signed_url?: string | null;
  organization_id: string;
};

export type ActionResultApiResponse = {
  success: boolean;
};

export type ActionAndResultApiResponse = [
  ActionApiResponse,
  Array<ActionResultApiResponse>,
];

export type StepApiResponse = {
  step_id: string;
  task_id: string;
  created_at: string;
  modified_at: string;
  input_token_count: number;
  is_last: boolean;
  order: number;
  organization_id: string;
  output?: {
    actions_and_results: ActionAndResultApiResponse[];
    errors: unknown[];
  };
  retry_index: number;
  status: Status;
  step_cost: number;
};

export type Task = {
  task_id: string;
  status: Status;
  created_at: string; // ISO 8601
  modified_at: string; // ISO 8601
  extracted_information: Record<string, unknown> | string | null;
  screenshot_url: string | null;
  recording_url: string | null;
  organization_id: string;
  workflow_run_id: string | null;
  order: number | null;
  retry: number | null;
  max_steps_per_run: number | null;
  errors: Array<Record<string, unknown>>;
  title: string | null;
  url: string;
  webhook_callback_url: string | null;
  navigation_goal: string | null;
  data_extraction_goal: string | null;
  navigation_payload: Record<string, unknown> | string | null;
  complete_criterion: string | null;
  terminate_criterion: string | null;
  application: string | null;
};

export type TaskApiResponse = {
  request: CreateTaskRequest;
  task_id: string;
  status: Status;
  created_at: string; // ISO 8601
  modified_at: string; // ISO 8601
  extracted_information: Record<string, unknown> | string | null;
  screenshot_url: string | null;
  recording_url: string | null;
  failure_reason: string | null;
  errors: Array<Record<string, unknown>>;
  max_steps_per_run: number | null;
  task_v2: TaskV2 | null;
  workflow_run_id: string | null;
};

export type CreateTaskRequest = {
  title?: string | null;
  url: string;
  webhook_callback_url?: string | null;
  navigation_goal?: string | null;
  data_extraction_goal?: string | null;
  navigation_payload?: Record<string, unknown> | string | null;
  extracted_information_schema?: Record<string, unknown> | string | null;
  extra_http_headers?: Record<string, string> | null;
  error_code_mapping?: Record<string, string> | null;
  proxy_location?: ProxyLocation | null;
  totp_verification_url?: string | null;
  totp_identifier?: string | null;
  application?: string | null;
  include_action_history_in_verification?: boolean | null;
  max_screenshot_scrolls?: number | null;
  model?: string | null;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type OrganizationApiResponse = {
  created_at: string;
  modified_at: string;
  max_retries_per_step: number | null;
  max_steps_per_run: number | null;
  organization_id: string;
  organization_name: string;
  webhook_callback_url: string | null;
};

export type ApiKeyApiResponse = {
  id: string;
  organization_id: string;
  token: string;
  created_at: string;
  modified_at: string;
  token_type: string;
  valid: boolean;
};

// TODO complete this
export const ActionTypes = {
  InputText: "input_text",
  Click: "click",
  SelectOption: "select_option",
  UploadFile: "upload_file",
  complete: "complete",
  wait: "wait",
  terminate: "terminate",
  SolveCaptcha: "solve_captcha",
  extract: "extract",
  ReloadPage: "reload_page",
  KeyPress: "keypress",
  Scroll: "scroll",
  Move: "move",
  NullAction: "null_action",
  VerificationCode: "verification_code",
  Drag: "drag",
  LeftMouse: "left_mouse",
} as const;

export type ActionType = (typeof ActionTypes)[keyof typeof ActionTypes];

export const ReadableActionTypes: {
  [key in ActionType]: string;
} = {
  input_text: "Input Text",
  click: "Click",
  select_option: "Select Option",
  upload_file: "Upload File",
  complete: "Complete",
  wait: "Wait",
  terminate: "Terminate",
  solve_captcha: "Solve Captcha",
  extract: "Extract Data",
  reload_page: "Reload Page",
  keypress: "Press Keys",
  scroll: "Scroll",
  move: "Move",
  null_action: "Screenshot",
  verification_code: "Verification Code",
  drag: "Drag",
  left_mouse: "Left Mouse",
};

export type Option = {
  label: string;
  index: number;
  value: string;
};

export type ActionApiResponse = {
  reasoning: string;
  confidence_float?: number;
  action_type: ActionType;
  text: string | null;
  option: Option | null;
  file_url: string | null;
};

export type Action = {
  reasoning: string;
  confidence?: number;
  type: ActionType;
  input: string;
  success: boolean;
  stepId: string;
  index: number;
};

export type EvalKind = "workflow" | "task";

export interface Eval {
  kind: EvalKind;
  created_at: string;
  organization_id: string;
  status: Status;
  title: string | null;
  workflow_permanent_id: string | null;
  workflow_run_id: string | null;
}

export interface EvalWorkflow extends Eval {
  kind: "workflow";
}

export interface EvalTask extends Eval {
  kind: "task";
  task_id: string;
  url: string | null;
}

export type EvalApiResponse = EvalWorkflow[] | EvalTask[];

export type DebugSessionApiResponse = {
  debug_session_id: string;
  browser_session_id: string;
  workflow_permanent_id: string | null;
  created_at: string;
  modified_at: string;
};

export type WorkflowRunApiResponse = {
  created_at: string;
  failure_reason: string | null;
  modified_at: string;
  proxy_location: ProxyLocation | null;
  status: Status;
  title?: string;
  webhook_callback_url: string;
  workflow_id: string;
  workflow_permanent_id: string;
  workflow_run_id: string;
  workflow_title: string | null;
};

export type WorkflowRunStatusApiResponse = {
  workflow_id: string;
  workflow_run_id: string;
  status: Status;
  proxy_location: ProxyLocation | null;
  webhook_callback_url: string | null;
  extra_http_headers: Record<string, string> | null;
  created_at: string;
  modified_at: string;
  parameters: Record<string, unknown>;
  screenshot_urls: Array<string> | null;
  recording_url: string | null;
  outputs: Record<string, unknown> | null;
  failure_reason: string | null;
  downloaded_file_urls: Array<string> | null;
  total_steps: number | null;
  total_cost: number | null;
  task_v2: TaskV2 | null;
  workflow_title: string | null;
  browser_session_id: string | null;
  max_screenshot_scrolls: number | null;
};

export type TaskGenerationApiResponse = {
  suggested_title: string | null;
  url: string | null;
  navigation_goal: string | null;
  data_extraction_goal: string | null;
  navigation_payload: Record<string, unknown> | null;
  extracted_information_schema: Record<string, unknown> | null;
};

export type ActionsApiResponse = {
  action_id: string;
  action_type: ActionType;
  status: Status;
  task_id: string | null;
  step_id: string | null;
  step_order: number | null;
  action_order: number | null;
  confidence_float: number | null;
  description: string | null;
  reasoning: string | null;
  intention: string | null;
  response: string | null;
};

export type TaskV2 = {
  task_id: string;
  status: Status;
  workflow_run_id: string | null;
  workflow_id: string | null;
  workflow_permanent_id: string | null;
  prompt: string | null;
  url: string | null;
  created_at: string;
  modified_at: string;
  output: Record<string, unknown> | null;
  summary: string | null;
  webhook_callback_url: string | null;
  totp_verification_url: string | null;
  totp_identifier: string | null;
  proxy_location: ProxyLocation | null;
  extra_http_headers: Record<string, string> | null;
};

export type Createv2TaskRequest = {
  user_prompt: string;
  webhook_callback_url?: string | null;
  proxy_location?: ProxyLocation | null;
  browser_session_id?: string | null;
};

export type PasswordCredentialApiResponse = {
  username: string;
};

export type CreditCardCredentialApiResponse = {
  last_four: string;
  brand: string;
};

export type CredentialApiResponse = {
  credential_id: string;
  credential: PasswordCredentialApiResponse | CreditCardCredentialApiResponse;
  credential_type: "password" | "credit_card";
  name: string;
};

export function isPasswordCredential(
  credential: PasswordCredentialApiResponse | CreditCardCredentialApiResponse,
): credential is PasswordCredentialApiResponse {
  return "username" in credential;
}

export function isCreditCardCredential(
  credential: PasswordCredentialApiResponse | CreditCardCredentialApiResponse,
): credential is CreditCardCredentialApiResponse {
  return "last_four" in credential;
}

export type CreateCredentialRequest = {
  name: string;
  credential_type: "password" | "credit_card";
  credential: PasswordCredential | CreditCardCredential;
};

export type PasswordCredential = {
  username: string;
  password: string;
  totp: string | null;
};

export type CreditCardCredential = {
  card_number: string;
  card_cvv: string;
  card_exp_month: string;
  card_exp_year: string;
  card_brand: string;
  card_holder_name: string;
};

export type ModelsResponse = {
  models: Record<string, string>;
};

export const RunEngine = {
  SkyvernV1: "skyvern-1.0",
  SkyvernV2: "skyvern-2.0",
  OpenaiCua: "openai-cua",
  AnthropicCua: "anthropic-cua",
} as const;

export type RunEngine = (typeof RunEngine)[keyof typeof RunEngine];

export type PylonEmailHash = {
  hash: string;
};

// CRM Types
export const LeadStatus = {
  New: "new",
  Contacted: "contacted",
  Qualified: "qualified",
  Proposal: "proposal",
  Negotiation: "negotiation",
  Customer: "customer",
  Lost: "lost",
} as const;

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export const CompanySize = {
  Small: "small",
  Medium: "medium",
  Large: "large",
  Enterprise: "enterprise",
} as const;

export type CompanySize = (typeof CompanySize)[keyof typeof CompanySize];

export const OpportunityStage = {
  Prospecting: "prospecting",
  Qualification: "qualification",
  Proposal: "proposal",
  Negotiation: "negotiation",
  ClosedWon: "closed_won",
  ClosedLost: "closed_lost",
} as const;

export type OpportunityStage = (typeof OpportunityStage)[keyof typeof OpportunityStage];

export const ActivityType = {
  Call: "call",
  Email: "email",
  Meeting: "meeting",
  Note: "note",
  Task: "task",
  Automation: "automation",
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export type Contact = {
  contact_id: string;
  organization_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  phone: string | null;
  job_title: string | null;
  company_id: string | null;
  lead_status: LeadStatus;
  lead_score: number;
  source: string | null;
  source_task_id: string | null;
  source_workflow_run_id: string | null;
  tags: string[];
  custom_fields: Record<string, any>;
  notes: string | null;
  created_at: string;
  modified_at: string;
};

export type ContactCreate = {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  job_title?: string;
  company_id?: string;
  lead_status?: LeadStatus;
  source?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  notes?: string;
};

export type ContactUpdate = Partial<ContactCreate>;

export type Company = {
  company_id: string;
  organization_id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  size: CompanySize | null;
  revenue_range: string | null;
  description: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  custom_fields: Record<string, any>;
  created_at: string;
  modified_at: string;
};

export type CompanyCreate = {
  name: string;
  domain?: string;
  industry?: string;
  size?: CompanySize;
  revenue_range?: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  custom_fields?: Record<string, any>;
};

export type CompanyUpdate = Partial<CompanyCreate>;

export type Opportunity = {
  opportunity_id: string;
  organization_id: string;
  contact_id: string | null;
  company_id: string | null;
  name: string;
  stage: OpportunityStage;
  value: number | null;
  probability: number;
  expected_close_date: string | null;
  actual_close_date: string | null;
  workflow_id: string | null;
  description: string | null;
  custom_fields: Record<string, any>;
  created_at: string;
  modified_at: string;
};

export type OpportunityCreate = {
  contact_id?: string;
  company_id?: string;
  name: string;
  stage?: OpportunityStage;
  value?: number;
  probability?: number;
  expected_close_date?: string;
  workflow_id?: string;
  description?: string;
  custom_fields?: Record<string, any>;
};

export type Activity = {
  activity_id: string;
  organization_id: string;
  contact_id: string | null;
  company_id: string | null;
  opportunity_id: string | null;
  type: ActivityType;
  subject: string | null;
  description: string | null;
  task_id: string | null;
  workflow_run_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  modified_at: string;
};

export type ActivityCreate = {
  contact_id?: string;
  company_id?: string;
  opportunity_id?: string;
  type: ActivityType;
  subject?: string;
  description?: string;
  task_id?: string;
  workflow_run_id?: string;
  metadata?: Record<string, any>;
};

export type ContactWithRelations = {
  contact: Contact;
  company: Company | null;
  activities: Activity[];
  opportunities: Opportunity[];
};

export type CRMStats = {
  total_contacts: number;
  total_companies: number;
  total_opportunities: number;
  opportunities_value: number;
  contacts_by_status: Record<string, number>;
  opportunities_by_stage: Record<string, number>;
};
