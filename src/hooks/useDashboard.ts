import { useMemo } from 'react';
import {
  mockDashboardStats,
  mockChannelStats,
  mockChartData,
  mockConversionData,
  mockCampaigns,
} from '@/data/mockData';
import { ChannelStats, DashboardStats } from '@/types/crm';

export interface DashboardData {
  stats: DashboardStats;
  channelStats: ChannelStats[];
  chartData: typeof mockChartData;
  conversionData: typeof mockConversionData;
  recentCampaigns: typeof mockCampaigns;
  topChannel: ChannelStats | null;
  worstChannel: ChannelStats | null;
}

export function useDashboard(): DashboardData {
  const stats = mockDashboardStats;
  const channelStats = mockChannelStats;
  const chartData = mockChartData;
  const conversionData = mockConversionData;
  const recentCampaigns = mockCampaigns;

  // Canal com melhor performance (maior CTR)
  const topChannel = useMemo(() => {
    if (channelStats.length === 0) return null;
    return channelStats.reduce((best, current) =>
      current.ctr > best.ctr ? current : best
    );
  }, [channelStats]);

  // Canal com pior performance (menor CTR)
  const worstChannel = useMemo(() => {
    if (channelStats.length === 0) return null;
    return channelStats.reduce((worst, current) =>
      current.ctr < worst.ctr ? current : worst
    );
  }, [channelStats]);

  return {
    stats,
    channelStats,
    chartData,
    conversionData,
    recentCampaigns,
    topChannel,
    worstChannel,
  };
}
