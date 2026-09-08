import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Pill, 
  Clock, 
  User, 
  Stethoscope, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export interface PendingMedicationDose {
  id: string;
  patientId: string;
  patientName: string;
  roomBed: string;
  scheduledTime: string;
  medicineName: string;
  dosage: string;
  route: string;
  frequency: string;
  prescribedBy: string;
  instructions: string;
  status: 'SCHEDULED' | 'DUE_NOW' | 'ADMINISTERED';
  administeredAt?: string;
  administeredBy?: string;
}

interface ViewMedicationOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  dose: PendingMedicationDose | null;
  onAdminister: (doseId: string) => void;
}

export const ViewMedicationOrderModal: React.FC<ViewMedicationOrderModalProps> = ({
  isOpen,
  onClose,
  dose,
  onAdminister
}) => {
  const { currentUser } = useAuth();
  const [adminNotes, setAdminNotes] = useState('');

  if (!dose) return null;

  const handleAdministerClick = () => {
    onAdminister(dose.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Physician Prescription Order"
      subtitle="Authorized medication order for inpatient nursing administration"
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Physician Authorization Badge */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized Medical Order • Read-Only Nursing View</span>
          </div>
          <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-700">
            Order #{dose.id}
          </span>
        </div>

        {/* Patient Details */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Patient</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">{dose.patientName}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{dose.patientId} • {dose.roomBed}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Scheduled Time</span>
              <div className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 font-mono bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{dose.scheduledTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medication Order Specification */}
        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
          <div className="p-3.5 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">{dose.medicineName}</span>
                <span className="text-slate-500 text-[11px]">Dosage: <strong>{dose.dosage}</strong></span>
              </div>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              dose.status === 'ADMINISTERED' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : dose.status === 'DUE_NOW'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {dose.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="p-3.5 grid grid-cols-2 gap-3 bg-white">
            <div>
              <span className="text-slate-400 block font-semibold text-[11px]">Route of Administration:</span>
              <span className="font-bold text-slate-800 text-xs mt-0.5 block">{dose.route}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[11px]">Frequency / Timing:</span>
              <span className="font-bold text-slate-800 text-xs mt-0.5 block">{dose.frequency}</span>
            </div>
          </div>

          <div className="p-3.5 bg-white">
            <span className="text-slate-400 block font-semibold text-[11px]">Prescribing Physician:</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-slate-800 font-semibold">
              <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
              <span>{dose.prescribedBy}</span>
            </div>
          </div>

          <div className="p-3.5 bg-white">
            <span className="text-slate-400 block font-semibold text-[11px]">Doctor's Clinical Instructions:</span>
            <p className="text-slate-700 mt-1 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              "{dose.instructions}"
            </p>
          </div>
        </div>

        {/* Administration Status / Logging */}
        {dose.status === 'ADMINISTERED' ? (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Dose Administered</p>
              <p className="text-emerald-700 text-[11px]">
                Logged by {dose.administeredBy || 'Sr. Tigist Mengistu, BSc'} at {dose.administeredAt || 'Today 08:05'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Nursing Administration Note (Optional)
            </label>
            <input
              type="text"
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="e.g. Administered orally with water, tolerated well."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        )}

        {/* Modal Buttons */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Nurses verify 5 Rights of Medication Administration.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              Close
            </button>
            {dose.status !== 'ADMINISTERED' && (
              <button
                type="button"
                onClick={handleAdministerClick}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Log Dose Administered</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
