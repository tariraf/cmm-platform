import type { 
  TikTokAnalytics, 
  InstagramAnalytics, 
  TwitterAnalytics, 
  SEOAnalytics, 
  PlatformInsight  // Make sure using PlatformInsight
} from '@/types/analytics';

export class EnhancedAnalyticsEngine {
  
  // TikTok Insights Generator
  static generateTikTokInsights(data: TikTokAnalytics[]): PlatformInsight[] {
    const insights: PlatformInsight[] = [];
    
    if (data.length === 0) return insights;
    
    const latest = data[data.length - 1];
    
    // Traffic Source Analysis
    const topTrafficSource = Object.entries(latest.trafficSources)
      .sort(([,a], [,b]) => b - a)[0];
    
    const trafficPercentage = ((topTrafficSource[1] / latest.videoViews) * 100).toFixed(1);
    
    insights.push({
      id: `tiktok-traffic-${Date.now()}`,
      platform: 'tiktok',
      type: 'traffic',  // This should match the merged type
      title: `${this.capitalizeFirst(topTrafficSource[0])} Dominasi Traffic TikTok`,
      description: `${trafficPercentage}% video views berasal dari ${this.formatTrafficSource(topTrafficSource[0])} dengan ${this.formatNumber(topTrafficSource[1])} views. Optimasi konten untuk ${this.formatTrafficSource(topTrafficSource[0])} dapat meningkatkan jangkauan.`,
      priority: parseFloat(trafficPercentage) > 40 ? 'high' : 'medium',
      createdAt: new Date().toISOString(),
      period: { month: latest.month, year: latest.year },
      data: { 
        topSource: topTrafficSource[0], 
        percentage: parseFloat(trafficPercentage),
        views: topTrafficSource[1]
      }
    });

    // Add other insights...
    return insights;
  }

  // Instagram Insights Generator  
  static generateInstagramInsights(data: InstagramAnalytics[]): PlatformInsight[] {
    const insights: PlatformInsight[] = [];
    
    if (data.length === 0) return insights;
    
    const latest = data[data.length - 1];
    
    insights.push({
      id: `instagram-organic-${Date.now()}`,
      platform: 'instagram',
      type: 'performance',
      title: `Organic Content Performance`,
      description: `Konten organik menghasilkan ${this.formatNumber(latest.impressionsOrganic)} impressions vs ads ${this.formatNumber(latest.impressionsAds)} impressions.`,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      period: { month: latest.month, year: latest.year },
      data: { 
        organicImpressions: latest.impressionsOrganic,
        adsImpressions: latest.impressionsAds
      }
    });

    return insights;
  }

  // Twitter Insights Generator
  static generateTwitterInsights(data: TwitterAnalytics[]): PlatformInsight[] {
    const insights: PlatformInsight[] = [];
    
    if (data.length === 0) return insights;
    
    const latest = data[data.length - 1];
    
    const bestWeek = latest.weeks.reduce((best, week) => 
      (week.impressions / week.postsCount) > (best.impressions / best.postsCount) ? week : best
    );
    
    insights.push({
      id: `twitter-weekly-${Date.now()}`,
      platform: 'twitter',
      type: 'performance',
      title: `Week ${bestWeek.weekNumber} Mencatat Performa Terbaik`,
      description: `Minggu ke-${bestWeek.weekNumber} menghasilkan rata-rata ${this.formatNumber(Math.round(bestWeek.impressions / bestWeek.postsCount))} impressions per post.`,
      priority: 'high',
      createdAt: new Date().toISOString(),
      period: { month: latest.month, year: latest.year },
      data: { 
        weekNumber: bestWeek.weekNumber,
        avgImpressionsPerPost: Math.round(bestWeek.impressions / bestWeek.postsCount)
      }
    });

    return insights;
  }

  // SEO Insights Generator
  static generateSEOInsights(data: SEOAnalytics[]): PlatformInsight[] {
    const insights: PlatformInsight[] = [];
    
    if (data.length === 0) return insights;
    
    const latest = data[data.length - 1];
    
    insights.push({
      id: `seo-keywords-${Date.now()}`,
      platform: 'seo',
      type: 'keyword',
      title: `Top Keywords Performance`,
      description: `Website mencatat ${this.formatNumber(latest.activeUsers)} active users dengan performa keyword yang baik.`,
      priority: 'high',
      createdAt: new Date().toISOString(),
      period: { month: latest.month, year: latest.year },
      data: { 
        activeUsers: latest.activeUsers,
        topKeywords: latest.keywords.slice(0, 5)
      }
    });

    return insights;
  }

  // Utility functions
  private static formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private static formatTrafficSource(source: string): string {
    const sourceMap: Record<string, string> = {
      'search': 'pencarian',
      'personalProfile': 'profil personal',
      'fyp': 'For You Page',
      'following': 'following feed',
      'sound': 'sound/audio'
    };
    return sourceMap[source] || source;
  }
}