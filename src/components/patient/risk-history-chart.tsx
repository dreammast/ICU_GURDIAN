'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Area,
  ComposedChart,
} from 'recharts';
import type { RiskHistory } from '@/lib/types';

interface RiskHistoryChartProps {
  history: RiskHistory[];
}

export default function RiskHistoryChart({ history }: RiskHistoryChartProps) {
  const chartData = history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    score: h.score,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
          <Tooltip
             contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
            }}
          />
          <Legend />
          
          <ReferenceLine y={0.8} label={{ value: 'High Risk', position: 'insideTopRight', fill: 'hsl(var(--destructive))', fontSize: 12 }} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
          <ReferenceLine y={0.5} label={{ value: 'Moderate Risk', position: 'insideTopRight', fill: 'hsl(var(--primary-foreground))', fontSize: 12 }} stroke="hsl(var(--primary))" strokeDasharray="3 3" />

          <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="url(#colorScore)" />
          <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
