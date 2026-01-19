import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Vital } from '@/lib/types';

interface VitalsMiniChartProps {
  vitals: Vital[];
}

const VitalsMiniChart: React.FC<VitalsMiniChartProps> = ({ vitals }) => {
  const chartData = vitals.map(v => ({
    time: new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    HR: v.hr,
    SpO2: v.spo2,
  }));

  return (
    <div className="h-24 w-full">
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
            }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="HR" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorHr)" name="Heart Rate" />
          <Area type="monotone" dataKey="SpO2" stroke="hsl(var(--accent))" strokeWidth={2} fillOpacity={1} fill="url(#colorSpo2)" name="SpO2" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsMiniChart;
