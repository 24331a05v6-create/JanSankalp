'use client';

import { useState, useEffect } from 'react';

interface CategoryChartProps {
  data: Record<string, number>;
}

const LABELS: Record<string, string> = {
  education: 'Education',
  healthcare: 'Healthcare',
  roads: 'Roads',
  water: 'Water',
  sanitation: 'Sanitation',
  electricity: 'Electricity',
  employment: 'Employment',
  other: 'Other',
};

const COLORS: Record<string, string> = {
  education: '#3b82f6',
  healthcare: '#ef4444',
  roads: '#f59e0b',
  water: '#06b6d4',
  sanitation: '#8b5cf6',
  electricity: '#f97316',
  employment: '#10b981',
  other: '#64748b',
};

export function CategoryChart({ data }: CategoryChartProps) {
  const [ChartComponents, setChartComponents] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const recharts = await import('recharts');
      setChartComponents({
        PieChart: recharts.PieChart,
        Pie: recharts.Pie,
        Cell: recharts.Cell,
        ResponsiveContainer: recharts.ResponsiveContainer,
        Tooltip: recharts.Tooltip,
        Legend: recharts.Legend,
      });
    })();
  }, []);

  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name: LABELS[name] || name, value, color: COLORS[name] || '#64748b' }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  if (!ChartComponents) {
    return (
      <div className="w-full h-60 flex items-center justify-center" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
        <div className="w-6 h-6 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 text-sm" style={{ color: 'var(--text-tertiary)' }}>
        No data yet
      </div>
    );
  }

  const { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } = ChartComponents;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
          animationBegin={0}
          animationDuration={800}
        >
          {chartData.map((entry: any) => (
            <Cell key={entry.name} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-md)',
            fontSize: '13px',
          }}
          formatter={(value: any) => [`${value} submissions`]}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
