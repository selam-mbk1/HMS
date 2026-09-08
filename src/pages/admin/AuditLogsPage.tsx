import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { AuditLog } from '../../types';
import { Lock, ShieldAlert, Clock, UserCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useHospital();

  const columns: Column<AuditLog>[] = [
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      cell: (log) => <span className="font-mono text-xs text-slate-600 block">{log.timestamp}</span>,
    },
    {
      header: 'Staff Member',
      cell: (log) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{log.userName}</span>
          <span className="font-mono text-[11px] text-slate-500">{log.userRole}</span>
        </div>
      ),
    },
    {
      header: 'Security Action',
      accessorKey: 'action',
      cell: (log) => (
        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
          {log.action}
        </span>
      ),
    },
    {
      header: 'Event Details',
      accessorKey: 'details',
      cell: (log) => <p className="text-xs text-slate-700 max-w-md">{log.details}</p>,
    },
    {
      header: 'IP Address',
      accessorKey: 'ipAddress',
      cell: (log) => <span className="font-mono text-xs text-slate-500">{log.ipAddress}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Clinical Access & Security Audit Trail
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log of patient record accesses, medication dispensing, and financial transactions.
          </p>
        </div>
      </div>

      <DataTable
        data={auditLogs}
        columns={columns}
        searchPlaceholder="Search audit logs by user, action, details..."
        searchFilter={(log, q) =>
          log.userName.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.userRole.toLowerCase().includes(q)
        }
        pageSize={10}
        exportFileName="hospital_audit_trail_logs"
      />
    </div>
  );
};
