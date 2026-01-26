import { ChannelStats } from '@/types/crm';
import { ChannelIcon } from '@/components/common';
import { getChannelConfig } from '@/constants/channels';
import { formatNumber, formatPercent } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ChannelCardProps {
  stats: ChannelStats;
  delay?: number;
}

export function ChannelCard({ stats, delay = 0 }: ChannelCardProps) {
  const config = getChannelConfig(stats.channel);
  const deliveryRate = stats.sent > 0 ? Math.round((stats.delivered / stats.sent) * 100) : 0;

  return (
    <article
      className="glass-card rounded-xl p-4 opacity-0 animate-fade-in hover:border-primary/30 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <ChannelIcon channel={stats.channel} />
        <div>
          <h3 className="font-semibold text-card-foreground">{config.label}</h3>
          <p className="text-xs text-muted-foreground">
            {formatPercent(stats.ctr, 0)} entrega
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Enviados</span>
          <span className="text-sm font-medium text-card-foreground">
            {formatNumber(stats.sent)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Entregues</span>
          <span className="text-sm font-medium text-card-foreground">
            {formatNumber(stats.delivered)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Cliques</span>
          <span className="text-sm font-medium text-primary">
            {formatNumber(stats.clicked)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Conversões</span>
          <span className="text-sm font-medium text-success">
            {formatNumber(stats.converted)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Taxa de entrega</span>
          <span className={cn('font-medium', deliveryRate >= 90 ? 'text-success' : 'text-warning')}>
            {deliveryRate}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${deliveryRate}%` }}
          />
        </div>
      </div>
    </article>
  );
}
