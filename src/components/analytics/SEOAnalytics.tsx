'use client';
import React from 'react';
import type { SEOAnalytics } from '@/types/analytics';
import { Card } from '@/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, UserPlus, MousePointer, Clock, TrendingUp, Search, Globe, Target } from 'lucide-react';

interface SEOAnalyticsProps {
  data: SEOAnalytics;
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function SEOAnalytics({ data }: SEOAnalyticsProps) {
  const keywordChartData = data.keywords.slice(0, 10).map(keyword => ({
    keyword: keyword.keyword.length > 15 ? keyword.keyword.substring(0, 15) + '...' : keyword.keyword,
    clicks: keyword.clicks,
    ctr: keyword.ctr,
    position: keyword.position
  }));

  const campaignChartData = data.campaigns.map(campaign => ({
    name: campaign.name.length > 20 ? campaign.name.substring(0, 20) + '...' : campaign.name,
    ctr: campaign.ctr,
    clicks: campaign.clicks
  }));

  const topPagesData = data.topPages.slice(0, 5).map(page => ({
    page: page.page.replace('/', '').substring(0, 15) || 'Home',
    views: page.views,
    users: page.users,
    bounceRate: page.bounceRate
  }));

  const newUserPercentage = (data.newUsers / data.activeUsers * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.activeUsers)}</p>
              <p className="text-green-600 text-xs">↑ +{newUserPercentage}% new</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">New Users</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.newUsers)}</p>
              <p className="text-gray-500 text-xs">{newUserPercentage}% of total</p>
            </div>
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.bounceRate}%</p>
              <p className={`text-xs ${data.bounceRate < 50 ? 'text-green-600' : 'text-red-600'}`}>
                {data.bounceRate < 50 ? 'Good' : 'Needs improvement'}
              </p>
            </div>
            <MousePointer className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Session</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(data.avgSessionDuration)}</p>
              <p className="text-gray-500 text-xs">minutes</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Sessions</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(data.sessions)}</p>
            </div>
            <Globe className="w-6 h-6 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Page Views</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(data.pageviews)}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Organic Traffic</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(data.organicTraffic)}</p>
            </div>
            <Search className="w-6 h-6 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Keywords Performance */}
        <Card title="Top Keywords by Clicks">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={keywordChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keyword" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Bar dataKey="clicks" fill="#4ECDC4" name="Clicks" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Campaign CTR Performance */}
        <Card title="Campaign CTR Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="ctr" fill="#FF6B6B" name="CTR %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Keywords Table */}
      <Card title="Keyword Performance Details">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Keyword</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Clicks</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Impressions</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">CTR</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Position</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {data.keywords.map((keyword, index) => {
                const totalClicks = data.keywords.reduce((sum, kw) => sum + kw.clicks, 0);
                const percentage = ((keyword.clicks / totalClicks) * 100).toFixed(1);
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{keyword.keyword}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700 font-semibold">{formatNumber(keyword.clicks)}</td>
                    <td className="text-right py-3 px-4 text-gray-700">{formatNumber(keyword.impressions)}</td>
                    <td className="text-right py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        keyword.ctr > 15 ? 'bg-green-100 text-green-800' : 
                        keyword.ctr > 10 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {keyword.ctr}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        keyword.position <= 3 ? 'bg-green-100 text-green-800' : 
                        keyword.position <= 10 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        #{keyword.position.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Campaign Performance Summary */}
      <Card title="Campaign Performance Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.campaigns.map((campaign, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CTR:</span>
                  <span className={`font-semibold ${campaign.ctr > 8 ? 'text-green-600' : campaign.ctr > 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {campaign.ctr}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Clicks:</span>
                  <span className="font-semibold text-gray-900">{formatNumber(campaign.clicks)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impressions:</span>
                  <span className="text-gray-700">{formatNumber(campaign.impressions)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}