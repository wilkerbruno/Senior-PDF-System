import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  className?: string;
}

export function StatsCard({ 
  label, 
  value, 
  icon: Icon, 
  iconColor = 'text-primary',
  trend,
  className 
}: StatsCardProps) {
  return (
    <div className={cn('glass-card rounded-lg p-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className={cn(
              'text-xs mt-1',
              trend.type === 'positive' && 'text-success',
              trend.type === 'negative' && 'text-destructive',
              trend.type === 'neutral' && 'text-muted-foreground'
            )}>
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-2 rounded-lg bg-muted/50', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
