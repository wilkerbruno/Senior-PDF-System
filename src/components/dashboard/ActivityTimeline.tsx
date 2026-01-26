import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Clock } from 'lucide-react';

interface ActivityData {
  hour: string;
  activities: number;
}

interface ActivityTimelineProps {
  data: ActivityData[];
}

export function ActivityTimeline({ data }: ActivityTimelineProps) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Atividades por Hora
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Distribuição de atividades nas últimas 24h
        </p>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value} atividades`, 'Atividades']}
            />
            <Area
              type="monotone"
              dataKey="activities"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              fill="url(#activityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
