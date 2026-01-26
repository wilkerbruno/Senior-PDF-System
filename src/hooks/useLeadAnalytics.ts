import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LeadWithLocation {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: string;
  neighborhood: string | null;
  city: string | null;
  zone: string | null;
  business_type: string | null;
  interests: string[] | null;
  purchase_potential: string | null;
  audience_score: string | null;
  created_at: string;
}

interface ZoneStats {
  zone: string;
  totalLeads: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

interface NeighborhoodStats {
  neighborhood: string;
  zone: string;
  totalLeads: number;
  conversions: number;
  conversionRate: number;
  heatLevel: 'cold' | 'warm' | 'hot' | 'super_hot';
}

interface AudienceScoreStats {
  score: string;
  count: number;
  percentage: number;
  color: string;
}

export function useLeadAnalytics() {
  const [leads, setLeads] = useState<LeadWithLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
      } else {
        setLeads((data as LeadWithLocation[]) || []);
      }
      setLoading(false);
    }

    fetchLeads();
  }, []);

  const zoneStats = useMemo((): ZoneStats[] => {
    const zones = ['Zona Sul', 'Zona Norte', 'Zona Oeste', 'Centro'];
    
    return zones.map(zone => {
      const zoneLeads = leads.filter(l => l.zone === zone);
      const conversions = zoneLeads.filter(l => l.status === 'converted').length;
      
      return {
        zone,
        totalLeads: zoneLeads.length,
        conversions,
        conversionRate: zoneLeads.length > 0 ? (conversions / zoneLeads.length) * 100 : 0,
        revenue: conversions * 2500, // Estimated revenue per conversion
      };
    });
  }, [leads]);

  const neighborhoodStats = useMemo((): NeighborhoodStats[] => {
    const neighborhoodMap = new Map<string, { zone: string; leads: LeadWithLocation[] }>();
    
    leads.forEach(lead => {
      if (lead.neighborhood) {
        const existing = neighborhoodMap.get(lead.neighborhood);
        if (existing) {
          existing.leads.push(lead);
        } else {
          neighborhoodMap.set(lead.neighborhood, {
            zone: lead.zone || 'Desconhecido',
            leads: [lead],
          });
        }
      }
    });

    return Array.from(neighborhoodMap.entries()).map(([neighborhood, data]) => {
      const conversions = data.leads.filter(l => l.status === 'converted').length;
      const conversionRate = data.leads.length > 0 ? (conversions / data.leads.length) * 100 : 0;
      
      let heatLevel: 'cold' | 'warm' | 'hot' | 'super_hot' = 'cold';
      if (conversionRate >= 30) heatLevel = 'super_hot';
      else if (conversionRate >= 20) heatLevel = 'hot';
      else if (conversionRate >= 10) heatLevel = 'warm';
      
      return {
        neighborhood,
        zone: data.zone,
        totalLeads: data.leads.length,
        conversions,
        conversionRate,
        heatLevel,
      };
    }).sort((a, b) => b.conversionRate - a.conversionRate);
  }, [leads]);

  const audienceScoreStats = useMemo((): AudienceScoreStats[] => {
    const scores = [
      { score: 'super_hot', label: 'Super Quente', color: '#ef4444' },
      { score: 'hot', label: 'Quente', color: '#f97316' },
      { score: 'warm', label: 'Morno', color: '#eab308' },
      { score: 'cold', label: 'Frio', color: '#3b82f6' },
    ];

    const total = leads.length || 1;

    return scores.map(({ score, label, color }) => {
      const count = leads.filter(l => l.audience_score === score).length;
      return {
        score: label,
        count,
        percentage: (count / total) * 100,
        color,
      };
    });
  }, [leads]);

  const calculateAudienceScore = (lead: LeadWithLocation): string => {
    let score = 0;
    
    // Status-based scoring
    if (lead.status === 'converted') score += 40;
    else if (lead.status === 'qualified') score += 30;
    else if (lead.status === 'contacted') score += 20;
    else if (lead.status === 'new') score += 10;
    
    // Purchase potential
    if (lead.purchase_potential === 'high') score += 30;
    else if (lead.purchase_potential === 'medium') score += 15;
    
    // Has phone (more engaged)
    if (lead.phone) score += 10;
    
    // Has interests
    if (lead.interests && lead.interests.length > 0) score += 10;
    
    // Zone bonus (Zona Sul tends to have higher conversion)
    if (lead.zone === 'Zona Sul') score += 10;
    else if (lead.zone === 'Barra da Tijuca' || lead.zone === 'Zona Oeste') score += 5;
    
    if (score >= 70) return 'super_hot';
    if (score >= 50) return 'hot';
    if (score >= 30) return 'warm';
    return 'cold';
  };

  const updateLeadScore = async (leadId: string, score: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ audience_score: score })
      .eq('id', leadId);

    if (error) {
      console.error('Error updating lead score:', error);
      return false;
    }

    setLeads(prev => prev.map(l => 
      l.id === leadId ? { ...l, audience_score: score } : l
    ));
    return true;
  };

  const recalculateAllScores = async () => {
    const updates = leads.map(lead => ({
      id: lead.id,
      audience_score: calculateAudienceScore(lead),
    }));

    for (const update of updates) {
      await supabase
        .from('leads')
        .update({ audience_score: update.audience_score })
        .eq('id', update.id);
    }

    setLeads(prev => prev.map(lead => ({
      ...lead,
      audience_score: calculateAudienceScore(lead),
    })));
  };

  return {
    leads,
    loading,
    zoneStats,
    neighborhoodStats,
    audienceScoreStats,
    updateLeadScore,
    recalculateAllScores,
    calculateAudienceScore,
  };
}
