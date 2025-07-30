# Workflow Setup Guide for Discovery Page

This guide explains how to set up workflows so they appear correctly on the discovery page.

## Requirements for Workflows

For a workflow to appear on the discovery page, it must:

1. **Be a template workflow** - The API query filters for `template=true`
2. **Have a descriptive title** - This is used for categorization and display
3. **Have a description** - This explains what the workflow does

## Workflow Categories

Workflows are automatically categorized based on keywords in their titles:

### Lead Generation
- Keywords: `linkedin`, `lead`, `email` + (`find` or `verif`)
- Examples:
  - "LinkedIn Lead Research"
  - "Email Finder & Verification"
  - "Lead Generation Tool"

### Research
- Keywords: `company` + (`intelligence` or `research`), `competitor`, `analysis`, `content`, `scrap`
- Examples:
  - "Company Intelligence Gathering"
  - "Competitor Analysis"
  - "Content Scraping & Analysis"

### Data Processing
- Keywords: `data`, `extract`
- Examples:
  - "Data Extraction Tool"
  - "Extract Information from PDFs"

### Automation
- Keywords: `automat`, `bot`
- Examples:
  - "Automation Workflow"
  - "Bot Creator"

### Other
- Any workflow that doesn't match the above categories

## Creating a Workflow for Discovery

When creating a workflow via the API or workflow editor:

1. **Set as Template**: Ensure the workflow is marked as a template
2. **Title**: Use descriptive titles with relevant keywords
3. **Description**: Provide a clear, concise description (60-80 characters ideal)

Example workflow structure:
```json
{
  "title": "LinkedIn Lead Research",
  "description": "Extract contact info and company data from LinkedIn profiles",
  "is_saved_task": true,
  "workflow_definition": {
    "parameters": [...],
    "blocks": [...]
  }
}
```

## Icon and Time Estimates

Icons and time estimates are automatically assigned based on the workflow category:
- Lead Generation: 👤 or 📧 (1-3 minutes)
- Research: 🏢, 🔍, or 📄 (3-8 minutes)
- Data Processing: 📊 (2-4 minutes)
- Automation: 🤖 (3-5 minutes)
- Other: 🔧 (2-3 minutes)

## API Endpoint

Workflows are fetched using:
```
GET /workflows?template=true&page_size=100
```

Ensure your workflows are properly configured to be returned by this query.