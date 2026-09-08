import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  iconColor = 'text-[#2563EB] bg-blue-50',
  subtitle,
}) => {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-slate-200/80 shadow-card-subtle hover:shadow-card-hover interactive-card hover:border-blue-200 group transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{title}</p>
          <h3 className="text-2xl font-bold text-[#0F172A] mt-1.5 tabular-nums tracking-tight group-hover:text-blue-600 transition-colors">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl shrink-0 ${iconColor} transition-transform duration-200 group-hover:scale-110 group-hover:shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {(change || subtitle) && (
        <div className="mt-3.5 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`font-semibold inline-flex items-center px-2 py-0.5 rounded-md text-[11px] ${
                isPositive
                  ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                  : 'bg-rose-50 text-[#DC2626] border border-rose-200'
              }`}
            >
              {isPositive ? '↑' : '↓'} {change}
            </span>
          )}
          {subtitle && <span className="text-[#64748B]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
