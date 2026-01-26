import { Flame } from 'lucide-react';

interface NeighborhoodStats {
  neighborhood: string;
  zone: string;
  totalLeads: number;
  conversions: number;
  conversionRate: number;
  heatLevel: 'cold' | 'warm' | 'hot' | 'super_hot';
}

interface SalesHeatmapProps {
  data: NeighborhoodStats[];
}

const heatColors = {
  cold: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  warm: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  hot: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  super_hot: 'bg-red-500/20 border-red-500/40 text-red-400',
};

const heatLabels = {
  cold: 'Frio',
  warm: 'Morno',
  hot: 'Quente',
  super_hot: 'Super Quente',
};

export function SalesHeatmap({ data }: SalesHeatmapProps) {
  const topNeighborhoods = data.slice(0, 12);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Mapa de Calor de Vendas
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Performance por bairro no RJ
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {Object.entries(heatLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${heatColors[key as keyof typeof heatColors].split(' ')[0]}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {topNeighborhoods.map((item) => (
          <div
            key={item.neighborhood}
            className={`p-4 rounded-lg border ${heatColors[item.heatLevel]} transition-all hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm truncate">{item.neighborhood}</span>
              <Flame className={`h-4 w-4 ${item.heatLevel === 'super_hot' ? 'animate-pulse' : ''}`} />
            </div>
            <div className="text-xs opacity-80">{item.zone}</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs">{item.totalLeads} leads</span>
              <span className="font-bold">{item.conversionRate.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Flame className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum dado de bairro disponível</p>
          <p className="text-sm">Adicione leads com localização para ver o heatmap</p>
        </div>
      )}
    </div>
  );
}
