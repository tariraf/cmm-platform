export interface SocialMediaMetrics {
  platform: 'instagram' | 'linkedin' | 'tiktok' | 'twitter';
  impressions: number;
  engagement: number;
  reach: number;
  clicks: number;
  costPerLead: number;
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: 'instagram' | 'linkedin' | 'tiktok' | 'twitter' | 'zoho_form' | 'website';
  sector: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: string;
  convertedAt?: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: string[];
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  status: 'active' | 'paused' | 'completed';
}

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  status: 'prospect' | 'active' | 'inactive';
  lastInteraction: string;
  notes: string;
}

export interface SEOMetrics {
  organicTraffic: number;
  keywords: number;
  backlinks: number;
  domainAuthority: number;
  pageSpeed: number;
  date: string;
}

export interface AnalyticsInsight {
  id: string;
  type: 'performance' | 'timing' | 'conversion' | 'trend';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  data: Record<string, any>;
}