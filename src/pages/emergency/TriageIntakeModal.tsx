import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { EmergencyTriageLevel } from '../../types';
import { AlertOctagon, Activity, CheckCircle2 } from 'lucide-react';

interface TriageIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TriageIntakeModal: React.FC<TriageIntakeModalProps> = ({ isOpen, onClose }) => {
  const { addEmergencyCase } = useHospital();

  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [triageLevel, setTriageLevel] = useState<EmergencyTriageLevel>('URGENT');
  const [gcsScore, setGcsScore] = useState<number>(15);
  const [bpSystolic, setBpSystolic] = useState<number>(120);
  const [bpDiastolic, setBpDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(88);
  const [spo2, setSpo2] = useState<number>(97);
  const [temp, setTemp] = useState<number>(37.0);
  const [doctorName, setDoctorName] = useState('Dr. Dawit Haile (Emergency Lead)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmergencyCase({
      patientName: patientName.trim() || 'Unknown Trauma Patient (Unidentified)',
      age: Number(age),
      gender,
      chiefComplaint,
      triageLevel,
      vitalSigns: {
        bloodPressureSystolic: Number(bpSystolic),
        bloodPressureDiastolic: Number(bpDiastolic),
        pulseRate: Number(pulse),
        temperature: Number(temp),
        respiratoryRate: 18,
        oxygenSaturation: Number(spo2)
      },
      gcsScore: Number(gcsScore),
      assignedDoctor: doctorName,
      status: 'TRIAGED'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emergency Trauma & Triage Intake"
      subtitle="Rapid clinical assessment and immediate bed / bay assignment"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Triage Priority Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Manchester / Emergency Severity Index (ESI) Triage Classification *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { level: 'RESUSCITATION', label: 'Resuscitation (Level 1)', desc: 'Immediate life threat (0 min)', color: 'border-rose-600 bg-rose-50 text-rose-900' },
              { level: 'CRITICAL', label: 'Emergent (Level 2)', desc: 'High risk / vital distress (<15m)', color: 'border-rose-400 bg-rose-50/50 text-rose-800' },
              { level: 'URGENT', label: 'Urgent (Level 3)', desc: 'Multiple resources needed (<30m)', color: 'border-amber-400 bg-amber-50 text-amber-900' },
              { level: 'OBSERVATION', label: 'Less Urgent (Level 4/5)', desc: 'Stable condition / minor (<60m)', color: 'border-blue-400 bg-blue-50 text-blue-900' }
            ].map(item => (
              <button
                key={item.level}
                type="button"
                onClick={() => setTriageLevel(item.level as EmergencyTriageLevel)}
                className={`p-3 rounded-xl border text-left transition ${
                  triageLevel === item.level
                    ? `${item.color} ring-2 ring-blue-600 font-bold shadow-xs`
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    item.level === 'RESUSCITATION' || item.level === 'CRITICAL'
                      ? 'bg-rose-600'
                      : item.level === 'URGENT'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`} />
                  <span className="text-xs">{item.label}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-normal">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Name (or Trauma Identifier) *
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              placeholder="e.g. Mulugeta Assefa or Unknown Trauma"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated / Actual Age</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other / Undetermined</option>
            </select>
          </div>
        </div>

        {/* Chief Complaint */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Chief Complaint & Mechanism of Injury / Acute Presentation *
          </label>
          <textarea
            rows={2}
            required
            value={chiefComplaint}
            onChange={e => setChiefComplaint(e.target.value)}
            placeholder="e.g. Sudden severe substernal chest pain radiating to left arm with diaphoresis; or Motor vehicle collision trauma with head impact..."
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
          />
        </div>

        {/* Rapid Vitals & GCS Score */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-600" /> Immediate Vital Signs & Glasgow Coma Scale (GCS)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">BP (mmHg)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={bpSystolic}
                  onChange={e => setBpSystolic(Number(e.target.value))}
                  className="w-full p-1.5 text-xs text-center border border-slate-200 rounded-lg font-mono font-bold"
                />
                <span>/</span>
                <input
                  type="number"
                  value={bpDiastolic}
                  onChange={e => setBpDiastolic(Number(e.target.value))}
                  className="w-full p-1.5 text-xs text-center border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pulse (bpm)</label>
              <input
                type="number"
                value={pulse}
                onChange={e => setPulse(Number(e.target.value))}
                className="w-full p-1.5 text-xs text-center border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">SpO2 (%)</label>
              <input
                type="number"
                value={spo2}
                onChange={e => setSpo2(Number(e.target.value))}
                className="w-full p-1.5 text-xs text-center border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                value={temp}
                onChange={e => setTemp(Number(e.target.value))}
                className="w-full p-1.5 text-xs text-center border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">GCS Score (3-15)</label>
              <input
                type="number"
                min="3"
                max="15"
                value={gcsScore}
                onChange={e => setGcsScore(Number(e.target.value))}
                className="w-full p-1.5 text-xs text-center border border-slate-200 rounded-lg font-mono font-bold text-blue-700"
              />
            </div>
          </div>
        </div>

        {/* Attending ER Doctor */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Emergency Physician</label>
          <input
            type="text"
            value={doctorName}
            onChange={e => setDoctorName(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
          />
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <AlertOctagon className="w-4 h-4" />
            Admit to Emergency Bay
          </button>
        </div>
      </form>
    </Modal>
  );
};
