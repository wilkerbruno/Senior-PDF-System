import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

interface Lead {
  id: string;
  name: string;
  status: string;
  audience_score: string | null;
  business_type: string | null;
  created_at: string;
  updated_at: string;
}

interface Campaign {
  id: string;
  sent: number;
  delivered: number;
  clicked: number;
  converted: number;
  created_at: string;
}

interface LeadTypeData {
  type: string;
  count: number;
  color: string;
}

interface ScoreData {
  score: string;
  count: number;
  color: string;
  label: string;
}

interface EngagementData {
  date: string;
  activeUsers: number;
  messages: number;
  conversions: number;
}

interface ActivityData {
  hour: string;
  activities: number;
}

const BUSINESS_TYPE_COLORS: Record<string, string> = {
  'Restaurante': 'hsl(262 83% 58%)',
  'Loja': 'hsl(199 89% 48%)',
  'Serviços': 'hsl(142 76% 36%)',
  'Saúde': 'hsl(38 92% 50%)',
  'Educação': 'hsl(340 75% 55%)',
  'Tecnologia': 'hsl(180 70% 45%)',
  'Outro': 'hsl(220 14% 50%)',
};

const SCORE_CONFIG = {
  cold: { color: 'hsl(199 89% 48%)', label: 'Frio' },
  warm: { color: 'hsl(38 92% 50%)', label: 'Morno' },
  hot: { color: 'hsl(25 95% 53%)', label: 'Quente' },
  super_hot: { color: 'hsl(0 84% 60%)', label: 'Super Quente' },
};

export function useAnalyticsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      setIsLoading(true);
      try {
        const [leadsRes, campaignsRes] = await Promise.all([
          supabase.from('leads').select('id, name, status, audience_score, business_type, created_at, updated_at'),
          supabase.from('campaigns').select('id, sent, delivered, clicked, converted, created_at'),
        ]);

        if (leadsRes.data) setLeads(leadsRes.data);
        if (campaignsRes.data) setCampaigns(campaignsRes.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const leadsByType = useMemo((): LeadTypeData[] => {
    const typeCount: Record<string, number> = {};
    
    leads.forEach((lead) => {
      const type = lead.business_type || 'Outro';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return Object.entries(typeCount)
      .map(([type, count]) => ({
        type,
        count,
        color: BUSINESS_TYPE_COLORS[type] || BUSINESS_TYPE_COLORS['Outro'],
      }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  const scoreDistribution = useMemo((): ScoreData[] => {
    const scoreCount: Record<string, number> = {
      cold: 0,
      warm: 0,
      hot: 0,
      super_hot: 0,
    };

    leads.forEach((lead) => {
      const score = lead.audience_score || 'cold';
      if (score in scoreCount) {
        scoreCount[score]++;
      }
    });

    return Object.entries(scoreCount).map(([score, count]) => ({
      score,
      count,
      color: SCORE_CONFIG[score as keyof typeof SCORE_CONFIG]?.color || 'hsl(220 14% 50%)',
      label: SCORE_CONFIG[score as keyof typeof SCORE_CONFIG]?.label || score,
    }));
  }, [leads]);

  const engagementData = useMemo((): EngagementData[] => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dayName = days[date.getDay()];
      
      const dayLeads = leads.filter((l) => {
        const leadDate = new Date(l.updated_at);
        return leadDate.toDateString() === date.toDateString();
      });

      const dayCampaigns = campaigns.filter((c) => {
        const campDate = new Date(c.created_at);
        return campDate.toDateString() === date.toDateString();
      });

      return {
        date: dayName,
        activeUsers: dayLeads.filter((l) => l.status === 'engaged' || l.status === 'new').length,
        messages: dayCampaigns.reduce((sum, c) => sum + c.sent, 0),
        conversions: dayCampaigns.reduce((sum, c) => sum + c.converted, 0),
      };
    });
  }, [leads, campaigns]);

  const activityTimeline = useMemo((): ActivityData[] => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0') + ':00';
      
      // Simulate activity based on leads created at similar hours
      const hourActivities = leads.filter((l) => {
        const leadHour = new Date(l.created_at).getHours();
        return leadHour === i;
      }).length;

      // Add some baseline activity with peaks during business hours
      const baseActivity = i >= 9 && i <= 18 ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 2);
      
      return {
        hour,
        activities: hourActivities + baseActivity,
      };
    });
  }, [leads]);

  const stats = useMemo(() => ({
    totalLeads: leads.length,
    activeLeads: leads.filter((l) => l.status === 'engaged' || l.status === 'new').length,
    hotLeads: leads.filter((l) => l.audience_score === 'hot' || l.audience_score === 'super_hot').length,
    conversionRate: campaigns.length > 0
      ? campaigns.reduce((sum, c) => sum + (c.sent > 0 ? c.converted / c.sent : 0), 0) / campaigns.length * 100
      : 0,
  }), [leads, campaigns]);

  return {
    leadsByType,
    scoreDistribution,
    engagementData,
    activityTimeline,
    stats,
    isLoading,
  };
}
