'use client'
import React, { useState } from 'react';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  Phone, 
  Mail, 
  Calendar,
  Edit,
  Eye,
  MoreVertical,
  Package,
  DollarSign,
  TrendingUp,
  Star,
  Target,
  Wallet,
  Currency,
  CurrencyIcon,
  Wallet2
} from 'lucide-react';
import { PRODUCT_LABELS, PRODUCT_COLORS, ProductOpportunity } from '@/types';

// Enhanced dummy customers dengan product opportunities
const enhancedCustomers = [
  {
    id: '1',
    companyName: 'PT Bank Digital Indonesia',
    contactPerson: 'Dewi Sartika',
    email: 'dewi@bankdigital.co.id',
    phone: '021-1234567',
    industry: 'Perbankan',
    companySize: 'large' as const,
    status: 'active' as const,
    lastInteraction: '2024-11-28',
    notes: 'Tertarik dengan solusi digital marketing untuk produk KPR',
    source: 'linkedin' as const,
    priorityScore: 9,
    assignedTo: 'Admin DICO',
    productOpportunities: [
      {
        product: 'meterai_elektronik' as ProductOpportunity,
        status: 'negotiation' as const,
        value: 850000,
        probability: 75,
        expectedCloseDate: '2024-12-15',
        notes: 'Evaluasi integrasi dengan sistem core banking',
        createdAt: '2024-11-01',
        updatedAt: '2024-11-28'
      },
      {
        product: 'digital_solution' as ProductOpportunity,
        status: 'proposal_sent' as const,
        value: 1200000,
        probability: 60,
        expectedCloseDate: '2025-01-30',
        notes: 'Proposal untuk digital transformation',
        createdAt: '2024-11-15',
        updatedAt: '2024-11-25'
      }
    ],
    totalOpportunityValue: 2050000,
    createdAt: '2024-10-15',
    updatedAt: '2024-11-28'
  },
  {
    id: '2',
    companyName: 'CV Teknologi Maju',
    contactPerson: 'Rudi Hartono',
    email: 'rudi@tekmaju.com',
    phone: '021-2345678',
    industry: 'Teknologi',
    companySize: 'medium' as const,
    status: 'prospect' as const,
    lastInteraction: '2024-11-30',
    notes: 'Evaluasi platform untuk campaign B2B SaaS',
    source: 'website' as const,
    priorityScore: 7,
    assignedTo: 'Marketing Team',
    productOpportunities: [
      {
        product: 'graph_analytic' as ProductOpportunity,
        status: 'interested' as const,
        value: 450000,
        probability: 40,
        expectedCloseDate: '2024-12-31',
        notes: 'Butuh demo lebih detail untuk analytics features',
        createdAt: '2024-11-20',
        updatedAt: '2024-11-30'
      }
    ],
    totalOpportunityValue: 450000,
    createdAt: '2024-11-01',
    updatedAt: '2024-11-30'
  },
  {
    id: '3',
    companyName: 'RS Harapan Sehat',
    contactPerson: 'Dr. Lisa Maharani',
    email: 'lisa@rsharapan.co.id',
    phone: '021-3456789',
    industry: 'Healthcare',
    companySize: 'large' as const,
    status: 'active' as const,
    lastInteraction: '2024-12-01',
    notes: 'Implementasi smart card untuk patient management',
    source: 'referral' as const,
    priorityScore: 8,
    assignedTo: 'Admin DICO',
    productOpportunities: [
      {
        product: 'smart_card' as ProductOpportunity,
        status: 'closed_won' as const,
        value: 950000,
        probability: 100,
        expectedCloseDate: '2024-11-30',
        notes: 'Deal successfully closed - implementation starts January',
        createdAt: '2024-10-01',
        updatedAt: '2024-11-30'
      },
      {
        product: 'digital_solution' as ProductOpportunity,
        status: 'interested' as const,
        value: 750000,
        probability: 30,
        expectedCloseDate: '2025-02-28',
        notes: 'Interested in full digital transformation after smart card success',
        createdAt: '2024-11-25',
        updatedAt: '2024-12-01'
      }
    ],
    totalOpportunityValue: 1700000,
    createdAt: '2024-09-15',
    updatedAt: '2024-12-01'
  }
];

export default function EnhancedCustomersPage() {
  const [customers] = useState(enhancedCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesProduct = productFilter === 'all' || 
                          customer.productOpportunities.some(opty => opty.product === productFilter);
    return matchesSearch && matchesStatus && matchesProduct;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOpportunityStatusColor = (status: string) => {
    switch (status) {
      case 'interested': return 'bg-blue-100 text-blue-800';
      case 'proposal_sent': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed_won': return 'bg-green-100 text-green-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-100';
    if (score >= 6) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const formatCurrency = (value: number) => `Rp ${(value / 1000).toFixed(0)}K`;

  // Calculate summary stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalPipelineValue = customers.reduce((sum, customer) => sum + customer.totalOpportunityValue, 0);
  const totalOpportunities = customers.reduce((sum, customer) => sum + customer.productOpportunities.length, 0);

  return (
    <div>
      <Header 
        title="Customer Management" 
        subtitle="Kelola customer pipeline dan product opportunities"
      />
      
      <div className="p-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
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
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Products</option>
              {Object.entries(PRODUCT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
                <div className="text-gray-600 text-sm">Total Customers</div>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
                <div className="text-gray-600 text-sm">Active Customers</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalOpportunities}</div>
                <div className="text-gray-600 text-sm">Total Opportunities</div>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalPipelineValue)}</div>
                <div className="text-gray-600 text-sm">Pipeline Value</div>
              </div>
              <Wallet2 className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Customer Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Company</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Industry</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Product Opportunities</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Pipeline Value</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{customer.companyName}</div>
                          <div className="text-gray-600 text-sm flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{customer.contactPerson}</div>
                      <div className="text-gray-600 text-sm flex items-center mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {customer.phone}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{customer.industry}</span>
                      <div className="text-gray-500 text-xs mt-1 capitalize">{customer.companySize}</div>
                    </td>
                    
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center">
                        <Star className={`w-4 h-4 mr-1 ${getPriorityColor(customer.priorityScore)}`} />
                        <span className={`text-sm font-medium px-2 py-1 rounded ${getPriorityColor(customer.priorityScore)}`}>
                          {customer.priorityScore}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {customer.productOpportunities.map((opty, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span 
                              className="text-xs px-2 py-1 rounded text-white"
                              style={{ backgroundColor: PRODUCT_COLORS[opty.product] }}
                            >
                              {PRODUCT_LABELS[opty.product]}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ml-2 ${getOpportunityStatusColor(opty.status)}`}>
                              {opty.status.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6 text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(customer.totalOpportunityValue)}</div>
                      <div className="text-gray-500 text-xs">
                        {customer.productOpportunities.length} opportunities
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}