import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'appointment' | 'priority' | 'lab' | 'bed' | 'payment' | 'stock' | 'emergency' | 'general';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let colorClasses = 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]';
  let dotColor = 'bg-[#64748B]';

  // Success: Green #16A34A
  if (['COMPLETED', 'CONFIRMED', 'PAID', 'IN_STOCK', 'DISPENSED', 'ACTIVE', 'NORMAL'].includes(normalized)) {
    colorClasses = 'bg-emerald-50 text-[#16A34A] border-emerald-200';
    dotColor = 'bg-[#16A34A]';
  } 
  // Warning: Amber #F59E0B
  else if (['WAITING', 'WAITING_FOR_NURSE', 'WAITING_FOR_DOCTOR', 'PENDING', 'LOW_STOCK', 'URGENT', 'PARTIAL', 'PARTIALLY_DISPENSED', 'OBSERVATION'].includes(normalized)) {
    colorClasses = 'bg-amber-50 text-[#F59E0B] border-amber-200';
    dotColor = 'bg-[#F59E0B]';
  } 
  // Info: Cyan/Blue #0891B2
  else if (['INFO', 'LAB_READY', 'STAT', 'ARRIVED', 'CHECKED_IN'].includes(normalized)) {
    colorClasses = 'bg-cyan-50 text-[#0891B2] border-cyan-200';
    dotColor = 'bg-[#0891B2]';
  }
  // Primary: Medical Blue #2563EB
  else if (['IN_PROGRESS', 'WITH_NURSE', 'COLLECTED', 'RESUSCITATION', 'OCCUPIED'].includes(normalized)) {
    colorClasses = 'bg-blue-50 text-[#2563EB] border-blue-200';
    dotColor = 'bg-[#2563EB]';
  } 
  // Danger/Critical: Red #DC2626
  else if (['CRITICAL', 'OUT_OF_STOCK', 'EXPIRED', 'UNPAID', 'CANCELLED', 'NO_SHOW', 'VOIDED'].includes(normalized)) {
    colorClasses = 'bg-rose-50 text-[#DC2626] border-rose-200 font-semibold';
    dotColor = 'bg-[#DC2626]';
  } 
  // Default Neutral
  else if (['SCHEDULED', 'AVAILABLE', 'CLEANING', 'MAINTENANCE'].includes(normalized)) {
    colorClasses = 'bg-slate-100 text-[#0F172A] border-[#E2E8F0]';
    dotColor = 'bg-[#64748B]';
  }

  const label = status.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium border uppercase tracking-wider transition-colors duration-150 ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${colorClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
};
