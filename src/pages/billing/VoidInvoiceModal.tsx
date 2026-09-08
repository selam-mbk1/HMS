import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { Invoice } from '../../types';
import { Ban, AlertTriangle } from 'lucide-react';

interface VoidInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

const COMMON_REASONS = [
  'Duplicate clinical order entry in billing ledger',
  'Order cancelled by attending physician prior to drug administration or procedure',
  'Patient transferred or discharged before scheduled inpatient service',
  'Billing item error / Service fee adjusted or not rendered',
  'Approved hospital social welfare indigent care exemption',
  'Insurance re-routing / Third-party corporate policy direct agreement',
  'Other custom justification'
];

export const VoidInvoiceModal: React.FC<VoidInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  const { voidInvoice } = useHospital();
  const [selectedReason, setSelectedReason] = useState(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [confirmAudit, setConfirmAudit] = useState(false);

  if (!invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === 'Other custom justification'
      ? customReason.trim() || 'Custom billing reversal authorized by Finance'
      : selectedReason;

    voidInvoice(invoice.id, finalReason);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Void Invoice: ${invoice.id}`}
      subtitle={`Patient: ${invoice.patientName} (${invoice.patientId})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Warning Banner */}
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-800 space-y-1">
            <p className="font-bold text-rose-900">Permanent Ledger Cancellation Warning</p>
            <p>
              Voiding this invoice will zero out the outstanding balance of{' '}
              <span className="font-bold font-mono text-rose-950">{invoice.balanceDue.toLocaleString()} ETB</span>{' '}
              and mark the record as officially revoked. This action is permanently logged in the Bethel St. Paul Finance Audit Trail.
            </p>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans">Invoice ID:</span>
            <span className="font-bold text-slate-800">{invoice.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans">Gross Amount:</span>
            <span className="text-slate-800">{invoice.totalAmount.toLocaleString()} ETB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans">Current Balance:</span>
            <span className="font-bold text-rose-600">{invoice.balanceDue.toLocaleString()} ETB</span>
          </div>
        </div>

        {/* Reason Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Audit Reason for Revocation *
          </label>
          <select
            value={selectedReason}
            onChange={e => setSelectedReason(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
            required
          >
            {COMMON_REASONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {selectedReason === 'Other custom justification' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Audit Explanation *
            </label>
            <textarea
              value={customReason}
              onChange={e => setCustomReason(e.target.value)}
              placeholder="Provide clinical or accounting justification for reversing this invoice..."
              rows={3}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        )}

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 pt-1">
          <input
            type="checkbox"
            checked={confirmAudit}
            onChange={e => setConfirmAudit(e.target.checked)}
            required
            className="mt-0.5 rounded-sm border-slate-300 text-rose-600 focus:ring-rose-500"
          />
          <span>
            I confirm that I am authorized by the Finance Directorate (Ato Samuel Bekele) to revoke this billable record.
          </span>
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!confirmAudit}
            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95"
          >
            <Ban className="w-4 h-4" />
            Confirm & Void Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
};
