import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { ZonePerformanceCard } from '@/components/analytics/ZonePerformanceCard';
import { SalesHeatmap } from '@/components/analytics/SalesHeatmap';
import { AudienceScoring } from '@/components/analytics/AudienceScoring';
import { LeadFiltersPanel, LeadFilters } from '@/components/analytics/LeadFiltersPanel';
import { LookalikeGenerator } from '@/components/analytics/LookalikeGenerator';
import { ROIDashboard } from '@/components/analytics/ROIDashboard';
import { useLeadAnalytics } from '@/hooks/useLeadAnalytics';
import { useNeighborhoods } from '@/hooks/useNeighborhoods';
import { Loader2, BarChart3, MapPin, Target, Users, Flame, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AnalyticsRJ() {
  const { 
    leads, 
    loading, 
    zoneStats, 
    neighborhoodStats, 
    audienceScoreStats,
    recalculateAllScores,
  } = useLeadAnalytics();
  
  const { neighborhoods, zones, loading: loadingNeighborhoods } = useNeighborhoods();
  
  const [filters, setFilters] = useState<LeadFilters>({
    zone: null,
    neighborhood: null,
    businessType: null,
    audienceScore: null,
    purchasePotential: null,
  });
  const [isRecalculating, setIsRecalculating] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (filters.zone && lead.zone !== filters.zone) return false;
      if (filters.neighborhood && lead.neighborhood !== filters.neighborhood) return false;
      if (filters.businessType && lead.business_type !== filters.businessType) return false;
      if (filters.audienceScore && lead.audience_score !== filters.audienceScore) return false;
      if (filters.purchasePotential && lead.purchase_potential !== filters.purchasePotential) return false;
      return true;
    });
  }, [leads, filters]);

  const topZone = zoneStats.reduce((a, b) => 
    a.conversionRate > b.conversionRate ? a : b, 
    zoneStats[0]
  );

  const topNeighborhoods = neighborhoodStats
    .filter(n => n.heatLevel === 'hot' || n.heatLevel === 'super_hot')
    .map(n => n.neighborhood);

  const businessTypes = [...new Set(leads.map(l => l.business_type).filter(Boolean))] as string[];

  const hotLeadsCount = leads.filter(
    l => l.audience_score === 'hot' || l.audience_score === 'super_hot'
  ).length;

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    await recalculateAllScores();
    setIsRecalculating(false);
  };

  if (loading || loadingNeighborhoods) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Analytics RJ"
        description="Dashboard de performance local para Rio de Janeiro"
      />

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="roi" className="gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">ROI</span>
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="gap-2">
            <Flame className="h-4 w-4" />
            <span className="hidden sm:inline">Heatmap</span>
          </TabsTrigger>
          <TabsTrigger value="scoring" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Scoring</span>
          </TabsTrigger>
          <TabsTrigger value="audiences" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Públicos</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Performance por Zona - Rio de Janeiro</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {zoneStats.map((stats) => (
              <ZonePerformanceCard
                key={stats.zone}
                stats={stats}
                isTop={stats.zone === topZone?.zone}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesHeatmap data={neighborhoodStats} />
            <AudienceScoring 
              data={audienceScoreStats} 
              onRecalculate={handleRecalculate}
              isLoading={isRecalculating}
            />
          </div>
        </TabsContent>

        {/* ROI Tab */}
        <TabsContent value="roi" className="space-y-6">
          <ROIDashboard 
            data={zoneStats.map(z => ({
              zone: z.zone,
              totalLeads: z.totalLeads,
              conversions: z.conversions,
              costPerLead: Math.random() * 20 + 5,
              revenue: z.conversions * (Math.random() * 500 + 200),
              roi: Math.random() * 150 - 20,
              trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
            }))}
          />
        </TabsContent>

        {/* Heatmap Tab */}
        <TabsContent value="heatmap" className="space-y-6">
          <SalesHeatmap data={neighborhoodStats} />
          
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Ranking Completo por Bairro
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Posição</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Bairro</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Zona</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Leads</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Conversões</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Taxa</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {neighborhoodStats.map((item, index) => (
                    <tr key={item.neighborhood} className="border-b border-border/50">
                      <td className="py-3 px-4 text-sm font-medium">{index + 1}</td>
                      <td className="py-3 px-4 text-sm">{item.neighborhood}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{item.zone}</td>
                      <td className="py-3 px-4 text-sm text-right">{item.totalLeads}</td>
                      <td className="py-3 px-4 text-sm text-right">{item.conversions}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium">{item.conversionRate.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.heatLevel === 'super_hot' ? 'bg-red-500/20 text-red-400' :
                          item.heatLevel === 'hot' ? 'bg-orange-500/20 text-orange-400' :
                          item.heatLevel === 'warm' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {item.heatLevel === 'super_hot' ? 'Super Quente' :
                           item.heatLevel === 'hot' ? 'Quente' :
                           item.heatLevel === 'warm' ? 'Morno' : 'Frio'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Scoring Tab */}
        <TabsContent value="scoring" className="space-y-6">
          <AudienceScoring 
            data={audienceScoreStats} 
            onRecalculate={handleRecalculate}
            isLoading={isRecalculating}
          />
          
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Leads por Score
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {audienceScoreStats.map((stat) => (
                <div
                  key={stat.score}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: stat.color, backgroundColor: `${stat.color}15` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="font-medium">{stat.score}</span>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: stat.color }}>
                    {stat.count}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.percentage.toFixed(1)}% do total
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Audiences Tab */}
        <TabsContent value="audiences" className="space-y-6">
          <LeadFiltersPanel
            zones={zones}
            neighborhoods={neighborhoods}
            onFilterChange={setFilters}
            filteredCount={filteredLeads.length}
            totalCount={leads.length}
          />
          
          <LookalikeGenerator
            topNeighborhoods={topNeighborhoods}
            topBusinessTypes={businessTypes}
            hotLeadsCount={hotLeadsCount}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
