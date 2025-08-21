'use client';
import React, { useState } from 'react';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { dummyCustomers, dummyLeads } from '@/data/dummy';
import { Customer, Lead } from '@/types';
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
  MoreVertical
} from 'lucide-react';

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(dummyCustomers);
  const [leads] = useState<Lead[]>(dummyLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecentLeads = (companyName: string) => {
    return leads.filter(lead => 
      lead.company.toLowerCase().includes(companyName.toLowerCase())
    ).length;
  };

  return (
    <div>
      <Header 
        title="Customer Management" 
        subtitle="Kelola profil customer dan key person untuk partnership B2B"
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
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
            <div className="text-gray-600 text-sm">Total Customers</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.status === 'active').length}
            </div>
            <div className="text-gray-600 text-sm">Active</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {customers.filter(c => c.status === 'prospect').length}
            </div>
            <div className="text-gray-600 text-sm">Prospects</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {leads.length}
            </div>
            <div className="text-gray-600 text-sm">Total Leads</div>
          </Card>
        </div>

        {/* Customer List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Company</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact Person</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Industry</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Leads</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Contact</th>
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
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {getRecentLeads(customer.companyName)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(customer.lastInteraction).toLocaleDateString('id-ID')}
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