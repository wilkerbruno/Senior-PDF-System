import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChannelCard } from '@/components/dashboard/ChannelCard';
import { CampaignTable } from '@/components/dashboard/CampaignTable';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { ConversionChart } from '@/components/dashboard/ConversionChart';
import { PageHeader } from '@/components/common';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { useRealtimeDashboard } from '@/hooks/useRealtimeDashboard';
import { formatNumber, formatCurrency, formatPercent } from '@/utils/formatters';
import { Users, Send, MousePointerClick, TrendingUp, DollarSign, Target, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { stats, channelStats, chartData, conversionData, recentCampaigns, isLoading } = useRealtimeDashboard();

  const statCards = [
    {
      title: 'Total de Leads',
      value: formatNumber(stats.totalLeads),
      change: '+12.5% vs último mês',
      changeType: 'positive' as const,
      icon: Users,
      iconColor: 'text-primary',
    },
    {
      title: 'Leads Ativos',
      value: formatNumber(stats.activeLeads),
      change: '71.8% do total',
      changeType: 'neutral' as const,
      icon: Target,
      iconColor: 'text-success',
    },
    {
      title: 'Mensagens Enviadas',
      value: formatNumber(stats.campaignsSent),
      change: '+28.3% vs último mês',
      changeType: 'positive' as const,
      icon: Send,
      iconColor: 'text-accent',
    },
    {
      title: 'CTR Médio',
      value: formatPercent(stats.averageCTR, 0),
      change: '+5.2% vs último mês',
      changeType: 'positive' as const,
      icon: MousePointerClick,
      iconColor: 'text-warning',
    },
    {
      title: 'Conversões',
      value: formatNumber(stats.conversions),
      change: '+18.7% vs último mês',
      changeType: 'positive' as const,
      icon: TrendingUp,
      iconColor: 'text-success',
    },
    {
      title: 'Receita Gerada',
      value: formatCurrency(stats.revenue, true),
      change: '+22.1% vs último mês',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconColor: 'text-primary',
    },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <PageSkeleton variant="dashboard" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        description="Visão geral do seu CRM Marketing"
        actions={
          <Badge variant="secondary" className="gap-2">
            <Wifi className="h-3 w-3 text-success animate-pulse" />
            Tempo Real
          </Badge>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            iconColor={stat.iconColor}
            delay={index * 50}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <PerformanceChart data={chartData} />
        </div>
        <div>
          <ConversionChart data={conversionData} />
        </div>
      </div>

      {/* Channels Grid */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Performance por Canal
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {channelStats.map((channel, index) => (
            <ChannelCard key={channel.channel} stats={channel} delay={index * 50} />
          ))}
        </div>
      </section>

      {/* Campaigns Table */}
      <CampaignTable campaigns={recentCampaigns} />
    </MainLayout>
  );
};

export default Index;
