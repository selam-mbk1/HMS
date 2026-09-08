import React, { useRef } from 'react';
import { Modal } from '../../components/common/Modal';
import { PaymentTransaction, Invoice } from '../../types';
import { Printer, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface PrintableReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
  invoice?: Invoice | null;
}

export const PrintableReceiptModal: React.FC<PrintableReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  invoice
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'TELEBIRR':
        return 'Telebirr (Ethio Telecom Mobile Money)';
      case 'CBE_BIRR':
        return 'CBE Birr (Commercial Bank of Ethiopia)';
      case 'CASH':
        return 'Physical Cash Currency (Cashier Counter)';
      case 'BANK_TRANSFER':
        return 'Direct Bank Wire / Electronic Transfer';
      case 'CREDIT_CARD':
        return 'POS Terminal Electronic Debit Card';
      case 'INSURANCE':
        return 'Third-Party Health Insurance Guarantee';
      default:
        return method;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Official Payment Receipt: ${transaction.receiptNumber || transaction.id}`}
      subtitle="BETHEL ST. PAUL Specialized Hospital — Main Campus"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Printable Official Receipt Canvas */}
        <div 
          ref={printRef} 
          className="p-6 bg-amber-50/20 border-2 border-dashed border-slate-300 rounded-2xl shadow-xs print:border-none print:shadow-none print:p-0 space-y-5 text-slate-800"
        >
          {/* Header */}
          <div className="text-center border-b border-slate-200 pb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-base shadow-xs mb-2">
              BSP
            </div>
            <h3 className="text-base font-black tracking-tight text-slate-900 uppercase">
              Bethel St. Paul Specialized Hospital
            </h3>
            <p className="text-xs font-semibold text-slate-600">
              Finance Directorate • Medical Billing & Cashier Department
            </p>
            <p className="text-[11px] text-slate-500">
              Main Campus • Gulele Sub-City, Addis Ababa, Ethiopia • Tel: +251 11 275 8890
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              OFFICIAL CASH RECEIPT / VOUCHER
            </div>
          </div>

          {/* Key Reference Bar */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Receipt Number:</span>
              <span className="font-bold text-slate-900 text-sm">{transaction.receiptNumber || 'REC-2026-7104'}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Transaction Reference:</span>
              <span className="font-semibold text-slate-800">{transaction.referenceNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Date & Time:</span>
              <span className="text-slate-700">{transaction.timestamp}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Invoice Ref:</span>
              <span className="font-bold text-blue-700">{transaction.invoiceId}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 text-xs bg-white p-4 border border-slate-200 rounded-xl">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Received From (Patient):</span>
              <span className="font-bold text-slate-900">{transaction.patientName} ({transaction.patientId})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payment Channel / Gateway:</span>
              <span className="font-medium text-slate-800">{getMethodLabel(transaction.method)}</span>
            </div>
            {transaction.notes && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Cashier Memo:</span>
                <span className="text-slate-700 italic">{transaction.notes}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-bold text-slate-900">Total Birr Received:</span>
              <div className="text-right">
                <span className="text-xl font-black font-mono text-emerald-700">
                  {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                </span>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                  Statutory Healthcare VAT: 0.00 ETB (Exempt)
                </p>
              </div>
            </div>
          </div>

          {/* Stamp & Security Verification */}
          <div className="flex items-end justify-between pt-2 border-t border-slate-200 text-[11px]">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                VERIFIED BY HOSPITAL FINANCE AUDIT
              </div>
              <p className="text-slate-500">Authorized Cashier: <span className="font-bold text-slate-800">{transaction.cashierName}</span></p>
              <p className="text-[10px] text-slate-400 font-mono">Terminal ID: BSP-POS-01 • Server Validated</p>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
              <QrCode className="w-8 h-8 text-slate-700" />
              <div className="text-[9px] text-slate-500 leading-tight">
                <p className="font-bold text-slate-800">DIGITAL AUDIT STAMP</p>
                <p>{transaction.referenceNumber}</p>
                <p>Bethel St. Paul Hospital</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Print Hospital Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
};
