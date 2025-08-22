'use client';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import CampaignFormModal from '@/components/campaigns/CampaignFormModal';
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
  CheckCircle,
  Trash2,
  Loader
} from 'lucide-react';

export default function CampaignsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    clearError
  } = useCampaigns();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal states
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState(false);

  // Check authentication
  React.useEffect(() => {
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

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle campaign form submit
  const handleCampaignSave = async (campaignData: Omit<Campaign, 'id'>) => {
    try {
      if (modalMode === 'create') {
        return await createCampaign(campaignData);
      } else if (selectedCampaign) {
        return await updateCampaign(selectedCampaign.id, campaignData);
      }
      return false;
    } catch (error) {
      console.error('Error saving campaign:', error);
      return false;
    }
  };

  // Handle campaign delete
  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      setDeletingCampaign(true);
      const success = await deleteCampaign(campaignId);
      if (success) {
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    } finally {
      setDeletingCampaign(false);
    }
  };

  // Open modals
  const openCreateModal = () => {
    setSelectedCampaign(undefined);
    setModalMode('create');
    setIsCampaignModalOpen(true);
  };

  const openEditModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setModalMode('edit');
    setIsCampaignModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!deletingCampaign) {
      setDeleteConfirm(null);
    }
  };

  // Utility functions
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

  // Calculate summary stats
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
              placeholder="Search campaigns..."
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
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
            
            <button 
              onClick={openCreateModal}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
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

        {/* Loading State */}
        {loading ? (
          <Card className="p-8 text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading campaigns...</p>
          </Card>
        ) : (
          /* Campaign List */
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
                        <button 
                          onClick={() => openEditModal(campaign)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit Campaign"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(campaign.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Campaign"
                          disabled={deletingCampaign}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {filteredCampaigns.length === 0 && (
              <Card className="p-12 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No campaigns found</p>
                <p className="text-gray-400">Try adjusting your search criteria or create a new campaign</p>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Campaign Form Modal */}
      {isCampaignModalOpen && (
        <CampaignFormModal
          isOpen={isCampaignModalOpen}
          onClose={() => setIsCampaignModalOpen(false)}
          onSave={handleCampaignSave}
          campaign={selectedCampaign}
          mode={modalMode}
        />
      )}

      {/* Delete Confirmation Modal - FIXED VERSION */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay - clickable to close */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 cursor-pointer" 
              aria-hidden="true"
              onClick={closeDeleteModal}
            ></div>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal panel */}
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Campaign
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this campaign? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleDeleteCampaign(deleteConfirm)}
                  disabled={deletingCampaign}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingCampaign ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deletingCampaign}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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