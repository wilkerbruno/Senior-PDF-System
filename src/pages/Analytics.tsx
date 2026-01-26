import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { StatsCard } from '@/components/common/StatsCard';
import { LeadsByTypeChart } from '@/components/dashboard/LeadsByTypeChart';
import { LeadScoreDistribution } from '@/components/dashboard/LeadScoreDistribution';
import { EngagementChart } from '@/components/dashboard/EngagementChart';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { ConversionChart } from '@/components/dashboard/ConversionChart';
import { useAnalyticsDashboard } from '@/hooks/useAnalyticsDashboard';
import { useRealtimeDashboard } from '@/hooks/useRealtimeDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Target, Flame, TrendingUp, BarChart3, Activity, Clock } from 'lucide-react';
import { formatPercent } from '@/utils/formatters';

const Analytics = () => {
  const { 
    leadsByType, 
    scoreDistribution, 
    engagementData, 
    activityTimeline,
    stats,
    isLoading: analyticsLoading 
  } = useAnalyticsDashboard();
  
  const { chartData, conversionData, isLoading: dashboardLoading } = useRealtimeDashboard();

  const isLoading = analyticsLoading || dashboardLoading;

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
        title="Analytics"
        description="Métricas detalhadas e insights sobre seus leads e campanhas"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Total de Leads"
          value={stats.totalLeads}
          icon={Users}
          iconColor="text-primary"
        />
        <StatsCard
          label="Leads Ativos"
          value={stats.activeLeads}
          icon={Target}
          iconColor="text-success"
        />
        <StatsCard
          label="Leads Quentes"
          value={stats.hotLeads}
          icon={Flame}
          iconColor="text-warning"
        />
        <StatsCard
          label="Taxa de Conversão"
          value={formatPercent(stats.conversionRate, 1)}
          icon={TrendingUp}
          iconColor="text-accent"
        />
      </div>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="leads" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Por Tipo de Lead</span>
            <span className="sm:hidden">Leads</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Engajamento</span>
            <span className="sm:hidden">Engajamento</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
            <span className="sm:hidden">Performance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeadsByTypeChart data={leadsByType} />
            <LeadScoreDistribution data={scoreDistribution} />
          </div>

          {/* Lead Type Details Table */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Detalhamento por Tipo de Negócio
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Leads</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">% do Total</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsByType.map((item) => (
                    <tr key={item.type} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-card-foreground">{item.type}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-sm font-medium text-card-foreground">
                        {item.count}
                      </td>
                      <td className="text-right py-3 px-4 text-sm text-muted-foreground">
                        {stats.totalLeads > 0 ? ((item.count / stats.totalLeads) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EngagementChart data={engagementData} />
            </div>
            <div>
              <ActivityTimeline data={activityTimeline} />
            </div>
          </div>

          {/* Engagement Summary */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Resumo de Engajamento (Últimos 7 dias)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">Total de Usuários Ativos</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {engagementData.reduce((sum, d) => sum + d.activeUsers, 0)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {engagementData.reduce((sum, d) => sum + d.messages, 0).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-muted-foreground">Conversões</p>
                <p className="text-2xl font-bold text-warning mt-1">
                  {engagementData.reduce((sum, d) => sum + d.conversions, 0)}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceChart data={chartData} />
            </div>
            <div>
              <ConversionChart data={conversionData} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Analytics;
