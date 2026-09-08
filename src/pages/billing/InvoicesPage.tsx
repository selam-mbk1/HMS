import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { Invoice, PaymentTransaction } from '../../types';
import { 
  Receipt, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Printer, 
  FileText, 
  Ban, 
  Plus, 
  Building2, 
  Search,
  Filter
} from 'lucide-react';
import { RecordPaymentModal } from './RecordPaymentModal';
import { ItemizedInvoiceModal } from './ItemizedInvoiceModal';
import { VoidInvoiceModal } from './VoidInvoiceModal';
import { PrintableReceiptModal } from './PrintableReceiptModal';

export const InvoicesPage: React.FC = () => {
  const { invoices, paymentTransactions } = useHospital();
  
  // Modals state
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | undefined>(undefined);
  const [selectedInvoiceForStatement, setSelectedInvoiceForStatement] = useState<Invoice | null>(null);
  const [selectedInvoiceForVoid, setSelectedInvoiceForVoid] = useState<Invoice | null>(null);
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState<PaymentTransaction | null>(null);

  // Financial calculations
  const nonVoided = invoices.filter(i => i.paymentStatus !== 'VOIDED');
  const totalBilled = nonVoided.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalCollected = nonVoided.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalOutstanding = nonVoided.reduce((sum, i) => sum + i.balanceDue, 0);

  const handleOpenReceiptForInvoice = (inv: Invoice) => {
    // Find matching transaction
    const txn = paymentTransactions.find(t => t.invoiceId === inv.id);
    if (txn) {
      setSelectedTransactionForReceipt(txn);
    } else {
      // Create synthetic transaction object for view/print
      const syntheticTxn: PaymentTransaction = {
        id: `TXN-${inv.id}`,
        invoiceId: inv.id,
        patientId: inv.patientId,
        patientName: inv.patientName,
        amount: inv.paidAmount,
        method: inv.paymentMethod || 'CASH',
        referenceNumber: inv.referenceNumber || 'TXN-SETTLED',
        cashierName: inv.recordedBy || 'Ato Samuel Bekele',
        timestamp: inv.issueDate,
        status: 'VERIFIED',
        receiptNumber: inv.receiptNumber || 'REC-SETTLED'
      };
      setSelectedTransactionForReceipt(syntheticTxn);
    }
  };

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice #',
      accessorKey: 'id',
      cell: (inv) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{inv.id}</span>
          <span className="text-[10px] text-slate-400 font-mono">Issued: {inv.issuedDate || inv.issueDate}</span>
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
      header: 'Gross Total (ETB)',
      accessorKey: 'totalAmount',
      cell: (inv) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Paid Amount',
      accessorKey: 'paidAmount',
      cell: (inv) => (
        <span className="font-mono font-semibold text-emerald-700 text-xs">
          {inv.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Balance Due',
      accessorKey: 'balanceDue',
      cell: (inv) => (
        <span className={`font-mono font-bold text-xs ${inv.balanceDue > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
          {inv.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Payment Status',
      accessorKey: 'paymentStatus',
      cell: (inv) => <StatusBadge status={inv.paymentStatus} />,
    },
    {
      header: 'Cashier Actions',
      cell: (inv) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedInvoiceForStatement(inv)}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition shadow-2xs"
            title="View Itemized Statement"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          {inv.balanceDue > 0 && inv.paymentStatus !== 'VOIDED' ? (
            <button
              onClick={() => setSelectedInvoiceForPayment(inv)}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition flex items-center gap-1 active:scale-95"
              title="Record Payment"
            >
              <CreditCard className="w-3 h-3" />
              <span>Settle</span>
            </button>
          ) : inv.paidAmount > 0 ? (
            <button
              onClick={() => handleOpenReceiptForInvoice(inv)}
              className="px-2 py-1 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1"
              title="Print Receipt"
            >
              <Printer className="w-3 h-3 text-slate-500" />
              <span>Receipt</span>
            </button>
          ) : null}

          {inv.paymentStatus !== 'VOIDED' && (
            <button
              onClick={() => setSelectedInvoiceForVoid(inv)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Void Invoice"
            >
              <Ban className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Receipt className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Invoicing & Revenue Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            BETHEL ST. PAUL Specialized Hospital • Outpatient consultations, diagnostic testing, inpatient ward stays, and pharmacy bills.
          </p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Billed Receivables"
          value={`${totalBilled.toLocaleString()} ETB`}
          icon={Receipt}
          iconColor="text-blue-600 bg-blue-50"
          subtitle="Cumulative non-voided hospital bills"
        />
        <StatCard
          title="Settled Revenue Collected"
          value={`${totalCollected.toLocaleString()} ETB`}
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50"
          subtitle="Settled via Telebirr, CBE Birr & Cash"
        />
        <StatCard
          title="Outstanding Patient Balance"
          value={`${totalOutstanding.toLocaleString()} ETB`}
          icon={AlertCircle}
          iconColor="text-rose-600 bg-rose-50"
          subtitle="Active unpaid or partial patient accounts"
        />
      </div>

      {/* Invoices Table */}
      <DataTable
        data={invoices}
        columns={columns}
        searchPlaceholder="Search invoices by patient name, MRN, or invoice ID..."
        searchFilter={(i, q) =>
          i.patientName.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.patientId.toLowerCase().includes(q) ||
          (i.department && i.department.toLowerCase().includes(q))
        }
        filterOptions={{
          label: 'Filter by Status',
          key: 'paymentStatus',
          options: [
            { label: 'Settled (Paid)', value: 'PAID' },
            { label: 'Partially Paid', value: 'PARTIAL' },
            { label: 'Unpaid / Pending', value: 'UNPAID' },
            { label: 'Voided / Cancelled', value: 'VOIDED' },
          ],
          filterFn: (i, val) => i.paymentStatus === val,
        }}
        pageSize={10}
        exportFileName="bethel_st_paul_hospital_invoices"
      />

      {/* Modals */}
      <RecordPaymentModal
        isOpen={Boolean(selectedInvoiceForPayment)}
        onClose={() => setSelectedInvoiceForPayment(undefined)}
        invoice={selectedInvoiceForPayment}
      />

      <ItemizedInvoiceModal
        isOpen={Boolean(selectedInvoiceForStatement)}
        onClose={() => setSelectedInvoiceForStatement(null)}
        invoice={selectedInvoiceForStatement}
        onOpenPayment={(inv) => setSelectedInvoiceForPayment(inv)}
        onOpenVoid={(inv) => setSelectedInvoiceForVoid(inv)}
      />

      <VoidInvoiceModal
        isOpen={Boolean(selectedInvoiceForVoid)}
        onClose={() => setSelectedInvoiceForVoid(null)}
        invoice={selectedInvoiceForVoid}
      />

      <PrintableReceiptModal
        isOpen={Boolean(selectedTransactionForReceipt)}
        onClose={() => setSelectedTransactionForReceipt(null)}
        transaction={selectedTransactionForReceipt}
      />
    </div>
  );
};
