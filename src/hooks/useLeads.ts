import { useState, useMemo, useCallback } from 'react';
import { Lead } from '@/types/crm';
import { mockLeads } from '@/data/mockData';

export interface LeadFilters {
  search: string;
  status: Lead['status'] | 'all';
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

export function useLeads() {
  const [leads] = useState<Lead[]>(mockLeads);
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);

  // Filtrar leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Filtro de busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.phone.includes(filters.search);
        
        if (!matchesSearch) return false;
      }

      // Filtro de status
      if (filters.status !== 'all' && lead.status !== filters.status) {
        return false;
      }

      // Filtro de fonte
      if (filters.source !== 'all' && lead.source !== filters.source) {
        return false;
      }

      return true;
    });
  }, [leads, filters]);

  // Estatísticas
  const stats: LeadStats = useMemo(() => ({
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    engaged: leads.filter((l) => l.status === 'engaged').length,
    converted: leads.filter((l) => l.status === 'converted').length,
    inactive: leads.filter((l) => l.status === 'inactive').length,
  }), [leads]);

  // Fontes únicas para filtro
  const sources = useMemo(() => {
    const uniqueSources = [...new Set(leads.map((l) => l.source))];
    return uniqueSources.sort();
  }, [leads]);

  // Actions
  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateStatusFilter = useCallback((status: Lead['status'] | 'all') => {
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
    updateSearch,
    updateStatusFilter,
    updateSourceFilter,
    resetFilters,
  };
}
