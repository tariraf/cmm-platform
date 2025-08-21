'use client';
import React from 'react';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const stats = [
  {
    title: 'Total Leads',
    value: '1,234',
    change: '+12.5%',
    positive: true,
    icon: Users
  },
  {
    title: 'Active Campaigns',
    value: '8',
    change: '+2',
    positive: true,
    icon: Target
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: '+0.8%',
    positive: true,
    icon: TrendingUp
  },
  {
    title: 'Cost Per Lead',
    value: 'Rp 45K',
    change: '-15%',
    positive: true,
    icon: DollarSign
  }
];

export default function DashboardPage() {
  return (
    <div>
      <Header 
        title="Dashboard Overview" 
        subtitle="Ringkasan performa campaign dan marketing metrics"
      />
      
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.positive ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ml-1 ${
                        stat.positive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Quick Actions">
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Create New Campaign</div>
                <div className="text-gray-600 text-sm">Setup campaign baru untuk platform sosial media</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Add New Lead</div>
                <div className="text-gray-600 text-sm">Input lead baru dari berbagai sumber</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Generate Report</div>
                <div className="text-gray-600 text-sm">Buat laporan performa campaign bulanan</div>
              </button>
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">New lead from LinkedIn</p>
                  <p className="text-gray-600 text-sm">Bank ABC - 2 menit yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Campaign "FinTech Innovation" updated</p>
                  <p className="text-gray-600 text-sm">Budget increased - 15 menit yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">New insight generated</p>
                  <p className="text-gray-600 text-sm">TikTok peak engagement - 1 jam yang lalu</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}