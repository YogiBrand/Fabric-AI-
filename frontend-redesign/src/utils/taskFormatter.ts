/**
 * Formats custom task configuration into a structured prompt for the browser agent
 */

interface CustomTask {
  taskType: 'web_scrape' | 'form_submission' | 'lead_generation';
  dataInputType: 'urls' | 'companies' | 'contacts';
  data: string[];
  useCrawl4AI: boolean;
  llmProvider?: string;
  steps: Array<{ id: string; description: string; order: number }>;
  formFields: Array<{ id: string; name: string; label: string; type: string; required: boolean }>;
}

export function formatCustomTaskPrompt(task: CustomTask, userMessage?: string): string {
  let prompt = '';
  
  // Add user message if provided
  if (userMessage && userMessage.trim()) {
    prompt += `${userMessage}\n\n`;
  }
  
  // Start with custom instructions header
  prompt += '**CUSTOM INSTRUCTIONS - Ensure these instructions are followed:**\n\n';
  
  // Add task type description
  switch (task.taskType) {
    case 'web_scrape':
      prompt += `Task Type: Web Scraping\n`;
      if (task.useCrawl4AI) {
        prompt += `- Use crawl4ai with LLM extraction (${task.llmProvider || 'default provider'})\n`;
        prompt += `- Extract and structure the content as clean markdown\n`;
        prompt += `- Store all scraped data in JSON format for export\n`;
      }
      break;
    case 'form_submission':
      prompt += `Task Type: Form Submission\n`;
      prompt += `Go to the websites listed below and submit forms with the provided field values.\n`;
      break;
    case 'lead_generation':
      prompt += `Task Type: Lead Generation\n`;
      prompt += `Search for and collect lead information from the following sources.\n`;
      break;
  }
  
  prompt += '\n';
  
  // Add data sources
  switch (task.dataInputType) {
    case 'urls':
      prompt += `**Target URLs:**\n`;
      task.data.forEach((url, index) => {
        prompt += `${index + 1}. ${url}\n`;
      });
      break;
    case 'companies':
      prompt += `**Target Companies:**\n`;
      prompt += `Search for the official websites of these companies:\n`;
      task.data.forEach((company, index) => {
        prompt += `${index + 1}. ${company}\n`;
      });
      break;
    case 'contacts':
      prompt += `**Target Contacts:**\n`;
      prompt += `Search for information about these contacts:\n`;
      task.data.forEach((contact, index) => {
        prompt += `${index + 1}. ${contact}\n`;
      });
      break;
  }
  
  prompt += '\n';
  
  // Add steps if provided
  if (task.steps && task.steps.length > 0) {
    prompt += `**Steps to Execute:**\n`;
    task.steps.forEach(step => {
      prompt += `${step.order}. ${step.description}\n`;
    });
    prompt += '\n';
  }
  
  // Add form fields for form submission
  if (task.taskType === 'form_submission' && task.formFields && task.formFields.length > 0) {
    prompt += `**Form Field Values:**\n`;
    task.formFields.forEach(field => {
      prompt += `- ${field.label}${field.required ? ' (required)' : ''}: [${field.name}]\n`;
    });
    prompt += '\n';
  }
  
  // Add special instructions
  prompt += `**Important Instructions:**\n`;
  
  if (task.useCrawl4AI) {
    prompt += `1. For each URL, use crawl4ai to extract content with LLM-powered extraction\n`;
    prompt += `2. Focus on extracting the core content, excluding navigation and footer elements\n`;
    prompt += `3. Store all extracted data in a structured JSON format\n`;
    prompt += `4. At the end of the task, provide a summary and offer to export the collected data as JSON\n`;
  } else {
    prompt += `1. Visit each target systematically\n`;
    prompt += `2. Collect all relevant information\n`;
    prompt += `3. Store data in a structured format\n`;
    prompt += `4. Provide a summary at the end\n`;
  }
  
  if (task.taskType === 'form_submission') {
    prompt += `5. Fill out forms with the provided field values\n`;
    prompt += `6. Handle form validation and submission\n`;
    prompt += `7. Capture confirmation messages or submission results\n`;
  }
  
  return prompt;
}

/**
 * Formats scraped data for JSON export
 */
export function formatScrapedDataForExport(data: any[]): string {
  const exportData = {
    timestamp: new Date().toISOString(),
    totalRecords: data.length,
    data: data
  };
  
  return JSON.stringify(exportData, null, 2);
}