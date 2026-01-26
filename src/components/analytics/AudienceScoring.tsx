import { Target, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AudienceScoreStats {
  score: string;
  count: number;
  percentage: number;
  color: string;
}

interface AudienceScoringProps {
  data: AudienceScoreStats[];
  onRecalculate?: () => void;
  isLoading?: boolean;
}

export function AudienceScoring({ data, onRecalculate, isLoading }: AudienceScoringProps) {
  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Audience Scoring
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Classificação de leads por temperatura
          </p>
        </div>
        
        {onRecalculate && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRecalculate}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Recalcular
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
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
                  backgroundColor: 'hsl(220 25% 11%)',
                  border: '1px solid hsl(220 20% 18%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  `${value} leads (${((value / total) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div
              key={item.score}
              className="flex items-center justify-between p-3 rounded-lg bg-card/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-card-foreground">{item.score}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">{item.count} leads</span>
                <span className="font-bold text-card-foreground w-16 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
        <h4 className="font-medium text-card-foreground mb-2">Como funciona o scoring:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong className="text-red-400">Super Quente:</strong> Alta probabilidade de conversão (70+ pontos)</li>
          <li>• <strong className="text-orange-400">Quente:</strong> Boa probabilidade de conversão (50-69 pontos)</li>
          <li>• <strong className="text-yellow-400">Morno:</strong> Precisa de nurturing (30-49 pontos)</li>
          <li>• <strong className="text-blue-400">Frio:</strong> Início do funil (&lt;30 pontos)</li>
        </ul>
      </div>
    </div>
  );
}
