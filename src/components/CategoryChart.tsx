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
  education: '#3B82F6',
  healthcare: '#EF4444',
  roads: '#F59E0B',
  water: '#06B6D4',
  sanitation: '#8B5CF6',
  electricity: '#F97316',
  employment: '#10B981',
  other: '#6B7280',
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
    .map(([name, value]) => ({ name: LABELS[name] || name, value, color: COLORS[name] || '#6B7280' }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  if (!ChartComponents) {
    return (
      <div className="w-full h-60 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 text-gray-400 text-sm">
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
        >
          {chartData.map((entry: any) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => [`${value} submissions`]} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}