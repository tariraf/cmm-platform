import { SocialMediaMetrics, Lead, Campaign, Customer, SEOMetrics, AnalyticsInsight } from '@/types';

export const dummySocialMetrics: SocialMediaMetrics[] = [
  {
    platform: 'linkedin',
    impressions: 15420,
    engagement: 1235,
    reach: 12300,
    clicks: 456,
    costPerLead: 45000,
    date: '2024-12-01'
  },
  {
    platform: 'instagram',
    impressions: 28900,
    engagement: 2150,
    reach: 21400,
    clicks: 678,
    costPerLead: 60000,
    date: '2024-12-01'
  },
  {
    platform: 'tiktok',
    impressions: 45200,
    engagement: 4560,
    reach: 38900,
    clicks: 1230,
    costPerLead: 35000,
    date: '2024-12-01'
  },
  {
    platform: 'twitter',
    impressions: 12800,
    engagement: 890,
    reach: 9800,
    clicks: 234,
    costPerLead: 75000,
    date: '2024-12-01'
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
    createdAt: '2024-12-01T14:30:00Z',
    convertedAt: '2024-12-05T09:15:00Z'
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
    createdAt: '2024-12-02T16:45:00Z'
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
    status: 'active'
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
    status: 'active'
  }
];

export const dummySEOMetrics: SEOMetrics = {
  organicTraffic: 12450,
  keywords: 1234,
  backlinks: 567,
  domainAuthority: 45,
  pageSpeed: 87,
  date: '2024-12-01'
};

export const dummyInsights: AnalyticsInsight[] = [
  {
    id: '1',
    type: 'performance',
    title: 'LinkedIn Mengungguli Instagram dalam Cost Per Lead',
    description: 'Performa kampanye di LinkedIn menghasilkan Cost Per Lead 25% lebih rendah dibandingkan Instagram pada kuartal ini.',
    priority: 'high',
    createdAt: '2024-12-01T08:00:00Z',
    data: { linkedinCPL: 45000, instagramCPL: 60000, improvement: 25 }
  },
  {
    id: '2',
    type: 'timing',
    title: 'Peak Engagement di TikTok Malam Hari',
    description: 'Teridentifikasi lonjakan engagement pada konten video di TikTok pada jam 19.00-21.00 WIB.',
    priority: 'medium',
    createdAt: '2024-12-01T10:30:00Z',
    data: { peakHours: '19:00-21:00', engagementIncrease: 340 }
  },
  {
    id: '3',
    type: 'conversion',
    title: 'Sektor Keuangan Dominasi Konversi',
    description: 'Leads dari sektor keuangan menunjukkan tingkat konversi tertinggi bulan ini.',
    priority: 'high',
    createdAt: '2024-12-01T15:45:00Z',
    data: { sector: 'keuangan', conversionRate: 68, totalLeads: 45 }
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
    status: 'active',
    lastInteraction: '2024-11-28',
    notes: 'Tertarik dengan solusi digital marketing untuk produk KPR'
  },
  {
    id: '2',
    companyName: 'CV Teknologi Maju',
    contactPerson: 'Rudi Hartono',
    email: 'rudi@tekmaju.com',
    phone: '021-2345678',
    industry: 'Teknologi',
    status: 'prospect',
    lastInteraction: '2024-11-30',
    notes: 'Evaluasi platform untuk campaign B2B SaaS'
  }
];