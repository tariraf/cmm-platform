'use client';
import { useState, useEffect } from 'react';
import { campaignService } from '@/lib/firestore';
import { Campaign } from '@/types';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all campaigns
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new campaign
  const createCampaign = async (campaignData: Omit<Campaign, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      const id = await campaignService.create(campaignData);
      
      // Add to local state
      const newCampaign: Campaign = { ...campaignData, id };
      setCampaigns(prev => [newCampaign, ...prev]);
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating campaign:', err);
      return false;
    }
  };

  // Update campaign
  const updateCampaign = async (id: string, updates: Partial<Campaign>): Promise<boolean> => {
    try {
      setError(null);
      await campaignService.update(id, updates);
      
      // Update local state
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === id 
            ? { ...campaign, ...updates }
            : campaign
        )
      );
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating campaign:', err);
      return false;
    }
  };

  // Delete campaign
  const deleteCampaign = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await campaignService.delete(id);
      
      // Remove from local state
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting campaign:', err);
      return false;
    }
  };

  // Get active campaigns
  const getActiveCampaigns = async (): Promise<Campaign[]> => {
    try {
      setError(null);
      return await campaignService.getActive();
    } catch (err: any) {
      setError(err.message);
      console.error('Error getting active campaigns:', err);
      return [];
    }
  };

  // Get campaign by ID
  const getCampaign = async (id: string): Promise<Campaign | null> => {
    try {
      setError(null);
      return await campaignService.getById(id);
    } catch (err: any) {
      setError(err.message);
      console.error('Error getting campaign:', err);
      return null;
    }
  };

  // Load campaigns on component mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaign,
    getActiveCampaigns,
    refreshCampaigns: loadCampaigns,
    clearError: () => setError(null)
  };
}