import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DbLead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: 'new' | 'engaged' | 'converted' | 'inactive';
  last_contact: string | null;
  created_at: string;
  updated_at: string;
  // RJ location fields
  neighborhood: string | null;
  city: string | null;
  zone: string | null;
  business_type: string | null;
  interests: string[] | null;
  purchase_potential: string | null;
  audience_score: string | null;
}

export interface LeadFilters {
  search: string;
  status: DbLead['status'] | 'all';
  source: string | 'all';
}

export interface LeadStats {
  total: number;
  new: number;
  engaged: number;
  converted: number;
  inactive: number;
}

const initialFilters: LeadFilters = {
  search: '',
  status: 'all',
  source: 'all',
};

export function useSupabaseLeads() {
  const [leads, setLeads] = useState<DbLead[]>([]);
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads((data as DbLead[]) || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar leads',
        description: 'Não foi possível carregar os leads.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          (lead.phone && lead.phone.includes(filters.search));
        if (!matchesSearch) return false;
      }

      if (filters.status !== 'all' && lead.status !== filters.status) {
        return false;
      }

      if (filters.source !== 'all' && lead.source !== filters.source) {
        return false;
      }

      return true;
    });
  }, [leads, filters]);

  const stats: LeadStats = useMemo(() => ({
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    engaged: leads.filter((l) => l.status === 'engaged').length,
    converted: leads.filter((l) => l.status === 'converted').length,
    inactive: leads.filter((l) => l.status === 'inactive').length,
  }), [leads]);

  const sources = useMemo(() => {
    const uniqueSources = [...new Set(leads.map((l) => l.source))];
    return uniqueSources.sort();
  }, [leads]);

  const createLead = useCallback(async (lead: Omit<DbLead, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase.from('leads').insert({
        ...lead,
        user_id: user.id,
      });

      if (error) throw error;

      toast({ title: 'Lead criado com sucesso!' });
      await fetchLeads();
      return { error: null };
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar lead',
      });
      return { error };
    }
  }, [user, toast, fetchLeads]);

  const updateLead = useCallback(async (id: string, updates: Partial<DbLead>) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Lead atualizado!' });
      await fetchLeads();
      return { error: null };
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar lead',
      });
      return { error };
    }
  }, [toast, fetchLeads]);

  const deleteLead = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);

      if (error) throw error;

      toast({ title: 'Lead removido!' });
      await fetchLeads();
      return { error: null };
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover lead',
      });
      return { error };
    }
  }, [toast, fetchLeads]);

  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateStatusFilter = useCallback((status: DbLead['status'] | 'all') => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateSourceFilter = useCallback((source: string | 'all') => {
    setFilters((prev) => ({ ...prev, source }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    leads: filteredLeads,
    allLeads: leads,
    filters,
    stats,
    sources,
    isLoading,
    createLead,
    updateLead,
    deleteLead,
    updateSearch,
    updateStatusFilter,
    updateSourceFilter,
    resetFilters,
    refetch: fetchLeads,
  };
}
