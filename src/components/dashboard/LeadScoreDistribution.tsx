import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Flame } from 'lucide-react';

interface ScoreData {
  score: string;
  count: number;
  color: string;
  label: string;
}

interface LeadScoreDistributionProps {
  data: ScoreData[];
}

const SCORE_LABELS: Record<string, string> = {
  cold: 'Frio',
  warm: 'Morno',
  hot: 'Quente',
  super_hot: 'Super Quente',
};

export function LeadScoreDistribution({ data }: LeadScoreDistributionProps) {
  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Flame className="h-5 w-5 text-warning" />
          Temperatura dos Leads
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Classificação por potencial de conversão
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-40 w-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={4}
                dataKey="count"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  `${value} leads (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
                  SCORE_LABELS[name] || name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div
              key={item.score}
              className="flex items-center justify-between p-2 rounded-lg bg-card/50"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-card-foreground">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{item.count}</span>
                <span className="text-sm font-bold text-card-foreground w-12 text-right">
                  {total > 0 ? ((item.count / total) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
