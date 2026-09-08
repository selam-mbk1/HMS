import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PrescriptionReviewModal } from '../../components/pharmacy/PrescriptionReviewModal';
import { PrescriptionOrder, Medicine, MedicationBatch } from '../../types';
import { 
  Pill, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  History,
  Calendar,
  BookOpen,
  Eye,
  Building2,
  ShieldCheck,
  AlertOctagon,
  Ban
} from 'lucide-react';

export const PharmacyDashboard: React.FC = () => {
  const { medicines, prescriptions, batches, dispensingRecords, updateMedicineStock } = useHospital();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedRxForReview, setSelectedRxForReview] = useState<PrescriptionOrder | null>(null);
  const [stockModalMed, setStockModalMed] = useState<Medicine | null>(null);
  const [stockAdjustQty, setStockAdjustQty] = useState<number>(0);

  // Filter queues
  // Prescriptions awaiting dispensing: PENDING, PENDING_REVIEW, READY_TO_DISPENSE
  const awaitingDispense = prescriptions.filter(
    p => p.status === 'PENDING' || p.status === 'PENDING_REVIEW' || p.status === 'READY_TO_DISPENSE'
  );

  const dispensedPrescriptions = prescriptions.filter(p => p.status === 'DISPENSED');

  const lowStockDrugs = medicines.filter(
    m => (m.stockQuantity <= m.reorderLevel) || m.status === 'LOW_STOCK' || m.status === 'OUT_OF_STOCK'
  );

  const expiringSoonBatches = batches.filter(
    b => b.status === 'EXPIRING_SOON' || (b.status !== 'EXPIRED' && new Date(b.expiryDate) <= new Date('2026-12-31'))
  );

  const todayDispensedCount = dispensingRecords.filter(r => r.dispensedAt.startsWith('2026-09-08')).length || dispensedPrescriptions.length;

  const handleApplyStockAdjust = () => {
    if (!stockModalMed || stockAdjustQty === 0) return;
    updateMedicineStock(stockModalMed.id, stockAdjustQty, 'Direct inventory adjustment');
    setStockModalMed(null);
    setStockAdjustQty(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Hospital Pharmacy Workstation Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <Pill className="w-5 h-5 text-blue-600" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Hospital Pharmacy Workstation
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Dispensary Operational
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bethel St. Paul Specialized Hospital • Main Campus • Central Hospital Pharmacy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span>Staff: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
            <span>•</span>
            <span>Date: <strong className="font-mono">Tuesday, September 8, 2026</strong></span>
          </div>
        </div>

        {/* Quick Navigation Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/pharmacy/prescriptions')}
            className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Prescription Queue ({awaitingDispense.length})</span>
          </button>

          <button
            onClick={() => navigate('/pharmacy/inventory')}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Package className="w-3.5 h-3.5 text-slate-500" />
            <span>Drug Inventory</span>
          </button>

          <button
            onClick={() => navigate('/pharmacy/batches')}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Batch & Expiry</span>
          </button>

          <button
            onClick={() => navigate('/pharmacy/dispensing-history')}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Dispensing History</span>
          </button>

          <button
            onClick={() => navigate('/pharmacy/formulary')}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Formulary</span>
          </button>
        </div>
      </div>

      {/* 4 Standard Required Pharmacy KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <StatCard
            title="Prescriptions Awaiting Dispensing"
            value={awaitingDispense.length}
            icon={Clock}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Orders requiring clinical review"
          />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <StatCard
            title="Low Stock Medicines"
            value={lowStockDrugs.length}
            icon={AlertTriangle}
            iconColor="text-rose-600 bg-rose-50"
            subtitle="At or below reorder threshold"
          />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <StatCard
            title="Expiring Soon"
            value={expiringSoonBatches.length}
            icon={Calendar}
            iconColor="text-amber-600 bg-amber-50"
            subtitle="Batches expiring within 90 days"
          />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <StatCard
            title="Dispensed Today"
            value={todayDispensedCount}
            icon={CheckCircle2}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="Fulfilled patient prescriptions"
          />
        </motion.div>
      </div>

      {/* Primary Work Queue: Prescriptions Awaiting Dispensing */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Prescriptions Awaiting Dispensing
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {awaitingDispense.length} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review doctor orders, check drug interactions, verify batch inventory, and release medications.
            </p>
          </div>

          <button
            onClick={() => navigate('/pharmacy/prescriptions')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Full Prescription Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {awaitingDispense.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Prescription Queue is Clear</p>
            <p className="text-slate-400 mt-1">All outpatient and inpatient doctor orders have been dispensed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Patient Name & ID</th>
                  <th className="py-3 px-4">Prescription ID</th>
                  <th className="py-3 px-4">Doctor & Department</th>
                  <th className="py-3 px-4">Medication(s)</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4">Prescription Date</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {awaitingDispense.map((rx) => {
                  const isStat = rx.priority === 'STAT';
                  const isUrgent = rx.priority === 'URGENT';
                  const totalQty = rx.items.reduce((sum, it) => sum + it.quantity, 0);

                  return (
                    <tr key={rx.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{rx.patientName}</span>
                        <span className="font-mono text-[11px] text-slate-500">{rx.patientId}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {rx.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">{rx.doctorName}</span>
                        <span className="text-[11px] text-slate-500">{rx.department || 'Internal Medicine'}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {rx.items.map((it, i) => (
                            <span key={i} className="block text-slate-800 truncate">
                              • <strong>{it.medicineName}</strong> ({it.dosage}) — {it.frequency}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                        {totalQty}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {rx.createdAt}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isStat ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                            STAT
                          </span>
                        ) : isUrgent ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            URGENT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                            ROUTINE
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={rx.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRxForReview(rx)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 ml-auto cursor-pointer text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Prescription</span>
                        </motion.button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two Grid Tables: Low Stock & Expiring Soon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock & Reorder Alerts Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Low Stock & Reorder Alerts
              </h3>
            </div>
            <button
              onClick={() => navigate('/pharmacy/inventory')}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              View Inventory →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {lowStockDrugs.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                All medications are currently above minimum safety reorder thresholds.
              </div>
            ) : (
              lowStockDrugs.slice(0, 5).map((med) => (
                <div key={med.id} className="p-4 flex items-center justify-between gap-3 text-xs hover:bg-rose-50/20 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block">{med.name} ({med.strength || med.dosageForm})</span>
                    <span className="text-[11px] text-slate-500">{med.category} • Location: {med.shelfLocation}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-600 block text-xs">
                        {med.stockQuantity} units
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Reorder at: {med.reorderLevel}
                      </span>
                    </div>

                    <button
                      onClick={() => setStockModalMed(med)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs shadow-2xs transition cursor-pointer"
                    >
                      Update Stock
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expiring Soon Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Calendar className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Expiring Soon (FEFO Monitoring)
              </h3>
            </div>
            <button
              onClick={() => navigate('/pharmacy/batches')}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              All Batches →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {expiringSoonBatches.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No active batches expiring within the next 90 days.
              </div>
            ) : (
              expiringSoonBatches.slice(0, 5).map((b) => {
                const today = new Date('2026-09-08');
                const exp = new Date(b.expiryDate);
                const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isExpired = diffDays <= 0 || b.status === 'EXPIRED';

                return (
                  <div key={b.id} className="p-4 flex items-center justify-between gap-3 text-xs hover:bg-amber-50/20 transition-colors">
                    <div>
                      <span className="font-bold text-slate-900 block">{b.medicineName}</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Batch: {b.batchNumber} • Qty: {b.quantity} units
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-bold block text-xs ${isExpired ? 'text-rose-600' : 'text-amber-700'}`}>
                        {b.expiryDate}
                      </span>
                      <span className={`text-[10px] font-bold ${isExpired ? 'text-rose-600' : 'text-amber-700'}`}>
                        {isExpired ? 'EXPIRED' : `${diffDays} days left`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Dispensing Activity Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <History className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Recent Dispensing Activity
            </h3>
          </div>
          <button
            onClick={() => navigate('/pharmacy/dispensing-history')}
            className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            Complete History →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Prescription ID</th>
                <th className="py-3 px-4">Medication Supplied</th>
                <th className="py-3 px-4 text-center">Units</th>
                <th className="py-3 px-4">Batch Number</th>
                <th className="py-3 px-4">Dispensed At</th>
                <th className="py-3 px-4">Dispensing Pharmacist</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dispensingRecords.slice(0, 5).map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{rec.patientName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{rec.patientId}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {rec.prescriptionId}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">{rec.medicineName}</span>
                    {rec.dosage && <span className="text-slate-400 font-mono ml-1">({rec.dosage})</span>}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">
                    {rec.quantity}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {rec.batchNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {rec.dispensedAt}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {rec.pharmacistName}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      DISPENSED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Review Modal */}
      <AnimatePresence>
        {selectedRxForReview && (
          <PrescriptionReviewModal
            prescription={selectedRxForReview}
            onClose={() => setSelectedRxForReview(null)}
          />
        )}
      </AnimatePresence>

      {/* Direct Stock Adjustment Modal */}
      <AnimatePresence>
        {stockModalMed && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Update Medicine Stock</h3>
                <button onClick={() => setStockModalMed(null)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-slate-500">Drug: <strong className="text-slate-900">{stockModalMed.name}</strong></p>
                  <p className="text-slate-500">Current Stock: <strong className="font-mono text-blue-700">{stockModalMed.stockQuantity} units</strong></p>
                  <p className="text-slate-500">Reorder Level: <strong className="font-mono text-slate-700">{stockModalMed.reorderLevel} units</strong></p>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Units to Add or Restock (+ quantity)
                  </label>
                  <input
                    type="number"
                    value={stockAdjustQty}
                    onChange={(e) => setStockAdjustQty(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    placeholder="e.g. 50"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Updated stock level will be: <strong>{Math.max(0, stockModalMed.stockQuantity + stockAdjustQty)}</strong> units
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setStockModalMed(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyStockAdjust}
                  disabled={stockAdjustQty === 0}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-xl shadow-xs"
                >
                  Confirm Restock
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
