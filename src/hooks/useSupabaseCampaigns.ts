import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Channel } from '@/types/crm';

export interface DbCampaign {
  id: string;
  user_id: string;
  name: string;
  channel: Channel;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignFilters {
  search: string;
  channel: Channel | 'all';
  status: DbCampaign['status'] | 'all';
}

export interface CampaignStats {
  total: number;
  active: number;
  completed: number;
  draft: number;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalConverted: number;
}

const initialFilters: CampaignFilters = {
  search: '',
  channel: 'all',
  status: 'all',
};

export function useSupabaseCampaigns() {
  const [campaigns, setCampaigns] = useState<DbCampaign[]>([]);
  const [filters, setFilters] = useState<CampaignFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();
  const { toast } = useToast();

  const fetchCampaigns = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns((data as DbCampaign[]) || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar campanhas',
        description: 'Não foi possível carregar as campanhas.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!campaign.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.channel !== 'all' && campaign.channel !== filters.channel) {
        return false;
      }

      if (filters.status !== 'all' && campaign.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [campaigns, filters]);

  const stats: CampaignStats = useMemo(() => ({
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === 'active').length,
    completed: campaigns.filter((c) => c.status === 'completed').length,
    draft: campaigns.filter((c) => c.status === 'draft').length,
    totalSent: campaigns.reduce((sum, c) => sum + c.sent, 0),
    totalDelivered: campaigns.reduce((sum, c) => sum + c.delivered, 0),
    totalOpened: campaigns.reduce((sum, c) => sum + c.opened, 0),
    totalConverted: campaigns.reduce((sum, c) => sum + c.converted, 0),
  }), [campaigns]);

  const createCampaign = useCallback(async (campaign: Omit<DbCampaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase.from('campaigns').insert({
        ...campaign,
        user_id: user.id,
      });

      if (error) throw error;

      toast({ title: 'Campanha criada com sucesso!' });
      await fetchCampaigns();
      return { error: null };
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar campanha',
      });
      return { error };
    }
  }, [user, toast, fetchCampaigns]);

  const updateCampaign = useCallback(async (id: string, updates: Partial<DbCampaign>) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Campanha atualizada!' });
      await fetchCampaigns();
      return { error: null };
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar campanha',
      });
      return { error };
    }
  }, [toast, fetchCampaigns]);

  const deleteCampaign = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);

      if (error) throw error;

      toast({ title: 'Campanha removida!' });
      await fetchCampaigns();
      return { error: null };
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover campanha',
      });
      return { error };
    }
  }, [toast, fetchCampaigns]);

  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateChannelFilter = useCallback((channel: Channel | 'all') => {
    setFilters((prev) => ({ ...prev, channel }));
  }, []);

  const updateStatusFilter = useCallback((status: DbCampaign['status'] | 'all') => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    campaigns: filteredCampaigns,
    allCampaigns: campaigns,
    filters,
    stats,
    isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    updateSearch,
    updateChannelFilter,
    updateStatusFilter,
    resetFilters,
    refetch: fetchCampaigns,
  };
}
