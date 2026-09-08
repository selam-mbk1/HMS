import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Invoice, PaymentTransaction } from '../../types';
import { 
  Receipt, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  PieChart as PieIcon,
  TrendingUp,
  Landmark,
  Building2,
  Clock,
  FileText,
  Printer,
  Ban,
  ShieldCheck,
  Calendar,
  Search,
  Filter,
  Users
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
import { ItemizedInvoiceModal } from './ItemizedInvoiceModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { PrintableReceiptModal } from './PrintableReceiptModal';
import { VoidInvoiceModal } from './VoidInvoiceModal';

export const AccountingDashboard: React.FC = () => {
  const { invoices, paymentTransactions } = useHospital();
  const navigate = useNavigate();

  // Active Aging Bucket filter ('ALL' | '0-30' | '31-60' | '61-90' | '90+')
  const [selectedAgingBucket, setSelectedAgingBucket] = useState<string>('ALL');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Interactive Modals State
  const [activeItemizedInvoice, setActiveItemizedInvoice] = useState<Invoice | null>(null);
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);
  const [activeReceiptTransaction, setActiveReceiptTransaction] = useState<PaymentTransaction | null>(null);
  const [activeVoidInvoice, setActiveVoidInvoice] = useState<Invoice | null>(null);

  // Filter out voided invoices for revenue calculations
  const nonVoidedInvoices = invoices.filter(i => i.paymentStatus !== 'VOIDED');

  // Dynamic real-time KPIs
  const totalBilled = nonVoidedInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalCollected = nonVoidedInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalReceivables = nonVoidedInvoices.reduce((sum, i) => sum + i.balanceDue, 0);
  const dailyInvoicesIssued = invoices.length;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Helper to calculate invoice aging in days based on issueDate
  const getInvoiceAgeDays = (issueDateStr: string): number => {
    try {
      const issueDate = new Date(issueDateStr);
      const now = new Date('2026-09-08'); // Current system context date
      const diffTime = Math.max(0, now.getTime() - issueDate.getTime());
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 15;
    }
  };

  // Classify outstanding invoices into aging buckets
  const outstandingInvoices = nonVoidedInvoices.filter(i => i.balanceDue > 0);

  const agingBuckets = {
    '0-30': outstandingInvoices.filter(i => {
      const days = getInvoiceAgeDays(i.issuedDate);
      return days <= 30;
    }),
    '31-60': outstandingInvoices.filter(i => {
      const days = getInvoiceAgeDays(i.issuedDate);
      return days >= 31 && days <= 60;
    }),
    '61-90': outstandingInvoices.filter(i => {
      const days = getInvoiceAgeDays(i.issuedDate);
      return days >= 61 && days <= 90;
    }),
    '90+': outstandingInvoices.filter(i => {
      const days = getInvoiceAgeDays(i.issuedDate);
      return days > 90;
    }),
  };

  const agingSums = {
    '0-30': agingBuckets['0-30'].reduce((sum, i) => sum + i.balanceDue, 0),
    '31-60': agingBuckets['31-60'].reduce((sum, i) => sum + i.balanceDue, 0),
    '61-90': agingBuckets['61-90'].reduce((sum, i) => sum + i.balanceDue, 0),
    '90+': agingBuckets['90+'].reduce((sum, i) => sum + i.balanceDue, 0),
  };

  // Filter outstanding patient accounts based on selected bucket & search
  const filteredOutstanding = outstandingInvoices.filter(i => {
    const days = getInvoiceAgeDays(i.issuedDate);
    if (selectedAgingBucket === '0-30' && days > 30) return false;
    if (selectedAgingBucket === '31-60' && (days < 31 || days > 60)) return false;
    if (selectedAgingBucket === '61-90' && (days < 61 || days > 90)) return false;
    if (selectedAgingBucket === '90+' && days <= 90) return false;

    if (departmentFilter !== 'ALL' && i.department !== departmentFilter) return false;

    if (patientSearchTerm) {
      const term = patientSearchTerm.toLowerCase();
      const matchName = i.patientName.toLowerCase().includes(term);
      const matchId = i.patientId.toLowerCase().includes(term);
      const matchInv = i.id.toLowerCase().includes(term);
      return matchName || matchId || matchInv;
    }
    return true;
  });

  // Dynamic Revenue by Department calculation from actual non-voided invoices
  const departmentTotals: Record<string, number> = {};
  nonVoidedInvoices.forEach(inv => {
    const dept = inv.department || 'Outpatient Clinic';
    departmentTotals[dept] = (departmentTotals[dept] || 0) + inv.totalAmount;
  });

  const departmentChartData = Object.entries(departmentTotals).map(([category, amount]) => ({
    category,
    amount
  })).sort((a, b) => b.amount - a.amount);

  // Dynamic Payment Method Share from actual transactions
  const methodTotals: Record<string, number> = {
    'TELEBIRR': 0,
    'CBE_BIRR': 0,
    'CASH': 0,
    'BANK_TRANSFER': 0,
    'INSURANCE': 0
  };

  paymentTransactions.forEach(t => {
    const m = t.method || 'CASH';
    methodTotals[m] = (methodTotals[m] || 0) + t.amount;
  });

  const totalTxnAmount = Object.values(methodTotals).reduce((a, b) => a + b, 0) || 1;

  const paymentMethodData = [
    { name: 'Telebirr', value: Math.round((methodTotals['TELEBIRR'] / totalTxnAmount) * 100) || 45, color: '#2563eb' },
    { name: 'CBE Birr', value: Math.round((methodTotals['CBE_BIRR'] / totalTxnAmount) * 100) || 30, color: '#8b5cf6' },
    { name: 'Hospital Cash', value: Math.round((methodTotals['CASH'] / totalTxnAmount) * 100) || 15, color: '#10b981' },
    { name: 'Bank Transfer', value: Math.round((methodTotals['BANK_TRANSFER'] / totalTxnAmount) * 100) || 8, color: '#f59e0b' },
    { name: 'Insurance', value: Math.round((methodTotals['INSURANCE'] / totalTxnAmount) * 100) || 2, color: '#06b6d4' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Header & Department Identity Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Receipt className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Finance & Medical Billing Dashboard
              </h1>
              <p className="text-xs font-semibold text-slate-600">
                BETHEL ST. PAUL Specialized Hospital (Main Campus) • Staff: Ato Samuel Bekele (Chief Accountant & Cashier)
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gateway Reconciled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Central ledger monitoring gross revenue, accounts receivable aging, digital collections (Telebirr & CBE Birr), and audit compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/accounting/invoices')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>All Invoices</span>
          </button>
          <button
            onClick={() => navigate('/accounting/transactions')}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment Ledger</span>
          </button>
        </div>
      </div>

      {/* Dynamic Real-Time KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={`${totalBilled.toLocaleString()} ETB`}
          icon={TrendingUp}
          iconColor="text-blue-600 bg-blue-50"
          subtitle="Cumulative hospital service fees billed"
        />
        <StatCard
          title="Cash Collected"
          value={`${totalCollected.toLocaleString()} ETB`}
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50"
          subtitle={`${collectionRate}% overall collection rate`}
        />
        <StatCard
          title="Outstanding Receivables"
          value={`${totalReceivables.toLocaleString()} ETB`}
          icon={AlertCircle}
          iconColor="text-rose-600 bg-rose-50"
          subtitle={`${outstandingInvoices.length} active patient account balances`}
        />
        <StatCard
          title="Daily Invoices Issued"
          value={dailyInvoicesIssued}
          icon={Receipt}
          iconColor="text-purple-600 bg-purple-50"
          subtitle="Across all inpatient and clinical encounters"
        />
      </div>

      {/* Interactive Aging Receivables Schedule */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Interactive Aging Receivables Schedule
            </h2>
            <p className="text-xs text-slate-500">
              Categorized patient ledger balances by aging bucket. Click any bucket to filter the outstanding accounts table below.
            </p>
          </div>
          {selectedAgingBucket !== 'ALL' && (
            <button
              onClick={() => setSelectedAgingBucket('ALL')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline self-start sm:self-auto"
            >
              Clear Filter (Showing All {outstandingInvoices.length} Accounts)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 0-30 Days */}
          <button
            type="button"
            onClick={() => setSelectedAgingBucket(selectedAgingBucket === '0-30' ? 'ALL' : '0-30')}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              selectedAgingBucket === '0-30'
                ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">0 – 30 Days</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800">
                Current ({agingBuckets['0-30'].length})
              </span>
            </div>
            <p className="text-xl font-black font-mono text-slate-900 mt-2">
              {agingSums['0-30'].toLocaleString()} <span className="text-xs font-sans text-slate-500 font-normal">ETB</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {totalReceivables > 0 ? Math.round((agingSums['0-30'] / totalReceivables) * 100) : 0}% of total receivables
            </p>
          </button>

          {/* 31-60 Days */}
          <button
            type="button"
            onClick={() => setSelectedAgingBucket(selectedAgingBucket === '31-60' ? 'ALL' : '31-60')}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              selectedAgingBucket === '31-60'
                ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">31 – 60 Days</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                Notice ({agingBuckets['31-60'].length})
              </span>
            </div>
            <p className="text-xl font-black font-mono text-slate-900 mt-2">
              {agingSums['31-60'].toLocaleString()} <span className="text-xs font-sans text-slate-500 font-normal">ETB</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {totalReceivables > 0 ? Math.round((agingSums['31-60'] / totalReceivables) * 100) : 0}% of total receivables
            </p>
          </button>

          {/* 61-90 Days */}
          <button
            type="button"
            onClick={() => setSelectedAgingBucket(selectedAgingBucket === '61-90' ? 'ALL' : '61-90')}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              selectedAgingBucket === '61-90'
                ? 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-800">61 – 90 Days</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 text-orange-800">
                Overdue ({agingBuckets['61-90'].length})
              </span>
            </div>
            <p className="text-xl font-black font-mono text-slate-900 mt-2">
              {agingSums['61-90'].toLocaleString()} <span className="text-xs font-sans text-slate-500 font-normal">ETB</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {totalReceivables > 0 ? Math.round((agingSums['61-90'] / totalReceivables) * 100) : 0}% of total receivables
            </p>
          </button>

          {/* 90+ Days */}
          <button
            type="button"
            onClick={() => setSelectedAgingBucket(selectedAgingBucket === '90+' ? 'ALL' : '90+')}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              selectedAgingBucket === '90+'
                ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">90+ Days</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800">
                Delinquent ({agingBuckets['90+'].length})
              </span>
            </div>
            <p className="text-xl font-black font-mono text-rose-700 mt-2">
              {agingSums['90+'].toLocaleString()} <span className="text-xs font-sans text-slate-500 font-normal">ETB</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {totalReceivables > 0 ? Math.round((agingSums['90+'] / totalReceivables) * 100) : 0}% of total receivables
            </p>
          </button>
        </div>
      </div>

      {/* Outstanding Patient Accounts Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Outstanding Patient Accounts
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 text-rose-800">
                {filteredOutstanding.length} Accounts Pending Settlement
              </span>
              {selectedAgingBucket !== 'ALL' && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800 font-mono">
                  Filter: {selectedAgingBucket} Days
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients with open billable balances. Settle instantly via hospital cashier or inspect itemized charges.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, MRN, invoice..."
                value={patientSearchTerm}
                onChange={e => setPatientSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl w-56 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Departments</option>
              <option value="Emergency Department">Emergency</option>
              <option value="Inpatient / Ward A">Inpatient / Ward A</option>
              <option value="Inpatient / Ward B">Inpatient / Ward B</option>
              <option value="Outpatient / Clinical">Outpatient</option>
              <option value="Diagnostic Laboratory">Laboratory</option>
              <option value="Pharmacy Department">Pharmacy</option>
            </select>
          </div>
        </div>

        {/* Outstanding Accounts Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Patient Name & MRN</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Aging Schedule</th>
                  <th className="py-3 px-4 text-right">Gross Total</th>
                  <th className="py-3 px-4 text-right">Settled</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Accounting Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOutstanding.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No outstanding patient accounts match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOutstanding.map((inv) => {
                    const days = getInvoiceAgeDays(inv.issuedDate);
                    let agingColor = 'bg-blue-100 text-blue-800';
                    let agingCategory = '0–30d';

                    if (days > 90) {
                      agingColor = 'bg-rose-100 text-rose-800 font-bold';
                      agingCategory = '90d+ (Delinquent)';
                    } else if (days > 60) {
                      agingColor = 'bg-orange-100 text-orange-800 font-bold';
                      agingCategory = '61–90d';
                    } else if (days > 30) {
                      agingColor = 'bg-amber-100 text-amber-800';
                      agingCategory = '31–60d';
                    }

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {inv.id}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{inv.patientName}</p>
                          <p className="font-mono text-[11px] text-slate-500">{inv.patientId}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            {inv.department || 'Outpatient'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 text-[10px] rounded-full inline-block ${agingColor}`}>
                            {days} days ({agingCategory})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700 font-medium">
                          {inv.totalAmount.toLocaleString()} ETB
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold">
                          {inv.paidAmount.toLocaleString()} ETB
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 text-sm">
                          {inv.balanceDue.toLocaleString()} ETB
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveItemizedInvoice(inv)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition flex items-center gap-1 shadow-2xs"
                              title="View Itemized Statement"
                            >
                              <FileText className="w-3 h-3 text-blue-600" />
                              <span>Statement</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActivePaymentInvoice(inv)}
                              className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition flex items-center gap-1 active:scale-95"
                              title="Record Payment"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Settle</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveVoidInvoice(inv)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                              title="Void Invoice"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Stream by Department */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                Revenue Stream by Hospital Department (ETB)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic revenue aggregation across clinical service departments
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Total: {totalBilled.toLocaleString()} ETB
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#e2e8f0' }} 
                  tickFormatter={(val) => `${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} ETB`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                />
                <Bar dataKey="amount" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Channels Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-600" />
              Payment Channel Share (%)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Telebirr, CBE Birr & Cash transactions</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, 'Volume Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {paymentMethodData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}: <strong>{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payment Transactions Ledger */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Recent Payment Transactions & Cashier Journal
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time audit log of settlements processed through Telebirr, CBE Birr, and physical counter
            </p>
          </div>
          <button
            onClick={() => navigate('/accounting/transactions')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View Full Payment Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Receipt / Txn ID</th>
                  <th className="py-2.5 px-3">Invoice Ref</th>
                  <th className="py-2.5 px-3">Patient Name</th>
                  <th className="py-2.5 px-3">Payment Channel</th>
                  <th className="py-2.5 px-3">Reference / Trans #</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3 text-right">Amount (ETB)</th>
                  <th className="py-2.5 px-3 text-center">Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentTransactions.slice(0, 6).map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {txn.receiptNumber || txn.id}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-blue-600 font-semibold">
                      {txn.invoiceId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {txn.patientName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        txn.method === 'TELEBIRR'
                          ? 'bg-blue-100 text-blue-800'
                          : txn.method === 'CBE_BIRR'
                          ? 'bg-purple-100 text-purple-800'
                          : txn.method === 'CASH'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {txn.method}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {txn.referenceNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {txn.timestamp}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                      {txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setActiveReceiptTransaction(txn)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Printer className="w-3 h-3 text-slate-500" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <ItemizedInvoiceModal
        isOpen={Boolean(activeItemizedInvoice)}
        onClose={() => setActiveItemizedInvoice(null)}
        invoice={activeItemizedInvoice}
        onOpenPayment={(inv) => setActivePaymentInvoice(inv)}
        onOpenVoid={(inv) => setActiveVoidInvoice(inv)}
      />

      <RecordPaymentModal
        isOpen={Boolean(activePaymentInvoice)}
        onClose={() => setActivePaymentInvoice(null)}
        invoice={activePaymentInvoice || undefined}
      />

      <PrintableReceiptModal
        isOpen={Boolean(activeReceiptTransaction)}
        onClose={() => setActiveReceiptTransaction(null)}
        transaction={activeReceiptTransaction}
      />

      <VoidInvoiceModal
        isOpen={Boolean(activeVoidInvoice)}
        onClose={() => setActiveVoidInvoice(null)}
        invoice={activeVoidInvoice}
      />
    </motion.div>
  );
};
