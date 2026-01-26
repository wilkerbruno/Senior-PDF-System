import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatters';

interface ZoneStats {
  zone: string;
  totalLeads: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

interface ZonePerformanceCardProps {
  stats: ZoneStats;
  isTop?: boolean;
}

const zoneColors: Record<string, string> = {
  'Zona Sul': 'from-emerald-500 to-teal-600',
  'Zona Norte': 'from-blue-500 to-indigo-600',
  'Zona Oeste': 'from-purple-500 to-pink-600',
  'Centro': 'from-orange-500 to-red-600',
};

export function ZonePerformanceCard({ stats, isTop }: ZonePerformanceCardProps) {
  const gradientClass = zoneColors[stats.zone] || 'from-gray-500 to-gray-600';
  
  return (
    <div className="glass-card rounded-xl p-5 relative overflow-hidden">
      {isTop && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full">
            Top Performance
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${gradientClass}`}>
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground">{stats.zone}</h3>
          <p className="text-sm text-muted-foreground">Rio de Janeiro</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Leads</p>
          <p className="text-xl font-bold text-card-foreground">
            {stats.totalLeads.toLocaleString('pt-BR')}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Conversões</p>
          <p className="text-xl font-bold text-card-foreground">
            {stats.conversions.toLocaleString('pt-BR')}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Taxa Conversão</p>
          <div className="flex items-center gap-1">
            <p className="text-xl font-bold text-card-foreground">
              {formatPercent(stats.conversionRate)}
            </p>
            {stats.conversionRate >= 15 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Receita</p>
          <p className="text-xl font-bold text-card-foreground">
            {formatCurrency(stats.revenue)}
          </p>
        </div>
      </div>
    </div>
  );
}
