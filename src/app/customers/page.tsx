'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCustomers } from '@/hooks/useCustomers';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import CustomerFormModal from '@/components/customers/CustomerFormModal';
import OpportunityModal from '@/components/customers/OpportunityModal';
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
  Wallet2,
  Trash2,
  Loader,
  AlertTriangle
} from 'lucide-react';
import { PRODUCT_LABELS, PRODUCT_COLORS, ProductOpportunity, Customer } from '@/types';

export default function CustomersPageFixed() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    clearError
  } = useCustomers();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  
  // Modal states
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    customerId: string;
    customerName: string;
    isDeleting: boolean;
  } | null>(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesProduct = productFilter === 'all' || 
                          customer.productOpportunities.some(opty => opty.product === productFilter);
    return matchesSearch && matchesStatus && matchesProduct;
  });

  // Handle customer form submit
  const handleCustomerSave = async (customerData: Omit<Customer, 'id'>) => {
    try {
      if (modalMode === 'create') {
        return await createCustomer(customerData);
      } else if (selectedCustomer) {
        return await updateCustomer(selectedCustomer.id, customerData);
      }
      return false;
    } catch (error) {
      console.error('Error saving customer:', error);
      return false;
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (customer: Customer, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🗑️ Delete clicked for customer:', customer.companyName);
    
    setDeleteConfirm({
      customerId: customer.id,
      customerName: customer.companyName,
      isDeleting: false
    });
  };

  // Handle actual deletion
  const handleDeleteCustomer = async () => {
    if (!deleteConfirm) return;
    
    console.log('🗑️ Confirming delete for customer:', deleteConfirm.customerName);
    
    // Set deleting state
    setDeleteConfirm(prev => prev ? { ...prev, isDeleting: true } : null);
    
    try {
      const success = await deleteCustomer(deleteConfirm.customerId);
      
      if (success) {
        console.log('✅ Customer deleted successfully');
        setDeleteConfirm(null);
      } else {
        console.log('❌ Failed to delete customer');
        setDeleteConfirm(prev => prev ? { ...prev, isDeleting: false } : null);
      }
    } catch (error) {
      console.error('💥 Error deleting customer:', error);
      setDeleteConfirm(prev => prev ? { ...prev, isDeleting: false } : null);
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    console.log('❌ Delete cancelled');
    setDeleteConfirm(null);
  };

  // Open modals
  const openCreateModal = () => {
    setSelectedCustomer(undefined);
    setModalMode('create');
    setIsCustomerModalOpen(true);
  };

  const openEditModal = (customer: Customer, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('✏️ Edit clicked for customer:', customer.companyName);
    
    setSelectedCustomer(customer);
    setModalMode('edit');
    setIsCustomerModalOpen(true);
  };

  // Utility functions
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
        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={clearError}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-800 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="text-gray-800 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Products</option>
              {Object.entries(PRODUCT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
            <button 
              onClick={openCreateModal}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
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

        {/* Loading State */}
        {loading ? (
          <Card className="p-8 text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading customers...</p>
          </Card>
        ) : (
          /* Customer Table */
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
                          <button 
                            onClick={(e) => openEditModal(customer, e)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Customer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {/* Only show delete for admin users */}
                          {user.role === 'admin' && (
                            <button 
                              onClick={(e) => handleDeleteClick(customer, e)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete Customer"
                              disabled={deleteConfirm?.isDeleting}
                            >
                              {deleteConfirm?.customerId === customer.id && deleteConfirm.isDeleting ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No customers found</p>
                  <p className="text-gray-400">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleCustomerSave}
        customer={selectedCustomer}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={!deleteConfirm.isDeleting ? handleCancelDelete : undefined}
            ></div>
            
            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Customer
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the customer "<strong>{deleteConfirm.customerName}</strong>"? 
                        This action cannot be undone and all customer data will be permanently lost.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteCustomer}
                  disabled={deleteConfirm.isDeleting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteConfirm.isDeleting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Customer
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  disabled={deleteConfirm.isDeleting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}