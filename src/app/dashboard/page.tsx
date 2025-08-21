'use client'
import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  TrendingDown,
  Star,
  Award
} from 'lucide-react';
import { PRODUCT_LABELS, PRODUCT_COLORS, ProductOpportunity } from '@/types';

const stats = [
  {
    title: 'Total Opportunities',
    value: '47',
    change: '+8',
    positive: true,
    icon: Target,
    color: 'blue'
  },
  {
    title: 'Pipeline Value',
    value: 'Rp 2.8M',
    change: '+25%',
    positive: true,
    icon: DollarSign,
    color: 'green'
  },
  {
    title: 'Active Customers',
    value: '23',
    change: '+3',
    positive: true,
    icon: Users,
    color: 'purple'
  },
  {
    title: 'Win Rate',
    value: '68%',
    change: '+5%',
    positive: true,
    icon: Award,
    color: 'orange'
  }
];

// Mock data untuk product opportunities
const productData = [
  { product: 'meterai_elektronik', opportunities: 18, value: 950000, percentage: 34, color: PRODUCT_COLORS.meterai_elektronik },
  { product: 'digital_solution', opportunities: 12, value: 720000, percentage: 26, color: PRODUCT_COLORS.digital_solution },
  { product: 'smart_card', opportunities: 8, value: 480000, percentage: 17, color: PRODUCT_COLORS.smart_card },
  { product: 'graph_analytic', opportunities: 6, value: 360000, percentage: 13, color: PRODUCT_COLORS.graph_analytic },
  { product: 'digital_product', opportunities: 3, value: 290000, percentage: 10, color: PRODUCT_COLORS.digital_product }
];

const industryData = [
  { industry: 'Perbankan', customers: 8, opportunities: 15, value: 850000, topProduct: 'meterai_elektronik' },
  { industry: 'Teknologi', customers: 6, opportunities: 12, value: 520000, topProduct: 'digital_solution' },
  { industry: 'Healthcare', customers: 4, opportunities: 8, value: 380000, topProduct: 'smart_card' },
  { industry: 'Pemerintahan', customers: 3, opportunities: 7, value: 420000, topProduct: 'meterai_elektronik' },
  { industry: 'Asuransi', customers: 2, opportunities: 5, value: 230000, topProduct: 'meterai_elektronik' }
];

const monthlyTrend = [
  { month: 'Jul', opportunities: 12, value: 580000, closed: 8 },
  { month: 'Aug', opportunities: 15, value: 720000, closed: 10 },
  { month: 'Sep', opportunities: 18, value: 890000, closed: 12 },
  { month: 'Oct', opportunities: 22, value: 1200000, closed: 15 },
  { month: 'Nov', opportunities: 28, value: 1450000, closed: 19 },
  { month: 'Dec', opportunities: 32, value: 1680000, closed: 22 }
];

const topProductsByRevenue = [
  { product: 'meterai_elektronik', revenue: 1850000, growth: 28, deals: 12 },
  { product: 'digital_solution', revenue: 1200000, growth: 15, deals: 8 },
  { product: 'smart_card', revenue: 890000, growth: 22, deals: 6 },
  { product: 'graph_analytic', revenue: 650000, growth: -5, deals: 4 },
  { product: 'digital_product', revenue: 420000, growth: 45, deals: 3 }
];

function formatCurrency(value: number): string {
  return `Rp ${(value / 1000).toFixed(0)}K`;
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function EnhancedDashboardPage() {
  const [timeframe, setTimeframe] = useState('month');

  return (
    <div>
      <Header 
        title="Dashboard Overview" 
        subtitle="Campaign performance & product opportunity analytics"
      />
      
      <div className="p-6 space-y-6">
        {/* Time Filter */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Performance Summary</h2>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Product Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Opportunities Distribution */}
          <Card title="Product Opportunities Distribution" subtitle="Breakdown by product category">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ product, percentage }) => `${PRODUCT_LABELS[product as ProductOpportunity]}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="opportunities"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value} opportunities`,
                    PRODUCT_LABELS[props.payload.product as ProductOpportunity]
                  ]} 
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Products by Revenue */}
          <Card title="Top Products by Revenue" subtitle="Performance in current quarter">
            <div className="space-y-4">
              {topProductsByRevenue.map((product, index) => (
                <div key={product.product} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-8 rounded-sm mr-3" style={{ backgroundColor: PRODUCT_COLORS[product.product as ProductOpportunity] }}></div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {PRODUCT_LABELS[product.product as ProductOpportunity]}
                      </div>
                      <div className="text-sm text-gray-600">{product.deals} deals closed</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</div>
                    <div className={`text-sm flex items-center ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {Math.abs(product.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card title="Monthly Opportunities Trend" subtitle="Pipeline development over time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'opportunities' ? `${value} opportunities` :
                  name === 'closed' ? `${value} closed` :
                  formatCurrency(value),
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Bar yAxisId="left" dataKey="opportunities" fill="#3B82F6" name="opportunities" />
              <Bar yAxisId="left" dataKey="closed" fill="#10B981" name="closed" />
              <Line yAxisId="right" type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={3} name="value" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Industry Analysis */}
        <Card title="Industry Breakdown" subtitle="Customer distribution and top products by industry">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Industry</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Customers</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Opportunities</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Pipeline Value</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Top Product</th>
                </tr>
              </thead>
              <tbody>
                {industryData.map((industry, index) => (
                  <tr key={industry.industry} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{industry.industry}</div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {industry.customers}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {industry.opportunities}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 font-semibold text-gray-900">
                      {formatCurrency(industry.value)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: PRODUCT_COLORS[industry.topProduct as ProductOpportunity] }}
                      >
                        {PRODUCT_LABELS[industry.topProduct as ProductOpportunity]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Quick Actions">
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Create New Opportunity</div>
                <div className="text-gray-600 text-sm">Add new product opportunity untuk customer</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Update Customer Pipeline</div>
                <div className="text-gray-600 text-sm">Review dan update status opportunities</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Generate Product Report</div>
                <div className="text-gray-600 text-sm">Analisis performa per produk bulanan</div>
              </button>
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">New opportunity: Meterai Elektronik</p>
                  <p className="text-gray-600 text-sm">Bank XYZ - Rp 450K - 2 menit yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Customer moved to negotiation</p>
                  <p className="text-gray-600 text-sm">PT Teknologi Maju - Smart Card - 15 menit yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Deal closed: Digital Solution</p>
                  <p className="text-gray-600 text-sm">BUMN Healthcare - Rp 2.1M - 1 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Follow-up required</p>
                  <p className="text-gray-600 text-sm">3 opportunities need attention - 2 jam yang lalu</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}