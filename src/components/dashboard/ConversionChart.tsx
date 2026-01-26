import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ConversionData {
  name: string;
  value: number;
  fill: string;
}

interface ConversionChartProps {
  data: ConversionData[];
}

export function ConversionChart({ data }: ConversionChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Conversões por Canal
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Distribuição de conversões
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220 25% 11%)',
                border: '1px solid hsl(220 20% 18%)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px hsl(0 0% 0% / 0.3)',
              }}
              labelStyle={{ color: 'hsl(220 10% 95%)' }}
              itemStyle={{ color: 'hsl(220 10% 80%)' }}
              formatter={(value: number) => [
                `${value.toLocaleString('pt-BR')} (${((value / total) * 100).toFixed(1)}%)`,
                'Conversões',
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-xs text-muted-foreground">{item.name}</span>
            <span className="text-xs font-medium text-card-foreground ml-auto">
              {item.value.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
