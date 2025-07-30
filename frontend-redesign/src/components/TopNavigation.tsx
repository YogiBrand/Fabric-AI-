import React from 'react';
import { useApp } from '../contexts/AppContext';

export function TopNavigation() {
  const { state } = useApp();

  // Don't render anything for chat mode (no top navigation needed)
  if (state.activeTab === 'chat') {
    return null;
  }

  // For portal mode, we could add portal-specific navigation here if needed
  return null;
}