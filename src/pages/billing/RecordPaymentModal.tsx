import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { Invoice, PaymentMethod } from '../../types';
import { Receipt, CheckCircle2 } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  const { recordPayment } = useHospital();

  const [paymentAmount, setPaymentAmount] = useState<number>(invoice?.balanceDue || 0);
  const [method, setMethod] = useState<PaymentMethod>('TELEBIRR');
  const [refNumber, setRefNumber] = useState(`TX-${Math.floor(100000 + Math.random() * 900000)}`);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (invoice) {
      setPaymentAmount(invoice.balanceDue);
      setRefNumber(`TX-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [invoice]);

  if (!invoice) return null;

  const remainingAfterPayment = Math.max(0, invoice.balanceDue - paymentAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordPayment({
      invoiceId: invoice.id,
      patientId: invoice.patientId,
      amount: Number(paymentAmount),
      method,
      referenceNumber: refNumber,
      cashierName: 'Rahel Desta (Billing)',
      notes
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Process Payment: Invoice ${invoice.id}`}
      subtitle={`Patient: ${invoice.patientName} (${invoice.patientId})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Financial Overview Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Gross Invoiced Amount:</span>
            <span className="font-semibold text-slate-800">{invoice.totalAmount.toLocaleString()} ETB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Previous Amount Settled:</span>
            <span className="font-semibold text-emerald-700">{invoice.paidAmount.toLocaleString()} ETB</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
            <span className="text-slate-900">Current Outstanding Balance:</span>
            <span className="text-rose-600 font-mono">{invoice.balanceDue.toLocaleString()} ETB</span>
          </div>
        </div>

        {/* Payment Amount */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700">Amount to Pay Now (ETB) *</label>
            <button
              type="button"
              onClick={() => setPaymentAmount(invoice.balanceDue)}
              className="text-[11px] text-blue-600 hover:underline font-medium"
            >
              Pay Full Balance ({invoice.balanceDue} ETB)
            </button>
          </div>
          <input
            type="number"
            max={invoice.balanceDue}
            min={1}
            value={paymentAmount}
            onChange={e => setPaymentAmount(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm font-bold font-mono border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            required
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>Remaining balance after this transaction:</span>
            <span className="font-bold text-slate-800 font-mono">{remainingAfterPayment.toLocaleString()} ETB</span>
          </div>
        </div>

        {/* Payment Channel / Gateway */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payment Method / Gateway</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'TELEBIRR', name: 'Telebirr', sub: 'Ethio Telecom' },
              { id: 'CBE_BIRR', name: 'CBE Birr', sub: 'Commercial Bank' },
              { id: 'CASH', name: 'Hospital Cashier', sub: 'Physical Currency' },
              { id: 'INSURANCE', name: 'Insurance Claim', sub: 'Third-Party Payer' },
              { id: 'BANK_TRANSFER', name: 'Bank Wire', sub: 'Awash / Dashen' },
              { id: 'CREDIT_CARD', name: 'POS Card', sub: 'Debit / Credit' }
            ].map(gateway => (
              <button
                key={gateway.id}
                type="button"
                onClick={() => setMethod(gateway.id as PaymentMethod)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  method === gateway.id
                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/30'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold text-slate-900">{gateway.name}</p>
                <p className="text-[10px] text-slate-500">{gateway.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Gateway Transaction ID / Reference */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Receipt / Gateway Transaction Ref *
          </label>
          <input
            type="text"
            value={refNumber}
            onChange={e => setRefNumber(e.target.value)}
            placeholder="e.g. TB-98234823 or Receipt #4092"
            required
            className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-hidden"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Remarks</label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Optional cashier notes or patient memo"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
          />
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Issue Official Hospital Receipt
          </button>
        </div>
      </form>
    </Modal>
  );
};
