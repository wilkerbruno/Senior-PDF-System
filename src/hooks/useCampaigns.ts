import { useState, useMemo, useCallback } from 'react';
import { Campaign, Channel } from '@/types/crm';
import { mockCampaigns } from '@/data/mockData';

export interface CampaignFilters {
  channel: Channel | 'all';
  status: Campaign['status'] | 'all';
}

export interface CampaignStats {
  total: number;
  active: number;
  scheduled: number;
  completed: number;
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  avgConversionRate: number;
}

const initialFilters: CampaignFilters = {
  channel: 'all',
  status: 'all',
};

export function useCampaigns() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [filters, setFilters] = useState<CampaignFilters>(initialFilters);

  // Filtrar campanhas
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      if (filters.channel !== 'all' && campaign.channel !== filters.channel) {
        return false;
      }
      if (filters.status !== 'all' && campaign.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [campaigns, filters]);

  // Estatísticas
  const stats: CampaignStats = useMemo(() => {
    const activeCampaigns = campaigns.filter((c) => c.status === 'active' || c.status === 'completed');
    
    const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
    const avgOpenRate = activeCampaigns.length > 0
      ? activeCampaigns.reduce((acc, c) => acc + c.openRate, 0) / activeCampaigns.length
      : 0;
    const avgClickRate = activeCampaigns.length > 0
      ? activeCampaigns.reduce((acc, c) => acc + c.clickRate, 0) / activeCampaigns.length
      : 0;
    const avgConversionRate = activeCampaigns.length > 0
      ? activeCampaigns.reduce((acc, c) => acc + c.conversionRate, 0) / activeCampaigns.length
      : 0;

    return {
      total: campaigns.length,
      active: campaigns.filter((c) => c.status === 'active').length,
      scheduled: campaigns.filter((c) => c.status === 'scheduled').length,
      completed: campaigns.filter((c) => c.status === 'completed').length,
      totalSent,
      avgOpenRate: Math.round(avgOpenRate * 10) / 10,
      avgClickRate: Math.round(avgClickRate * 10) / 10,
      avgConversionRate: Math.round(avgConversionRate * 10) / 10,
    };
  }, [campaigns]);

  // Actions
  const updateChannelFilter = useCallback((channel: Channel | 'all') => {
    setFilters((prev) => ({ ...prev, channel }));
  }, []);

  const updateStatusFilter = useCallback((status: Campaign['status'] | 'all') => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Campanhas por canal
  const campaignsByChannel = useMemo(() => {
    const grouped: Record<Channel, Campaign[]> = {
      email: [],
      sms: [],
      whatsapp: [],
      push: [],
      rcs: [],
    };
    
    campaigns.forEach((campaign) => {
      grouped[campaign.channel].push(campaign);
    });
    
    return grouped;
  }, [campaigns]);

  return {
    campaigns: filteredCampaigns,
    allCampaigns: campaigns,
    filters,
    stats,
    campaignsByChannel,
    updateChannelFilter,
    updateStatusFilter,
    resetFilters,
  };
}
