import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { Appointment, Patient } from '../../types';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  Droplet, 
  Weight, 
  Ruler, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

interface NurseAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  patient?: Patient;
}

export const NurseAssessmentModal: React.FC<NurseAssessmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  patient
}) => {
  const { recordVitals, updateAppointmentStatus, addToast } = useHospital();
  const { currentUser } = useAuth();

  // Vital Signs State
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [pulse, setPulse] = useState(74);
  const [temperature, setTemperature] = useState(36.8);
  const [respRate, setRespRate] = useState(16);
  const [spo2, setSpo2] = useState(98);
  const [weight, setWeight] = useState(65.0);
  const [height, setHeight] = useState(168);
  const [painScale, setPainScale] = useState(0);

  // Observations & Notes
  const [generalAppearance, setGeneralAppearance] = useState('Alert and oriented, in no acute distress');
  const [mobility, setMobility] = useState('Independent / Ambulatory');
  const [nursingNotes, setNursingNotes] = useState('');

  // Reset or preset values when modal opens with an appointment
  useEffect(() => {
    if (appointment) {
      setSystolic(120);
      setDiastolic(80);
      setPulse(74);
      setTemperature(36.8);
      setRespRate(16);
      setSpo2(98);
      setWeight(65.0);
      setHeight(168);
      setPainScale(0);
      setGeneralAppearance('Alert and oriented, in no acute distress');
      setMobility('Independent / Ambulatory');
      setNursingNotes(`Pre-consultation triage: Patient arrived on time for ${appointment.reason || 'evaluation'}. Vitals stable.`);
    }
  }, [appointment]);

  if (!appointment) return null;

  // Calculate BMI
  const bmi = (weight && height) ? (weight / Math.pow(height / 100, 2)).toFixed(1) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Record vital signs
    recordVitals({
      patientId: appointment.patientId,
      recordedBy: `${currentUser.name} (Nurse)`,
      temperature: Number(temperature),
      bloodPressureSystolic: Number(systolic),
      bloodPressureDiastolic: Number(diastolic),
      pulseRate: Number(pulse),
      respiratoryRate: Number(respRate),
      oxygenSaturation: Number(spo2),
      weight: Number(weight),
      height: Number(height),
      painScale: Number(painScale),
      notes: `Appearance: ${generalAppearance}. Mobility: ${mobility}. Notes: ${nursingNotes}`
    });

    // 2. Transition appointment from WAITING_FOR_NURSE to WAITING_FOR_DOCTOR
    updateAppointmentStatus(appointment.id, 'WAITING_FOR_DOCTOR');

    // 3. Notify
    addToast(
      'success',
      'Nurse Assessment Complete',
      `Patient ${appointment.patientName} (${appointment.patientId}) has been assessed and forwarded to ${appointment.doctorName}'s waiting queue.`
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Outpatient Nurse Assessment & Vital Signs"
      subtitle="Complete nursing triage before doctor clinical consultation"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Administrative Banner */}
        <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{appointment.patientName}</h3>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                    {appointment.patientId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {patient ? `${patient.age} yrs • ${patient.gender} • Blood Group: ${patient.bloodGroup || 'O+'}` : 'Outpatient Patient'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 justify-end">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Appointment: {appointment.time}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Doctor: <strong className="text-slate-700">{appointment.doctorName}</strong> ({appointment.department})
              </p>
            </div>
          </div>

          {/* Visit Reason */}
          <div className="mt-3 flex items-start gap-2 text-xs">
            <span className="font-semibold text-slate-700 shrink-0">Chief Complaint / Reason:</span>
            <span className="text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex-1">
              {appointment.reason || 'General clinical consultation and review'}
            </span>
          </div>
        </div>

        {/* Vital Signs Entry Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Vital Signs Measurements</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Blood Pressure */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" /> Blood Pressure
                </span>
                <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  required
                  min={50}
                  max={260}
                  value={systolic}
                  onChange={e => setSystolic(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center focus:border-blue-500 focus:outline-hidden"
                  placeholder="Systolic"
                />
                <span className="text-slate-400 font-bold">/</span>
                <input
                  type="number"
                  required
                  min={30}
                  max={160}
                  value={diastolic}
                  onChange={e => setDiastolic(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center focus:border-blue-500 focus:outline-hidden"
                  placeholder="Diastolic"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 90/60 - 120/80</span>
            </div>

            {/* Pulse Rate */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> Pulse / Heart Rate
                </span>
                <span className="text-[10px] text-slate-400 font-mono">bpm</span>
              </div>
              <input
                type="number"
                required
                min={30}
                max={220}
                value={pulse}
                onChange={e => setPulse(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 60 - 100 bpm</span>
            </div>

            {/* Temperature */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temperature
                </span>
                <span className="text-[10px] text-slate-400 font-mono">°C</span>
              </div>
              <input
                type="number"
                step="0.1"
                required
                min={32}
                max={44}
                value={temperature}
                onChange={e => setTemperature(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 36.5 - 37.5 °C</span>
            </div>

            {/* Oxygen Saturation */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-blue-500" /> SpO2 Saturation
                </span>
                <span className="text-[10px] text-slate-400 font-mono">%</span>
              </div>
              <input
                type="number"
                required
                min={50}
                max={100}
                value={spo2}
                onChange={e => setSpo2(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 95 - 100%</span>
            </div>

            {/* Respiratory Rate */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-teal-500" /> Respiratory Rate
                </span>
                <span className="text-[10px] text-slate-400 font-mono">bpm</span>
              </div>
              <input
                type="number"
                required
                min={8}
                max={60}
                value={respRate}
                onChange={e => setRespRate(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 12 - 20 breaths/min</span>
            </div>

            {/* Weight & Height with BMI */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-purple-500" /> Weight & Height
                </span>
                {bmi && (
                  <span className="text-[10px] font-bold font-mono bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                    BMI: {bmi}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.5"
                  required
                  min={1}
                  max={300}
                  value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center focus:border-blue-500 focus:outline-hidden"
                  placeholder="kg"
                />
                <span className="text-[11px] text-slate-400 font-bold">kg</span>
                <input
                  type="number"
                  required
                  min={40}
                  max={250}
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-lg text-center focus:border-blue-500 focus:outline-hidden"
                  placeholder="cm"
                />
                <span className="text-[11px] text-slate-400 font-bold">cm</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Standard anthropometric metrics</span>
            </div>
          </div>
        </div>

        {/* Wong-Baker Pain Scale */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>Wong-Baker Pain Scale Rating</span>
              <span className="text-slate-400 font-normal">(0 = No Hurt, 10 = Hurts Worst)</span>
            </label>
            <span className="text-xs font-bold text-blue-700 font-mono bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {painScale} / 10 {painScale === 0 ? '• No Pain' : painScale <= 3 ? '• Mild' : painScale <= 6 ? '• Moderate' : '• Severe'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={painScale}
            onChange={e => setPainScale(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>0 (None)</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8</span>
            <span>10 (Worst)</span>
          </div>
        </div>

        {/* Basic Nursing Observations & Clinical Triage Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              General Appearance & Consciousness
            </label>
            <input
              type="text"
              value={generalAppearance}
              onChange={e => setGeneralAppearance(e.target.value)}
              placeholder="e.g. Alert, oriented x3, well hydrated"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobility & Ambulation
            </label>
            <select
              value={mobility}
              onChange={e => setMobility(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden bg-white"
            >
              <option value="Independent / Ambulatory">Independent / Ambulatory</option>
              <option value="Assisted Ambulation">Assisted Ambulation (Cane / Crutches)</option>
              <option value="Wheelchair Arrival">Wheelchair Arrival</option>
              <option value="Stretcher / Non-ambulatory">Stretcher / Non-ambulatory</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nursing Observations & Clinical Triage Notes
          </label>
          <textarea
            rows={3}
            value={nursingNotes}
            onChange={e => setNursingNotes(e.target.value)}
            placeholder="Record subjective observations, skin color, distress cues, or immediate nursing interventions..."
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Workflow Confirmation Box */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Next Workflow Step:</p>
            <p className="text-blue-700 mt-0.5">
              Upon submission, vital signs will be permanently stored in patient EMR and this visit will advance from <strong>WAITING FOR NURSE</strong> to <strong>WAITING FOR DOCTOR</strong>. {appointment.doctorName} will immediately receive the patient in their clinical queue.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Assessment & Forward to Doctor</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
