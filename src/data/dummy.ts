import { SocialMediaMetrics, Lead, Campaign, Customer, SEOMetrics, AnalyticsInsight, ProductOpportunity } from '@/types';

export const dummySocialMetrics: SocialMediaMetrics[] = [
  {
    platform: 'linkedin',
    impressions: 15420,
    engagement: 1235,
    reach: 12300,
    clicks: 456,
    costPerLead: 45000,
    date: '2024-12-01',
    productEngagement: {
      digital_product: 180,
      meterai_elektronik: 420,
      graph_analytic: 230,
      digital_solution: 285,
      smart_card: 120
    },
    leadsByProduct: {
      digital_product: 3,
      meterai_elektronik: 12,
      graph_analytic: 6,
      digital_solution: 8,
      smart_card: 4
    }
  },
  {
    platform: 'instagram',
    impressions: 28900,
    engagement: 2150,
    reach: 21400,
    clicks: 678,
    costPerLead: 60000,
    date: '2024-12-01',
    productEngagement: {
      digital_product: 340,
      meterai_elektronik: 580,
      graph_analytic: 410,
      digital_solution: 520,
      smart_card: 300
    },
    leadsByProduct: {
      digital_product: 5,
      meterai_elektronik: 8,
      graph_analytic: 7,
      digital_solution: 6,
      smart_card: 4
    }
  },
  {
    platform: 'tiktok',
    impressions: 45200,
    engagement: 4560,
    reach: 38900,
    clicks: 1230,
    costPerLead: 35000,
    date: '2024-12-01',
    productEngagement: {
      digital_product: 890,
      meterai_elektronik: 1240,
      graph_analytic: 780,
      digital_solution: 920,
      smart_card: 730
    },
    leadsByProduct: {
      digital_product: 8,
      meterai_elektronik: 15,
      graph_analytic: 9,
      digital_solution: 12,
      smart_card: 6
    }
  },
  {
    platform: 'twitter',
    impressions: 12800,
    engagement: 890,
    reach: 9800,
    clicks: 234,
    costPerLead: 75000,
    date: '2024-12-01',
    productEngagement: {
      digital_product: 120,
      meterai_elektronik: 280,
      graph_analytic: 180,
      digital_solution: 210,
      smart_card: 100
    },
    leadsByProduct: {
      digital_product: 2,
      meterai_elektronik: 6,
      graph_analytic: 3,
      digital_solution: 4,
      smart_card: 2
    }
  }
];

export const dummyLeads: Lead[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    email: 'budi@bankabc.com',
    phone: '081234567890',
    company: 'Bank ABC',
    source: 'linkedin',
    sector: 'keuangan',
    status: 'qualified',
    interestedProducts: ['meterai_elektronik', 'digital_solution'],
    leadScore: 85,
    estimatedValue: 750000,
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sari Indah',
    email: 'sari@fintech.co.id',
    phone: '081234567891',
    company: 'FinTech Solutions',
    source: 'instagram',
    sector: 'keuangan',
    status: 'converted',
    interestedProducts: ['meterai_elektronik'],
    leadScore: 92,
    estimatedValue: 450000,
    createdAt: '2024-12-01T14:30:00Z',
    convertedAt: '2024-12-05T09:15:00Z',
    convertedToCustomerId: '1'
  },
  {
    id: '3',
    name: 'Ahmad Rahman',
    email: 'ahmad@manufaktur.com',
    phone: '081234567892',
    company: 'PT Manufaktur Jaya',
    source: 'tiktok',
    sector: 'manufaktur',
    status: 'new',
    interestedProducts: ['digital_solution', 'smart_card'],
    leadScore: 65,
    estimatedValue: 320000,
    createdAt: '2024-12-02T16:45:00Z'
  },
  {
    id: '4',
    name: 'Dr. Lisa Maharani',
    email: 'lisa@rshealthcare.com',
    phone: '081234567893',
    company: 'RS Healthcare Plus',
    source: 'website',
    sector: 'healthcare',
    status: 'qualified',
    interestedProducts: ['smart_card', 'digital_solution'],
    leadScore: 78,
    estimatedValue: 890000,
    createdAt: '2024-11-28T08:30:00Z'
  },
  {
    id: '5',
    name: 'Ravi Sharma',
    email: 'ravi@techstartup.id',
    phone: '081234567894',
    company: 'Tech Startup Indonesia',
    source: 'tiktok',
    sector: 'teknologi',
    status: 'contacted',
    interestedProducts: ['graph_analytic', 'digital_product'],
    leadScore: 72,
    estimatedValue: 180000,
    createdAt: '2024-11-30T11:15:00Z'
  }
];

export const dummyCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Digital Banking Q4 2024',
    platform: ['linkedin', 'instagram'],
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    budget: 50000000,
    spent: 32000000,
    leads: 145,
    conversions: 23,
    status: 'active',
    targetProducts: ['meterai_elektronik', 'digital_solution'],
    productResults: [
      { product: 'meterai_elektronik', leads: 89, conversions: 15, cost: 18500000 },
      { product: 'digital_solution', leads: 56, conversions: 8, cost: 13500000 }
    ],
    targetIndustries: ['Perbankan', 'Asuransi', 'FinTech']
  },
  {
    id: '2',
    name: 'FinTech Innovation',
    platform: ['tiktok', 'twitter'],
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    budget: 30000000,
    spent: 18000000,
    leads: 89,
    conversions: 12,
    status: 'active',
    targetProducts: ['graph_analytic', 'digital_product'],
    productResults: [
      { product: 'graph_analytic', leads: 52, conversions: 7, cost: 10800000 },
      { product: 'digital_product', leads: 37, conversions: 5, cost: 7200000 }
    ],
    targetIndustries: ['Teknologi', 'Startup', 'Konsultan']
  },
  {
    id: '3',
    name: 'Healthcare Digital Transformation',
    platform: ['linkedin', 'website'],
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    budget: 25000000,
    spent: 25000000,
    leads: 67,
    conversions: 18,
    status: 'completed',
    targetProducts: ['smart_card', 'digital_solution'],
    productResults: [
      { product: 'smart_card', leads: 45, conversions: 12, cost: 15000000 },
      { product: 'digital_solution', leads: 22, conversions: 6, cost: 10000000 }
    ],
    targetIndustries: ['Healthcare', 'Rumah Sakit', 'Klinik']
  }
];

export const dummyCustomers: Customer[] = [
  {
    id: '1',
    companyName: 'PT Bank Digital Indonesia',
    contactPerson: 'Dewi Sartika',
    email: 'dewi@bankdigital.co.id',
    phone: '021-1234567',
    industry: 'Perbankan',
    companySize: 'large',
    status: 'active',
    lastInteraction: '2024-11-28',
    notes: 'Tertarik dengan solusi digital marketing untuk produk KPR',
    source: 'linkedin',
    priorityScore: 9,
    assignedTo: 'admin-001',
    productOpportunities: [
      {
        product: 'meterai_elektronik',
        status: 'negotiation',
        value: 850000,
        probability: 75,
        expectedCloseDate: '2024-12-15',
        notes: 'Evaluasi integrasi dengan sistem core banking',
        createdAt: '2024-11-01T00:00:00Z',
        updatedAt: '2024-11-28T00:00:00Z'
      },
      {
        product: 'digital_solution',
        status: 'proposal_sent',
        value: 1200000,
        probability: 60,
        expectedCloseDate: '2025-01-30',
        notes: 'Proposal untuk digital transformation',
        createdAt: '2024-11-15T00:00:00Z',
        updatedAt: '2024-11-25T00:00:00Z'
      }
    ],
    totalOpportunityValue: 2050000,
    createdAt: '2024-10-15T00:00:00Z',
    updatedAt: '2024-11-28T00:00:00Z'
  },
  {
    id: '2',
    companyName: 'CV Teknologi Maju',
    contactPerson: 'Rudi Hartono',
    email: 'rudi@tekmaju.com',
    phone: '021-2345678',
    industry: 'Teknologi',
    companySize: 'medium',
    status: 'prospect',
    lastInteraction: '2024-11-30',
    notes: 'Evaluasi platform untuk campaign B2B SaaS',
    source: 'website',
    priorityScore: 7,
    assignedTo: 'marketing-001',
    productOpportunities: [
      {
        product: 'graph_analytic',
        status: 'interested',
        value: 450000,
        probability: 40,
        expectedCloseDate: '2024-12-31',
        notes: 'Butuh demo lebih detail untuk analytics features',
        createdAt: '2024-11-20T00:00:00Z',
        updatedAt: '2024-11-30T00:00:00Z'
      }
    ],
    totalOpportunityValue: 450000,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-30T00:00:00Z'
  },
  {
    id: '3',
    companyName: 'RS Harapan Sehat',
    contactPerson: 'Dr. Lisa Maharani',
    email: 'lisa@rsharapan.co.id',
    phone: '021-3456789',
    industry: 'Healthcare',
    companySize: 'large',
    status: 'active',
    lastInteraction: '2024-12-01',
    notes: 'Implementasi smart card untuk patient management',
    source: 'referral',
    priorityScore: 8,
    assignedTo: 'admin-001',
    productOpportunities: [
      {
        product: 'smart_card',
        status: 'closed_won',
        value: 950000,
        probability: 100,
        expectedCloseDate: '2024-11-30',
        notes: 'Deal successfully closed - implementation starts January',
        createdAt: '2024-10-01T00:00:00Z',
        updatedAt: '2024-11-30T00:00:00Z'
      },
      {
        product: 'digital_solution',
        status: 'interested',
        value: 750000,
        probability: 30,
        expectedCloseDate: '2025-02-28',
        notes: 'Interested in full digital transformation after smart card success',
        createdAt: '2024-11-25T00:00:00Z',
        updatedAt: '2024-12-01T00:00:00Z'
      }
    ],
    totalOpportunityValue: 1700000,
    createdAt: '2024-09-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: '4',
    companyName: 'PT Asuransi Nasional',
    contactPerson: 'Bambang Sutrisno',
    email: 'bambang@asuransinasional.com',
    phone: '021-4567890',
    industry: 'Asuransi',
    companySize: 'large',
    status: 'active',
    lastInteraction: '2024-11-25',
    notes: 'Implementasi meterai elektronik untuk policy documents',
    source: 'linkedin',
    priorityScore: 8,
    assignedTo: 'admin-001',
    productOpportunities: [
      {
        product: 'meterai_elektronik',
        status: 'proposal_sent',
        value: 1150000,
        probability: 70,
        expectedCloseDate: '2024-12-20',
        notes: 'Waiting for board approval for digital policy implementation',
        createdAt: '2024-10-15T00:00:00Z',
        updatedAt: '2024-11-25T00:00:00Z'
      }
    ],
    totalOpportunityValue: 1150000,
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-11-25T00:00:00Z'
  },
  {
    id: '5',
    companyName: 'Startup Analytics Pro',
    contactPerson: 'Sarah Wijaya',
    email: 'sarah@analyticspro.id',
    phone: '021-5678901',
    industry: 'Teknologi',
    companySize: 'startup',
    status: 'prospect',
    lastInteraction: '2024-12-02',
    notes: 'Interested in graph analytics for client reporting',
    source: 'tiktok',
    priorityScore: 6,
    assignedTo: 'marketing-001',
    productOpportunities: [
      {
        product: 'graph_analytic',
        status: 'interested',
        value: 280000,
        probability: 50,
        expectedCloseDate: '2025-01-15',
        notes: 'Budget confirmation needed for Q1 2025',
        createdAt: '2024-11-28T00:00:00Z',
        updatedAt: '2024-12-02T00:00:00Z'
      },
      {
        product: 'digital_product',
        status: 'interested',
        value: 150000,
        probability: 35,
        expectedCloseDate: '2025-02-28',
        notes: 'Secondary option if graph analytics works well',
        createdAt: '2024-12-01T00:00:00Z',
        updatedAt: '2024-12-02T00:00:00Z'
      }
    ],
    totalOpportunityValue: 430000,
    createdAt: '2024-11-20T00:00:00Z',
    updatedAt: '2024-12-02T00:00:00Z'
  }
];

export const dummySEOMetrics: SEOMetrics = {
  organicTraffic: 12450,
  keywords: 1234,
  backlinks: 567,
  domainAuthority: 45,
  pageSpeed: 87,
  date: '2024-12-01',
  productPageViews: {
    digital_product: 2340,
    meterai_elektronik: 4850,
    graph_analytic: 1890,
    digital_solution: 3270,
    smart_card: 1650
  },
  productKeywordRankings: {
    meterai_elektronik: [
      { keyword: 'meterai elektronik', position: 2, volume: 8900 },
      { keyword: 'e-meterai', position: 1, volume: 5400 },
      { keyword: 'digital stamp', position: 3, volume: 2100 }
    ],
    digital_solution: [
      { keyword: 'digital transformation', position: 5, volume: 12000 },
      { keyword: 'enterprise solution', position: 4, volume: 3200 },
      { keyword: 'business digitalization', position: 6, volume: 1800 }
    ],
    smart_card: [
      { keyword: 'smart card solution', position: 3, volume: 4500 },
      { keyword: 'rfid card', position: 7, volume: 6700 },
      { keyword: 'contactless card', position: 4, volume: 3100 }
    ],
    graph_analytic: [
      { keyword: 'data visualization', position: 8, volume: 7200 },
      { keyword: 'business analytics', position: 9, volume: 9800 },
      { keyword: 'graph analysis', position: 5, volume: 1200 }
    ],
    digital_product: [
      { keyword: 'digital product development', position: 6, volume: 2800 },
      { keyword: 'software solution', position: 12, volume: 15000 },
      { keyword: 'custom application', position: 7, volume: 3400 }
    ]
  }
};

export const dummyInsights: AnalyticsInsight[] = [
  {
    id: '1',
    type: 'product',
    title: 'Meterai Elektronik Dominasi Pipeline',
    description: 'Produk Meterai Elektronik menghasilkan 34% dari total opportunities dengan nilai pipeline Rp 2.95M. Sektor perbankan dan asuransi menunjukkan minat tertinggi.',
    priority: 'high',
    createdAt: '2024-12-01T08:00:00Z',
    data: { product: 'meterai_elektronik', pipelineValue: 2950000, percentage: 34, topSectors: ['perbankan', 'asuransi'] },
    relatedProducts: ['meterai_elektronik'],
    actionable: true,
    estimatedImpact: 'high'
  },
  {
    id: '2',
    type: 'performance',
    title: 'TikTok Menghasilkan Lead Berkualitas Tinggi',
    description: 'Platform TikTok menghasilkan lead dengan conversion rate 24% lebih tinggi dibandingkan platform lain, terutama untuk produk Digital Solution dan Smart Card.',
    priority: 'high',
    createdAt: '2024-12-01T10:30:00Z',
    data: { platform: 'tiktok', conversionRate: 24, topProducts: ['digital_solution', 'smart_card'] },
    relatedProducts: ['digital_solution', 'smart_card'],
    actionable: true,
    estimatedImpact: 'medium'
  },
  {
    id: '3',
    type: 'conversion',
    title: 'Healthcare Sektor Mencatat Win Rate Tertinggi',
    description: 'Customers dari sektor healthcare menunjukkan win rate 78% untuk produk Smart Card dan Digital Solution, signifikan lebih tinggi dari rata-rata industri 68%.',
    priority: 'medium',
    createdAt: '2024-12-01T15:45:00Z',
    data: { sector: 'healthcare', winRate: 78, averageWinRate: 68, topProducts: ['smart_card', 'digital_solution'] },
    relatedProducts: ['smart_card', 'digital_solution'],
    actionable: true,
    estimatedImpact: 'high'
  },
  {
    id: '4',
    type: 'trend',
    title: 'Q4 Growth Acceleration untuk Digital Products',
    description: 'Opportunities untuk Digital Product dan Graph Analytics mengalami pertumbuhan 45% di Q4, didorong oleh kebutuhan end-of-year digital transformation.',
    priority: 'medium',
    createdAt: '2024-12-01T12:00:00Z',
    data: { quarter: 'Q4', growth: 45, products: ['digital_product', 'graph_analytic'] },
    relatedProducts: ['digital_product', 'graph_analytic'],
    actionable: true,
    estimatedImpact: 'medium'
  }
];