import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ZoneROI {
  zone: string;
  totalLeads: number;
  conversions: number;
  costPerLead: number;
  revenue: number;
  roi: number;
  trend: 'up' | 'down' | 'stable';
}

interface ROIDashboardProps {
  data: ZoneROI[];
}

const ZONE_COLORS: Record<string, string> = {
  'Zona Sul': '#10b981',
  'Zona Norte': '#3b82f6',
  'Zona Oeste': '#f59e0b',
  'Centro': '#8b5cf6',
};

export function ROIDashboard({ data }: ROIDashboardProps) {
  const totals = useMemo(() => {
    return data.reduce((acc, zone) => ({
      totalLeads: acc.totalLeads + zone.totalLeads,
      conversions: acc.conversions + zone.conversions,
      revenue: acc.revenue + zone.revenue,
      cost: acc.cost + (zone.costPerLead * zone.totalLeads),
    }), { totalLeads: 0, conversions: 0, revenue: 0, cost: 0 });
  }, [data]);

  const avgROI = totals.cost > 0 ? ((totals.revenue - totals.cost) / totals.cost) * 100 : 0;
  const avgCPL = totals.totalLeads > 0 ? totals.cost / totals.totalLeads : 0;
  const conversionRate = totals.totalLeads > 0 ? (totals.conversions / totals.totalLeads) * 100 : 0;

  const chartData = data.map(zone => ({
    name: zone.zone.replace('Zona ', ''),
    roi: zone.roi,
    revenue: zone.revenue,
    cost: zone.costPerLead * zone.totalLeads,
    color: ZONE_COLORS[zone.zone] || '#6b7280',
  }));

  const bestZone = data.reduce((a, b) => a.roi > b.roi ? a : b, data[0]);
  const worstZone = data.reduce((a, b) => a.roi < b.roi ? a : b, data[0]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totals.revenue.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Custo por Lead</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {avgCPL.toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-foreground">
                  {conversionRate.toFixed(1)}%
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI Médio</p>
                <p className={`text-2xl font-bold ${avgROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {avgROI >= 0 ? '+' : ''}{avgROI.toFixed(1)}%
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full ${avgROI >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                {avgROI >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI by Zone Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            ROI por Zona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === 'roi' ? `${value.toFixed(1)}%` : `R$ ${value.toLocaleString('pt-BR')}`,
                    name === 'roi' ? 'ROI' : name === 'revenue' ? 'Receita' : 'Custo'
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="roi" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Zone Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Melhor Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bestZone && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{bestZone.zone}</span>
                  <Badge className="bg-green-500/20 text-green-400">
                    +{bestZone.roi.toFixed(1)}% ROI
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Leads</p>
                    <p className="font-medium">{bestZone.totalLeads}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversões</p>
                    <p className="font-medium">{bestZone.conversions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Custo/Lead</p>
                    <p className="font-medium">R$ {bestZone.costPerLead.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Receita</p>
                    <p className="font-medium">R$ {bestZone.revenue.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <Progress value={bestZone.roi} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Precisa de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            {worstZone && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{worstZone.zone}</span>
                  <Badge className="bg-red-500/20 text-red-400">
                    {worstZone.roi >= 0 ? '+' : ''}{worstZone.roi.toFixed(1)}% ROI
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Leads</p>
                    <p className="font-medium">{worstZone.totalLeads}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversões</p>
                    <p className="font-medium">{worstZone.conversions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Custo/Lead</p>
                    <p className="font-medium">R$ {worstZone.costPerLead.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Receita</p>
                    <p className="font-medium">R$ {worstZone.revenue.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <Progress value={Math.max(0, worstZone.roi)} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Zone Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Detalhamento por Zona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Zona</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Leads</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Conversões</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">CPL</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Receita</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">ROI</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Tendência</th>
                </tr>
              </thead>
              <tbody>
                {data.map((zone) => (
                  <tr key={zone.zone} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: ZONE_COLORS[zone.zone] || '#6b7280' }}
                        />
                        <span className="font-medium">{zone.zone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">{zone.totalLeads}</td>
                    <td className="py-3 px-4 text-right">{zone.conversions}</td>
                    <td className="py-3 px-4 text-right">R$ {zone.costPerLead.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">R$ {zone.revenue.toLocaleString('pt-BR')}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={zone.roi >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {zone.roi >= 0 ? '+' : ''}{zone.roi.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {zone.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-400 inline" />}
                      {zone.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400 inline" />}
                      {zone.trend === 'stable' && <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
