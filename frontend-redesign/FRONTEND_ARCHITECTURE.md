# Fabric Frontend Architecture Documentation

## Overview

This document provides a comprehensive overview of the Fabric frontend application architecture, components, and structure. The frontend is built as a modern React TypeScript application using Vite as the build tool.

## Technology Stack

### Core Technologies
- **React 18.3.1** - UI library for building component-based interfaces
- **TypeScript 5.5.3** - Static typing for JavaScript
- **Vite 5.4.2** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

### Key Libraries
- **Supabase JS 2.52.1** - Backend as a Service for authentication and database
- **Axios 1.11.0** - HTTP client for API requests
- **Lucide React** - Icon library
- **React Resizable Panels** - Resizable panel layouts
- **PapaParse 5.5.3** - CSV parsing library
- **UUID 11.1.0** - Unique identifier generation

## Project Structure

```
frontend-redesign/
├── src/                        # Source code directory
│   ├── main.tsx               # Application entry point
│   ├── App.tsx                # Root component
│   ├── index.css              # Global styles
│   ├── vite-env.d.ts          # Vite environment types
│   │
│   ├── components/            # React components
│   │   ├── Portal/            # Portal-specific components
│   │   │   ├── sections/      # Portal section components
│   │   │   └── ...           # Various portal components
│   │   └── ...               # General components
│   │
│   ├── contexts/              # React contexts
│   │   └── AppContext.tsx     # Global application state
│   │
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Central type exports
│   │
│   ├── utils/                 # Utility functions
│   │   ├── api.ts            # API helper functions
│   │   ├── recordToLog.ts    # Logging utilities
│   │   └── taskFormatter.ts  # Task formatting utilities
│   │
│   └── data/                  # Static data
│       └── mockData.ts        # Mock data for development
│
├── Configuration Files
│   ├── index.html             # HTML entry point
│   ├── package.json           # Dependencies and scripts
│   ├── package-lock.json      # Locked dependency versions
│   ├── tsconfig.json          # TypeScript configuration
│   ├── tsconfig.app.json      # App-specific TS config
│   ├── tsconfig.node.json     # Node-specific TS config
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   ├── eslint.config.js       # ESLint configuration
│   └── .env.example           # Environment variables example
```

## Component Architecture

### Core Components

#### Layout Components
- **MainLayout.tsx** - Main application layout wrapper
- **Sidebar.tsx** - Navigation sidebar
- **TopNavigation.tsx** - Top navigation bar

#### View Components
- **ChatView.tsx** - Main chat interface
- **PortalView.tsx** - Portal dashboard view
- **ChromiumPreview.tsx** - Browser preview component

#### Feature Components

**Chat & Communication**
- **ChatThread.tsx** - Individual chat thread display
- **TerminalLogs.tsx** - Terminal log viewer

**Browser & Automation**
- **BrowserStatus.tsx** - Browser status indicator
- **BrowserActionCard.tsx** - Browser action display
- **BrowserStepCard.tsx** - Step-by-step browser actions
- **ChromiumPreviewSimple.tsx** - Simplified browser preview

**Data & Research**
- **DataExtractionPanel.tsx** - Data extraction interface
- **ResearchProgress.tsx** - Research progress tracker
- **ResearchStepCard.tsx** - Individual research step display
- **StepLogTable.tsx** - Step logging table

**Workflow & Automation**
- **WorkflowCards.tsx** - Workflow card displays
- **WorkflowModal.tsx** - Workflow modal interface
- **CustomTaskBlock.tsx** - Custom task display
- **CustomTaskWizard.tsx** - Custom task creation wizard
- **AgentProgressCard.tsx** - Agent progress tracking

**Portal Components**
- **EnrichmentWizard.tsx** - Data enrichment wizard
- **UploadWizard.tsx** - File upload wizard
- **WorkflowWizard.tsx** - Workflow creation wizard
- **NewAgentWizard.tsx** - Agent creation wizard
- **CompanyDetailView.tsx** - Company details view
- **DataTable.tsx** - Data table component
- **OutreachWorkflow.tsx** - Outreach workflow interface

**Portal Sections**
- **CompaniesSection.tsx** - Companies management
- **ContactsSection.tsx** - Contacts management
- **AgentsSection.tsx** - Agents management
- **WorkflowsSection.tsx** - Workflows management
- **UploadsSection.tsx** - Uploads management
- **SettingsSection.tsx** - Settings interface

**Utility Components**
- **LLMSelector.tsx** - Language model selector
- **CredentialsForm.tsx** - Credentials input form
- **GoogleSheetsInput.tsx** - Google Sheets integration
- **DataExportCard.tsx** - Data export interface
- **LiveStatusTimeline.tsx** - Real-time status timeline

## State Management

### AppContext
The application uses React Context API for global state management through `AppContext.tsx`. This context provides:
- User authentication state
- Application settings
- Global data management
- WebSocket connection management

## API Integration

### API Utilities (`utils/api.ts`)
Centralized API communication layer handling:
- HTTP requests using Axios
- Request/response interceptors
- Error handling
- Authentication headers

### WebSocket Integration
Real-time communication for:
- Live chat updates
- Browser automation status
- Research progress tracking
- Agent task updates

## Styling System

### Tailwind CSS
- Utility-first CSS framework
- Custom configuration in `tailwind.config.js`
- Responsive design utilities
- Dark mode support (if configured)

### Global Styles (`index.css`)
- CSS reset and base styles
- Tailwind directives
- Custom utility classes
- Component-specific overrides

## Build & Development

### NPM Scripts
```json
{
  "dev": "vite",              // Start development server
  "build": "vite build",      // Build for production
  "lint": "eslint .",         // Run linting
  "preview": "vite preview"   // Preview production build
}
```

### Development Workflow
1. `npm install` - Install dependencies
2. `npm run dev` - Start development server (default: http://localhost:5173)
3. `npm run build` - Create production build in `dist/`
4. `npm run preview` - Preview production build locally

### Environment Variables
Configure in `.env` file (see `.env.example`):
- API endpoints
- Supabase configuration
- Feature flags
- Third-party service keys

## Type System

### TypeScript Configuration
- Strict mode enabled
- Module resolution for absolute imports
- Path aliases configured
- Separate configs for app and node environments

### Type Definitions (`types/index.ts`)
Central location for:
- Component prop types
- API response types
- Domain models
- Utility types

## Key Features

### 1. Chat Interface
- Real-time messaging
- AI-powered responses
- File attachments
- Message history

### 2. Browser Automation
- Visual browser preview
- Step-by-step automation
- Screenshot capture
- Action recording

### 3. Data Management
- CSV import/export
- Data extraction
- Table visualization
- Filtering and sorting

### 4. Workflow Builder
- Visual workflow creation
- Agent task assignment
- Progress tracking
- Result visualization

### 5. Portal Dashboard
- Company management
- Contact database
- Agent orchestration
- Upload processing

## Performance Optimizations

### Vite Optimizations
- Fast HMR (Hot Module Replacement)
- Optimized builds with Rollup
- Code splitting
- Tree shaking

### React Optimizations
- Component lazy loading
- Memoization where appropriate
- Virtual scrolling for large lists
- Optimized re-renders

## Testing Considerations

While no test files are included in this export, the architecture supports:
- Unit testing with Vitest
- Component testing with React Testing Library
- E2E testing with Playwright/Cypress
- API mocking for isolated testing

## Security Considerations

- Environment variables for sensitive data
- Supabase Row Level Security
- Input validation
- XSS protection through React
- CSRF protection in API calls

## Deployment

The application can be deployed to:
- **Vercel** - Optimal for Vite apps
- **Netlify** - Simple static hosting
- **AWS S3 + CloudFront** - Scalable solution
- **Docker** - Containerized deployment

### Production Build
```bash
npm run build
# Outputs to dist/ directory
```

## Future Considerations

### Scalability
- Code splitting for larger bundles
- Lazy loading for routes
- Service worker for offline support
- CDN integration for assets

### Maintainability
- Component documentation
- Storybook integration
- Automated testing
- CI/CD pipeline

### Feature Expansion
- Internationalization (i18n)
- Advanced theming
- Plugin architecture
- Mobile responsive improvements

## Conclusion

This frontend architecture provides a solid foundation for building a modern, scalable web application. The combination of React, TypeScript, and Vite offers excellent developer experience while maintaining high performance and type safety.