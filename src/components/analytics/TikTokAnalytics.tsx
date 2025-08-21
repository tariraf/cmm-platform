'use client';
import React from 'react';
import type { TikTokAnalytics } from '@/types/analytics';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { Eye, Heart, Share, MessageCircle, Search, User, Hash } from 'lucide-react';

interface TikTokAnalyticsProps {
  data: TikTokAnalytics;
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function TikTokAnalytics({ data }: TikTokAnalyticsProps) {
  const trafficSourceData = Object.entries(data.trafficSources).map(([source, value]) => ({
    name: source === 'fyp' ? 'For You Page' : 
          source === 'personalProfile' ? 'Personal Profile' : 
          source.charAt(0).toUpperCase() + source.slice(1),
    value,
    percentage: ((value / data.videoViews) * 100).toFixed(1)
  }));

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];

  const engagementData = [
    { name: 'Likes', value: data.likes, icon: Heart, color: '#FF6B6B' },
    { name: 'Comments', value: data.comments, icon: MessageCircle, color: '#4ECDC4' },
    { name: 'Shares', value: data.shares, icon: Share, color: '#45B7D1' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Video Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.videoViews)}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.profileViews)}</p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.likes)}</p>
            </div>
            <Heart className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {((data.likes + data.comments + data.shares) / data.videoViews * 100).toFixed(1)}%
              </p>
            </div>
            <Hash className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card title="Traffic Sources Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficSourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Engagement Breakdown */}
        <Card title="Engagement Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Search Queries */}
      <Card title="Top Search Queries" subtitle="Kata kunci yang membawa traffic ke konten PERURI">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Keyword</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Clicks</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Impressions</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">CTR</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {data.searchQueries.map((query, index) => {
                const totalClicks = data.searchQueries.reduce((sum, q) => sum + q.clicks, 0);
                const percentage = ((query.clicks / totalClicks) * 100).toFixed(1);
                const ctr = ((query.clicks / query.impressions) * 100).toFixed(1);
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{query.keyword}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700">{formatNumber(query.clicks)}</td>
                    <td className="text-right py-3 px-4 text-gray-700">{formatNumber(query.impressions)}</td>
                    <td className="text-right py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(ctr) > 15 ? 'bg-green-100 text-green-800' : 
                        parseFloat(ctr) > 10 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {ctr}%
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
    </div>
  );
}