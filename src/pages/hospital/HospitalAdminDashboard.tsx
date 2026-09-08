import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Users, 
  Bed, 
  Receipt, 
  AlertOctagon, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Building2, 
  Clock, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

export const HospitalAdminDashboard: React.FC = () => {
  const { patients, beds, appointments, emergencyCases, invoices, departments } = useHospital();
  const navigate = useNavigate();

  // Metrics
  const totalPatientsCount = patients.length;
  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED').length;
  const totalBeds = beds.length;
  const bedOccupancyRate = Math.round((occupiedBeds / (totalBeds || 1)) * 100);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const criticalEmergencyCount = emergencyCases.filter(e => e.triageLevel === 'CRITICAL' || e.triageLevel === 'RESUSCITATION').length;

  // Chart Data: Department Patient Influx
  const departmentVolumeData = [
    { name: 'Internal Med', outpatients: 45, inpatients: 18 },
    { name: 'Cardiology', outpatients: 32, inpatients: 12 },
    { name: 'Pediatrics', outpatients: 28, inpatients: 14 },
    { name: 'Surgery', outpatients: 20, inpatients: 22 },
    { name: 'Maternity', outpatients: 18, inpatients: 16 },
    { name: 'Emergency', outpatients: 55, inpatients: 8 },
  ];

  // Revenue 7-Day Trend
  const revenueTrendData = [
    { day: 'Mon', revenue: 145000 },
    { day: 'Tue', revenue: 180000 },
    { day: 'Wed', revenue: 165000 },
    { day: 'Thu', revenue: 210000 },
    { day: 'Fri', revenue: 195000 },
    { day: 'Sat', revenue: 230000 },
    { day: 'Sun', revenue: 175000 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Top Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Building2 className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Operations Command Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Command Center Live • 99.9% Uptime
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time census, ward occupancy, inpatient admissions, and emergency acuity telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/inpatient/beds')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-xs cursor-pointer"
          >
            Ward Bed Manager
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/emergency/dashboard')}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 rounded-xl shadow-md shadow-rose-500/20 transition flex items-center gap-1.5 cursor-pointer group"
          >
            <AlertOctagon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
            <span>Emergency Center ({criticalEmergencyCount} Critical)</span>
          </motion.button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Active Patient Census"
            value={totalPatientsCount}
            change="+12% today"
            isPositive={true}
            icon={Users}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Registered electronic health records"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Inpatient Bed Occupancy"
            value={`${bedOccupancyRate}%`}
            change={`${occupiedBeds} of ${totalBeds} beds`}
            isPositive={bedOccupancyRate < 85}
            icon={Bed}
            iconColor="text-teal-600 bg-teal-50"
            subtitle="Hospital inpatient utilization"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Daily Financial Settlement"
            value={`${totalRevenue.toLocaleString()} ETB`}
            change="+8.4% vs last week"
            isPositive={true}
            icon={Receipt}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="Processed via Telebirr & Cashier"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Critical Emergency Cases"
            value={criticalEmergencyCount}
            icon={AlertOctagon}
            iconColor="text-rose-600 bg-rose-50"
            subtitle="Immediate ER Resuscitation & Emergent"
          />
        </motion.div>
      </div>

      {/* Operational Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Volume Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Clinical Department Workload</h3>
              <p className="text-xs text-slate-500 mt-0.5">Outpatient clinic visits vs Inpatient bed admissions</p>
            </div>
            <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">Today</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="outpatients" fill="#3b82f6" name="Outpatients" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inpatients" fill="#0d9488" name="Inpatients" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Flow Area Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Weekly Revenue Flow (ETB)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Cashier, Telebirr, and insurance reimbursement receipts</p>
            </div>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-200">
              Positive Intake
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={v => `${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString()} ETB`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ward Occupancy Overview & Emergency Triage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ward Bed Status */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Inpatient Bed Allocation by Ward</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time status of hospital wards and critical care units</p>
            </div>
            <button
              onClick={() => navigate('/inpatient/beds')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
            >
              View All Beds <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {beds.slice(0, 6).map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{b.bedNumber}</span>
                    <span className="text-[11px] text-slate-500">{b.type}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{b.wardName}</p>
                  {b.currentPatientName && (
                    <p className="text-[11px] text-blue-700 mt-1 truncate max-w-[170px]">
                      Patient: <strong>{b.currentPatientName}</strong>
                    </p>
                  )}
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Triage Stream */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Emergency Cases</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/emergency/register')}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition flex items-center gap-1 cursor-pointer"
              >
                + New Intake
              </button>
              <span className="text-xs text-rose-600 font-bold">{emergencyCases.length} Cases</span>
            </div>
          </div>

          <div className="space-y-3">
            {emergencyCases.slice(0, 4).map((ec) => (
              <div key={ec.id} className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{ec.patientName}</span>
                  <StatusBadge status={ec.triageLevel} />
                </div>
                <p className="text-slate-600 line-clamp-2 mt-1">{ec.chiefComplaint}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>GCS Score: <strong className="text-slate-800">{ec.gcsScore}/15</strong></span>
                  <span className="font-mono">{ec.arrivalTimestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
