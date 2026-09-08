import React from 'react';
import { Modal } from '../../components/common/Modal';
import { EmergencyCase } from '../../types';
import { 
  HeartPulse, 
  Activity, 
  User, 
  Stethoscope, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertOctagon,
  FileText,
  BedDouble
} from 'lucide-react';

interface NurseEmergencyCaseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyCase: EmergencyCase | null;
}

export const NurseEmergencyCaseViewModal: React.FC<NurseEmergencyCaseViewModalProps> = ({
  isOpen,
  onClose,
  emergencyCase
}) => {
  if (!emergencyCase) return null;

  const isCritical = emergencyCase.priority === 'CRITICAL' || emergencyCase.triageLevel === 'CRITICAL' || emergencyCase.status === 'RESUSCITATION';
  const isUrgent = emergencyCase.priority === 'URGENT' || emergencyCase.triageLevel === 'URGENT';

  const bpText = emergencyCase.vitalSigns 
    ? `${emergencyCase.vitalSigns.bloodPressureSystolic}/${emergencyCase.vitalSigns.bloodPressureDiastolic} mmHg`
    : emergencyCase.vitals?.bp || '90/60 mmHg';

  const pulseText = emergencyCase.vitalSigns?.pulseRate || emergencyCase.vitals?.pulse || 122;
  const spo2Text = emergencyCase.vitalSigns?.oxygenSaturation || emergencyCase.vitals?.spo2 || 94;
  const tempText = emergencyCase.vitalSigns?.temperature || emergencyCase.vitals?.temp || 36.4;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Active Emergency Case Monitor"
      subtitle="Nursing telemetry and status monitoring for patients under emergency physician care"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Physician In-Charge Banner */}
        <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block">
                Assigned Emergency Physician
              </span>
              <p className="text-xs font-bold text-slate-900">
                {emergencyCase.assignedDoctor || 'Dr. Biruk Assefa, MD'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Current Location
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
              <BedDouble className="w-3.5 h-3.5 text-blue-600" />
              {emergencyCase.bedAssigned || 'Resus Bay 1'}
            </span>
          </div>
        </div>

        {/* Patient Identity & Clinical Acuity */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{emergencyCase.patientName}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 text-white font-bold">
                    {emergencyCase.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {emergencyCase.age}y • {emergencyCase.gender} • Arrival: {emergencyCase.arrivalTime || '07:45'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                isCritical
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                  : isUrgent
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {isCritical ? '🔴 CRITICAL' : isUrgent ? '🟠 URGENT' : '🟢 LESS URGENT'}
              </span>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                emergencyCase.status === 'RESUSCITATION'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {emergencyCase.status === 'RESUSCITATION' ? 'IN RESUSCITATION' : emergencyCase.status}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Chief Complaint & Trauma Description:
            </span>
            <p className="text-xs font-semibold text-rose-950 bg-rose-50 p-2.5 rounded-xl border border-rose-200 mt-1">
              {emergencyCase.chiefComplaint}
            </p>
          </div>
        </div>

        {/* Vital Signs Telemetry */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span>Vital Signs Telemetry</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</span>
              <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">{bpText}</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pulse Rate</span>
              <p className={`text-sm font-bold font-mono mt-0.5 ${pulseText > 100 ? 'text-rose-600' : 'text-slate-900'}`}>
                {pulseText} bpm
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Oxygen Saturation</span>
              <p className={`text-sm font-bold font-mono mt-0.5 ${spo2Text < 95 ? 'text-rose-600' : 'text-slate-900'}`}>
                {spo2Text}%
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Temperature</span>
              <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">{tempText}°C</p>
            </div>
          </div>
        </div>

        {/* Doctor Treatment Status (Nurse Monitoring View) */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-600" />
            Physician Care in Progress
          </span>
          <p className="text-slate-600">
            Emergency physician active resuscitation / stabilization in progress. Nurse role is to assist with vitals monitoring, IV access, and clinical observation.
          </p>
          {emergencyCase.diagnosis && (
            <p className="text-slate-800 pt-1 font-medium">
              <strong>Working Diagnosis:</strong> {emergencyCase.diagnosis}
            </p>
          )}
        </div>

        {/* Nursing Safety Notice */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Nursing Notice:</strong> Clinical diagnoses, emergency prescriptions, and discharge decisions are performed directly by the attending emergency physician.
          </p>
        </div>

        {/* Close */}
        <div className="flex justify-end pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition cursor-pointer"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </Modal>
  );
};
