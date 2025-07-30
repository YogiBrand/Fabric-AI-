import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/PageLayout";
import { ContactsPage } from "./ContactsPage";
import { CompaniesPage } from "./CompaniesPage";
import { OpportunitiesPage } from "./OpportunitiesPage";
import { CRMDashboard } from "./CRMDashboard";

export function CRMPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">CRM</h1>
          <p className="text-muted-foreground">
            Manage your contacts, companies, and opportunities from automation results
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <CRMDashboard />
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <ContactsPage />
          </TabsContent>

          <TabsContent value="companies" className="mt-6">
            <CompaniesPage />
          </TabsContent>

          <TabsContent value="opportunities" className="mt-6">
            <OpportunitiesPage />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}