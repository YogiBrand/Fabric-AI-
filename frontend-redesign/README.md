# Fabric Frontend - Redesign Base

This folder contains all the frontend code for the Fabric application, consolidated for redesign purposes.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## What's Included

### Source Code (`src/`)
- **30+ React Components** - Complete UI component library
- **State Management** - Context-based global state
- **API Integration** - Axios-based API client
- **Type Definitions** - Full TypeScript coverage
- **Utilities** - Helper functions and formatters

### Configuration Files
- **Vite** - Modern build tool configuration
- **TypeScript** - Type checking and compilation
- **Tailwind CSS** - Utility-first styling
- **ESLint** - Code quality and standards
- **PostCSS** - CSS processing

### Key Features
- Real-time chat interface
- Browser automation preview
- Data extraction and management
- Workflow builder
- Portal dashboard
- Company and contact management

## Architecture Overview

```
Frontend Stack:
├── React 18 (UI Library)
├── TypeScript (Type Safety)
├── Vite (Build Tool)
├── Tailwind CSS (Styling)
├── Supabase (Backend Integration)
└── Axios (HTTP Client)
```

## Development Guidelines

### Component Structure
- Functional components with hooks
- TypeScript for all components
- Tailwind for styling
- Props validation with TypeScript

### State Management
- React Context for global state
- Local state with useState/useReducer
- Async state with custom hooks

### Code Style
- ESLint rules enforced
- Consistent file naming
- Modular component design
- Reusable utilities

## For Redesign

This codebase serves as the foundation for redesign. Key areas to consider:

1. **UI/UX Improvements**
   - Component library standardization
   - Design system implementation
   - Accessibility enhancements
   - Mobile responsiveness

2. **Performance**
   - Code splitting optimization
   - Lazy loading implementation
   - Bundle size reduction
   - Render optimization

3. **Architecture**
   - State management evaluation
   - API layer abstraction
   - Component composition patterns
   - Testing infrastructure

## Documentation

See `FRONTEND_ARCHITECTURE.md` for detailed technical documentation.

## Support

For questions or issues, please refer to the main project documentation.