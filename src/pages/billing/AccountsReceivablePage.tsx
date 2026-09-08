import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatCard } from '../../components/common/StatCard';
import { Invoice } from '../../types';
import { 
  Clock, 
  AlertCircle, 
  CreditCard, 
  FileText, 
  Send, 
  Ban, 
  Calendar,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { ItemizedInvoiceModal } from './ItemizedInvoiceModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { VoidInvoiceModal } from './VoidInvoiceModal';

export const AccountsReceivablePage: React.FC = () => {
  const { invoices } = useHospital();
  const [activeItemizedInvoice, setActiveItemizedInvoice] = useState<Invoice | null>(null);
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);
  const [activeVoidInvoice, setActiveVoidInvoice] = useState<Invoice | null>(null);

  // Helper to calculate invoice aging in days
  const getInvoiceAgeDays = (issueDateStr: string): number => {
    try {
      const issueDate = new Date(issueDateStr);
      const now = new Date('2026-09-08');
      const diffTime = Math.max(0, now.getTime() - issueDate.getTime());
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 15;
    }
  };

  // Only consider open (unpaid / partial), non-voided invoices
  const openReceivables = invoices.filter(i => i.balanceDue > 0 && i.paymentStatus !== 'VOIDED');

  const totalReceivableAmount = openReceivables.reduce((sum, i) => sum + i.balanceDue, 0);

  const bucket0_30 = openReceivables.filter(i => getInvoiceAgeDays(i.issuedDate) <= 30);
  const bucket31_60 = openReceivables.filter(i => {
    const d = getInvoiceAgeDays(i.issuedDate);
    return d >= 31 && d <= 60;
  });
  const bucket61_90 = openReceivables.filter(i => {
    const d = getInvoiceAgeDays(i.issuedDate);
    return d >= 61 && d <= 90;
  });
  const bucket90_plus = openReceivables.filter(i => getInvoiceAgeDays(i.issuedDate) > 90);

  const sum0_30 = bucket0_30.reduce((sum, i) => sum + i.balanceDue, 0);
  const sum31_60 = bucket31_60.reduce((sum, i) => sum + i.balanceDue, 0);
  const sum61_90 = bucket61_90.reduce((sum, i) => sum + i.balanceDue, 0);
  const sum90_plus = bucket90_plus.reduce((sum, i) => sum + i.balanceDue, 0);

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice #',
      accessorKey: 'id',
      cell: (inv) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{inv.id}</span>
          <span className="text-[10px] text-slate-400 font-mono">Issued: {inv.issuedDate}</span>
        </div>
      ),
    },
    {
      header: 'Patient Details',
      cell: (inv) => (
        <div>
          <span className="font-bold text-slate-900 block">{inv.patientName}</span>
          <span className="font-mono text-[11px] text-slate-500">{inv.patientId}</span>
        </div>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department',
      cell: (inv) => (
        <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200">
          {inv.department || 'Outpatient'}
        </span>
      ),
    },
    {
      header: 'Aging Category',
      cell: (inv) => {
        const days = getInvoiceAgeDays(inv.issuedDate);
        let badgeStyle = 'bg-blue-100 text-blue-800';
        let label = '0–30 Days (Current)';

        if (days > 90) {
          badgeStyle = 'bg-rose-100 text-rose-800 font-bold';
          label = `${days} Days (Delinquent 90+)`;
        } else if (days > 60) {
          badgeStyle = 'bg-orange-100 text-orange-800 font-bold';
          label = `${days} Days (Overdue 61–90)`;
        } else if (days > 30) {
          badgeStyle = 'bg-amber-100 text-amber-800';
          label = `${days} Days (Due 31–60)`;
        }

        return (
          <span className={`px-2.5 py-0.5 text-[10px] rounded-full inline-block ${badgeStyle}`}>
            {label}
          </span>
        );
      },
    },
    {
      header: 'Total Gross (ETB)',
      accessorKey: 'totalAmount',
      cell: (inv) => (
        <span className="font-mono text-slate-700 text-xs">
          {inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Settled',
      accessorKey: 'paidAmount',
      cell: (inv) => (
        <span className="font-mono text-emerald-700 text-xs font-semibold">
          {inv.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Outstanding Balance (ETB)',
      accessorKey: 'balanceDue',
      cell: (inv) => (
        <span className="font-mono font-bold text-rose-600 text-xs">
          {inv.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (inv) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveItemizedInvoice(inv)}
            className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition shadow-2xs"
            title="View Statement"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setActivePaymentInvoice(inv)}
            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition flex items-center gap-1 active:scale-95"
          >
            <CreditCard className="w-3 h-3" />
            <span>Settle</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveVoidInvoice(inv)}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Void / Reversal"
          >
            <Ban className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Accounts Receivable & Aging Schedule
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            BETHEL ST. PAUL Specialized Hospital • Aging analysis across 0–30, 31–60, 61–90, and 90+ day buckets.
          </p>
        </div>
      </div>

      {/* Aging Bucket KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="0 – 30 Days (Current)"
          value={`${sum0_30.toLocaleString()} ETB`}
          icon={Clock}
          iconColor="text-blue-600 bg-blue-50"
          subtitle={`${bucket0_30.length} accounts • Recent encounters`}
        />
        <StatCard
          title="31 – 60 Days (Notice)"
          value={`${sum31_60.toLocaleString()} ETB`}
          icon={Calendar}
          iconColor="text-amber-600 bg-amber-50"
          subtitle={`${bucket31_60.length} accounts • Pending payment`}
        />
        <StatCard
          title="61 – 90 Days (Overdue)"
          value={`${sum61_90.toLocaleString()} ETB`}
          icon={AlertTriangle}
          iconColor="text-orange-600 bg-orange-50"
          subtitle={`${bucket61_90.length} accounts • First notice dispatched`}
        />
        <StatCard
          title="90+ Days (Delinquent)"
          value={`${sum90_plus.toLocaleString()} ETB`}
          icon={AlertCircle}
          iconColor="text-rose-600 bg-rose-50"
          subtitle={`${bucket90_plus.length} accounts • Priority collections`}
        />
      </div>

      {/* Aging Receivables Table */}
      <DataTable
        data={openReceivables}
        columns={columns}
        searchPlaceholder="Search open accounts by patient name, MRN, or invoice ID..."
        searchFilter={(i, q) =>
          i.patientName.toLowerCase().includes(q) ||
          i.patientId.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          (i.department && i.department.toLowerCase().includes(q))
        }
        filterOptions={{
          label: 'Filter by Department',
          key: 'department',
          options: [
            { label: 'Emergency Department', value: 'Emergency Department' },
            { label: 'Inpatient / Ward A', value: 'Inpatient / Ward A' },
            { label: 'Inpatient / Ward B', value: 'Inpatient / Ward B' },
            { label: 'Outpatient / Clinical', value: 'Outpatient / Clinical' },
          ],
          filterFn: (i, val) => i.department === val,
        }}
        pageSize={10}
        exportFileName="bethel_hospital_aging_receivables"
      />

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

      <VoidInvoiceModal
        isOpen={Boolean(activeVoidInvoice)}
        onClose={() => setActiveVoidInvoice(null)}
        invoice={activeVoidInvoice}
      />
    </div>
  );
};
