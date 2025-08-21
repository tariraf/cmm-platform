import React from 'react';
import type { PlatformInsight } from '@/types/analytics';
import { TrendingUp, Users, Target, BarChart3, AlertCircle, CheckCircle, Clock, Search, Eye } from 'lucide-react';

interface InsightCardProps {
  insight: PlatformInsight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const getIcon = () => {
    switch (insight.type) {
      case 'performance': return TrendingUp;
      case 'content': return BarChart3;
      case 'audience': return Users;
      case 'keyword': return Search;
      case 'traffic': return Eye;
      case 'timing': return Clock;
      case 'conversion': return Target;
      case 'trend': return TrendingUp;
      default: return AlertCircle;
    }
  };

  const getPriorityColor = () => {
    switch (insight.priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-700';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'low': return 'bg-green-50 border-green-200 text-green-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const Icon = getIcon();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-50 rounded-lg mr-3">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{insight.title}</h3>
            <div className="flex items-center mt-1">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor()}`}>
                {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
              </span>
              {insight.platform && (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {insight.platform.charAt(0).toUpperCase() + insight.platform.slice(1)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {new Date(insight.createdAt).toLocaleDateString('id-ID')}
        </div>
      </div>
      
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {insight.description}
      </p>

    </div>
  );
}