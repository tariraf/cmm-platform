import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { SocialMediaMetrics } from '@/types';

interface MetricsChartProps {
  data: SocialMediaMetrics[];
  type: 'engagement' | 'impressions' | 'costPerLead';
}

export default function MetricsChart({ data, type }: MetricsChartProps) {
  const getChartData = () => {
    return data.map(item => ({
      platform: item.platform.charAt(0).toUpperCase() + item.platform.slice(1),
      value: item[type],
      platform_key: item.platform
    }));
  };

  const formatValue = (value: number) => {
    if (type === 'costPerLead') {
      return `Rp ${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  const getTitle = () => {
    switch (type) {
      case 'engagement': return 'Engagement by Platform';
      case 'impressions': return 'Impressions by Platform';
      case 'costPerLead': return 'Cost Per Lead by Platform';
      default: return 'Metrics';
    }
  };

  const colors = {
    instagram: '#E4405F',
    linkedin: '#0077B5',
    tiktok: '#000000',
    twitter: '#1DA1F2'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{getTitle()}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={getChartData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis tickFormatter={formatValue} />
          <Tooltip formatter={(value: number) => [formatValue(value), getTitle()]} />
          <Bar 
            dataKey="value" 
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}