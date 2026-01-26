import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { DbLead } from './useSupabaseLeads';
import { DbCampaign } from './useSupabaseCampaigns';
import { ChannelStats, DashboardStats, Channel } from '@/types/crm';

export interface RealtimeDashboardData {
  stats: DashboardStats;
  channelStats: ChannelStats[];
  chartData: { name: string; enviados: number; entregues: number; cliques: number }[];
  conversionData: { name: string; value: number; fill: string }[];
  recentCampaigns: DbCampaign[];
  topChannel: ChannelStats | null;
  worstChannel: ChannelStats | null;
  isLoading: boolean;
}

const CHANNEL_COLORS: Record<Channel, string> = {
  whatsapp: 'hsl(142 76% 36%)',
  sms: 'hsl(142 69% 58%)',
  email: 'hsl(199 89% 48%)',
  push: 'hsl(38 92% 50%)',
  rcs: 'hsl(262 83% 58%)',
};

const CHANNEL_LABELS: Record<Channel, string> = {
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  email: 'Email',
  push: 'Push',
  rcs: 'RCS',
};

export function useRealtimeDashboard(): RealtimeDashboardData {
  const [leads, setLeads] = useState<DbLead[]>([]);
  const [campaigns, setCampaigns] = useState<DbCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [leadsRes, campaignsRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
      ]);

      if (leadsRes.data) setLeads(leadsRes.data as DbLead[]);
      if (campaignsRes.data) setCampaigns(campaignsRes.data as DbCampaign[]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const leadsChannel = supabase
      .channel('realtime-leads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLeads((prev) => [payload.new as DbLead, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setLeads((prev) =>
              prev.map((l) => (l.id === payload.new.id ? (payload.new as DbLead) : l))
            );
          } else if (payload.eventType === 'DELETE') {
            setLeads((prev) => prev.filter((l) => l.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const campaignsChannel = supabase
      .channel('realtime-campaigns')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'campaigns' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCampaigns((prev) => [payload.new as DbCampaign, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCampaigns((prev) =>
              prev.map((c) => (c.id === payload.new.id ? (payload.new as DbCampaign) : c))
            );
          } else if (payload.eventType === 'DELETE') {
            setCampaigns((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(campaignsChannel);
    };
  }, [user]);

  const stats: DashboardStats = useMemo(() => ({
    totalLeads: leads.length,
    activeLeads: leads.filter((l) => l.status === 'engaged' || l.status === 'new').length,
    campaignsSent: campaigns.reduce((sum, c) => sum + c.sent, 0),
    averageCTR: campaigns.length > 0
      ? Math.round(
          campaigns.reduce((sum, c) => sum + (c.sent > 0 ? (c.clicked / c.sent) * 100 : 0), 0) /
            campaigns.length
        )
      : 0,
    conversions: campaigns.reduce((sum, c) => sum + c.converted, 0),
    revenue: campaigns.reduce((sum, c) => sum + c.converted * 50, 0), // Estimated revenue per conversion
  }), [leads, campaigns]);

  const channelStats: ChannelStats[] = useMemo(() => {
    const channels: Channel[] = ['whatsapp', 'sms', 'email', 'push', 'rcs'];
    
    return channels.map((channel) => {
      const channelCampaigns = campaigns.filter((c) => c.channel === channel);
      const sent = channelCampaigns.reduce((sum, c) => sum + c.sent, 0);
      const delivered = channelCampaigns.reduce((sum, c) => sum + c.delivered, 0);
      const opened = channelCampaigns.reduce((sum, c) => sum + c.opened, 0);
      const clicked = channelCampaigns.reduce((sum, c) => sum + c.clicked, 0);
      const converted = channelCampaigns.reduce((sum, c) => sum + c.converted, 0);
      const ctr = sent > 0 ? Math.round((clicked / sent) * 100) : 0;

      return { channel, sent, delivered, opened, clicked, converted, ctr };
    });
  }, [campaigns]);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      return months[monthIndex];
    });

    return last6Months.map((name, index) => {
      const monthCampaigns = campaigns.filter((c) => {
        const date = new Date(c.created_at);
        const monthIndex = (currentMonth - 5 + index + 12) % 12;
        return date.getMonth() === monthIndex;
      });

      return {
        name,
        enviados: monthCampaigns.reduce((sum, c) => sum + c.sent, 0),
        entregues: monthCampaigns.reduce((sum, c) => sum + c.delivered, 0),
        cliques: monthCampaigns.reduce((sum, c) => sum + c.clicked, 0),
      };
    });
  }, [campaigns]);

  const conversionData = useMemo(() => {
    return channelStats
      .filter((cs) => cs.converted > 0)
      .map((cs) => ({
        name: CHANNEL_LABELS[cs.channel],
        value: cs.converted,
        fill: CHANNEL_COLORS[cs.channel],
      }));
  }, [channelStats]);

  const topChannel = useMemo(() => {
    if (channelStats.length === 0) return null;
    return channelStats.reduce((best, current) =>
      current.ctr > best.ctr ? current : best
    );
  }, [channelStats]);

  const worstChannel = useMemo(() => {
    if (channelStats.length === 0) return null;
    return channelStats.reduce((worst, current) =>
      current.ctr < worst.ctr ? current : worst
    );
  }, [channelStats]);

  const recentCampaigns = useMemo(() => campaigns.slice(0, 5), [campaigns]);

  return {
    stats,
    channelStats,
    chartData,
    conversionData,
    recentCampaigns,
    topChannel,
    worstChannel,
    isLoading,
  };
}
