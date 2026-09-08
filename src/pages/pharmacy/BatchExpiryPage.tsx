import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MedicationBatch } from '../../types';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Package, 
  Ban, 
  ShieldAlert,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BatchExpiryPage: React.FC = () => {
  const { batches, medicines, adjustBatchStock } = useHospital();
  const [selectedBatch, setSelectedBatch] = useState<MedicationBatch | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustNote, setAdjustNote] = useState<string>('');

  // Calculate stats
  const activeBatches = batches.filter(b => b.status === 'ACTIVE');
  const expiringSoonBatches = batches.filter(b => b.status === 'EXPIRING_SOON' || (b.status !== 'EXPIRED' && new Date(b.expiryDate) <= new Date('2026-12-31')));
  const expiredBatches = batches.filter(b => b.status === 'EXPIRED');

  const handleApplyAdjustment = () => {
    if (!selectedBatch || adjustQty === 0) return;
    adjustBatchStock(selectedBatch.id, adjustQty, adjustNote || 'Physical inventory reconciliation');
    setSelectedBatch(null);
    setAdjustQty(0);
    setAdjustNote('');
  };

  const columns: Column<MedicationBatch>[] = [
    {
      header: 'Batch Number',
      accessorKey: 'batchNumber',
      cell: (b) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{b.batchNumber}</span>
          <span className="text-[10px] text-slate-400 block font-mono">Lot ID: {b.id}</span>
        </div>
      ),
    },
    {
      header: 'Medication Formulation',
      cell: (b) => {
        const med = medicines.find(m => m.id === b.medicineId);
        return (
          <div>
            <span className="font-bold text-slate-900 block text-xs">{b.medicineName}</span>
            <span className="text-[11px] text-slate-500">{med?.category || 'Pharmaceutical'} • {med?.shelfLocation || 'Main Store'}</span>
          </div>
        );
      },
    },
    {
      header: 'Expiry Date',
      accessorKey: 'expiryDate',
      cell: (b) => {
        const today = new Date('2026-09-08');
        const exp = new Date(b.expiryDate);
        const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isExp = diffDays <= 0 || b.status === 'EXPIRED';
        const isWarning = !isExp && diffDays <= 90;

        return (
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-mono font-bold text-xs ${isExp ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-800'}`}>
                {b.expiryDate}
              </span>
            </div>
            <span className={`text-[10px] font-bold block ${isExp ? 'text-rose-700' : isWarning ? 'text-amber-700' : 'text-slate-400'}`}>
              {isExp ? 'EXPIRED' : `${diffDays} days remaining`}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Available Stock',
      cell: (b) => (
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className={`font-bold ${b.quantity === 0 ? 'text-slate-400' : b.quantity <= 30 ? 'text-amber-600' : 'text-slate-900'}`}>
              {b.quantity} units
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Initial: {b.initialQuantity}</span>
        </div>
      ),
    },
    {
      header: 'Batch Status',
      accessorKey: 'status',
      cell: (b) => {
        if (b.status === 'EXPIRED') {
          return (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 w-fit">
              <Ban className="w-3 h-3" /> EXPIRED
            </span>
          );
        }
        if (b.status === 'EXPIRING_SOON') {
          return (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit">
              <AlertTriangle className="w-3 h-3" /> EXPIRING SOON
            </span>
          );
        }
        if (b.status === 'DEPLETED') {
          return (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 w-fit block">
              DEPLETED
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" /> ACTIVE
          </span>
        );
      },
    },
    {
      header: 'Actions',
      cell: (b) => (
        <button
          onClick={() => setSelectedBatch(b)}
          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition cursor-pointer"
        >
          Reconcile Stock
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Medication Batch & Expiry Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Lot traceability, expiry monitoring, quarantine safeguards, and pharmacy batch inventory.
          </p>
        </div>
      </div>

      {/* Expiry KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Active Batches</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{activeBatches.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Approved for active dispensing</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">Expiring Soon (≤ 90 Days)</span>
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-950 mt-2">{expiringSoonBatches.length}</p>
          <span className="text-[11px] text-amber-700 mt-0.5 block">Priority for FEFO (First-Expired-First-Out)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-900">Expired Batches</span>
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <Ban className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-rose-950 mt-2">{expiredBatches.length}</p>
          <span className="text-[11px] text-rose-700 mt-0.5 block">Locked from dispensing • Quarantine</span>
        </div>
      </div>

      {/* Main Batches DataTable */}
      <DataTable
        data={batches}
        columns={columns}
        searchPlaceholder="Search by batch number, medication name, or lot ID..."
        searchFilter={(b, q) =>
          b.batchNumber.toLowerCase().includes(q) ||
          b.medicineName.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
        }
        filterOptions={{
          label: 'Status',
          key: 'status',
          options: [
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Expiring Soon', value: 'EXPIRING_SOON' },
            { label: 'Expired', value: 'EXPIRED' },
            { label: 'Depleted', value: 'DEPLETED' },
          ],
          filterFn: (b, val) => b.status === val,
        }}
        pageSize={8}
        exportFileName="hospital_medication_batches"
      />

      {/* Reconciliation Modal */}
      <AnimatePresence>
        {selectedBatch && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Reconcile Batch Stock</h3>
                </div>
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-slate-500">Medication: <strong className="text-slate-900">{selectedBatch.medicineName}</strong></p>
                  <p className="text-slate-500">Batch Number: <strong className="font-mono text-slate-900">{selectedBatch.batchNumber}</strong></p>
                  <p className="text-slate-500">Current Recorded Units: <strong className="font-mono text-blue-700">{selectedBatch.quantity}</strong></p>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Stock Adjustment Quantity (+ to add, - to reduce)
                  </label>
                  <input
                    type="number"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    placeholder="+10 or -5"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    New total will be: <strong>{Math.max(0, selectedBatch.quantity + adjustQty)}</strong> units
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Audit Reason / Notes</label>
                  <input
                    type="text"
                    value={adjustNote}
                    onChange={(e) => setAdjustNote(e.target.value)}
                    placeholder="e.g. Broken vial during handling, physical audit count..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyAdjustment}
                  disabled={adjustQty === 0}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-xl shadow-xs"
                >
                  Save Stock Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
