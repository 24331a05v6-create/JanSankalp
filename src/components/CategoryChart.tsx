'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryChartProps {
  data: Record<string, number>;
}

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
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No data available
      </div>
    );
  }

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
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || COLORS.other} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => [`${value} submissions`, '']}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}