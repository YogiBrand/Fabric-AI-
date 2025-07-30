import React from 'react';
import { UploadsSection } from './Portal/sections/UploadsSection';
import { ContactsSection } from './Portal/sections/ContactsSection';
import { CompaniesSection } from './Portal/sections/CompaniesSection';
import { WorkflowsSection } from './Portal/sections/WorkflowsSection';
import { AgentsSection } from './Portal/sections/AgentsSection';
import { SettingsSection } from './Portal/sections/SettingsSection';
import { useApp } from '../contexts/AppContext';

export function PortalView() {
  const { state } = useApp();

  const renderSection = () => {
    switch (state.activePortalSection) {
      case 'uploads':
        return <UploadsSection />;
      case 'contacts':
        return <ContactsSection />;
      case 'companies':
        return <CompaniesSection />;
      case 'workflows':
        return <WorkflowsSection />;
      case 'agents':
        return <AgentsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <UploadsSection />;
    }
  };

  return (
    <div className="flex-1 bg-white overflow-auto">
      {renderSection()}
    </div>
  );
}