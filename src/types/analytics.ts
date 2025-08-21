export interface DateFilter {
  month: number;
  year: number;
  quarter?: 1 | 2 | 3 | 4;
  startDate?: string;
  endDate?: string;
}

export interface TikTokAnalytics {
  date: string;
  month: number;
  year: number;
  videoViews: number;
  profileViews: number;
  likes: number;
  shares: number;
  comments: number;
  trafficSources: {
    search: number;
    personalProfile: number;
    fyp: number; // For You Page
    following: number;
    sound: number;
  };
  searchQueries: Array<{
    keyword: string;
    clicks: number;
    impressions: number;
  }>;
}

export interface InstagramAnalytics {
  date: string;
  month: number;
  year: number;
  reach: number;
  impressionsOrganic: number;
  impressionsAds: number;
  engagement: number;
  adsViewsBreakdown: {
    followers: number;
    nonFollowers: number;
  };
  topPosts: Array<{
    id: string;
    type: 'photo' | 'video' | 'carousel' | 'reel';
    caption: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    date: string;
  }>;
}

export interface TwitterAnalytics {
  month: number;
  year: number;
  weeks: Array<{
    weekNumber: number;
    startDate: string;
    endDate: string;
    postsCount: number;
    impressions: number;
    engagement: number;
    topPerformingPost: {
      content: string;
      impressions: number;
      engagement: number;
      type: 'text' | 'image' | 'video' | 'thread';
    };
  }>;
}

export interface SEOAnalytics {
  month: number;
  year: number;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  organicTraffic: number;
  keywords: Array<{
    keyword: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  topPages: Array<{
    page: string;
    views: number;
    users: number;
    bounceRate: number;
  }>;
  campaigns: Array<{
    name: string;
    ctr: number;
    clicks: number;
    impressions: number;
  }>;
}

export interface PlatformInsight {
  id: string;
  platform?: 'tiktok' | 'instagram' | 'twitter' | 'seo'; // Make optional
  type: 'performance' | 'timing' | 'conversion' | 'trend' | 'content' | 'audience' | 'keyword' | 'traffic'; // Merge both
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  period?: {
    month: number;
    year: number;
  };
  data: Record<string, any>;
}