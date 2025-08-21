'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import DateFilter from '@/components/analytics/DateFilter';
import TikTokAnalytics from '@/components/analytics/TikTokAnalytics';  
import InstagramAnalytics from '@/components/analytics/InstagramAnalytics';
import TwitterAnalytics from '@/components/analytics/TwitterAnalytics';
import SEOAnalytics from '@/components/analytics/SEOAnalytics'; 
import InsightCard from '@/components/analytics/InsightCard';
import { EnhancedAnalyticsEngine } from '@/lib/enhanced-analytics';
import { dummyTikTokData, dummyInstagramData, dummyTwitterData, dummySEOData } from '@/data/enhanced-dummy';
import { PlatformInsight } from '@/types/analytics';
import { 
  Lightbulb, 
  RefreshCw, 
  BarChart3, 
  Camera, 
  MessageSquare, 
  Search,
  TrendingUp 
} from 'lucide-react';

export default function EnhancedAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'tiktok' | 'instagram' | 'twitter' | 'seo'>('overview');
  const [selectedMonth, setSelectedMonth] = useState(12);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedQuarter, setSelectedQuarter] = useState(4);
  const [insights, setInsights] = useState<PlatformInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const generateInsights = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let allInsights: PlatformInsight[] = [];
      
      // Generate insights for each platform
      const tiktokInsights = EnhancedAnalyticsEngine.generateTikTokInsights(dummyTikTokData);
      const instagramInsights = EnhancedAnalyticsEngine.generateInstagramInsights(dummyInstagramData);
      const twitterInsights = EnhancedAnalyticsEngine.generateTwitterInsights(dummyTwitterData);
      const seoInsights = EnhancedAnalyticsEngine.generateSEOInsights(dummySEOData);
      
      allInsights = [...tiktokInsights, ...instagramInsights, ...twitterInsights, ...seoInsights];
      
      // Sort by priority and date
      allInsights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setInsights(allInsights);
      setIsGenerating(false);
    }, 1500);
  };

  useEffect(() => {
    if (mounted) {
      generateInsights();
    }
  }, [mounted, selectedMonth, selectedYear]);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3, color: 'text-blue-600' },
    { id: 'tiktok' as const, label: 'TikTok', icon: Camera, color: 'text-pink-600' },
    { id: 'instagram' as const, label: 'Instagram', icon: Camera, color: 'text-purple-600' },
    { id: 'twitter' as const, label: 'Twitter', icon: MessageSquare, color: 'text-blue-500' },
    { id: 'seo' as const, label: 'SEO Website', icon: Search, color: 'text-green-600' }
  ];

  const getFilteredInsights = () => {
    if (activeTab === 'overview') return insights;
    return insights.filter(insight => insight.platform === activeTab);
  };

  // Get current data based on selected filters
  const getCurrentTikTokData = () => {
    return dummyTikTokData.find(d => d.month === selectedMonth && d.year === selectedYear) || dummyTikTokData[0];
  };

  const getCurrentInstagramData = () => {
    return dummyInstagramData.find(d => d.month === selectedMonth && d.year === selectedYear) || dummyInstagramData[0];
  };

  const getCurrentTwitterData = () => {
    return dummyTwitterData.find(d => d.month === selectedMonth && d.year === selectedYear) || dummyTwitterData[0];
  };

  const getCurrentSEOData = () => {
    return dummySEOData.find(d => d.month === selectedMonth && d.year === selectedYear) || dummySEOData[0];
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Header 
        title="Enhanced Analytics & Insights" 
        subtitle="Analisis mendalam per platform dengan insights otomatis berbasis AI"
      />
      
      <div className="p-6 space-y-6">
        {/* Date Filter */}
        <DateFilter
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedQuarter={selectedQuarter}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onQuarterChange={setSelectedQuarter}
          showQuarter={activeTab === 'overview'}
        />

        {/* Platform Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white border-t border-l border-r border-gray-200 text-gray-900 -mb-px'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Insights Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === 'overview' ? 'All Platform Insights' : `${tabs.find(t => t.id === activeTab)?.label} Insights`}
            </h2>
          </div>
          <button
            onClick={generateInsights}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Refresh Insights'}
          </button>
        </div>

        {/* Platform Content */}
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Overview Insights */}
            {isGenerating ? (
              <Card className="p-8 text-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Insights</h3>
                  <p className="text-gray-600">AI sedang menganalisis data dari semua platform...</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getFilteredInsights().slice(0, 6).map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            )}

            {/* Quick Platform Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">TikTok Views</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(getCurrentTikTokData().videoViews / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <Camera className="w-6 h-6 text-pink-600" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Instagram Reach</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(getCurrentInstagramData().reach / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <Camera className="w-6 h-6 text-purple-600" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Twitter Posts</p>
                    <p className="text-xl font-bold text-gray-900">
                      {getCurrentTwitterData().weeks.reduce((sum, week) => sum + week.postsCount, 0)}
                    </p>
                  </div>
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Website Users</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(getCurrentSEOData().activeUsers / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <Search className="w-6 h-6 text-green-600" />
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Platform-specific insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getFilteredInsights().map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>

            {/* Platform-specific analytics */}
            <div className="mt-8">
              {activeTab === 'tiktok' && <TikTokAnalytics data={getCurrentTikTokData()} />}
              {activeTab === 'instagram' && <InstagramAnalytics data={getCurrentInstagramData()} />}
              {activeTab === 'twitter' && <TwitterAnalytics data={getCurrentTwitterData()} />}
              {activeTab === 'seo' && <SEOAnalytics data={getCurrentSEOData()} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}