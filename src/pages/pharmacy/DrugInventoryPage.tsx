import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Medicine } from '../../types';
import { Pill, AlertTriangle, Package, Calendar, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DrugInventoryPage: React.FC = () => {
  const { medicines, updateMedicineStock, addMedicine } = useHospital();
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('');

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newMedForm, setNewMedForm] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotic',
    unit: 'Tablets',
    strength: '500mg',
    pricePerUnit: 25,
    stockQuantity: 100,
    reorderLevel: 30,
    batchNumber: 'AMP-2026-05',
    expiryDate: '2027-04-30',
    shelfLocation: 'Shelf C-01',
    status: 'IN_STOCK' as const
  });

  const handleAdjustStock = () => {
    if (!selectedMed || adjustQty === 0) return;
    updateMedicineStock(selectedMed.id, adjustQty, adjustReason || 'Physical inventory reconciliation');
    setSelectedMed(null);
    setAdjustQty(0);
    setAdjustReason('');
  };

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedForm.name || !newMedForm.genericName) return;
    addMedicine({
      name: newMedForm.name,
      genericName: newMedForm.genericName,
      category: newMedForm.category,
      unit: newMedForm.unit,
      strength: newMedForm.strength,
      pricePerUnit: Number(newMedForm.pricePerUnit),
      stockQuantity: Number(newMedForm.stockQuantity),
      currentStock: Number(newMedForm.stockQuantity),
      minimumStock: Number(newMedForm.reorderLevel),
      reorderLevel: Number(newMedForm.reorderLevel),
      batchNumber: newMedForm.batchNumber,
      expiryDate: newMedForm.expiryDate,
      shelfLocation: newMedForm.shelfLocation,
      status: Number(newMedForm.stockQuantity) > Number(newMedForm.reorderLevel) ? 'IN_STOCK' : 'LOW_STOCK'
    });
    setShowAddModal(false);
    setNewMedForm({
      name: '',
      genericName: '',
      category: 'Antibiotic',
      unit: 'Tablets',
      strength: '500mg',
      pricePerUnit: 25,
      stockQuantity: 100,
      reorderLevel: 30,
      batchNumber: 'AMP-2026-05',
      expiryDate: '2027-04-30',
      shelfLocation: 'Shelf C-01',
      status: 'IN_STOCK'
    });
  };

  const columns: Column<Medicine>[] = [
    {
      header: 'Drug Formulation & Generic',
      cell: (m) => (
        <div>
          <span className="font-bold text-slate-900 block text-xs">{m.name}</span>
          <span className="text-[11px] text-slate-500 italic">Generic: {m.genericName} • {m.strength}</span>
        </div>
      ),
    },
    {
      header: 'Therapeutic Category',
      accessorKey: 'category',
      cell: (m) => (
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-xs">
          {m.category}
        </span>
      ),
    },
    {
      header: 'Form & Location',
      cell: (m) => (
        <div>
          <span className="font-semibold text-slate-800 font-mono text-xs">{m.unit}</span>
          <span className="text-[11px] text-slate-500 block">Loc: {m.shelfLocation}</span>
        </div>
      ),
    },
    {
      header: 'Stock Inventory',
      cell: (m) => {
        const qty = m.stockQuantity ?? m.currentStock ?? 0;
        const reorder = m.reorderLevel ?? m.minimumStock ?? 0;
        const isLow = qty <= reorder;
        return (
          <div>
            <div className="flex items-center gap-1.5 font-bold font-mono text-xs">
              <span className={isLow ? 'text-rose-600' : 'text-slate-900'}>{qty}</span>
              <span className="text-slate-400 font-normal">/ min {reorder}</span>
            </div>
            {isLow && (
              <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5 mt-0.5">
                <AlertTriangle className="w-3 h-3" /> Reorder Needed
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Unit Price (ETB)',
      accessorKey: 'pricePerUnit',
      cell: (m) => <span className="font-mono font-bold text-slate-900 text-xs">{m.pricePerUnit ?? m.unitPrice ?? 0} ETB</span>,
    },
    {
      header: 'Batch # & Expiry',
      cell: (m) => (
        <div>
          <span className="font-mono text-xs text-slate-700 block">Batch: {m.batchNumber}</span>
          <span className="font-mono text-[11px] text-slate-500">Exp: {m.expiryDate}</span>
        </div>
      ),
    },
    {
      header: 'Availability',
      accessorKey: 'status',
      cell: (m) => <StatusBadge status={m.status} />,
    },
    {
      header: 'Actions',
      cell: (m) => (
        <button
          onClick={() => setSelectedMed(m)}
          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition cursor-pointer"
        >
          Adjust Stock
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Drug Formulary & Inventory
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pharmaceutical stock monitoring, minimum thresholds, batch tracking, and pricing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Medicine</span>
        </button>
      </div>

      <DataTable
        data={medicines}
        columns={columns}
        searchPlaceholder="Search medications by brand name, generic title, or batch..."
        searchFilter={(m, q) =>
          m.name.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.batchNumber.toLowerCase().includes(q)
        }
        filterOptions={{
          label: 'Category',
          key: 'category',
          options: [
            { label: 'Antihypertensive', value: 'Antihypertensive' },
            { label: 'Antidiabetic', value: 'Antidiabetic' },
            { label: 'Antibiotic', value: 'Antibiotic' },
            { label: 'Analgesic', value: 'Analgesic' },
            { label: 'Antiasthmatic', value: 'Antiasthmatic' },
            { label: 'Cardiovascular', value: 'Cardiovascular' },
          ],
          filterFn: (m, val) => m.category === val,
        }}
        pageSize={8}
        exportFileName="hospital_drug_formulary"
      />

      {/* Adjust Stock Modal */}
      <AnimatePresence>
        {selectedMed && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Adjust Medication Stock</h3>
                <button onClick={() => setSelectedMed(null)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-slate-500">Medication: <strong className="text-slate-900">{selectedMed.name}</strong></p>
                  <p className="text-slate-500">Current Stock: <strong className="font-mono text-blue-700">{selectedMed.stockQuantity} {selectedMed.unit}</strong></p>
                  <p className="text-slate-500">Reorder Threshold: <strong className="font-mono text-slate-700">{selectedMed.reorderLevel} {selectedMed.unit}</strong></p>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Stock Adjustment (+ to add, - to subtract)
                  </label>
                  <input
                    type="number"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    placeholder="e.g. +50 or -10"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    New total: <strong>{Math.max(0, selectedMed.stockQuantity + adjustQty)}</strong> {selectedMed.unit}
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Reason for Adjustment</label>
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="e.g. Routine shipment received, physical audit correction..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedMed(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdjustStock}
                  disabled={adjustQty === 0}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-xl shadow-xs"
                >
                  Save Adjustment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Medicine Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Register Medicine to Formulary</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
              </div>

              <form onSubmit={handleCreateMedicine} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Brand Name *</label>
                    <input
                      required
                      type="text"
                      value={newMedForm.name}
                      onChange={(e) => setNewMedForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Ciprofloxacin"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Generic Name *</label>
                    <input
                      required
                      type="text"
                      value={newMedForm.genericName}
                      onChange={(e) => setNewMedForm(p => ({ ...p, genericName: e.target.value }))}
                      placeholder="e.g. Ciprofloxacin HCl"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newMedForm.category}
                      onChange={(e) => setNewMedForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-2.5 py-2 border border-slate-200 rounded-xl outline-hidden bg-white"
                    >
                      <option value="Antibiotic">Antibiotic</option>
                      <option value="Antihypertensive">Antihypertensive</option>
                      <option value="Antidiabetic">Antidiabetic</option>
                      <option value="Analgesic">Analgesic</option>
                      <option value="Antiasthmatic">Antiasthmatic</option>
                      <option value="Cardiovascular">Cardiovascular</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Strength</label>
                    <input
                      type="text"
                      value={newMedForm.strength}
                      onChange={(e) => setNewMedForm(p => ({ ...p, strength: e.target.value }))}
                      placeholder="e.g. 500mg"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Packaging Unit</label>
                    <input
                      type="text"
                      value={newMedForm.unit}
                      onChange={(e) => setNewMedForm(p => ({ ...p, unit: e.target.value }))}
                      placeholder="e.g. Tablets"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Initial Stock</label>
                    <input
                      type="number"
                      value={newMedForm.stockQuantity}
                      onChange={(e) => setNewMedForm(p => ({ ...p, stockQuantity: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Reorder Level</label>
                    <input
                      type="number"
                      value={newMedForm.reorderLevel}
                      onChange={(e) => setNewMedForm(p => ({ ...p, reorderLevel: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Price (ETB)</label>
                    <input
                      type="number"
                      value={newMedForm.pricePerUnit}
                      onChange={(e) => setNewMedForm(p => ({ ...p, pricePerUnit: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Batch Number</label>
                    <input
                      type="text"
                      value={newMedForm.batchNumber}
                      onChange={(e) => setNewMedForm(p => ({ ...p, batchNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={newMedForm.expiryDate}
                      onChange={(e) => setNewMedForm(p => ({ ...p, expiryDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Shelf Location</label>
                    <input
                      type="text"
                      value={newMedForm.shelfLocation}
                      onChange={(e) => setNewMedForm(p => ({ ...p, shelfLocation: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                  >
                    Save Medicine
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
