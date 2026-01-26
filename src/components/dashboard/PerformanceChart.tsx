import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  name: string;
  enviados: number;
  entregues: number;
  cliques: number;
}

interface PerformanceChartProps {
  data: ChartData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Performance de Envios
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Evolução mensal de campanhas
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEnviados" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEntregues" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCliques" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(220 20% 18%)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="hsl(220 10% 55%)"
              tick={{ fill: 'hsl(220 10% 55%)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(220 10% 55%)"
              tick={{ fill: 'hsl(220 10% 55%)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220 25% 11%)',
                border: '1px solid hsl(220 20% 18%)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px hsl(0 0% 0% / 0.3)',
              }}
              labelStyle={{ color: 'hsl(220 10% 95%)' }}
              itemStyle={{ color: 'hsl(220 10% 80%)' }}
              formatter={(value: number) => [value.toLocaleString('pt-BR'), '']}
            />
            <Area
              type="monotone"
              dataKey="enviados"
              stroke="hsl(199 89% 48%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEnviados)"
              name="Enviados"
            />
            <Area
              type="monotone"
              dataKey="entregues"
              stroke="hsl(262 83% 58%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEntregues)"
              name="Entregues"
            />
            <Area
              type="monotone"
              dataKey="cliques"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCliques)"
              name="Cliques"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Enviados</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Entregues</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Cliques</span>
        </div>
      </div>
    </div>
  );
}
