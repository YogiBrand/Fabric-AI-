import { getClient, CredentialGetter } from "./AxiosClient";
import { 
  Contact, 
  ContactCreate, 
  ContactUpdate,
  Company, 
  CompanyCreate, 
  CompanyUpdate,
  Opportunity,
  OpportunityCreate,
  Activity,
  ActivityCreate,
  CRMStats,
  ContactWithRelations
} from "./types";

export async function getCRMStats(
  credentialGetter: CredentialGetter | null
): Promise<CRMStats> {
  const client = await getClient(credentialGetter);
  return client.get("/crm/stats").then((response) => response.data);
}

// Contact APIs
export async function getContacts(
  credentialGetter: CredentialGetter | null,
  params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    leadStatus?: string;
    companyId?: string;
  }
): Promise<{ contacts: Contact[]; total: number }> {
  const client = await getClient(credentialGetter);
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.pageSize) queryParams.append("page_size", String(params.pageSize));
  if (params?.search) queryParams.append("search", params.search);
  if (params?.leadStatus) queryParams.append("lead_status", params.leadStatus);
  if (params?.companyId) queryParams.append("company_id", params.companyId);
  
  return client
    .get("/crm/contacts", { params: queryParams })
    .then((response) => response.data);
}

export async function getContact(
  credentialGetter: CredentialGetter | null,
  contactId: string
): Promise<ContactWithRelations> {
  const client = await getClient(credentialGetter);
  return client
    .get(`/crm/contacts/${contactId}`)
    .then((response) => response.data);
}

export async function createContact(
  credentialGetter: CredentialGetter | null,
  data: ContactCreate
): Promise<Contact> {
  const client = await getClient(credentialGetter);
  return client
    .post("/crm/contacts", data)
    .then((response) => response.data);
}

export async function updateContact(
  credentialGetter: CredentialGetter | null,
  contactId: string,
  data: ContactUpdate
): Promise<Contact> {
  const client = await getClient(credentialGetter);
  return client
    .put(`/crm/contacts/${contactId}`, data)
    .then((response) => response.data);
}

export async function deleteContact(
  credentialGetter: CredentialGetter | null,
  contactId: string
): Promise<void> {
  const client = await getClient(credentialGetter);
  return client.delete(`/crm/contacts/${contactId}`);
}

// Company APIs
export async function getCompanies(
  credentialGetter: CredentialGetter | null,
  params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    industry?: string;
    size?: string;
  }
): Promise<{ companies: Company[]; total: number }> {
  const client = await getClient(credentialGetter);
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.pageSize) queryParams.append("page_size", String(params.pageSize));
  if (params?.search) queryParams.append("search", params.search);
  if (params?.industry) queryParams.append("industry", params.industry);
  if (params?.size) queryParams.append("size", params.size);
  
  return client
    .get("/crm/companies", { params: queryParams })
    .then((response) => response.data);
}

export async function getCompany(
  credentialGetter: CredentialGetter | null,
  companyId: string
): Promise<Company> {
  const client = await getClient(credentialGetter);
  return client
    .get(`/crm/companies/${companyId}`)
    .then((response) => response.data);
}

export async function createCompany(
  credentialGetter: CredentialGetter | null,
  data: CompanyCreate
): Promise<Company> {
  const client = await getClient(credentialGetter);
  return client
    .post("/crm/companies", data)
    .then((response) => response.data);
}

export async function updateCompany(
  credentialGetter: CredentialGetter | null,
  companyId: string,
  data: CompanyUpdate
): Promise<Company> {
  const client = await getClient(credentialGetter);
  return client
    .put(`/crm/companies/${companyId}`, data)
    .then((response) => response.data);
}

export async function deleteCompany(
  credentialGetter: CredentialGetter | null,
  companyId: string
): Promise<void> {
  const client = await getClient(credentialGetter);
  return client.delete(`/crm/companies/${companyId}`);
}

// Opportunity APIs
export async function getOpportunities(
  credentialGetter: CredentialGetter | null,
  params?: {
    page?: number;
    pageSize?: number;
    contactId?: string;
    companyId?: string;
    stage?: string;
  }
): Promise<{ opportunities: Opportunity[]; total: number }> {
  const client = await getClient(credentialGetter);
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.pageSize) queryParams.append("page_size", String(params.pageSize));
  if (params?.contactId) queryParams.append("contact_id", params.contactId);
  if (params?.companyId) queryParams.append("company_id", params.companyId);
  if (params?.stage) queryParams.append("stage", params.stage);
  
  return client
    .get("/crm/opportunities", { params: queryParams })
    .then((response) => response.data);
}

export async function createOpportunity(
  credentialGetter: CredentialGetter | null,
  data: OpportunityCreate
): Promise<Opportunity> {
  const client = await getClient(credentialGetter);
  return client
    .post("/crm/opportunities", data)
    .then((response) => response.data);
}

export async function updateOpportunity(
  credentialGetter: CredentialGetter | null,
  opportunityId: string,
  data: Partial<OpportunityCreate>
): Promise<Opportunity> {
  const client = await getClient(credentialGetter);
  return client
    .put(`/crm/opportunities/${opportunityId}`, data)
    .then((response) => response.data);
}

// Activity APIs
export async function getActivities(
  credentialGetter: CredentialGetter | null,
  params?: {
    contactId?: string;
    companyId?: string;
    opportunityId?: string;
    limit?: number;
  }
): Promise<Activity[]> {
  const client = await getClient(credentialGetter);
  const queryParams = new URLSearchParams();
  
  if (params?.contactId) queryParams.append("contact_id", params.contactId);
  if (params?.companyId) queryParams.append("company_id", params.companyId);
  if (params?.opportunityId) queryParams.append("opportunity_id", params.opportunityId);
  if (params?.limit) queryParams.append("limit", String(params.limit));
  
  return client
    .get("/crm/activities", { params: queryParams })
    .then((response) => response.data);
}

export async function createActivity(
  credentialGetter: CredentialGetter | null,
  data: ActivityCreate
): Promise<Activity> {
  const client = await getClient(credentialGetter);
  return client
    .post("/crm/activities", data)
    .then((response) => response.data);
}

// Extract from Task API
export async function extractCRMDataFromTask(
  credentialGetter: CredentialGetter | null,
  taskId: string
): Promise<{ created_entities: string[] }> {
  const client = await getClient(credentialGetter);
  return client
    .post(`/crm/extract/${taskId}`)
    .then((response) => response.data);
}