import React from 'react';
import { Modal } from '../../components/common/Modal';
import { EmergencyCase } from '../../types';
import { 
  HeartPulse, 
  Activity, 
  User, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertTriangle,
  Stethoscope,
  Edit3
} from 'lucide-react';

interface NurseAssessmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyCase: EmergencyCase | null;
  onReAssess?: (emergencyCase: EmergencyCase) => void;
}

export const NurseAssessmentViewModal: React.FC<NurseAssessmentViewModalProps> = ({
  isOpen,
  onClose,
  emergencyCase,
  onReAssess
}) => {
  if (!emergencyCase) return null;

  const isCritical = emergencyCase.priority === 'CRITICAL' || emergencyCase.triageLevel === 'CRITICAL';
  const isUrgent = emergencyCase.priority === 'URGENT' || emergencyCase.triageLevel === 'URGENT';

  const bpText = emergencyCase.vitalSigns 
    ? `${emergencyCase.vitalSigns.bloodPressureSystolic}/${emergencyCase.vitalSigns.bloodPressureDiastolic} mmHg`
    : emergencyCase.vitals?.bp || '120/80 mmHg';

  const pulseText = emergencyCase.vitalSigns?.pulseRate || emergencyCase.vitals?.pulse || 78;
  const spo2Text = emergencyCase.vitalSigns?.oxygenSaturation || emergencyCase.vitals?.spo2 || 98;
  const tempText = emergencyCase.vitalSigns?.temperature || emergencyCase.vitals?.temp || 36.7;
  const rrText = emergencyCase.vitalSigns?.respiratoryRate || 16;
  const painText = emergencyCase.vitalSigns?.painLevel ?? 2;
  const consciousness = emergencyCase.vitalSigns?.consciousnessLevel || 'Alert';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Completed Nursing Triage Assessment"
      subtitle="Clinical triage summary prepared for emergency doctor assessment"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Header Summary Banner */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{emergencyCase.patientName}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 text-white font-bold">
                  {emergencyCase.id}
                </span>
                {emergencyCase.patientId && (
                  <span className="font-mono text-xs text-slate-500">
                    {emergencyCase.patientId}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {emergencyCase.age}y • {emergencyCase.gender} • Arrival: {emergencyCase.arrivalTime || '08:40'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            {/* Priority Badge */}
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              isCritical
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : isUrgent
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {isCritical ? '🔴 CRITICAL' : isUrgent ? '🟠 URGENT' : '🟢 LESS URGENT'}
            </span>

            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              WAITING FOR EMERGENCY DOCTOR
            </span>
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
            Chief Complaint:
          </span>
          <p className="text-xs font-semibold text-rose-950 mt-0.5">
            {emergencyCase.chiefComplaint}
          </p>
        </div>

        {/* Vital Signs Grid */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span>Recorded Vital Signs</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</span>
              <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">{bpText}</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pulse Rate</span>
              <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">{pulseText} bpm</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Oxygen Saturation</span>
              <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">{spo2Text}%</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Temperature</span>
              <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">{tempText}°C</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Respiratory Rate</span>
              <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">{rrText} /min</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pain & Mental Status</span>
              <p className="text-xs font-bold font-mono text-slate-900 mt-0.5">
                Pain: {painText}/10 • {consciousness}
              </p>
            </div>
          </div>
        </div>

        {/* Nursing Observations & Notes */}
        <div className="space-y-2.5 text-xs">
          {emergencyCase.clinicalObservations && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-700 block mb-0.5">Clinical Observations:</span>
              <p className="text-slate-800">{emergencyCase.clinicalObservations}</p>
            </div>
          )}

          {emergencyCase.immediateConcerns && (
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-900 block mb-0.5">Immediate Clinical Concerns:</span>
              <p className="text-amber-950">{emergencyCase.immediateConcerns}</p>
            </div>
          )}

          {emergencyCase.triageNotes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-700 block mb-0.5">Nursing Triage Notes:</span>
              <p className="text-slate-800">{emergencyCase.triageNotes}</p>
            </div>
          )}
        </div>

        {/* Sign-off footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-blue-50/50 border border-blue-200 rounded-xl text-xs gap-2">
          <div className="flex items-center gap-2 text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Triaged by: <strong>{emergencyCase.triagedBy || 'Sr. Tigist Mengistu, BSc'}</strong>
            </span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">
            Ready for Emergency Physician
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          {onReAssess && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onReAssess(emergencyCase);
              }}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update / Re-assess Triage</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
