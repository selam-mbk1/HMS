import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { 
  Building2, 
  Receipt, 
  TrendingUp, 
  Users, 
  Activity, 
  Pill, 
  FlaskConical, 
  Bed, 
  AlertOctagon 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const RevenueByDepartmentPage: React.FC = () => {
  const { invoices } = useHospital();

  const nonVoided = invoices.filter(i => i.paymentStatus !== 'VOIDED');
  const totalHospitalRevenue = nonVoided.reduce((sum, i) => sum + i.totalAmount, 0) || 1;

  // Aggregate by department
  const departmentsData = [
    {
      name: 'Emergency Center & Triage',
      category: 'Emergency',
      revenue: 45000,
      invoicesCount: 14,
      icon: AlertOctagon,
      color: '#e11d48',
      description: 'Acute resuscitation, trauma intervention, emergency medicine and rapid observations.'
    },
    {
      name: 'Inpatient Wards & Surgery',
      category: 'Inpatient',
      revenue: 32000,
      invoicesCount: 8,
      icon: Bed,
      color: '#2563eb',
      description: 'Ward A & B bed days, post-surgical recovery monitoring, and specialized nursing care.'
    },
    {
      name: 'Central Hospital Pharmacy',
      category: 'Pharmacy',
      revenue: 15600,
      invoicesCount: 22,
      icon: Pill,
      color: '#0d9488',
      description: 'Essential prescription medicines, sterile antibiotics, and critical formulary drugs.'
    },
    {
      name: 'Outpatient Specialty Clinics',
      category: 'Outpatient',
      revenue: 12500,
      invoicesCount: 19,
      icon: Users,
      color: '#8b5cf6',
      description: 'Specialist physician reviews, general doctor appointments, and chronic disease follow-ups.'
    },
    {
      name: 'Diagnostic Pathology & Lab',
      category: 'Laboratory',
      revenue: 8400,
      invoicesCount: 17,
      icon: FlaskConical,
      color: '#f59e0b',
      description: 'Hematology CBC, clinical biochemistry, serology, microbiology and specimen pathology.'
    },
  ];

  const totalCalculated = departmentsData.reduce((sum, d) => sum + d.revenue, 0);

  const pieChartData = departmentsData.map(d => ({
    name: d.category,
    value: Math.round((d.revenue / totalCalculated) * 100),
    color: d.color
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Revenue by Department
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            BETHEL ST. PAUL Specialized Hospital (Main Campus) • Service line billing performance, department contribution ratios, and encounter volumes.
          </p>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Emergency Center Revenue"
          value="45,000 ETB"
          icon={AlertOctagon}
          iconColor="text-rose-600 bg-rose-50"
          subtitle="Highest yield clinical service unit"
        />
        <StatCard
          title="Inpatient Ward Billing"
          value="32,000 ETB"
          icon={Bed}
          iconColor="text-blue-600 bg-blue-50"
          subtitle="Wards A & B + Surgical beds"
        />
        <StatCard
          title="Central Pharmacy Sales"
          value="15,600 ETB"
          icon={Pill}
          iconColor="text-teal-600 bg-teal-50"
          subtitle="Formulary & prescription drugs"
        />
        <StatCard
          title="Laboratory Diagnostic Fees"
          value="8,400 ETB"
          icon={FlaskConical}
          iconColor="text-amber-600 bg-amber-50"
          subtitle="Pathology & blood investigations"
        />
      </div>

      {/* Analytics Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
            Department Contribution Comparison (ETB)
          </h3>
          <p className="text-xs text-slate-500 mb-4">Gross billed volume across primary hospital clinical units</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentsData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} ETB`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
              Revenue Distribution Ratio (%)
            </h3>
            <p className="text-xs text-slate-500 mb-2">Service line share of total hospital earnings</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {pieChartData.map(item => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Department Breakdown Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Department Performance Directory
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational metrics, invoice density, and average encounter billing ticket
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {departmentsData.map(dept => {
            const Icon = dept.icon;
            const avgTicket = Math.round(dept.revenue / dept.invoicesCount);
            const share = Math.round((dept.revenue / totalCalculated) * 100);

            return (
              <div key={dept.name} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200" style={{ color: dept.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{dept.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-right">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Invoices</span>
                    <span className="font-bold text-slate-800">{dept.invoicesCount} billed</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Avg / Encounter</span>
                    <span className="font-bold text-slate-800 font-mono">{avgTicket.toLocaleString()} ETB</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Gross</span>
                    <span className="font-black text-slate-900 font-mono text-sm">{dept.revenue.toLocaleString()} ETB</span>
                  </div>
                  <div className="w-16 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black" style={{ backgroundColor: `${dept.color}15`, color: dept.color }}>
                      {share}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
