import { SocialMediaMetrics, Lead, Campaign, AnalyticsInsight } from '@/types';

export class AnalyticsEngine {
  static generateInsights(
    socialMetrics: SocialMediaMetrics[],
    leads: Lead[],
    campaigns: Campaign[]
  ): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // Cost Per Lead Analysis
    const cplInsight = this.analyzeCostPerLead(socialMetrics);
    if (cplInsight) insights.push(cplInsight);

    // Conversion Rate by Sector
    const sectorInsight = this.analyzeSectorConversion(leads);
    if (sectorInsight) insights.push(sectorInsight);

    // Platform Performance
    const platformInsight = this.analyzePlatformPerformance(socialMetrics);
    if (platformInsight) insights.push(platformInsight);

    // Lead Source Distribution
    const sourceInsight = this.analyzeLeadSources(leads);
    if (sourceInsight) insights.push(sourceInsight);

    return insights;
  }

  private static analyzeCostPerLead(metrics: SocialMediaMetrics[]): AnalyticsInsight | null {
    if (metrics.length < 2) return null;

    const sorted = metrics.sort((a, b) => a.costPerLead - b.costPerLead);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    
    const improvement = ((worst.costPerLead - best.costPerLead) / worst.costPerLead * 100).toFixed(1);

    return {
      id: 'cpl-analysis',
      type: 'performance',
      title: `${best.platform.charAt(0).toUpperCase() + best.platform.slice(1)} Paling Efisien`,
      description: `Platform ${best.platform} menghasilkan Cost Per Lead ${improvement}% lebih rendah dibandingkan ${worst.platform} (Rp ${best.costPerLead.toLocaleString()} vs Rp ${worst.costPerLead.toLocaleString()}).`,
      priority: parseFloat(improvement) > 20 ? 'high' : 'medium',
      createdAt: new Date().toISOString(),
      data: { bestPlatform: best.platform, worstPlatform: worst.platform, improvement: parseFloat(improvement) }
    };
  }

  private static analyzeSectorConversion(leads: Lead[]): AnalyticsInsight | null {
    const sectorStats = leads.reduce((acc, lead) => {
      if (!acc[lead.sector]) {
        acc[lead.sector] = { total: 0, converted: 0 };
      }
      acc[lead.sector].total++;
      if (lead.status === 'converted') {
        acc[lead.sector].converted++;
      }
      return acc;
    }, {} as Record<string, { total: number; converted: number }>);

    const sectorRates = Object.entries(sectorStats).map(([sector, stats]) => ({
      sector,
      rate: (stats.converted / stats.total) * 100,
      total: stats.total
    })).sort((a, b) => b.rate - a.rate);

    if (sectorRates.length === 0) return null;

    const topSector = sectorRates[0];

    return {
      id: 'sector-conversion',
      type: 'conversion',
      title: `Sektor ${topSector.sector.charAt(0).toUpperCase() + topSector.sector.slice(1)} Dominasi Konversi`,
      description: `Leads dari sektor ${topSector.sector} menunjukkan tingkat konversi tertinggi ${topSector.rate.toFixed(1)}% dari ${topSector.total} leads.`,
      priority: topSector.rate > 50 ? 'high' : 'medium',
      createdAt: new Date().toISOString(),
      data: { sector: topSector.sector, conversionRate: topSector.rate, totalLeads: topSector.total }
    };
  }

  private static analyzePlatformPerformance(metrics: SocialMediaMetrics[]): AnalyticsInsight | null {
    const bestEngagement = metrics.reduce((best, current) => 
      (current.engagement / current.impressions) > (best.engagement / best.impressions) ? current : best
    );

    const engagementRate = ((bestEngagement.engagement / bestEngagement.impressions) * 100).toFixed(2);

    return {
      id: 'platform-performance',
      type: 'performance',
      title: `${bestEngagement.platform.charAt(0).toUpperCase() + bestEngagement.platform.slice(1)} Unggul dalam Engagement`,
      description: `Platform ${bestEngagement.platform} mencatat engagement rate tertinggi ${engagementRate}% dengan ${bestEngagement.engagement.toLocaleString()} interaksi.`,
      priority: parseFloat(engagementRate) > 5 ? 'high' : 'medium',
      createdAt: new Date().toISOString(),
      data: { platform: bestEngagement.platform, engagementRate: parseFloat(engagementRate), totalEngagement: bestEngagement.engagement }
    };
  }

  private static analyzeLeadSources(leads: Lead[]): AnalyticsInsight | null {
    const sources = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSource = Object.entries(sources).sort((a, b) => b[1] - a[1])[0];
    if (!topSource) return null;

    const percentage = ((topSource[1] / leads.length) * 100).toFixed(1);

    return {
      id: 'lead-sources',
      type: 'trend',
      title: `${topSource[0].charAt(0).toUpperCase() + topSource[0].slice(1)} Sumber Lead Utama`,
      description: `${percentage}% leads berasal dari ${topSource[0]} dengan total ${topSource[1]} leads dalam periode ini.`,
      priority: parseFloat(percentage) > 40 ? 'high' : 'medium',
      createdAt: new Date().toISOString(),
      data: { source: topSource[0], percentage: parseFloat(percentage), count: topSource[1] }
    };
  }
}
