import React, { useRef } from 'react';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Invoice } from '../../types';
import { Printer, CreditCard, Ban, FileText, Building2 } from 'lucide-react';

interface ItemizedInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onOpenPayment?: (invoice: Invoice) => void;
  onOpenVoid?: (invoice: Invoice) => void;
}

export const ItemizedInvoiceModal: React.FC<ItemizedInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onOpenPayment,
  onOpenVoid
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Itemized Medical Statement: ${invoice.id}`}
      subtitle="BETHEL ST. PAUL Specialized Hospital — Main Campus"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Printable Paper Canvas */}
        <div ref={printRef} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs print:border-none print:shadow-none print:p-0 space-y-6 text-slate-800">
          {/* Official Letterhead Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  BSP
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-slate-900 uppercase">
                    Bethel St. Paul Specialized Hospital
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500">
                    Main Campus • Gulele Sub-City, Addis Ababa, Ethiopia • Tel: +251 11 275 8890
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono pl-10">
                TIN: 0049281744 • VAT Reg: EXEMPT (Healthcare Statutory Code #84)
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block">
                <StatusBadge status={invoice.paymentStatus} size="md" />
              </div>
              <p className="text-xs font-mono font-bold text-slate-900 mt-2">{invoice.id}</p>
              <p className="text-[11px] text-slate-500">Issue: {invoice.issueDate}</p>
              <p className="text-[11px] text-slate-500">Due: {invoice.dueDate}</p>
            </div>
          </div>

          {/* Patient & Billing Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Patient Information</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{invoice.patientName}</p>
              <p className="text-slate-600 font-mono mt-0.5">MRN/ID: {invoice.patientId}</p>
              <p className="text-slate-600 font-mono mt-0.5">Phone: {invoice.patientPhone || '+251 91 123 4567'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Account Summary</p>
              <p className="text-slate-600 mt-0.5">Department: <span className="font-semibold text-slate-800">{invoice.department || 'Outpatient / Clinical'}</span></p>
              <p className="text-slate-600 mt-0.5">Attending Cashier: <span className="font-semibold text-slate-800">{invoice.recordedBy || 'Ato Samuel Bekele'}</span></p>
              {invoice.receiptNumber && (
                <p className="text-emerald-700 font-mono font-bold mt-0.5">Receipt: {invoice.receiptNumber}</p>
              )}
            </div>
          </div>

          {/* Itemized Services Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Rendered Medical Services & Billable Supplies
              </h4>
              <span className="text-[11px] text-slate-400">{invoice.items.length} billable line items</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Service / Category</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Total (ETB)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                          {item.serviceCategory}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {item.description}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Totals & Calculation */}
          <div className="flex justify-end pt-2">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Gross:</span>
                <span className="font-mono font-semibold">{invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Welfare / Senior Rebate:</span>
                  <span className="font-mono font-semibold">-{invoice.discount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Healthcare Statutory Tax:</span>
                <span className="font-mono text-[11px]">0.00 ETB (Exempt)</span>
              </div>
              <div className="flex justify-between py-2 border-t border-b border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Invoiced:</span>
                <span className="font-mono">{invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Amount Paid / Settled:</span>
                <span className="font-mono">{invoice.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB</span>
              </div>
              <div className="flex justify-between text-base font-black text-rose-600 pt-1">
                <span>Net Balance Due:</span>
                <span className="font-mono">{invoice.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB</span>
              </div>
            </div>
          </div>

          {/* Voided Details Notice if applicable */}
          {invoice.paymentStatus === 'VOIDED' && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-rose-900">
                <Ban className="w-4 h-4" /> This Invoice Was Officially Voided & Revoked
              </p>
              <p className="text-[11px]">Audit Reason: <span className="italic font-medium">{invoice.voidReason || 'Clinical billing revision'}</span></p>
              <p className="text-[10px] text-rose-600 font-mono">Voided By: {invoice.voidedBy || 'Ato Samuel Bekele'} on {invoice.voidedAt}</p>
            </div>
          )}

          {/* Hospital Seal & Certification Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-end justify-between text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">Finance & Medical Billing Directorate</p>
              <p>Bethel St. Paul Specialized Hospital</p>
              <p className="text-[10px] font-mono text-slate-400 mt-1">Certified System Generated Document • No manual alterations permitted</p>
            </div>
            <div className="text-right border-t border-slate-300 pt-2 min-w-40">
              <p className="font-bold text-slate-800">Ato Samuel Bekele</p>
              <p className="text-[10px] text-slate-400">Chief Medical Accountant & Cashier</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {invoice.paymentStatus !== 'VOIDED' && onOpenVoid && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVoid(invoice);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex items-center gap-1.5 active:scale-95"
              >
                <Ban className="w-3.5 h-3.5" />
                Void Invoice
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Print Statement
            </button>

            {invoice.balanceDue > 0 && invoice.paymentStatus !== 'VOIDED' && onOpenPayment && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPayment(invoice);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                Record Payment ({invoice.balanceDue.toLocaleString()} ETB)
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
