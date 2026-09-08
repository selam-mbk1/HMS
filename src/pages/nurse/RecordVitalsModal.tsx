import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, Activity, Thermometer, Wind, Droplet, Weight } from 'lucide-react';

interface RecordVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedPatientId?: string;
}

export const RecordVitalsModal: React.FC<RecordVitalsModalProps> = ({
  isOpen,
  onClose,
  preSelectedPatientId
}) => {
  const { patients, recordVitals, vitals } = useHospital();
  const { currentUser } = useAuth();

  const [patientId, setPatientId] = useState(preSelectedPatientId || patients[0]?.id || '');
  const [temperature, setTemperature] = useState(36.8);
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [pulse, setPulse] = useState(72);
  const [respRate, setRespRate] = useState(16);
  const [spo2, setSpo2] = useState(98);
  const [weight, setWeight] = useState(70.0);
  const [painScale, setPainScale] = useState(0);
  const [notes, setNotes] = useState('');

  const selectedPatient = patients.find(p => p.id === patientId);
  const pastVitals = vitals.filter(v => v.patientId === patientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordVitals({
      patientId,
      recordedBy: currentUser.name,
      temperature: Number(temperature),
      bloodPressureSystolic: Number(systolic),
      bloodPressureDiastolic: Number(diastolic),
      pulseRate: Number(pulse),
      respiratoryRate: Number(respRate),
      oxygenSaturation: Number(spo2),
      weight: Number(weight),
      painScale: Number(painScale),
      notes
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Clinical Vital Signs" subtitle="Enter physical examination telemetry into patient EMR" maxWidth="3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Patient</label>
          <select
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.firstName} {p.middleName} {p.lastName} ({p.gender}, {p.age}y)
              </option>
            ))}
          </select>
        </div>

        {/* Previous trend summary if available */}
        {pastVitals.length > 0 && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="font-semibold text-slate-700">Previous Reading ({pastVitals[0].recordedAt}):</span>
            <span className="text-slate-600 ml-2 font-mono">
              BP: {pastVitals[0].bloodPressureSystolic}/{pastVitals[0].bloodPressureDiastolic} mmHg • HR: {pastVitals[0].pulseRate} bpm • Temp: {pastVitals[0].temperature}°C • SpO2: {pastVitals[0].oxygenSaturation}%
            </span>
          </div>
        )}

        {/* Vitals Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* BP */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-blue-600" /> Blood Pressure</span>
              <span className="text-[10px] text-slate-400">mmHg</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={systolic}
                onChange={e => setSystolic(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center"
                placeholder="Systolic"
              />
              <span className="text-slate-400 font-bold">/</span>
              <input
                type="number"
                value={diastolic}
                onChange={e => setDiastolic(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center"
                placeholder="Diastolic"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Normal: 90/60 - 120/80</span>
          </div>

          {/* Pulse */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-500" /> Pulse / Heart Rate</span>
              <span className="text-[10px] text-slate-400">bpm</span>
            </div>
            <input
              type="number"
              value={pulse}
              onChange={e => setPulse(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Normal: 60 - 100 bpm</span>
          </div>

          {/* Temperature */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-amber-500" /> Core Body Temp</span>
              <span className="text-[10px] text-slate-400">°C</span>
            </div>
            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={e => setTemperature(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Normal: 36.5 - 37.5 °C</span>
          </div>

          {/* Respiratory Rate */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-teal-500" /> Resp Rate</span>
              <span className="text-[10px] text-slate-400">breaths/min</span>
            </div>
            <input
              type="number"
              value={respRate}
              onChange={e => setRespRate(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Normal: 12 - 20</span>
          </div>

          {/* SpO2 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5 text-blue-500" /> Oxygen (SpO2)</span>
              <span className="text-[10px] text-slate-400">%</span>
            </div>
            <input
              type="number"
              value={spo2}
              onChange={e => setSpo2(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Normal: 95 - 100%</span>
          </div>

          {/* Weight */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5"><Weight className="w-3.5 h-3.5 text-purple-500" /> Weight</span>
              <span className="text-[10px] text-slate-400">kg</span>
            </div>
            <input
              type="number"
              step="0.5"
              value={weight}
              onChange={e => setWeight(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Body mass index input</span>
          </div>
        </div>

        {/* Pain Scale (0-10) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700">Wong-Baker Pain Scale Rating (0 = No Pain, 10 = Severe)</label>
            <span className="text-xs font-bold text-blue-700 font-mono">{painScale} / 10</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={painScale}
            onChange={e => setPainScale(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Clinical Observations */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nursing Observations & Triage Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Patient ambulating independently, no respiratory distress, resting comfortably."
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
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
          >
            Record Observation & Update EMR
          </button>
        </div>
      </form>
    </Modal>
  );
};
