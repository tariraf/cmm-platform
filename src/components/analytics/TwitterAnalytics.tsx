'use client';
import React from 'react';
import type { TwitterAnalytics } from '@/types/analytics';
import { Card } from '@/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MessageSquare, Eye, TrendingUp, FileText, Image, Video, Hash } from 'lucide-react';

interface TwitterAnalyticsProps {
  data: TwitterAnalytics;
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function TwitterAnalytics({ data }: TwitterAnalyticsProps) {
  const weeklyData = data.weeks.map(week => ({
    week: `Week ${week.weekNumber}`,
    posts: week.postsCount,
    impressions: week.impressions,
    engagement: week.engagement,
    avgImpressionsPerPost: Math.round(week.impressions / week.postsCount)
  }));

  const contentTypeData = data.weeks.reduce((acc, week) => {
    const type = week.topPerformingPost.type;
    if (!acc[type]) {
      acc[type] = { type, count: 0, totalImpressions: 0 };
    }
    acc[type].count += 1;
    acc[type].totalImpressions += week.topPerformingPost.impressions;
    return acc;
  }, {} as Record<string, { type: string; count: number; totalImpressions: number }>);

  const contentTypeChartData = Object.values(contentTypeData).map(item => ({
    type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    count: item.count,
    avgImpressions: Math.round(item.totalImpressions / item.count)
  }));

  const totalPosts = data.weeks.reduce((sum, week) => sum + week.postsCount, 0);
  const totalImpressions = data.weeks.reduce((sum, week) => sum + week.impressions, 0);
  const totalEngagement = data.weeks.reduce((sum, week) => sum + week.engagement, 0);
  const avgEngagementRate = ((totalEngagement / totalImpressions) * 100).toFixed(2);

  const getContentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'text': return FileText;
      case 'image': return Image;
      case 'video': return Video;
      case 'thread': return Hash;
      default: return MessageSquare;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Impressions</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalImpressions)}</p>
            </div>
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg per Post</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(Math.round(totalImpressions / totalPosts))}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{avgEngagementRate}%</p>
            </div>
            <Hash className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <Card title="Weekly Performance Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Line type="monotone" dataKey="impressions" stroke="#4ECDC4" strokeWidth={2} name="Impressions" />
              <Line type="monotone" dataKey="engagement" stroke="#FF6B6B" strokeWidth={2} name="Engagement" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Content Type Performance */}
        <Card title="Content Type Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentTypeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Bar dataKey="avgImpressions" fill="#45B7D1" name="Avg Impressions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Weekly Breakdown */}
      <Card title="Weekly Breakdown & Top Performing Posts">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Week</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Posts</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Impressions</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg/Post</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Top Performing Post</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Type</th>
              </tr>
            </thead>
            <tbody>
              {data.weeks.map((week) => {
                const avgPerPost = Math.round(week.impressions / week.postsCount);
                const ContentIcon = getContentIcon(week.topPerformingPost.type);
                
                return (
                  <tr key={week.weekNumber} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">Week {week.weekNumber}</div>
                      <div className="text-gray-500 text-sm">
                        {new Date(week.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(week.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {week.postsCount}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700 font-semibold">{formatNumber(week.impressions)}</td>
                    <td className="text-right py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        avgPerPost > 4000 ? 'bg-green-100 text-green-800' : 
                        avgPerPost > 2500 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {formatNumber(avgPerPost)}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-gray-900 text-sm truncate">{week.topPerformingPost.content}</div>
                      <div className="text-gray-500 text-xs">
                        {formatNumber(week.topPerformingPost.impressions)} impressions • {formatNumber(week.topPerformingPost.engagement)} engagement
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        <ContentIcon className="w-4 h-4 text-gray-600 mr-1" />
                        <span className="text-sm text-gray-700 capitalize">{week.topPerformingPost.type}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Content Strategy Insights */}
      <Card title="Content Strategy Insights">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(contentTypeData).map((item) => {
            const ContentIcon = getContentIcon(item.type);
            const avgImpressions = Math.round(item.totalImpressions / item.count);
            
            return (
              <div key={item.type} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <ContentIcon className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900 capitalize">{item.type}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>{item.count} posts</div>
                  <div>{formatNumber(avgImpressions)} avg impressions</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}