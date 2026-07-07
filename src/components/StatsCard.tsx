'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: number;
  color?: string;
  delay?: number;
}

export function StatsCard({ icon: Icon, label, value, trend, color = '#3b82f6', delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="card group relative overflow-hidden"
      style={{ padding: '20px' }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full -translate-y-8 translate-x-8"
        style={{ background: color }} />

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</span>
        {trend !== undefined && (
          <span className={`text-xs font-semibold mb-1 ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
