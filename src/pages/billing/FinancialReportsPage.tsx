import React, { useRef } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { 
  FileBarChart, 
  TrendingUp, 
  CheckCircle2, 
  Printer, 
  Download, 
  Building2, 
  DollarSign, 
  Receipt,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

export const FinancialReportsPage: React.FC = () => {
  const { invoices, paymentTransactions } = useHospital();
  const reportRef = useRef<HTMLDivElement>(null);

  const nonVoided = invoices.filter(i => i.paymentStatus !== 'VOIDED');
  const totalBilled = nonVoided.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalCollected = nonVoided.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalOutstanding = nonVoided.reduce((sum, i) => sum + i.balanceDue, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Estimated operational cost model (pharmaceutical cogs, diagnostic reagents, surgical consumables)
  const estimatedCostOfCare = Math.round(totalBilled * 0.38);
  const grossOperatingSurplus = totalBilled - estimatedCostOfCare;
  const netOperatingMargin = totalBilled > 0 ? Math.round((grossOperatingSurplus / totalBilled) * 100) : 0;

  // Daily revenue trend (last 7 days)
  const revenueTrendData = [
    { day: 'Sep 02', billed: 42000, collected: 38000 },
    { day: 'Sep 03', billed: 56000, collected: 49000 },
    { day: 'Sep 04', billed: 38000, collected: 35000 },
    { day: 'Sep 05', billed: 64000, collected: 58000 },
    { day: 'Sep 06', billed: 48000, collected: 41000 },
    { day: 'Sep 07', billed: 72000, collected: 65000 },
    { day: 'Sep 08', billed: totalBilled, collected: totalCollected },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <FileBarChart className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Financial Statement & Performance Reports
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            BETHEL ST. PAUL Specialized Hospital (Main Campus) • Directorate of Finance & Medical Billing
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print Financial Statement
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div ref={reportRef} className="space-y-6">
        {/* KPI Executive Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Gross Revenue Billed"
            value={`${totalBilled.toLocaleString()} ETB`}
            icon={TrendingUp}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="All clinical service categories"
          />
          <StatCard
            title="Realized Cash Collections"
            value={`${totalCollected.toLocaleString()} ETB`}
            icon={CheckCircle2}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle={`${collectionRate}% cash realization efficiency`}
          />
          <StatCard
            title="Estimated Direct Cost of Care"
            value={`${estimatedCostOfCare.toLocaleString()} ETB`}
            icon={DollarSign}
            iconColor="text-slate-600 bg-slate-50"
            subtitle="Pharma COGS & laboratory consumables"
          />
          <StatCard
            title="Gross Operating Margin"
            value={`${grossOperatingSurplus.toLocaleString()} ETB`}
            icon={ShieldCheck}
            iconColor="text-purple-600 bg-purple-50"
            subtitle={`${netOperatingMargin}% hospital operating margin`}
          />
        </div>

        {/* Financial Performance Charts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Hospital Revenue & Collection Velocity (ETB)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison between gross billed fees and settled receipts over 7 operating days
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} ETB`]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="billed" name="Gross Invoiced" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Settled Receipts" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Formal Income Statement Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              Hospital Operating Statement (Income & Collections)
            </h3>
            <p className="text-xs text-slate-500">
              Period: September 2026 Fiscal Quarter • Bethel St. Paul Specialized Hospital
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 font-bold text-slate-900">
              <span>Operating Healthcare Revenues</span>
              <span className="font-mono">{totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB</span>
            </div>
            <div className="pl-4 space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>• Inpatient Bed Accommodation & ICU Ward Stay</span>
                <span className="font-mono">32,000.00 ETB</span>
              </div>
              <div className="flex justify-between">
                <span>• General & Specialty Outpatient Consultations</span>
                <span className="font-mono">12,500.00 ETB</span>
              </div>
              <div className="flex justify-between">
                <span>• Diagnostic Laboratory & Blood Pathology</span>
                <span className="font-mono">8,400.00 ETB</span>
              </div>
              <div className="flex justify-between">
                <span>• Central Hospital Pharmacy & Drug Dispensing</span>
                <span className="font-mono">15,600.00 ETB</span>
              </div>
              <div className="flex justify-between">
                <span>• Emergency Triage & Surgical Interventions</span>
                <span className="font-mono">45,000.00 ETB</span>
              </div>
            </div>

            <div className="flex justify-between py-2 border-t border-b border-slate-100 font-bold text-slate-900">
              <span>Direct Operational Costs (Estimated)</span>
              <span className="font-mono text-rose-600">-{estimatedCostOfCare.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB</span>
            </div>
            <div className="pl-4 space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>• Pharmaceutical Inventory Cost of Goods Sold</span>
                <span className="font-mono text-rose-500">-19,800.00 ETB</span>
              </div>
              <div className="flex justify-between">
                <span>• Clinical Reagents, Lab Strips & Specimen Kits</span>
                <span className="font-mono text-rose-500">-7,200.00 ETB</span>
              </div>
              <div className="flex justify-between">
                <span>• Sterile Surgical Linen & Medical Consumables</span>
                <span className="font-mono text-rose-500">-16,100.00 ETB</span>
              </div>
            </div>

            <div className="flex justify-between py-3 border-t-2 border-slate-900 text-sm font-black text-slate-900">
              <span>Gross Operating Margin</span>
              <span className="font-mono text-emerald-700">{grossOperatingSurplus.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB</span>
            </div>

            <div className="flex justify-between py-2 border-t border-slate-200 text-slate-600">
              <span>Actual Settled Cash Realized:</span>
              <span className="font-mono font-bold text-slate-900">{totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Accounts Receivable Still Pending:</span>
              <span className="font-mono font-bold text-rose-600">{totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <p className="font-bold text-slate-800">Certified by Finance Directorate</p>
              <p>BETHEL ST. PAUL Specialized Hospital (Main Campus)</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">Ato Samuel Bekele</p>
              <p className="text-[10px] text-slate-400">Chief Medical Accountant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
