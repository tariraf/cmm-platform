'use client'
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { Package, TrendingUp, DollarSign, Target, Award, Users, Calendar, Filter } from 'lucide-react';
import { PRODUCT_LABELS, PRODUCT_COLORS, ProductOpportunity } from '@/types';

interface ProductAnalyticsProps {
  data?: any;
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
  showFilters?: boolean;
}

// Mock data untuk product analytics
const productMetrics = [
  {
    product: 'meterai_elektronik',
    opportunities: 18,
    pipelineValue: 2950000,
    winRate: 72,
    avgDealSize: 163888,
    avgSalesCycle: 45,
    revenue: 1850000,
    growth: 28
  },
  {
    product: 'digital_solution', 
    opportunities: 12,
    pipelineValue: 2170000,
    winRate: 68,
    avgDealSize: 180833,
    avgSalesCycle: 52,
    revenue: 1200000,
    growth: 15
  },
  {
    product: 'smart_card',
    opportunities: 8,
    pipelineValue: 1630000,
    winRate: 75,
    avgDealSize: 203750,
    avgSalesCycle: 38,
    revenue: 890000,
    growth: 22
  },
  {
    product: 'graph_analytic',
    opportunities: 6,
    pipelineValue: 1090000,
    winRate: 60,
    avgDealSize: 181666,
    avgSalesCycle: 35,
    revenue: 650000,
    growth: -5
  },
  {
    product: 'digital_product',
    opportunities: 3,
    pipelineValue: 430000,
    winRate: 65,
    avgDealSize: 143333,
    avgSalesCycle: 42,
    revenue: 420000,
    growth: 45
  }
];

const industryProductMapping = [
  { industry: 'Perbankan', meterai_elektronik: 8, digital_solution: 3, smart_card: 2, graph_analytic: 1, digital_product: 0 },
  { industry: 'Healthcare', meterai_elektronik: 2, digital_solution: 4, smart_card: 6, graph_analytic: 1, digital_product: 1 },
  { industry: 'Teknologi', meterai_elektronik: 1, digital_solution: 3, smart_card: 0, graph_analytic: 4, digital_product: 2 },
  { industry: 'Asuransi', meterai_elektronik: 5, digital_solution: 1, smart_card: 0, graph_analytic: 0, digital_product: 0 },
  { industry: 'Pemerintahan', meterai_elektronik: 2, digital_solution: 1, smart_card: 0, graph_analytic: 0, digital_product: 0 }
];

const monthlyTrend = [
  { month: 'Jul', meterai_elektronik: 12, digital_solution: 8, smart_card: 5, graph_analytic: 3, digital_product: 2 },
  { month: 'Aug', meterai_elektronik: 14, digital_solution: 9, smart_card: 6, graph_analytic: 4, digital_product: 2 },
  { month: 'Sep', meterai_elektronik: 16, digital_solution: 10, smart_card: 7, graph_analytic: 5, digital_product: 2 },
  { month: 'Oct', meterai_elektronik: 17, digital_solution: 11, smart_card: 7, graph_analytic: 5, digital_product: 3 },
  { month: 'Nov', meterai_elektronik: 18, digital_solution: 12, smart_card: 8, graph_analytic: 6, digital_product: 3 },
  { month: 'Dec', meterai_elektronik: 18, digital_solution: 12, smart_card: 8, graph_analytic: 6, digital_product: 3 }
];

function formatCurrency(value: number): string {
  return `Rp ${(value / 1000).toFixed(0)}K`;
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function ProductAnalytics({ timeframe = 'month', showFilters = true }: ProductAnalyticsProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [viewType, setViewType] = useState<'overview' | 'performance' | 'trends'>('overview');

  const filteredMetrics = selectedProduct === 'all' 
    ? productMetrics 
    : productMetrics.filter(m => m.product === selectedProduct);

  const totalOpportunities = productMetrics.reduce((sum, p) => sum + p.opportunities, 0);
  const totalPipelineValue = productMetrics.reduce((sum, p) => sum + p.pipelineValue, 0);
  const avgWinRate = productMetrics.reduce((sum, p) => sum + p.winRate, 0) / productMetrics.length;
  const totalRevenue = productMetrics.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Products</option>
              {Object.entries(PRODUCT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="performance">Performance</option>
              <option value="trends">Trends</option>
            </select>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} View
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalOpportunities}</div>
              <div className="text-gray-600 text-sm">Total Opportunities</div>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPipelineValue)}</div>
              <div className="text-gray-600 text-sm">Pipeline Value</div>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{avgWinRate.toFixed(0)}%</div>
              <div className="text-gray-600 text-sm">Avg Win Rate</div>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalRevenue)}</div>
              <div className="text-gray-600 text-sm">Total Revenue</div>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {viewType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Distribution */}
          <Card title="Product Opportunities Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredMetrics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ product, opportunities }) => `${PRODUCT_LABELS[product as ProductOpportunity]}: ${opportunities}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="opportunities"
                >
                  {filteredMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[entry.product as ProductOpportunity]} />
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

          {/* Pipeline Value by Product */}
          <Card title="Pipeline Value by Product">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="product" 
                  tickFormatter={(value) => PRODUCT_LABELS[value as ProductOpportunity]?.split(' ')[0] || value}
                />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(value) => PRODUCT_LABELS[value as ProductOpportunity]}
                />
                <Bar 
                  dataKey="pipelineValue" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {viewType === 'performance' && (
        <div className="space-y-6">
          {/* Performance Metrics Table */}
          <Card title="Product Performance Metrics">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Opportunities</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Pipeline Value</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Win Rate</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg Deal Size</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Sales Cycle</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMetrics.map((product) => (
                    <tr key={product.product} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded mr-3"
                            style={{ backgroundColor: PRODUCT_COLORS[product.product as ProductOpportunity] }}
                          ></div>
                          <span className="font-medium text-gray-900">
                            {PRODUCT_LABELS[product.product as ProductOpportunity]}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          {product.opportunities}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 font-semibold text-gray-900">
                        {formatCurrency(product.pipelineValue)}
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          product.winRate >= 70 ? 'bg-green-100 text-green-800' :
                          product.winRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.winRate}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 text-gray-700">
                        {formatCurrency(product.avgDealSize)}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-700">
                        {product.avgSalesCycle} days
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className={`text-sm font-medium ${
                          product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.growth >= 0 ? '+' : ''}{product.growth}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Industry Breakdown */}
          <Card title="Product Performance by Industry">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={industryProductMapping} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="industry" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="meterai_elektronik" stackId="a" fill={PRODUCT_COLORS.meterai_elektronik} />
                <Bar dataKey="digital_solution" stackId="a" fill={PRODUCT_COLORS.digital_solution} />
                <Bar dataKey="smart_card" stackId="a" fill={PRODUCT_COLORS.smart_card} />
                <Bar dataKey="graph_analytic" stackId="a" fill={PRODUCT_COLORS.graph_analytic} />
                <Bar dataKey="digital_product" stackId="a" fill={PRODUCT_COLORS.digital_product} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {viewType === 'trends' && (
        <div className="space-y-6">
          {/* Monthly Trend */}
          <Card title="Monthly Opportunities Trend by Product">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="meterai_elektronik" 
                  stroke={PRODUCT_COLORS.meterai_elektronik} 
                  strokeWidth={2}
                  name="Meterai Elektronik"
                />
                <Line 
                  type="monotone" 
                  dataKey="digital_solution" 
                  stroke={PRODUCT_COLORS.digital_solution} 
                  strokeWidth={2}
                  name="Digital Solution"
                />
                <Line 
                  type="monotone" 
                  dataKey="smart_card" 
                  stroke={PRODUCT_COLORS.smart_card} 
                  strokeWidth={2}
                  name="Smart Card"
                />
                <Line 
                  type="monotone" 
                  dataKey="graph_analytic" 
                  stroke={PRODUCT_COLORS.graph_analytic} 
                  strokeWidth={2}
                  name="Graph Analytic"
                />
                <Line 
                  type="monotone" 
                  dataKey="digital_product" 
                  stroke={PRODUCT_COLORS.digital_product} 
                  strokeWidth={2}
                  name="Digital Product"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Growth Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredMetrics.map((product) => (
              <Card key={product.product} className="p-4">
                <div className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${PRODUCT_COLORS[product.product as ProductOpportunity]}20` }}
                  >
                    <Package 
                      className="w-6 h-6" 
                      style={{ color: PRODUCT_COLORS[product.product as ProductOpportunity] }}
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {PRODUCT_LABELS[product.product as ProductOpportunity]}
                  </h3>
                  <div className={`text-2xl font-bold mb-1 ${
                    product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.growth >= 0 ? '+' : ''}{product.growth}%
                  </div>
                  <div className="text-gray-600 text-sm">Growth Rate</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}