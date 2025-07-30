import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCredentialGetter } from "@/hooks/useCredentialGetter";
import * as crmApi from "@/api/crm";
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
} from "@/api/types";

// CRM Stats Hook
export function useCRMStats() {
  const credentialGetter = useCredentialGetter();
  
  return useQuery({
    queryKey: ["crm", "stats"],
    queryFn: () => crmApi.getCRMStats(credentialGetter),
  });
}

// Contact Hooks
export function useContacts(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  leadStatus?: string;
  companyId?: string;
}) {
  const credentialGetter = useCredentialGetter();
  
  return useQuery({
    queryKey: ["crm", "contacts", params],
    queryFn: () => crmApi.getContacts(credentialGetter, params),
  });
}

export function useContact(contactId: string | undefined) {
  const credentialGetter = useCredentialGetter();
  
  return useQuery({
    queryKey: ["crm", "contacts", contactId],
    queryFn: () => crmApi.getContact(credentialGetter, contactId!),
    enabled: !!contactId,
  });
}

export function useCreateContact() {
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ContactCreate) => 
      crmApi.createContact(credentialGetter, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "contacts"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "stats"] });
    },
  });
}

export function useUpdateContact() {
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contactId, data }: { contactId: string; data: ContactUpdate }) => 
      crmApi.updateContact(credentialGetter, contactId, data),
    onSuccess: (_, { contactId }) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "contacts"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "contacts", contactId] });
      queryClient.invalidateQueries({ queryKey: ["crm", "stats"] });
    },
  });
}

export function useDeleteContact() {
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contactId: string) => 
      crmApi.deleteContact(credentialGetter, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "contacts"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "stats"] });
    },
  });
}

// Company Hooks
export function useCompanies(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  industry?: string;
  size?: string;
}) {
  const credentialGetter = useCredentialGetter();
  
  return useQuery({
    queryKey: ["crm", "companies", params],
    queryFn: () => crmApi.getCompanies(credentialGetter, params),
  });
}

export function useCompany(companyId: string | undefined) {
  const credentialGetter = useCredentialGetter();
  
  return useQuery({
    queryKey: ["crm", "companies", companyId],
    queryFn: () => crmApi.getCompany(credentialGetter, companyId!),
    enabled: !!companyId,
  });
}

export function useCreateCompany() {
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CompanyCreate) => 
      crmApi.createCompany(credentialGetter, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "companies"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "stats"] });
    },
  });
}

export function useUpdateCompany() {
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ companyId, data }: { companyId: string; data: CompanyUpdate }) => 
      crmApi.updateCompany(credentialGetter, companyId, data),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "companies"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "companies", companyId] });
      queryClient.invalidateQueries({ queryKey: ["crm", "stats"] });
    },
  });
}

export function useDeleteCompany() {
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (companyId: string) => 
      crmApi.deleteCompany(credentialGetter, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "companies"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "stats"] });
    },
  });
}

// Opportunity Hooks
export function useOpportunities(params?: {
  page?: number;
  pageSize?: number;
  contactId?: string;
  companyId?: string;
  stage?: string;
}) {
  const credentialGetter = useCredentialGetter();
  
  return useQuery({
    queryKey: ["crm", "opportunities", params],
    queryFn: () => crmApi.getOpportunities(credentialGetter, params),
  });
}

export function useCreateOpportunity() {
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: OpportunityCreate) => 
      crmApi.createOpportunity(credentialGetter, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "stats"] });
    },
  });
}

export function useUpdateOpportunity() {
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ opportunityId, data }: { opportunityId: string; data: Partial<OpportunityCreate> }) => 
      crmApi.updateOpportunity(credentialGetter, opportunityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "stats"] });
    },
  });
}

// Activity Hooks
export function useActivities(params?: {
  contactId?: string;
  companyId?: string;
  opportunityId?: string;
  limit?: number;
}) {
  const credentialGetter = useCredentialGetter();
  
  return useQuery({
    queryKey: ["crm", "activities", params],
    queryFn: () => crmApi.getActivities(credentialGetter, params),
  });
}

export function useCreateActivity() {
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ActivityCreate) => 
      crmApi.createActivity(credentialGetter, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "activities"] });
    },
  });
}

// Extract from Task Hook
export function useExtractCRMData() {
  const credentialGetter = useCredentialGetter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: string) => 
      crmApi.extractCRMDataFromTask(credentialGetter, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm"] });
    },
  });
}