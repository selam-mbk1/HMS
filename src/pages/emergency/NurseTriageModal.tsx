import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { EmergencyCase, EmergencyTriageLevel } from '../../types';
import { 
  HeartPulse, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  ShieldAlert, 
  Stethoscope,
  FileText,
  Thermometer,
  Wind,
  Smile,
  Frown,
  Scale,
  BrainCircuit
} from 'lucide-react';

interface NurseTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyCase: EmergencyCase | null;
  onCompleteTriage: (caseId: string, triageData: {
    priority: 'CRITICAL' | 'URGENT' | 'LESS_URGENT';
    triageLevel: EmergencyTriageLevel;
    vitalSigns: {
      bloodPressureSystolic: number;
      bloodPressureDiastolic: number;
      pulseRate: number;
      oxygenSaturation: number;
      temperature: number;
      respiratoryRate: number;
      painLevel: number;
      weight?: number;
      consciousnessLevel?: string;
    };
    clinicalObservations: string;
    immediateConcerns: string;
    triageNotes: string;
  }) => void;
  onSaveDraft?: (caseId: string, draftData: any) => void;
}

export const NurseTriageModal: React.FC<NurseTriageModalProps> = ({
  isOpen,
  onClose,
  emergencyCase,
  onCompleteTriage,
  onSaveDraft
}) => {
  if (!emergencyCase) return null;

  // Initialize or populate vital signs
  const [bpSystolic, setBpSystolic] = useState<number>(
    emergencyCase.vitalSigns?.bloodPressureSystolic || 120
  );
  const [bpDiastolic, setBpDiastolic] = useState<number>(
    emergencyCase.vitalSigns?.bloodPressureDiastolic || 80
  );
  const [pulse, setPulse] = useState<number>(
    emergencyCase.vitalSigns?.pulseRate || emergencyCase.vitals?.pulse || 78
  );
  const [spo2, setSpo2] = useState<number>(
    emergencyCase.vitalSigns?.oxygenSaturation || emergencyCase.vitals?.spo2 || 98
  );
  const [temp, setTemp] = useState<number>(
    emergencyCase.vitalSigns?.temperature || emergencyCase.vitals?.temp || 36.7
  );
  const [respiratoryRate, setRespiratoryRate] = useState<number>(
    emergencyCase.vitalSigns?.respiratoryRate || 16
  );
  const [painLevel, setPainLevel] = useState<number>(
    emergencyCase.vitalSigns?.painLevel ?? 2
  );
  const [weight, setWeight] = useState<string>(
    emergencyCase.vitalSigns?.weight ? String(emergencyCase.vitalSigns.weight) : ''
  );
  const [consciousnessLevel, setConsciousnessLevel] = useState<string>(
    emergencyCase.vitalSigns?.consciousnessLevel || 'Alert'
  );

  // Nursing Assessment
  const initialPriority = emergencyCase.priority === 'CRITICAL' || emergencyCase.triageLevel === 'CRITICAL' || emergencyCase.triageLevel === 'RESUSCITATION'
    ? 'CRITICAL'
    : emergencyCase.priority === 'URGENT' || emergencyCase.triageLevel === 'URGENT'
    ? 'URGENT'
    : 'LESS_URGENT';

  const [priority, setPriority] = useState<'CRITICAL' | 'URGENT' | 'LESS_URGENT'>(initialPriority);
  const [clinicalObservations, setClinicalObservations] = useState<string>(
    emergencyCase.clinicalObservations || 'Patient alert, cooperative, peripheral pulses palpable, skin warm and dry.'
  );
  const [immediateConcerns, setImmediateConcerns] = useState<string>(
    emergencyCase.immediateConcerns || 'Monitor vitals, prepare for emergency physician examination.'
  );
  const [triageNotes, setTriageNotes] = useState<string>(
    emergencyCase.triageNotes || 'Vital signs recorded by triage nurse. Patient placed in comfortable semi-fowler position.'
  );

  // Sync when case changes
  useEffect(() => {
    if (emergencyCase) {
      setBpSystolic(emergencyCase.vitalSigns?.bloodPressureSystolic || 120);
      setBpDiastolic(emergencyCase.vitalSigns?.bloodPressureDiastolic || 80);
      setPulse(emergencyCase.vitalSigns?.pulseRate || emergencyCase.vitals?.pulse || 78);
      setSpo2(emergencyCase.vitalSigns?.oxygenSaturation || emergencyCase.vitals?.spo2 || 98);
      setTemp(emergencyCase.vitalSigns?.temperature || emergencyCase.vitals?.temp || 36.7);
      setRespiratoryRate(emergencyCase.vitalSigns?.respiratoryRate || 16);
      setPainLevel(emergencyCase.vitalSigns?.painLevel ?? 2);
      setWeight(emergencyCase.vitalSigns?.weight ? String(emergencyCase.vitalSigns.weight) : '');
      setConsciousnessLevel(emergencyCase.vitalSigns?.consciousnessLevel || 'Alert');
      
      const p = emergencyCase.priority === 'CRITICAL' || emergencyCase.triageLevel === 'CRITICAL' || emergencyCase.triageLevel === 'RESUSCITATION'
        ? 'CRITICAL'
        : emergencyCase.priority === 'URGENT' || emergencyCase.triageLevel === 'URGENT'
        ? 'URGENT'
        : 'LESS_URGENT';
      setPriority(p);

      setClinicalObservations(
        emergencyCase.clinicalObservations || 'Patient alert, cooperative, peripheral pulses palpable, skin warm and dry.'
      );
      setImmediateConcerns(
        emergencyCase.immediateConcerns || 'Monitor vitals, prepare for emergency physician examination.'
      );
      setTriageNotes(
        emergencyCase.triageNotes || 'Vital signs recorded by triage nurse. Patient placed in comfortable position awaiting doctor.'
      );
    }
  }, [emergencyCase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mappedTriageLevel: EmergencyTriageLevel = 
      priority === 'CRITICAL' ? 'CRITICAL' : priority === 'URGENT' ? 'URGENT' : 'NORMAL';

    onCompleteTriage(emergencyCase.id, {
      priority,
      triageLevel: mappedTriageLevel,
      vitalSigns: {
        bloodPressureSystolic: Number(bpSystolic),
        bloodPressureDiastolic: Number(bpDiastolic),
        pulseRate: Number(pulse),
        oxygenSaturation: Number(spo2),
        temperature: Number(temp),
        respiratoryRate: Number(respiratoryRate),
        painLevel: Number(painLevel),
        weight: weight ? Number(weight) : undefined,
        consciousnessLevel
      },
      clinicalObservations,
      immediateConcerns,
      triageNotes
    });
    onClose();
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(emergencyCase.id, {
        status: 'IN_TRIAGE',
        priority,
        vitalSigns: {
          bloodPressureSystolic: Number(bpSystolic),
          bloodPressureDiastolic: Number(bpDiastolic),
          pulseRate: Number(pulse),
          oxygenSaturation: Number(spo2),
          temperature: Number(temp),
          respiratoryRate: Number(respiratoryRate),
          painLevel: Number(painLevel),
          weight: weight ? Number(weight) : undefined,
          consciousnessLevel
        },
        clinicalObservations,
        immediateConcerns,
        triageNotes
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emergency Triage Assessment"
      subtitle="Assess emergency patient, record vital signs, determine clinical priority, and prepare for doctor evaluation"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Demographics & Intake Context */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{emergencyCase.patientName}</h4>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold">
                    {emergencyCase.id}
                  </span>
                  {emergencyCase.patientId && (
                    <span className="text-xs font-mono text-slate-500">
                      MRN: {emergencyCase.patientId}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {emergencyCase.age} years • {emergencyCase.gender}
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-500">Arrival:</span>{' '}
              <span className="font-mono font-bold text-slate-800">{emergencyCase.arrivalTime || '08:40'}</span>
              {emergencyCase.arrivalMethod && (
                <span className="ml-2 px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">
                  {emergencyCase.arrivalMethod}
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Chief Complaint:</span>
            <p className="text-xs font-medium text-rose-950 bg-rose-50 p-2.5 rounded-xl border border-rose-200 mt-1">
              {emergencyCase.chiefComplaint}
            </p>
          </div>
        </div>

        {/* Vital Signs Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Vital Signs Recording</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Mandatory clinical nursing telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Blood Pressure */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                BP (mmHg) *
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  required
                  min={50}
                  max={260}
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(Number(e.target.value))}
                  placeholder="Sys"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-center font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-slate-400 font-bold">/</span>
                <input
                  type="number"
                  required
                  min={30}
                  max={160}
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(Number(e.target.value))}
                  placeholder="Dia"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-center font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Pulse Rate */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Pulse / HR (bpm) *
              </label>
              <input
                type="number"
                required
                min={30}
                max={220}
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* SpO2 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                SpO2 (%) *
              </label>
              <input
                type="number"
                required
                min={50}
                max={100}
                value={spo2}
                onChange={(e) => setSpo2(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Temp (°C) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                min={32}
                max={43}
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Respiratory Rate */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Resp Rate (/min) *
              </label>
              <input
                type="number"
                required
                min={6}
                max={60}
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Pain Score */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Pain Score (0-10) *
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                  {painLevel >= 7 ? 'Severe' : painLevel >= 4 ? 'Moderate' : painLevel > 0 ? 'Mild' : 'None'}
                </span>
              </div>
            </div>

            {/* Consciousness (AVPU) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Consciousness (AVPU)
              </label>
              <select
                value={consciousnessLevel}
                onChange={(e) => setConsciousnessLevel(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              >
                <option value="Alert">Alert (A)</option>
                <option value="Voice">Responsive to Voice (V)</option>
                <option value="Pain">Responsive to Pain (P)</option>
                <option value="Unresponsive">Unresponsive (U)</option>
              </select>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Weight (kg) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.5"
                min={2}
                max={250}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Clinical Priority Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Clinical Priority Determination *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Critical */}
            <button
              type="button"
              onClick={() => setPriority('CRITICAL')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                priority === 'CRITICAL'
                  ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-500 text-rose-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                <span className="text-xs font-bold">🔴 Critical</span>
              </div>
              <p className="text-[11px] text-rose-800 mt-1 font-medium">
                Immediate clinical attention
              </p>
            </button>

            {/* Urgent */}
            <button
              type="button"
              onClick={() => setPriority('URGENT')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                priority === 'URGENT'
                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500 text-amber-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-bold">🟠 Urgent</span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1 font-medium">
                High-risk condition requiring prompt assessment
              </p>
            </button>

            {/* Less Urgent */}
            <button
              type="button"
              onClick={() => setPriority('LESS_URGENT')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                priority === 'LESS_URGENT'
                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold">🟢 Less Urgent</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1 font-medium">
                Stable patient requiring clinical assessment
              </p>
            </button>
          </div>
        </div>

        {/* Nursing Assessment & Observations */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Clinical Observations *
            </label>
            <textarea
              required
              rows={2}
              value={clinicalObservations}
              onChange={(e) => setClinicalObservations(e.target.value)}
              placeholder="e.g. Skin color, breathing pattern, neurovascular status, mobility..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Immediate Concerns
            </label>
            <input
              type="text"
              value={immediateConcerns}
              onChange={(e) => setImmediateConcerns(e.target.value)}
              placeholder="e.g. Bleeding risk, pain management, IV access, airway..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Nursing Notes & Pre-Doctor Care
            </label>
            <textarea
              rows={2}
              value={triageNotes}
              onChange={(e) => setTriageNotes(e.target.value)}
              placeholder="Nursing care provided: position, ice pack, compression, preliminary positioning..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Triage Nurse Attestation */}
        <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs">
          <div className="flex items-center gap-2 text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium">
              Triage Assessor: <strong className="font-bold">Sr. Tigist Mengistu, BSc (Staff Nurse)</strong>
            </span>
          </div>
          <span className="text-[11px] text-blue-700 font-mono">
            Forward to: Emergency Doctor Queue
          </span>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>

          {onSaveDraft && (
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition cursor-pointer"
            >
              Save Draft & Keep In Triage
            </button>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Triage</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
