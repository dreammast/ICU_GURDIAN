'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Vital } from '@/lib/types';

interface VitalsTimelineChartProps {
  vitals: Vital[];
}

export default function VitalsTimelineChart({ vitals }: VitalsTimelineChartProps) {
  const chartData = vitals.map(v => ({
    time: new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    'Heart Rate (BPM)': v.hr,
    'SpO2 (%)': v.spo2,
    'Resp. Rate (BPM)': v.rr,
    'BP (Sys/Dia)': `${v.bp.systolic}/${v.bp.diastolic}`,
  }));

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12, fill: 'hsl(var(--chart-1))' }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: 'hsl(var(--chart-2))' }} />
          <Tooltip 
             contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
            }}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="Heart Rate (BPM)" stroke="hsl(var(--chart-1))" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="SpO2 (%)" stroke="hsl(var(--chart-2))" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="Resp. Rate (BPM)" stroke="hsl(var(--chart-4))" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
