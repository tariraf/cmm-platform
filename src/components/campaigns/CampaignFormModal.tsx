'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Target, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { Campaign, PRODUCT_LABELS, ProductOpportunity } from '@/types';

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Omit<Campaign, 'id'>) => Promise<boolean>;
  campaign?: Campaign;
  mode: 'create' | 'edit';
}

export default function CampaignFormModalFixed({ 
  isOpen, 
  onClose, 
  onSave, 
  campaign, 
  mode 
}: CampaignFormModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Omit<Campaign, 'id'>>({
    name: '',
    platform: [],
    startDate: '',
    endDate: '',
    budget: 0,
    spent: 0,
    leads: 0,
    conversions: 0,
    status: 'active',
    targetProducts: [],
    productResults: [],
    targetIndustries: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when campaign changes
  useEffect(() => {
    if (!isOpen) return;
    
    if (campaign && mode === 'edit') {
      setFormData({
        name: campaign.name || '',
        platform: Array.isArray(campaign.platform) ? campaign.platform : [],
        startDate: campaign.startDate || '',
        endDate: campaign.endDate || '',
        budget: campaign.budget || 0,
        spent: campaign.spent || 0,
        leads: campaign.leads || 0,
        conversions: campaign.conversions || 0,
        status: campaign.status || 'active',
        targetProducts: Array.isArray(campaign.targetProducts) ? campaign.targetProducts : [],
        productResults: Array.isArray(campaign.productResults) ? campaign.productResults : [],
        targetIndustries: Array.isArray(campaign.targetIndustries) ? campaign.targetIndustries : []
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        platform: [],
        startDate: '',
        endDate: '',
        budget: 0,
        spent: 0,
        leads: 0,
        conversions: 0,
        status: 'active',
        targetProducts: [],
        productResults: [],
        targetIndustries: []
      });
    }
    
    setErrors({});
  }, [campaign, mode, isOpen]);

  // Handle backdrop click - only close if clicking outside modal content
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Prevent modal close when clicking inside
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Campaign name is required';
    if (!Array.isArray(formData.platform) || formData.platform.length === 0) {
      newErrors.platform = 'At least one platform must be selected';
    }
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
    if (!Array.isArray(formData.targetProducts) || formData.targetProducts.length === 0) {
      newErrors.targetProducts = 'At least one target product must be selected';
    }
    
    // Validate date range
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const campaignData: Omit<Campaign, 'id'> = {
        ...formData,
        platform: Array.isArray(formData.platform) ? formData.platform : [],
        targetProducts: Array.isArray(formData.targetProducts) ? formData.targetProducts : [],
        targetIndustries: Array.isArray(formData.targetIndustries) ? formData.targetIndustries : [],
        productResults: Array.isArray(formData.productResults) && formData.productResults.length > 0 
          ? formData.productResults
          : formData.targetProducts.map(product => ({
              product,
              leads: 0,
              conversions: 0,
              cost: 0
            }))
      };
      
      const success = await onSave(campaignData);
      
      if (success) {
        onClose();
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save campaign' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<Campaign, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const currentPlatforms = Array.isArray(formData.platform) ? formData.platform : [];
    const updatedPlatforms = checked 
      ? [...currentPlatforms, platform]
      : currentPlatforms.filter(p => p !== platform);
    
    handleInputChange('platform', updatedPlatforms);
  };

  const handleProductChange = (product: ProductOpportunity, checked: boolean) => {
    const currentProducts = Array.isArray(formData.targetProducts) ? formData.targetProducts : [];
    const updatedProducts = checked 
      ? [...currentProducts, product]
      : currentProducts.filter(p => p !== product);
    
    handleInputChange('targetProducts', updatedProducts);
  };

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'website', label: 'Website' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>

        {/* Modal panel */}
        <div 
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-10"
          onClick={handleModalClick}
        >
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {mode === 'create' ? 'Create New Campaign' : 'Edit Campaign'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {mode === 'create' ? 'Set up a new marketing campaign' : 'Update campaign details'}
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
                {/* Campaign Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Digital Banking Q4 2024"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platforms <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {platforms.map(platform => (
                      <label key={platform.value} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Array.isArray(formData.platform) && formData.platform.includes(platform.value)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handlePlatformChange(platform.value, e.target.checked);
                          }}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{platform.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.platform && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.platform}
                    </p>
                  )}
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-800 pointer-events-none" />
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleInputChange('startDate', e.target.value);
                        }}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.startDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-800 pointer-events-none" />
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleInputChange('endDate', e.target.value);
                        }}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.endDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-800 pointer-events-none" />
                    <input
                      type="number"
                      value={formData.budget || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleInputChange('budget', parseInt(e.target.value) || 0);
                      }}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.budget ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="50000000"
                    />
                  </div>
                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.budget}
                    </p>
                  )}
                  {formData.budget && formData.budget > 0 && (
                    <p className="mt-1 text-sm text-gray-600">
                      {formatCurrency(formData.budget)}
                    </p>
                  )}
                </div>

                {/* Target Products */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Products <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(PRODUCT_LABELS).map(([key, label]) => (
                      <label key={key} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Array.isArray(formData.targetProducts) && formData.targetProducts.includes(key as ProductOpportunity)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleProductChange(key as ProductOpportunity, e.target.checked);
                          }}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.targetProducts && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.targetProducts}
                    </p>
                  )}
                </div>

                {/* Status (for edit mode) */}
                {mode === 'edit' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleInputChange('status', e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
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
                  {mode === 'create' ? 'Create Campaign' : 'Update Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}