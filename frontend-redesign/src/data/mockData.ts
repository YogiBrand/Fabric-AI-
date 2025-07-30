import { ChatMessage, Workflow, Contact, Company, Upload, WorkflowRun } from '../types';

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: "Hi! I'm your AI assistant. I can help you run workflows, manage your data, and automate lead generation tasks. What would you like to work on today?",
    sender: 'assistant',
    timestamp: new Date(Date.now() - 300000),
  },
];

export const mockWorkflows: Workflow[] = [
  {
    id: '1',
    title: 'LinkedIn Lead Research',
    description: 'Extract contact info and company data from LinkedIn profiles',
    icon: '👤',
    category: 'Lead Generation',
    fields: [
      { name: 'linkedinUrl', label: 'LinkedIn Profile URL', type: 'url', required: true, placeholder: 'https://linkedin.com/in/...' },
      { name: 'includeCompany', label: 'Include Company Data', type: 'select', required: false, options: ['Yes', 'No'] },
    ],
    estimatedTime: '2-3 minutes',
  },
  {
    id: '2',
    title: 'Email Finder & Verification',
    description: 'Find and verify email addresses for prospects',
    icon: '📧',
    category: 'Lead Generation',
    fields: [
      { name: 'companyDomain', label: 'Company Domain', type: 'text', required: true, placeholder: 'example.com' },
      { name: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'John' },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Doe' },
    ],
    estimatedTime: '1-2 minutes',
  },
  {
    id: '3',
    title: 'Company Intelligence Gathering',
    description: 'Research company size, funding, tech stack, and key contacts',
    icon: '🏢',
    category: 'Research',
    fields: [
      { name: 'companyName', label: 'Company Name', type: 'text', required: true, placeholder: 'Acme Corp' },
      { name: 'researchDepth', label: 'Research Depth', type: 'select', required: false, options: ['Basic', 'Detailed', 'Comprehensive'] },
    ],
    estimatedTime: '3-5 minutes',
  },
  {
    id: '4',
    title: 'Social Media Outreach',
    description: 'Automated personalized outreach across multiple platforms',
    icon: '📱',
    category: 'Outreach',
    fields: [
      { name: 'platforms', label: 'Platforms', type: 'select', required: true, options: ['LinkedIn', 'Twitter', 'Email'] },
      { name: 'message', label: 'Message Template', type: 'textarea', required: true, placeholder: 'Hi {{name}}, I noticed...' },
    ],
    estimatedTime: '2-4 minutes',
  },
  {
    id: '5',
    title: 'Competitor Analysis',
    description: 'Analyze competitor pricing, features, and market positioning',
    icon: '🔍',
    category: 'Research',
    fields: [
      { name: 'competitors', label: 'Competitor URLs', type: 'textarea', required: true, placeholder: 'One URL per line' },
      { name: 'focusAreas', label: 'Focus Areas', type: 'select', required: false, options: ['Pricing', 'Features', 'Marketing', 'All'] },
    ],
    estimatedTime: '5-8 minutes',
  },
  {
    id: '6',
    title: 'Content Scraping & Analysis',
    description: 'Extract and analyze content from websites and documents',
    icon: '📄',
    category: 'Research',
    fields: [
      { name: 'urls', label: 'URLs to Scrape', type: 'textarea', required: true, placeholder: 'One URL per line' },
      { name: 'analysisType', label: 'Analysis Type', type: 'select', required: false, options: ['Summary', 'Sentiment', 'Key Points', 'All'] },
    ],
    estimatedTime: '3-6 minutes',
  },
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    company: 'TechCorp Inc.',
    title: 'VP of Marketing',
    phone: '+1 (555) 123-4567',
    status: 'active',
    tags: ['high-priority', 'decision-maker'],
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@innovate.co',
    company: 'Innovate Solutions',
    title: 'CTO',
    status: 'active',
    tags: ['technical', 'warm-lead'],
    createdAt: new Date(Date.now() - 86400000 * 12),
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@startupxyz.com',
    company: 'StartupXYZ',
    title: 'Founder & CEO',
    phone: '+1 (555) 987-6543',
    status: 'inactive',
    tags: ['founder', 'series-a'],
    createdAt: new Date(Date.now() - 86400000 * 8),
  },
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    domain: 'techcorp.com',
    industry: 'Software',
    size: '50-200',
    status: 'qualified',
    contacts: [mockContacts[0]],
    notes: 'Interested in automation solutions. Follow up next week.',
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: '2',
    name: 'Innovate Solutions',
    domain: 'innovate.co',
    industry: 'Consulting',
    size: '10-50',
    status: 'contacted',
    contacts: [mockContacts[1]],
    notes: 'Technical decision maker. Needs ROI analysis.',
    createdAt: new Date(Date.now() - 86400000 * 12),
  },
];

export const mockUploads: Upload[] = [
  {
    id: '1',
    filename: 'leads_database.csv',
    size: 2048576,
    type: 'text/csv',
    uploadedAt: new Date(Date.now() - 86400000 * 2),
    status: 'completed',
    url: '/uploads/leads_database.csv',
  },
  {
    id: '2',
    filename: 'company_logos.zip',
    size: 15728640,
    type: 'application/zip',
    uploadedAt: new Date(Date.now() - 86400000 * 1),
    status: 'processing',
  },
];

export const mockWorkflowRun: WorkflowRun = {
  id: 'run-1',
  workflowId: '1',
  status: 'running',
  progress: 65,
  steps: [
    {
      id: 'step-1',
      title: 'Crawling LinkedIn profile',
      status: 'completed',
      logs: ['Connected to LinkedIn', 'Profile found', 'Extracting basic info'],
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: 'step-2',
      title: 'Extracting contact information',
      status: 'running',
      logs: ['Scanning for email patterns', 'Cross-referencing with databases'],
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: 'step-3',
      title: 'Company data research',
      status: 'pending',
      logs: [],
      timestamp: new Date(),
    },
  ],
  startTime: new Date(Date.now() - 180000),
  previewUrl: 'https://linkedin.com/in/example',
};

export const mockDataUploads: DataUpload[] = [
  {
    id: '1',
    filename: 'tech_companies_q1.csv',
    type: 'companies',
    recordCount: 150,
    uploadedAt: new Date(Date.now() - 86400000 * 2),
    status: 'uploaded',
    columns: ['company_name', 'website', 'industry', 'size'],
    mappedFields: {
      'company_name': 'name',
      'website': 'domain',
      'industry': 'industry',
      'size': 'size'
    }
  },
  {
    id: '2',
    filename: 'saas_contacts_batch2.json',
    type: 'contacts',
    recordCount: 89,
    uploadedAt: new Date(Date.now() - 86400000 * 5),
    status: 'enriched',
    columns: ['name', 'email', 'company', 'title'],
    mappedFields: {
      'name': 'name',
      'email': 'email',
      'company': 'company',
      'title': 'title'
    }
  }
];

export const enrichmentAgents: EnrichmentAgent[] = [
  {
    id: 'crawl4ai',
    name: 'Crawl4AI',
    description: 'Fast web scraping with AI-powered content extraction',
    icon: '🕷️'
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    description: 'Enterprise-grade web scraping and data extraction',
    icon: '🔥'
  },
  {
    id: 'scrapfly',
    name: 'ScrapFly',
    description: 'Reliable web scraping with anti-bot protection',
    icon: '🪰'
  }
];

export const enrichmentFields: EnrichmentField[] = [
  // Basic Company Info
  { id: 'description', label: 'Company Description', description: 'Business overview and mission', category: 'basic' },
  { id: 'address', label: 'Address', description: 'Physical business address', category: 'basic' },
  { id: 'phone', label: 'Phone Number', description: 'Main business phone', category: 'contact' },
  { id: 'employees', label: 'Employee Count', description: 'Number of employees', category: 'basic' },
  { id: 'founded', label: 'Founded Year', description: 'Year company was established', category: 'basic' },
  
  // Contact Information
  { id: 'email', label: 'Contact Email', description: 'General business email', category: 'contact' },
  { id: 'support_email', label: 'Support Email', description: 'Customer support email', category: 'contact' },
  { id: 'sales_email', label: 'Sales Email', description: 'Sales team contact', category: 'contact' },
  
  // Social Media
  { id: 'linkedin', label: 'LinkedIn URL', description: 'Company LinkedIn profile', category: 'social' },
  { id: 'twitter', label: 'Twitter Handle', description: 'Company Twitter account', category: 'social' },
  { id: 'facebook', label: 'Facebook Page', description: 'Company Facebook page', category: 'social' },
  
  // Financial Data
  { id: 'revenue', label: 'Annual Revenue', description: 'Estimated annual revenue', category: 'financial' },
  { id: 'funding', label: 'Total Funding', description: 'Total funding raised', category: 'financial' },
  { id: 'valuation', label: 'Valuation', description: 'Company valuation', category: 'financial' },
  
  // Technology Stack
  { id: 'technologies', label: 'Technologies Used', description: 'Tech stack and tools', category: 'technology' },
  { id: 'cms', label: 'CMS Platform', description: 'Content management system', category: 'technology' },
  { id: 'analytics', label: 'Analytics Tools', description: 'Web analytics platforms', category: 'technology' }
];

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Cold Emailer',
    description: 'Craft a personalized cold email to a prospect using the latest news about their company. Provide context about your company, demonstrate your understanding of their business, and invite them to discuss how you can help.',
    icon: '📧',
    category: 'Sales & Outreach',
    handle: '@ColdEmailer',
    tags: ['email', 'outreach', 'personalization'],
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: '2',
    name: 'LinkedIn Connector',
    description: 'Generate personalized LinkedIn connection requests and follow-up messages based on prospect profiles and mutual connections.',
    icon: '🤝',
    category: 'Sales & Outreach',
    handle: '@LinkedInConnector',
    tags: ['linkedin', 'networking', 'social'],
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: '3',
    name: 'Market Researcher',
    description: 'Analyze market trends, competitor positioning, and industry insights to provide comprehensive market research reports.',
    icon: '📊',
    category: 'Research & Analysis',
    handle: '@MarketResearcher',
    tags: ['research', 'analysis', 'market'],
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: '4',
    name: 'Content Creator',
    description: 'Generate engaging blog posts, social media content, and marketing copy tailored to your brand voice and target audience.',
    icon: '✍️',
    category: 'Content & Marketing',
    handle: '@ContentCreator',
    tags: ['content', 'writing', 'marketing'],
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: '5',
    name: 'Data Analyst',
    description: 'Process and analyze large datasets to extract meaningful insights, create visualizations, and generate actionable recommendations.',
    icon: '📈',
    category: 'Research & Analysis',
    handle: '@DataAnalyst',
    tags: ['data', 'analytics', 'insights'],
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 4),
  },
  {
    id: '6',
    name: 'Social Media Manager',
    description: 'Create and schedule social media posts, engage with followers, and manage your brand presence across multiple platforms.',
    icon: '📱',
    category: 'Content & Marketing',
    handle: '@SocialManager',
    tags: ['social', 'engagement', 'branding'],
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 6),
  },
];