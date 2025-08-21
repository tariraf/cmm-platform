'use client';
import React from 'react';
import type { InstagramAnalytics } from '@/types/analytics';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Eye, Heart, MessageCircle, Share, Users, TrendingUp } from 'lucide-react';

interface InstagramAnalyticsProps {
  data: InstagramAnalytics;
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function InstagramAnalytics({ data }: InstagramAnalyticsProps) {
  const impressionData = [
    { name: 'Organic', value: data.impressionsOrganic, color: '#4ECDC4' },
    { name: 'Ads', value: data.impressionsAds, color: '#FF6B6B' }
  ];

  const adsAudienceData = [
    { name: 'Followers', value: data.adsViewsBreakdown.followers, color: '#45B7D1' },
    { name: 'Non-Followers', value: data.adsViewsBreakdown.nonFollowers, color: '#96CEB4' }
  ];

  const topPostsChartData = data.topPosts.slice(0, 5).map(post => ({
    name: post.caption.substring(0, 20) + '...',
    views: post.views,
    likes: post.likes,
    type: post.type
  }));

  const COLORS = ['#4ECDC4', '#FF6B6B', '#45B7D1', '#96CEB4', '#FECA57'];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.reach)}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Organic Impressions</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.impressionsOrganic)}</p>
            </div>
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ads Impressions</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.impressionsAds)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.engagement)}</p>
            </div>
            <Heart className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organic vs Ads Impressions */}
        <Card title="Impressions Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={impressionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => value?  `${name}: ${formatNumber(value)}` : `${name}: undefined`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {impressionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Ads Audience Breakdown */}
        <Card title="Ads Views: Followers vs Non-Followers">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={adsAudienceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => {
                  const total = data.adsViewsBreakdown.followers + data.adsViewsBreakdown.nonFollowers;
                  const percentage = value? ((value / total) * 100).toFixed(1) : 0;
                  return `${name}: ${percentage}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {adsAudienceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top 5 Content Performance */}
      <Card title="Top 5 Performing Content">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topPostsChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip formatter={(value: number) => formatNumber(value)} />
            <Bar dataKey="views" fill="#4ECDC4" name="Views" radius={[4, 4, 0, 0]} />
            <Bar dataKey="likes" fill="#FF6B6B" name="Likes" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Top Posts Table */}
      <Card title="Top Content Details">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Content</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Views</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Likes</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Comments</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Shares</th>
              </tr>
            </thead>
            <tbody>
              {data.topPosts.map((post, index) => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-medium text-gray-900 truncate">{post.caption}</div>
                    <div className="text-gray-500 text-sm">{new Date(post.date).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.type === 'reel' ? 'bg-purple-100 text-purple-800' :
                      post.type === 'video' ? 'bg-blue-100 text-blue-800' :
                      post.type === 'carousel' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.type}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-700 font-semibold">{formatNumber(post.views)}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{formatNumber(post.likes)}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{formatNumber(post.comments)}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{formatNumber(post.shares)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}