import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Pill, 
  User, 
  Clock, 
  Calendar, 
  Building2, 
  FileText, 
  Package, 
  History, 
  AlertOctagon,
  MessageSquareWarning,
  Check,
  Ban
} from 'lucide-react';
import { PrescriptionOrder, Medicine, MedicationBatch, Patient, DispensingRecord } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';

interface PrescriptionReviewModalProps {
  prescription: PrescriptionOrder;
  onClose: () => void;
  onDispensed?: () => void;
}

export const PrescriptionReviewModal: React.FC<PrescriptionReviewModalProps> = ({
  prescription,
  onClose,
  onDispensed
}) => {
  const { 
    medicines, 
    batches, 
    patients, 
    dispensePrescription, 
    verifyPrescription, 
    requestClarification,
    getPatientMedicationHistory 
  } = useHospital();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'REVIEW' | 'HISTORY'>('REVIEW');
  const [selectedBatches, setSelectedBatches] = useState<Record<string, string>>(() => {
    // default to available active batch for each item
    const initial: Record<string, string> = {};
    prescription.items.forEach(item => {
      const itemBatches = batches.filter(b => b.medicineId === item.medicineId && b.status !== 'EXPIRED');
      if (itemBatches.length > 0) {
        initial[item.id] = itemBatches[0].batchNumber;
      }
    });
    return initial;
  });

  const [dispenseNotes, setDispenseNotes] = useState('');
  const [showClarificationDialog, setShowClarificationDialog] = useState(false);
  const [clarificationReason, setClarificationReason] = useState('');
  const [isDispensing, setIsDispensing] = useState(false);

  // Find patient details
  const patient: Patient | undefined = patients.find(p => p.id === prescription.patientId);
  const medicationHistory: DispensingRecord[] = getPatientMedicationHistory(prescription.patientId);

  // Check inventory availability and expiry for all items
  const itemChecks = prescription.items.map(item => {
    const med = medicines.find(m => m.id === item.medicineId);
    const itemBatches = batches.filter(b => b.medicineId === item.medicineId);
    const selectedBatchNum = selectedBatches[item.id] || med?.batchNumber;
    const selectedBatch = itemBatches.find(b => b.batchNumber === selectedBatchNum);

    const availableStock = med ? med.stockQuantity : 0;
    const isStockSufficient = availableStock >= item.quantity;
    const isExpired = selectedBatch ? (selectedBatch.status === 'EXPIRED' || new Date(selectedBatch.expiryDate) < new Date('2026-09-08')) : false;

    // Check drug allergy cross-reactivity
    const patientAllergies = patient?.allergies || [];
    const hasAllergyConflict = patientAllergies.some(allergy => {
      const a = allergy.toLowerCase();
      const medName = item.medicineName.toLowerCase();
      if (a.includes('penicillin') && (medName.includes('amoxicillin') || medName.includes('augmentin') || medName.includes('ampicillin'))) {
        return true;
      }
      if (a.includes('ciprofloxacin') && medName.includes('ciprofloxacin')) {
        return true;
      }
      if (a.includes('sulfa') && (medName.includes('cotrimoxazole') || medName.includes('sulfamethoxazole'))) {
        return true;
      }
      if (a.includes('aspirin') && (medName.includes('aspirin') || medName.includes('nsaid'))) {
        return true;
      }
      return false;
    });

    return {
      item,
      med,
      itemBatches,
      selectedBatch,
      selectedBatchNum,
      availableStock,
      isStockSufficient,
      isExpired,
      hasAllergyConflict
    };
  });

  const hasAnyOutOfStock = itemChecks.some(c => !c.isStockSufficient);
  const hasAnyExpiredBatch = itemChecks.some(c => c.isExpired);
  const hasAnyAllergyWarning = itemChecks.some(c => c.hasAllergyConflict);
  const canDispense = !hasAnyOutOfStock && !hasAnyExpiredBatch && prescription.status !== 'DISPENSED';

  const handleDispense = () => {
    if (!canDispense) return;
    setIsDispensing(true);
    setTimeout(() => {
      // Pick first item's batch or default
      const primaryBatch = Object.values(selectedBatches)[0] || 'AMP-2026-04';
      const pharmacistTitle = currentUser.role === 'PHARMACIST' 
        ? currentUser.name 
        : 'Pharm. Almaz Tadesse, BPharm';

      dispensePrescription(prescription.id, pharmacistTitle, primaryBatch, dispenseNotes);
      setIsDispensing(false);
      if (onDispensed) onDispensed();
      onClose();
    }, 400);
  };

  const handleRequestClarification = () => {
    if (!clarificationReason.trim()) return;
    requestClarification(prescription.id, clarificationReason.trim());
    setShowClarificationDialog(false);
    onClose();
  };

  const handleMarkReady = () => {
    verifyPrescription(prescription.id, 'READY_TO_DISPENSE', 'Reviewed and verified by Pharmacist');
    onClose();
  };

  const handleMarkOutOfStock = () => {
    verifyPrescription(prescription.id, 'OUT_OF_STOCK', 'Medication out of stock in central dispensary');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Prescription Clinical Review & Dispensing
                </h2>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  {prescription.id}
                </span>
                {prescription.priority === 'STAT' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                    STAT ORDER
                  </span>
                )}
                {prescription.priority === 'URGENT' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    URGENT
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Central Hospital Pharmacy • Bethel St. Paul Specialized Hospital
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 px-6 border-b border-slate-200 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('REVIEW')}
            className={`py-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'REVIEW'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Prescription & Safety Check
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`py-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'HISTORY'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            Patient Medication History ({medicationHistory.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'HISTORY' ? (
            /* Patient Medication History Tab */
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{prescription.patientName}</h4>
                  <p className="text-slate-500 mt-0.5 font-mono">Patient ID: {prescription.patientId}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500">Known Allergies:</span>
                  <div className="flex flex-wrap gap-1 mt-1 justify-end">
                    {patient?.allergies && patient.allergies.length > 0 ? (
                      patient.allergies.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                          {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px]">No known drug allergies</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 mb-2">Previous Dispensing Records (Read-Only)</h5>
                {medicationHistory.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500">
                    No prior medication dispensing records logged for this patient.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {medicationHistory.map((rec) => (
                      <div key={rec.id} className="p-3 bg-white hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{rec.medicineName}</span>
                            {rec.dosage && <span className="text-slate-500 font-mono">({rec.dosage})</span>}
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded text-[10px] font-bold">
                              Dispensed {rec.quantity} units
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Batch: <span className="font-mono">{rec.batchNumber}</span> • Dispensed by {rec.pharmacistName}
                          </p>
                          {rec.notes && <p className="text-[10px] text-slate-400 mt-0.5 italic">{rec.notes}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-semibold text-slate-600 block">{rec.dispensedAt}</span>
                          <span className="font-mono text-[10px] text-slate-400">Rx: {rec.prescriptionId}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Prescription Review & Verification Tab */
            <>
              {/* Allergy Warning Alert if triggered */}
              {hasAnyAllergyWarning && (
                <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-900 flex items-start gap-3">
                  <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-rose-950 text-sm">CRITICAL ALLERGY ALERT</h4>
                    <p className="text-xs text-rose-800 mt-0.5">
                      Patient has documented allergy: <strong className="underline">{patient?.allergies?.join(', ')}</strong>. 
                      One or more prescribed drugs may present severe adverse cross-reactivity. Contact prescriber before dispensing!
                    </p>
                  </div>
                </div>
              )}

              {/* Grid: Patient & Prescriber Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Information Card */}
                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-700 font-bold mb-2 pb-2 border-b border-slate-200/80">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Patient Information</span>
                  </div>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-bold text-slate-900">{prescription.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">MRN / ID:</span>
                      <span className="font-mono font-bold text-slate-800">{prescription.patientId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Age / Gender:</span>
                      <span>{patient?.age ? `${patient.age} yrs` : '25 yrs'} • {patient?.gender || 'FEMALE'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Blood Group:</span>
                      <span className="font-semibold text-slate-800">{patient?.bloodGroup || 'AB+'}</span>
                    </div>
                    <div className="flex justify-between items-start pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">Documented Allergies:</span>
                      <span className={`font-bold ${patient?.allergies && patient.allergies.length > 0 ? 'text-rose-700' : 'text-slate-600'}`}>
                        {patient?.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None known'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prescriber & Order Meta Card */}
                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-700 font-bold mb-2 pb-2 border-b border-slate-200/80">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Prescriber & Order Details</span>
                  </div>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Doctor:</span>
                      <span className="font-bold text-slate-900">{prescription.doctorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Department:</span>
                      <span className="font-semibold text-slate-800">{prescription.department || 'Internal Medicine'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Prescription Date:</span>
                      <span className="font-semibold text-slate-800">{prescription.createdAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Status:</span>
                      <StatusBadge status={prescription.status} />
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">Priority:</span>
                      <span className="font-bold text-slate-900">{prescription.priority || 'ROUTINE'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strict Scope Notice: Pharmacist cannot change clinical prescription */}
              <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl text-blue-900 text-[11px] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Clinical Safety Rule:</strong> Pharmacists verify and dispense medication. Diagnosis, dose, route, and duration cannot be altered without prescriber approval.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClarificationDialog(true)}
                  className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 rounded-lg shrink-0 transition cursor-pointer shadow-2xs"
                >
                  Request Clarification
                </button>
              </div>

              {/* Prescribed Items & Pharmacy Safety Check */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>Prescription Items & Safety Verification</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {prescription.items.length} item(s) to dispense
                  </span>
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                  {itemChecks.map(({ item, med, itemBatches, isStockSufficient, availableStock, isExpired, selectedBatchNum, hasAllergyConflict }) => (
                    <div key={item.id} className="p-4 bg-white space-y-3">
                      {/* Clinical Prescription Details (Read Only) */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{item.medicineName}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                              {item.dosage}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                            <span>Route: <strong>{item.route}</strong></span>
                            <span>Frequency: <strong>{item.frequency}</strong></span>
                            <span>Duration: <strong>{item.duration}</strong></span>
                            <span>Prescribed Qty: <strong className="text-blue-700 text-xs">{item.quantity} units</strong></span>
                          </div>
                          {item.instructions && (
                            <p className="text-[11px] text-slate-500 mt-1 italic">
                              Instructions: "{item.instructions}"
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          {hasAllergyConflict && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full mb-1">
                              <AlertTriangle className="w-3 h-3" /> Allergy Conflict
                            </span>
                          )}
                          <div>
                            <span className="text-[11px] text-slate-400 block">Estimated Cost:</span>
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              {((med?.pricePerUnit || 18) * item.quantity).toFixed(2)} ETB
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pharmacy Check Controls */}
                      <div className="bg-slate-50/80 p-3 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        {/* Stock Check */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Stock Availability
                          </span>
                          <div className="flex items-center gap-2">
                            {isStockSufficient ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Available ({availableStock} in stock)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-xs bg-rose-50 px-2 py-1 rounded border border-rose-200">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                Insufficient ({availableStock} in stock, need {item.quantity})
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Reorder level: {med?.reorderLevel || 25}
                          </span>
                        </div>

                        {/* Batch Selector */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Dispensary Batch Number
                          </label>
                          <select
                            value={selectedBatches[item.id] || ''}
                            onChange={(e) => setSelectedBatches(prev => ({ ...prev, [item.id]: e.target.value }))}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                          >
                            {itemBatches.map(b => (
                              <option key={b.id} value={b.batchNumber}>
                                {b.batchNumber} (Exp: {b.expiryDate} - Qty: {b.quantity}) {b.status === 'EXPIRED' ? '[EXPIRED]' : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Expiry Check */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Batch Expiry Verification
                          </span>
                          {isExpired ? (
                            <span className="inline-flex items-center gap-1 text-rose-800 font-bold text-xs bg-rose-100 px-2 py-1 rounded border border-rose-300">
                              <Ban className="w-3.5 h-3.5 text-rose-700" />
                              EXPIRED BATCH - DO NOT DISPENSE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-700 font-semibold text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Valid Batch • Exp: {med?.expiryDate || '2026-11-20'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pharmacist Dispensing Notes & Verification Statement */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-xs flex items-center justify-between">
                  <span>Pharmacist Dispensing Log & Patient Counseling Notes</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                </label>
                <textarea
                  value={dispenseNotes}
                  onChange={(e) => setDispenseNotes(e.target.value)}
                  placeholder="e.g. Patient counseled on completing full course, taking with meals, potential side-effects..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Clarification Request Modal */}
              <AnimatePresence>
                {showClarificationDialog && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3"
                  >
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <MessageSquareWarning className="w-4 h-4 text-amber-700" />
                      <span>Contact Prescriber / Clarification Request</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Send an official inquiry regarding prescription safety, drug-drug interaction, suspected allergy, or insufficient stock.
                    </p>
                    <textarea
                      value={clarificationReason}
                      onChange={(e) => setClarificationReason(e.target.value)}
                      placeholder="Specify the clinical question or stock constraint for Dr. Hana Tesfaye..."
                      rows={2}
                      className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-hidden"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowClarificationDialog(false)}
                        className="px-3 py-1.5 bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleRequestClarification}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer shadow-xs"
                      >
                        Submit Request to Doctor
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {prescription.status !== 'DISPENSED' && (
              <>
                <button
                  type="button"
                  onClick={handleMarkReady}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer shadow-2xs"
                >
                  Mark Ready
                </button>
                <button
                  type="button"
                  onClick={handleMarkOutOfStock}
                  className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer shadow-2xs"
                >
                  Out of Stock
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
            >
              Close
            </button>

            {prescription.status !== 'DISPENSED' && (
              <motion.button
                whileHover={{ scale: canDispense ? 1.02 : 1 }}
                whileTap={{ scale: canDispense ? 0.98 : 1 }}
                onClick={handleDispense}
                disabled={!canDispense || isDispensing}
                className={`px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-md cursor-pointer ${
                  canDispense
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isDispensing ? 'Dispensing...' : 'Dispense Medication'}</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
