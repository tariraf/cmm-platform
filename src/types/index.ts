export type ProductOpportunity = 
  | 'digital_product'
  | 'meterai_elektronik' 
  | 'graph_analytic'
  | 'digital_solution'
  | 'smart_card';

export interface ProductOpportunityData {
  product: ProductOpportunity;
  status: 'interested' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost';
  value: number; // Estimated deal value
  probability: number; // 0-100%
  expectedCloseDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  status: 'prospect' | 'active' | 'inactive';
  lastInteraction: string;
  notes: string;
  // NEW: Product Opportunities
  productOpportunities: ProductOpportunityData[];
  totalOpportunityValue: number;
  priorityScore: number; // 1-10 berdasarkan total value dan probability
  assignedTo: string; // User ID yang handle customer ini
  source: 'linkedin' | 'instagram' | 'tiktok' | 'twitter' | 'website' | 'referral' | 'cold_outreach';
  createdAt: string;
  updatedAt: string;
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
  // NEW: Product Interest
  interestedProducts: ProductOpportunity[];
  leadScore: number; // 1-100
  estimatedValue: number;
  createdAt: string;
  convertedAt?: string;
  convertedToCustomerId?: string;
}

// NEW: Product Analytics Interface
export interface ProductAnalytics {
  product: ProductOpportunity;
  totalOpportunities: number;
  totalValue: number;
  avgDealSize: number;
  winRate: number; // percentage
  avgSalesCycle: number; // days
  topIndustries: Array<{
    industry: string;
    count: number;
    value: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    opportunities: number;
    value: number;
    closed: number;
  }>;
  conversionBySource: Array<{
    source: string;
    leads: number;
    conversions: number;
    rate: number;
  }>;
}

// NEW: Dashboard Summary dengan Product Breakdown
export interface DashboardSummary {
  totalCustomers: number;
  activeOpportunities: number;
  totalPipelineValue: number;
  monthlyRevenue: number;
  conversionRate: number;
  
  // Product Breakdown
  productBreakdown: Array<{
    product: ProductOpportunity;
    opportunities: number;
    value: number;
    percentage: number;
  }>;
  
  // Top Performing Products
  topProducts: Array<{
    product: ProductOpportunity;
    revenue: number;
    growth: number; // percentage
  }>;
  
  // Industry Analysis
  industryBreakdown: Array<{
    industry: string;
    customers: number;
    opportunities: number;
    value: number;
    topProducts: ProductOpportunity[];
  }>;
}

// Product Labels untuk UI
export const PRODUCT_LABELS: Record<ProductOpportunity, string> = {
  digital_product: 'Digital Product',
  meterai_elektronik: 'Meterai Elektronik', 
  graph_analytic: 'Graph Analytic',
  digital_solution: 'Digital Solution',
  smart_card: 'Smart Card'
};

// Product Colors untuk Charts
export const PRODUCT_COLORS: Record<ProductOpportunity, string> = {
  digital_product: '#3B82F6',      // Blue
  meterai_elektronik: '#10B981',   // Green
  graph_analytic: '#F59E0B',       // Amber
  digital_solution: '#8B5CF6',     // Purple
  smart_card: '#EF4444'            // Red
};

// Industries yang sering menggunakan produk tertentu
export const PRODUCT_INDUSTRY_MAPPING: Record<ProductOpportunity, string[]> = {
  digital_product: ['Teknologi', 'E-commerce', 'Startup'],
  meterai_elektronik: ['Perbankan', 'Asuransi', 'Legal', 'Pemerintahan'],
  graph_analytic: ['Konsultan', 'Research', 'Media', 'Marketing'],
  digital_solution: ['Manufaktur', 'Healthcare', 'Education', 'BUMN'],
  smart_card: ['Perbankan', 'Healthcare', 'Transportasi', 'Retail']
};

export interface SocialMediaMetrics {
  platform: 'instagram' | 'linkedin' | 'tiktok' | 'twitter';
  impressions: number;
  engagement: number;
  reach: number;
  clicks: number;
  costPerLead: number;
  date: string;
  // NEW: Product-specific metrics
  productEngagement?: Record<ProductOpportunity, number>;
  leadsByProduct?: Record<ProductOpportunity, number>;
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
  // NEW: Product focus
  targetProducts: ProductOpportunity[];
  productResults: Array<{
    product: ProductOpportunity;
    leads: number;
    conversions: number;
    cost: number;
  }>;
  targetIndustries: string[];
}

export interface SEOMetrics {
  organicTraffic: number;
  keywords: number;
  backlinks: number;
  domainAuthority: number;
  pageSpeed: number;
  date: string;
  // NEW: Product page metrics
  productPageViews: Record<ProductOpportunity, number>;
  productKeywordRankings: Record<ProductOpportunity, Array<{
    keyword: string;
    position: number;
    volume: number;
  }>>;
}

export interface AnalyticsInsight {
  id: string;
  type: 'performance' | 'timing' | 'conversion' | 'trend' | 'product';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  data: Record<string, any>;
  // NEW: Product-related insights
  relatedProducts?: ProductOpportunity[];
  actionable?: boolean;
  estimatedImpact?: 'high' | 'medium' | 'low';
}