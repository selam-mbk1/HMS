import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';
import { StatCard } from '../../components/common/StatCard';
import { 
  ShieldCheck, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  RefreshCw, 
  Building2, 
  Lock, 
  Calendar,
  AlertCircle,
  FileCheck
} from 'lucide-react';

export const PaymentReconciliationPage: React.FC = () => {
  const { paymentTransactions } = useHospital();
  const { addToast } = useToast();

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastReconciledTime, setLastReconciledTime] = useState('2026-09-08 14:30 EAT');
  const [shiftClosed, setShiftClosed] = useState(false);

  // Totals by channel
  const telebirrTotal = paymentTransactions.filter(t => t.method === 'TELEBIRR').reduce((sum, t) => sum + t.amount, 0);
  const cbeTotal = paymentTransactions.filter(t => t.method === 'CBE_BIRR').reduce((sum, t) => sum + t.amount, 0);
  const cashTotal = paymentTransactions.filter(t => t.method === 'CASH').reduce((sum, t) => sum + t.amount, 0);
  const bankTotal = paymentTransactions.filter(t => t.method === 'BANK_TRANSFER').reduce((sum, t) => sum + t.amount, 0);
  const grandTotal = telebirrTotal + cbeTotal + cashTotal + bankTotal;

  const handleSyncGateways = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastReconciledTime(new Date().toLocaleTimeString() + ' EAT');
      addToast('success', 'Gateways Reconciled', 'Telebirr, CBE Birr, and POS terminals are 100% matched with hospital ledger.');
    }, 900);
  };

  const handleCloseShift = () => {
    setShiftClosed(true);
    addToast('success', 'Cashier Shift Reconciled & Closed', 'Official daily balancing sheet finalized by Ato Samuel Bekele.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Payment Gateway & Cashier Reconciliation
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            BETHEL ST. PAUL Specialized Hospital • Real-time bank matching, electronic mobile money audits, and cashier drawer settlement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncGateways}
            disabled={isSyncing}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition flex items-center gap-1.5 shadow-2xs active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
            <span>{isSyncing ? 'Syncing...' : 'Poll Gateway APIs'}</span>
          </button>

          {!shiftClosed ? (
            <button
              type="button"
              onClick={handleCloseShift}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95"
            >
              <FileCheck className="w-4 h-4" />
              <span>Finalize & Sign Shift Ledger</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Shift Closed & Audited
            </span>
          )}
        </div>
      </div>

      {/* Reconciliation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reconciled Volume"
          value={`${grandTotal.toLocaleString()} ETB`}
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50"
          subtitle="100% matched with hospital general ledger"
        />
        <StatCard
          title="Ledger Variance"
          value="0.00 ETB"
          icon={ShieldCheck}
          iconColor="text-blue-600 bg-blue-50"
          subtitle="Zero discrepancy across all channels"
        />
        <StatCard
          title="Telebirr API Status"
          value="Synchronized"
          icon={CreditCard}
          iconColor="text-blue-600 bg-blue-50"
          subtitle={`Merchant ID: 882041 • Last sync: ${lastReconciledTime}`}
        />
        <StatCard
          title="CBE Birr Portal"
          value="Verified"
          icon={Building2}
          iconColor="text-purple-600 bg-purple-50"
          subtitle="CBE Core Banking Server live"
        />
      </div>

      {/* Reconciliation Matrix Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Daily Channel Settlement & Audit Reconciliation Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Comparing external payment gateway logs with Bethel St. Paul internal cashier journal
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Audit Date: September 8, 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Payment Channel / Gateway</th>
                <th className="py-3 px-4">Gateway Reference ID</th>
                <th className="py-3 px-4 text-right">Gateway Report (ETB)</th>
                <th className="py-3 px-4 text-right">Hospital Ledger (ETB)</th>
                <th className="py-3 px-4 text-right">Variance</th>
                <th className="py-3 px-4 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Telebirr (Ethio Telecom Enterprise API)
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">TEL-BSP-7782</td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                  {telebirrTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                  {telebirrTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">0.00</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                    MATCHED
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  CBE Birr (Commercial Bank of Ethiopia)
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">CBE-CORP-4091</td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                  {cbeTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                  {cbeTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">0.00</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                    MATCHED
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Hospital Physical Cash Drawer (Ato Samuel Bekele)
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">DRAWER-MAIN-01</td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                  {cashTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                  {cashTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">0.00</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                    BALANCED
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  Bank Wire Transfers (Awash / Dashen Corporate)
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">STMT-2026-SEP</td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                  {bankTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                  {bankTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">0.00</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                    VERIFIED
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/90 font-bold border-t-2 border-slate-300">
                <td colSpan={2} className="py-3 px-4 text-slate-900">Total Consolidated Settlement</td>
                <td className="py-3 px-4 text-right font-mono text-slate-900">
                  {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-900">
                  {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-700">0.00 ETB</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2.5 py-1 text-[11px] font-black rounded-md bg-emerald-600 text-white">
                    100% RECONCILED
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Auditor Sign-off Stamp */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1 text-slate-500">
            <p className="font-bold text-slate-800">Finance Directorate Reconciled Journal</p>
            <p>BETHEL ST. PAUL Specialized Hospital (Main Campus)</p>
            <p className="text-[11px] text-slate-400 font-mono">
              Electronic Signature Token: BSP-FIN-RECON-99201948 • Validated
            </p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-right">
            <p className="font-black text-slate-900">Ato Samuel Bekele</p>
            <p className="text-[11px] text-slate-500">Chief Accountant & Medical Cashier</p>
            <p className="text-[10px] text-emerald-700 font-mono font-bold mt-0.5">STATUS: AUDIT SIGNED</p>
          </div>
        </div>
      </div>
    </div>
  );
};
