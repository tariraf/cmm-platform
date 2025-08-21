'use client';
import React, { useState } from 'react';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { dummyCampaigns } from '@/data/dummy';
import { Campaign } from '@/types';
import { 
  Search, 
  Plus, 
  Target, 
  Calendar,
  DollarSign,
  TrendingUp,
  Play,
  Pause,
  Edit,
  MoreVertical,
  CheckCircle
} from 'lucide-react';

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>(dummyCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const calculateProgress = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const calculateConversionRate = (conversions: number, leads: number) => {
    return leads > 0 ? ((conversions / leads) * 100).toFixed(1) : '0';
  };

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalLeads = campaigns.reduce((sum, campaign) => sum + campaign.leads, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);

  return (
    <div>
      <Header 
        title="Campaign Management" 
        subtitle="Kelola dan monitor performa campaign marketing di berbagai platform"
      />
      
      <div className="p-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </button>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
                <div className="text-gray-600 text-sm">Total Campaigns</div>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  Rp {(totalBudget / 1000000).toFixed(0)}M
                </div>
                <div className="text-gray-600 text-sm">Total Budget</div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalLeads}</div>
                <div className="text-gray-600 text-sm">Total Leads</div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {calculateConversionRate(totalConversions, totalLeads)}%
                </div>
                <div className="text-gray-600 text-sm">Avg Conversion</div>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Campaign List */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {campaign.name}
                    </h3>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1">{campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {campaign.platform.map((platform) => (
                      <span key={platform} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(campaign.startDate).toLocaleDateString('id-ID')} - {new Date(campaign.endDate).toLocaleDateString('id-ID')}
                  </div>
                </div>
                
                <div className="lg:w-96">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Budget Used</div>
                      <div className="text-sm font-semibold text-gray-900">
                        Rp {(campaign.spent / 1000000).toFixed(1)}M / Rp {(campaign.budget / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Performance</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {campaign.leads} leads, {campaign.conversions} conversions
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{calculateProgress(campaign.spent, campaign.budget).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(campaign.spent, campaign.budget)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      Conversion Rate: <span className="font-semibold text-gray-900">
                        {calculateConversionRate(campaign.conversions, campaign.leads)}%
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}