'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Building2,
  Mail,
  Phone,
  AlertCircle,
  User,
  Package,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Customer } from '@/types';

/** --- Local types for opportunities (sesuaikan bila sudah ada di '@/types') --- */
type OpportunityStatus =
  | 'new'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

interface ProductOpportunity {
  product: keyof typeof PRODUCT_LABELS;
  status: OpportunityStatus;
  value: number; // IDR
  probability: number; // 0-100
  expectedCloseDate: string; // YYYY-MM-DD
  notes?: string;
}

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id'>) => Promise<boolean>;
  customer?: Customer;
  mode: 'create' | 'edit';
}

/** --- Helpers & constants --- */

// Label produk yang umum dipakai (boleh disesuaikan)
const PRODUCT_LABELS = {
  esign: 'Peruri Sign',
  emeterai: 'E-Meterai',
  ekyc: 'e-KYC',
  stamp: 'e-Stamp',
  graph: 'Peruri Graph Analytic',
  smartcard: 'Smart Card',
} as const;

// Warna badge produk
const PRODUCT_COLORS: Record<keyof typeof PRODUCT_LABELS, string> = {
  esign: '#0ea5e9', // sky-500
  emeterai: '#10b981', // emerald-500
  ekyc: '#8b5cf6', // violet-500
  stamp: '#f59e0b', // amber-500
  graph: '#ef4444', // red-500
  smartcard: '#6366f1', // indigo-500
};

// Style status opportunity
function getOpportunityStatusColor(status: OpportunityStatus) {
  switch (status) {
    case 'new':
      return 'bg-gray-100 text-gray-800';
    case 'qualified':
      return 'bg-sky-100 text-sky-800';
    case 'proposal':
      return 'bg-indigo-100 text-indigo-800';
    case 'negotiation':
      return 'bg-amber-100 text-amber-800';
    case 'won':
      return 'bg-emerald-100 text-emerald-800';
    case 'lost':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatCurrency(value: number) {
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value || 0);
  } catch {
    return `Rp ${value?.toLocaleString('id-ID')}`;
  }
}

export default function CustomerFormModalFixed({
  isOpen,
  onClose,
  onSave,
  customer,
  mode,
}: CustomerFormModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: '',
    companySize: 'medium',
    status: 'prospect',
    lastInteraction: new Date().toISOString().split('T')[0],
    notes: '',
    productOpportunities: [],
    totalOpportunityValue: 0,
    priorityScore: 5,
    assignedTo: '',
    source: 'website',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /** ---------- Opportunity modal state ---------- */
  const [oppModalOpen, setOppModalOpen] = useState(false);
  const [oppEditingIndex, setOppEditingIndex] = useState<number | null>(null);
  const [oppDraft, setOppDraft] = useState<ProductOpportunity>({
    product: 'esign',
    status: 'new',
    value: 0,
    probability: 10,
    expectedCloseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const industries = [
    'Perbankan',
    'Teknologi',
    'Healthcare',
    'Asuransi',
    'Pemerintahan',
    'E-commerce',
    'Manufaktur',
    'Education',
    'BUMN',
    'Konsultan',
    'Startup',
    'Media',
    'Transportasi',
    'Retail',
    'Legal',
  ];

  const sources = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'cold_outreach', label: 'Cold Outreach' },
  ];

  /** ---------- Initialize form data when customer changes ---------- */
  useEffect(() => {
    if (!isOpen) return;

    if (customer && mode === 'edit') {
      setFormData({
        companyName: customer.companyName || '',
        contactPerson: customer.contactPerson || '',
        email: customer.email || '',
        phone: customer.phone || '',
        industry: customer.industry || '',
        companySize: customer.companySize || 'medium',
        status: customer.status || 'prospect',
        lastInteraction:
          customer.lastInteraction || new Date().toISOString().split('T')[0],
        notes: customer.notes || '',
        productOpportunities: customer.productOpportunities || [],
        totalOpportunityValue: customer.totalOpportunityValue || 0,
        priorityScore: customer.priorityScore || 5,
        assignedTo: customer.assignedTo || '',
        source: customer.source || 'website',
        createdAt: customer.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else if (mode === 'create') {
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        industry: '',
        companySize: 'medium',
        status: 'prospect',
        lastInteraction: new Date().toISOString().split('T')[0],
        notes: '',
        productOpportunities: [],
        totalOpportunityValue: 0,
        priorityScore: 5,
        assignedTo: '',
        source: 'website',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    setErrors({});
  }, [customer, mode, isOpen]);

  /** ---------- Weighted total recalculation whenever opportunities change ---------- */
  useEffect(() => {
    const list = (formData as any).productOpportunities as ProductOpportunity[];
    const weighted = (list || []).reduce((acc, o) => acc + (o.value || 0) * ((o.probability || 0) / 100), 0);
    setFormData((prev) => ({ ...prev, totalOpportunityValue: Math.round(weighted) }));
  }, [(formData as any).productOpportunities]);

  /** ---------- Backdrop & Escape ---------- */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /** ---------- Form helpers ---------- */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.industry.trim()) newErrors.industry = 'Industry is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const customerData: Omit<Customer, 'id'> = {
        ...formData,
        updatedAt: new Date().toISOString(),
        ...(mode === 'create' && { createdAt: new Date().toISOString() }),
      };
      const success = await onSave(customerData);
      if (success) onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      setErrors({ submit: 'Failed to save customer. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<Customer, 'id'>, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: '' }));
    }
  };

  /** ---------- Opportunity actions ---------- */
  const openCreateOpportunityModal = () => {
    setOppEditingIndex(null);
    setOppDraft({
      product: 'esign',
      status: 'new',
      value: 0,
      probability: 10,
      expectedCloseDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setOppModalOpen(true);
  };

  const openEditOpportunityModal = (opportunity: ProductOpportunity, index?: number) => {
    setOppEditingIndex(typeof index === 'number' ? index : null);
    setOppDraft({ ...opportunity });
    setOppModalOpen(true);
  };

  const handleDeleteOpportunity = (indexOrOpp: number | ProductOpportunity) => {
    const idx =
      typeof indexOrOpp === 'number'
        ? indexOrOpp
        : (formData as any).productOpportunities.findIndex((o: ProductOpportunity) => o === indexOrOpp);
    if (idx < 0) return;
    const next = [...((formData as any).productOpportunities as ProductOpportunity[])];
    next.splice(idx, 1);
    setFormData((prev) => ({ ...prev, productOpportunities: next as any }));
  };

  const saveOpportunity = () => {
    const list = [...((formData as any).productOpportunities as ProductOpportunity[])];
    if (oppEditingIndex === null) {
      list.push({ ...oppDraft });
    } else {
      list[oppEditingIndex] = { ...oppDraft };
    }
    setFormData((prev) => ({ ...prev, productOpportunities: list as any }));
    setOppModalOpen(false);
  };

  /** ---------- Render ---------- */
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleBackdropClick}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>

        {/* Modal panel */}
        <div
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-10"
          onClick={handleModalClick}
        >
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {mode === 'create' ? 'Add New Customer' : 'Edit Customer'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {mode === 'create' ? 'Create a new customer record' : 'Update customer information'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded">
                <p className="text-sm text-red-700 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleInputChange('companyName', e.target.value);
                        }}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.companyName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="PT Example Company"
                      />
                    </div>
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.contactPerson}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleInputChange('contactPerson', e.target.value);
                        }}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.contactPerson ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.contactPerson && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.contactPerson}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleInputChange('email', e.target.value);
                        }}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleInputChange('phone', e.target.value);
                        }}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="021-12345678"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Industry and Company Size */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleInputChange('industry', e.target.value);
                      }}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.industry ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    {errors.industry && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.industry}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleInputChange('companySize', e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="startup">Startup (1-10 employees)</option>
                      <option value="small">Small (11-50 employees)</option>
                      <option value="medium">Medium (51-200 employees)</option>
                      <option value="large">Large (201-1000 employees)</option>
                      <option value="enterprise">Enterprise (1000+ employees)</option>
                    </select>
                  </div>
                </div>

                {/* Status and Source */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status as any}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleInputChange('status', e.target.value as any);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="prospect">Prospect</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Source
                    </label>
                    <select
                      value={formData.source as any}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleInputChange('source', e.target.value as any);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {sources.map((source) => (
                        <option key={source.value} value={source.value}>
                          {source.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Product Opportunities Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-blue-600" />
                      Product Opportunities
                    </h4>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreateOpportunityModal();
                      }}
                      className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Opportunity
                    </button>
                  </div>

                  {(formData as any).productOpportunities.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No product opportunities yet</p>
                      <p className="text-gray-400 text-xs">Click "Add Opportunity" to create one</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {((formData as any).productOpportunities as ProductOpportunity[]).map(
                        (opportunity, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <span
                                    className="inline-block px-2 py-1 rounded text-white text-xs font-medium mr-2"
                                    style={{
                                      backgroundColor:
                                        PRODUCT_COLORS[
                                          (opportunity.product as keyof typeof PRODUCT_COLORS) || 'esign'
                                        ],
                                    }}
                                  >
                                    {
                                      PRODUCT_LABELS[
                                        (opportunity.product as keyof typeof PRODUCT_LABELS) || 'esign'
                                      ]
                                    }
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${getOpportunityStatusColor(
                                      opportunity.status
                                    )}`}
                                  >
                                    {opportunity.status.replace('_', ' ').toUpperCase()}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Value:</span>
                                    <span className="font-semibold ml-1">{formatCurrency(opportunity.value)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Probability:</span>
                                    <span className="font-semibold ml-1">{opportunity.probability}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Expected:</span>
                                    <span className="font-semibold ml-1">
                                      {new Date(opportunity.expectedCloseDate).toLocaleDateString('id-ID')}
                                    </span>
                                  </div>
                                </div>
                                {opportunity.notes && (
                                  <p className="text-gray-600 text-xs mt-2">{opportunity.notes}</p>
                                )}
                              </div>
                              <div className="flex space-x-1 ml-4">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditOpportunityModal(opportunity, index);
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="Edit Opportunity"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteOpportunity(index);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Delete Opportunity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      )}

                      {/* Total Value Summary */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-900 font-medium">Total Weighted Value:</span>
                          <span className="text-blue-900 font-bold text-lg">
                            {formatCurrency(formData.totalOpportunityValue)}
                          </span>
                        </div>
                        <p className="text-blue-700 text-xs mt-1">
                          Based on {(formData as any).productOpportunities.length} opportunities with probability
                          weighting
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleInputChange('notes', e.target.value);
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any relevant notes about this customer..."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => e.stopPropagation()}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {mode === 'create' ? 'Create Customer' : 'Update Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Opportunity Create/Edit Modal */}
      {oppModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOppModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white shadow-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold">
                {oppEditingIndex === null ? 'Add Opportunity' : 'Edit Opportunity'}
              </h4>
              <button onClick={() => setOppModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={oppDraft.product}
                  onChange={(e) => setOppDraft((p) => ({ ...p, product: e.target.value as any }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {Object.entries(PRODUCT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={oppDraft.status}
                  onChange={(e) => setOppDraft((p) => ({ ...p, status: e.target.value as OpportunityStatus }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="new">New</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value (IDR)</label>
                <input
                  type="number"
                  min={0}
                  value={oppDraft.value}
                  onChange={(e) => setOppDraft((p) => ({ ...p, value: Number(e.target.value || 0) }))}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="100000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={oppDraft.probability}
                  onChange={(e) =>
                    setOppDraft((p) => ({
                      ...p,
                      probability: Math.max(0, Math.min(100, Number(e.target.value || 0))),
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="30"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
                <input
                  type="date"
                  value={oppDraft.expectedCloseDate}
                  onChange={(e) => setOppDraft((p) => ({ ...p, expectedCloseDate: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={oppDraft.notes}
                  onChange={(e) => setOppDraft((p) => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Additional context..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-md border"
                onClick={() => setOppModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={saveOpportunity}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
