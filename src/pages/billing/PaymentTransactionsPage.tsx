import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatCard } from '../../components/common/StatCard';
import { PaymentTransaction } from '../../types';
import { 
  CreditCard, 
  CheckCircle2, 
  Printer, 
  ShieldCheck, 
  Receipt, 
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';
import { PrintableReceiptModal } from './PrintableReceiptModal';

export const PaymentTransactionsPage: React.FC = () => {
  const { paymentTransactions } = useHospital();
  const [activeReceiptTxn, setActiveReceiptTxn] = useState<PaymentTransaction | null>(null);

  const totalCollected = paymentTransactions.reduce((sum, t) => sum + t.amount, 0);
  const telebirrTotal = paymentTransactions.filter(t => t.method === 'TELEBIRR').reduce((sum, t) => sum + t.amount, 0);
  const cbeTotal = paymentTransactions.filter(t => t.method === 'CBE_BIRR').reduce((sum, t) => sum + t.amount, 0);
  const cashTotal = paymentTransactions.filter(t => t.method === 'CASH').reduce((sum, t) => sum + t.amount, 0);

  const columns: Column<PaymentTransaction>[] = [
    {
      header: 'Receipt #',
      accessorKey: 'receiptNumber',
      cell: (txn) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {txn.receiptNumber || txn.id}
        </span>
      ),
    },
    {
      header: 'Invoice Ref',
      accessorKey: 'invoiceId',
      cell: (txn) => (
        <span className="font-mono font-semibold text-blue-600 text-xs">
          {txn.invoiceId}
        </span>
      ),
    },
    {
      header: 'Patient Details',
      cell: (txn) => (
        <div>
          <span className="font-bold text-slate-900 block">{txn.patientName}</span>
          <span className="font-mono text-[11px] text-slate-500">{txn.patientId}</span>
        </div>
      ),
    },
    {
      header: 'Gateway Channel',
      accessorKey: 'method',
      cell: (txn) => {
        let badgeStyle = 'bg-blue-100 text-blue-800';
        if (txn.method === 'CBE_BIRR') badgeStyle = 'bg-purple-100 text-purple-800';
        if (txn.method === 'CASH') badgeStyle = 'bg-emerald-100 text-emerald-800';
        if (txn.method === 'BANK_TRANSFER') badgeStyle = 'bg-amber-100 text-amber-800';

        return (
          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md ${badgeStyle}`}>
            {txn.method}
          </span>
        );
      },
    },
    {
      header: 'Audit Reference #',
      accessorKey: 'referenceNumber',
      cell: (txn) => (
        <span className="font-mono text-slate-700 text-xs">
          {txn.referenceNumber}
        </span>
      ),
    },
    {
      header: 'Settlement Date',
      accessorKey: 'timestamp',
      cell: (txn) => (
        <span className="text-slate-600 text-xs">
          {txn.timestamp}
        </span>
      ),
    },
    {
      header: 'Amount Paid (ETB)',
      accessorKey: 'amount',
      cell: (txn) => (
        <span className="font-mono font-bold text-emerald-700 text-xs">
          {txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
        </span>
      ),
    },
    {
      header: 'Attending Cashier',
      accessorKey: 'cashierName',
      cell: (txn) => (
        <span className="text-slate-600 text-xs font-medium">
          {txn.cashierName}
        </span>
      ),
    },
    {
      header: 'Audit Status',
      cell: () => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          VERIFIED
        </span>
      ),
    },
    {
      header: 'Action',
      cell: (txn) => (
        <button
          type="button"
          onClick={() => setActiveReceiptTxn(txn)}
          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition inline-flex items-center gap-1 shadow-2xs active:scale-95"
          title="Print Official Hospital Receipt"
        >
          <Printer className="w-3 h-3 text-slate-500" />
          <span>Receipt</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Payment Transactions Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            BETHEL ST. PAUL Specialized Hospital • Real-time cashier collections, digital gateway payments (Telebirr & CBE Birr), and audit receipts.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Settled Revenue"
          value={`${totalCollected.toLocaleString()} ETB`}
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50"
          subtitle={`${paymentTransactions.length} settled ledger transactions`}
        />
        <StatCard
          title="Telebirr Collections"
          value={`${telebirrTotal.toLocaleString()} ETB`}
          icon={CreditCard}
          iconColor="text-blue-600 bg-blue-50"
          subtitle="Ethio Telecom Mobile Money"
        />
        <StatCard
          title="CBE Birr Collections"
          value={`${cbeTotal.toLocaleString()} ETB`}
          icon={Receipt}
          iconColor="text-purple-600 bg-purple-50"
          subtitle="Commercial Bank of Ethiopia"
        />
        <StatCard
          title="Cashier Counter Cash"
          value={`${cashTotal.toLocaleString()} ETB`}
          icon={DollarSign}
          iconColor="text-emerald-600 bg-emerald-50"
          subtitle="Physical cash currency received"
        />
      </div>

      {/* Transactions Data Table */}
      <DataTable
        data={paymentTransactions}
        columns={columns}
        searchPlaceholder="Search by receipt #, patient name, MRN, or transaction ref..."
        searchFilter={(t, q) =>
          t.patientName.toLowerCase().includes(q) ||
          t.patientId.toLowerCase().includes(q) ||
          t.invoiceId.toLowerCase().includes(q) ||
          (t.receiptNumber && t.receiptNumber.toLowerCase().includes(q)) ||
          t.referenceNumber.toLowerCase().includes(q)
        }
        filterOptions={{
          label: 'Payment Gateway',
          key: 'method',
          options: [
            { label: 'Telebirr', value: 'TELEBIRR' },
            { label: 'CBE Birr', value: 'CBE_BIRR' },
            { label: 'Cashier Cash', value: 'CASH' },
            { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
          ],
          filterFn: (t, val) => t.method === val,
        }}
        pageSize={10}
        exportFileName="bethel_hospital_payment_transactions"
      />

      <PrintableReceiptModal
        isOpen={Boolean(activeReceiptTxn)}
        onClose={() => setActiveReceiptTxn(null)}
        transaction={activeReceiptTxn}
      />
    </div>
  );
};
