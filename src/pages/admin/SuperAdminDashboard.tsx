import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Server, 
  FileText, 
  Lock, 
  Activity, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { mockStaffUsers } from '../../data/mockData';

export const SuperAdminDashboard: React.FC = () => {
  const { patients, beds, invoices, auditLogs } = useHospital();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital System Administration & Security
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Zero-Trust Guard Online
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Role-based access control (RBAC), user directory, clinical audit trail, and infrastructure uptime.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/users')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-xs cursor-pointer"
          >
            Staff User Accounts
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/admin/audit-logs')}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5 cursor-pointer group"
          >
            <Lock className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            <span>Audit Trail ({auditLogs.length} Events)</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Active System Accounts"
            value={mockStaffUsers.length}
            icon={Users}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Doctors, Nurses, Pharmacists, Techs"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Audit Trail Logs"
            value={auditLogs.length}
            icon={Lock}
            iconColor="text-indigo-600 bg-indigo-50"
            subtitle="Electronic compliance events"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="System Health & Services"
            value="100% Online"
            icon={Server}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="EMR Engine, PACS, LIS, RIS"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Total Patient Records"
            value={patients.length}
            icon={FileText}
            iconColor="text-teal-600 bg-teal-50"
            subtitle="Encrypted master patient index"
          />
        </motion.div>
      </div>

      {/* Grid: Staff Directory & Recent Compliance Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff User Directory */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Healthcare Personnel</h3>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Manage Users →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {mockStaffUsers.slice(0, 5).map(u => (
              <div key={u.id} className="p-3.5 hover:bg-blue-50/30 transition-all duration-150 flex items-center justify-between gap-3 text-xs group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs group-hover:scale-105 transition-transform">
                    {u.name[0]}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors">{u.name}</span>
                    <span className="text-slate-500 text-[11px]">{u.email}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold block border border-slate-200/60">
                    {u.role.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400">{u.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail Stream */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Security & Clinical Audit Stream</h3>
            </div>
            <button
              onClick={() => navigate('/admin/audit-logs')}
              className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              Full Log →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="p-3.5 hover:bg-blue-50/25 transition-all duration-150 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{log.action.replace(/_/g, ' ')}</span>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">{log.timestamp}</span>
                </div>
                <p className="text-slate-600 mt-1">{log.details}</p>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>User: <strong className="text-slate-700">{log.userName}</strong> ({log.userRole})</span>
                  <span className="font-mono">{log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
