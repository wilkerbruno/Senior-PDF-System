import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Users } from 'lucide-react';

interface LeadTypeData {
  type: string;
  count: number;
  color: string;
}

interface LeadsByTypeChartProps {
  data: LeadTypeData[];
}

export function LeadsByTypeChart({ data }: LeadsByTypeChartProps) {
  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Leads por Tipo
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Distribuição por categoria de negócio
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="type" 
              width={100}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [
                `${value.toLocaleString('pt-BR')} leads (${((value / total) * 100).toFixed(1)}%)`,
                'Quantidade',
              ]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.slice(0, 6).map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground truncate">{item.type}</span>
            <span className="text-xs font-medium text-card-foreground ml-auto">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
