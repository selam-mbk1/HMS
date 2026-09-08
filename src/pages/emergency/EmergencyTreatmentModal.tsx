import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { EmergencyCase } from '../../types';
import { 
  Stethoscope, 
  HeartPulse, 
  Activity, 
  FlaskConical, 
  Pill, 
  FileText, 
  ArrowRight, 
  BedDouble, 
  CheckCircle2, 
  LogOut, 
  Share2, 
  Clock, 
  AlertCircle,
  Plus,
  ShieldCheck,
  Building
} from 'lucide-react';

interface EmergencyTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyCase: EmergencyCase | null;
}

export const EmergencyTreatmentModal: React.FC<EmergencyTreatmentModalProps> = ({
  isOpen,
  onClose,
  emergencyCase
}) => {
  const { 
    beds, 
    wards, 
    updateEmergencyCase, 
    admitEmergencyToInpatient, 
    dischargeEmergencyCase,
    requestLabTest,
    dispensePrescription
  } = useHospital();

  // Active Tab: 1. Clinical Evaluation (Step 7) | 2. Disposition / Outcome (Step 8)
  const [activeTab, setActiveTab] = useState<'TREATMENT' | 'OUTCOME'>('TREATMENT');

  // Step 7 Doctor inputs
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [examinationNotes, setExaminationNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentGiven, setTreatmentGiven] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [orderedMeds, setOrderedMeds] = useState<string[]>([]);

  // Step 8 Outcome / Disposition
  const [outcome, setOutcome] = useState<'ADMITTED' | 'DISCHARGED' | 'TRANSFERRED' | 'OBSERVATION'>('ADMITTED');
  const [selectedWardId, setSelectedWardId] = useState('');
  const [selectedBedId, setSelectedBedId] = useState('');
  
  // Discharge specific
  const [dischargeDiagnosis, setDischargeDiagnosis] = useState('');
  const [dischargeInstructions, setDischargeInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );

  // Transfer specific
  const [transferFacility, setTransferFacility] = useState('Tikur Anbessa Specialized Referral Hospital (Cardiology Center)');
  const [transferReason, setTransferReason] = useState('Urgent Percutaneous Coronary Intervention (PCI) / Cath Lab');

  // Initialize or populate when emergencyCase changes
  useEffect(() => {
    if (emergencyCase) {
      setChiefComplaint(emergencyCase.chiefComplaint || 'Severe chest pain');
      setSymptoms(
        emergencyCase.symptoms ||
        'Sudden-onset retrosternal squeezing pain radiating to left shoulder and neck. Diaphoresis, nausea, mild dyspnea.'
      );
      setExaminationNotes(
        emergencyCase.examinationNotes ||
        'Alert, distressed, diaphoretic. BP: 90/60 mmHg, HR: 115 bpm (sinus tachycardia), SpO2: 89% on room air. S1 S2 heard, no murmurs. Lungs clear bilaterally.'
      );
      setDiagnosis(
        emergencyCase.diagnosis || 'Acute Coronary Syndrome (Suspected STEMI) / Angina Pectoris'
      );
      setTreatmentGiven(
        emergencyCase.treatmentGiven ||
        '1. High-flow O2 via nasal cannula (4 L/min) -> SpO2 improved to 96%.\n2. Chewable Aspirin 300 mg administered stat.\n3. Sublingual Nitroglycerin 0.4 mg.\n4. Dual 18G IV cannulation in left antecubital fossa.\n5. Normal Saline 500 mL bolus.'
      );
      setDoctorNotes(
        emergencyCase.doctorNotes ||
        'STAT ECG ordered showing ST elevation in V1-V4. Cardiac enzymes sent. Requires immediate coronary intensive care admission.'
      );
      setSelectedLabs(
        emergencyCase.laboratoryRequests?.length
          ? emergencyCase.laboratoryRequests
          : ['STAT Cardiac Troponin-I', '12-Lead ECG Analysis', 'Complete Blood Count (CBC)', 'Serum Electrolytes (K+, Na+)']
      );
      setOrderedMeds(
        emergencyCase.medicationsOrdered?.length
          ? emergencyCase.medicationsOrdered
          : ['Aspirin 300mg Oral', 'Nitroglycerin 0.4mg Sublingual', 'Morphine 4mg IV (Titrated)', 'Atorvastatin 80mg Oral']
      );
      setDischargeDiagnosis(
        emergencyCase.diagnosis || 'Acute Coronary Syndrome (Suspected STEMI)'
      );
      setDischargeInstructions(
        emergencyCase.dischargeInstructions ||
        'Strict rest. Take prescribed medications punctually. Avoid strenuous activities. Return immediately if chest pain recurs.'
      );

      // Default ward and bed
      const icuWard = wards.find(w => w.type === 'ICU') || wards[0];
      if (icuWard) {
        setSelectedWardId(icuWard.id);
        const avail = beds.find(b => b.wardId === icuWard.id && b.status === 'AVAILABLE');
        if (avail) setSelectedBedId(avail.id);
      }
    }
  }, [emergencyCase, wards, beds]);

  if (!emergencyCase) return null;

  // Available beds in selected ward
  const availableBeds = beds.filter(
    b => (!selectedWardId || b.wardId === selectedWardId) && b.status === 'AVAILABLE'
  );

  const toggleLab = (lab: string) => {
    setSelectedLabs(prev => 
      prev.includes(lab) ? prev.filter(l => l !== lab) : [...prev, lab]
    );
  };

  const handleSaveTreatment = () => {
    updateEmergencyCase(emergencyCase.id, {
      chiefComplaint,
      symptoms,
      examinationNotes,
      diagnosis,
      treatmentGiven,
      doctorNotes,
      laboratoryRequests: selectedLabs,
      medicationsOrdered: orderedMeds,
      status: 'IN_PROGRESS'
    });

    // Also dispatch any ordered STAT labs to the lab worklist
    if (selectedLabs.length > 0 && emergencyCase.patientId) {
      selectedLabs.forEach(lab => {
        requestLabTest({
          patientId: emergencyCase.patientId || 'PAT-00125',
          patientName: emergencyCase.patientName,
          testName: lab,
          category: 'HEMATOLOGY',
          sampleType: 'Whole Blood',
          clinicalNotes: `STAT ER Request (${emergencyCase.id}): ${diagnosis}`,
          priority: 'URGENT'
        });
      });
    }

    setActiveTab('OUTCOME');
  };

  const handleFinalDisposition = (e: React.FormEvent) => {
    e.preventDefault();

    if (outcome === 'ADMITTED') {
      if (!selectedBedId) {
        alert('Please select an available bed for inpatient admission.');
        return;
      }
      admitEmergencyToInpatient(
        emergencyCase.id, 
        selectedBedId, 
        emergencyCase.assignedDoctor || 'Dr. Hana Tesfaye'
      );
    } else if (outcome === 'DISCHARGED') {
      dischargeEmergencyCase(emergencyCase.id, {
        diagnosis: dischargeDiagnosis || diagnosis,
        treatmentGiven,
        instructions: dischargeInstructions,
        followUpDate
      });
    } else {
      updateEmergencyCase(emergencyCase.id, {
        status: outcome === 'TRANSFERRED' ? 'TRANSFERRED' : 'OBSERVATION',
        disposition: outcome,
        doctorNotes: `${doctorNotes}\n\nDisposition: ${outcome} to ${transferFacility}. Reason: ${transferReason}`
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🩺 Emergency Clinical Care & Treatment: ${emergencyCase.id}`}
      subtitle={`Patient: ${emergencyCase.patientName} (${emergencyCase.age}y ${emergencyCase.gender}) • Triage: ${emergencyCase.triageLevel}`}
      maxWidth="5xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs (Step 7 vs Step 8) */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('TREATMENT')}
            className={`px-5 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'TREATMENT'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Step 7: Doctor Clinical Examination & Treatment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('OUTCOME')}
            className={`px-5 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'OUTCOME'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            Step 8: Clinical Outcome & Hospital Admission
          </button>
        </div>

        {/* TAB 1: Clinical Examination & Treatment (Step 7) */}
        {activeTab === 'TREATMENT' && (
          <div className="space-y-4">
            {/* Quick Vitals Banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  🔴 {emergencyCase.triageLevel}
                </span>
                <span className="font-semibold text-slate-700">Attending: {emergencyCase.assignedDoctor}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-slate-600">
                <span>BP: {emergencyCase.vitalSigns?.bloodPressureSystolic || 90}/{emergencyCase.vitalSigns?.bloodPressureDiastolic || 60} mmHg</span>
                <span>HR: {emergencyCase.vitalSigns?.pulseRate || 115} bpm</span>
                <span className="text-rose-600 font-bold">SpO2: {emergencyCase.vitalSigns?.oxygenSaturation || 89}%</span>
                <span>Temp: {emergencyCase.vitalSigns?.temperature || 37.2}°C</span>
                <span>Pain: {emergencyCase.vitalSigns?.painLevel || 9}/10</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Symptoms & Examination */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chief Complaint & History of Acute Presenting Illness *
                  </label>
                  <input
                    type="text"
                    value={chiefComplaint}
                    onChange={e => setChiefComplaint(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Presenting Symptoms & Clinical Course *
                  </label>
                  <textarea
                    rows={3}
                    value={symptoms}
                    onChange={e => setSymptoms(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Systematic Emergency Examination (HEENT, Cardiac, Chest, Abdomen)
                  </label>
                  <textarea
                    rows={3}
                    value={examinationNotes}
                    onChange={e => setExaminationNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Right Column: Diagnosis & Treatment Given */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Clinical Diagnosis (ICD-10 Working Impression) *
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-rose-300 bg-rose-50/40 rounded-xl font-bold text-rose-950 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Treatment & Stabilization Administered *
                  </label>
                  <textarea
                    rows={3}
                    value={treatmentGiven}
                    onChange={e => setTreatmentGiven(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Physician Clinical Orders & Progress Notes
                  </label>
                  <textarea
                    rows={3}
                    value={doctorNotes}
                    onChange={e => setDoctorNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Diagnostic Labs & Emergency Medications Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* STAT Labs */}
              <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                    STAT Diagnostic Lab Orders
                  </span>
                  <span className="text-[10px] text-blue-600 font-semibold">Auto-dispatches to Lab Worklist</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'STAT Cardiac Troponin-I',
                    '12-Lead ECG Analysis',
                    'Complete Blood Count (CBC)',
                    'Serum Electrolytes (K+, Na+)',
                    'Blood Urea Nitrogen (BUN)',
                    'D-Dimer Assay'
                  ].map(test => {
                    const isSelected = selectedLabs.includes(test);
                    return (
                      <button
                        key={test}
                        type="button"
                        onClick={() => toggleLab(test)}
                        className={`p-2 rounded-lg text-left text-xs transition border flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{test}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Medications */}
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    Emergency Medications Ordered & Administered
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Formulary Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'Aspirin 300mg Oral',
                    'Nitroglycerin 0.4mg Sublingual',
                    'Morphine 4mg IV (Titrated)',
                    'Atorvastatin 80mg Oral',
                    'Normal Saline 500mL IV',
                    'Heparin 5000 IU Bolus'
                  ].map(med => {
                    const isSelected = orderedMeds.includes(med);
                    return (
                      <button
                        key={med}
                        type="button"
                        onClick={() => {
                          setOrderedMeds(prev => 
                            prev.includes(med) ? prev.filter(m => m !== med) : [...prev, med]
                          );
                        }}
                        className={`p-2 rounded-lg text-left text-xs transition border flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{med}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Close Encounter
              </button>
              <button
                type="button"
                onClick={handleSaveTreatment}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition flex items-center gap-2"
              >
                Save Clinical Notes & Proceed to Step 8 (Disposition) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Disposition / Outcome (Step 8) */}
        {activeTab === 'OUTCOME' && (
          <form onSubmit={handleFinalDisposition} className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Step 8 — Clinical Disposition & Next Care Destination
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                After initial stabilization and emergency treatment, determine the patient outcome.
              </p>
            </div>

            {/* 4 Outcome Choices */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  type: 'ADMITTED',
                  title: '🛏️ Admit to Hospital',
                  desc: 'Transfer to Inpatient Ward / ICU Bed',
                  badge: 'Recommended for Chest Pain',
                  style: 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-600'
                },
                {
                  type: 'DISCHARGED',
                  title: '🏠 Discharge Home',
                  desc: 'Patient stabilized with follow-up instructions',
                  badge: 'Stable / Resolved',
                  style: 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600'
                },
                {
                  type: 'TRANSFERRED',
                  title: '🚑 Tertiary Transfer',
                  desc: 'External Cath Lab / Cardiac Hospital',
                  badge: 'Specialized Procedure',
                  style: 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600'
                },
                {
                  type: 'OBSERVATION',
                  title: '⏱️ Continue Observation',
                  desc: 'Hold in ER Observation Bay for 6-24 hrs',
                  badge: 'Monitoring',
                  style: 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-600'
                }
              ].map(opt => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setOutcome(opt.type as any)}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    outcome === opt.type
                      ? opt.style
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <h4 className="text-xs font-bold">{opt.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{opt.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/80 border border-slate-200">
                    {opt.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* IF ADMITTED: Emergency -> Admission -> Ward -> Room -> Bed */}
            {outcome === 'ADMITTED' && (
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-rose-700" />
                  <h4 className="text-xs font-bold text-rose-950">
                    Inpatient Admission Pathway: Emergency → Admission → Ward → Room → Bed
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Inpatient Ward *
                    </label>
                    <select
                      value={selectedWardId}
                      onChange={e => {
                        setSelectedWardId(e.target.value);
                        const firstAvail = beds.find(
                          b => b.wardId === e.target.value && b.status === 'AVAILABLE'
                        );
                        if (firstAvail) setSelectedBedId(firstAvail.id);
                      }}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-rose-500"
                    >
                      {wards.map(w => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.type}) — {w.totalBeds - w.occupiedBeds} beds available
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Available Bed Selection *
                    </label>
                    <select
                      value={selectedBedId}
                      onChange={e => setSelectedBedId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900 focus:ring-2 focus:ring-rose-500"
                    >
                      {availableBeds.length > 0 ? (
                        availableBeds.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.bedCode} (Room {b.roomNumber}) — Ready for Admission
                          </option>
                        ))
                      ) : (
                        <option value="">No available beds in this ward</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-white border border-rose-200 rounded-lg text-xs text-slate-700">
                  <p className="font-semibold text-rose-900">Immediate Actions on Admission:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-600 text-[11px]">
                    <li>Patient status updated to <span className="font-bold text-slate-900">INPATIENT</span> with assigned bed.</li>
                    <li>Selected bed marked <span className="font-bold text-rose-700">OCCUPIED</span> in the Hospital Bed Matrix.</li>
                    <li>Inpatient daily per-diem and nursing care charges added to active invoice.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* IF DISCHARGED: Discharge diagnosis, treatment given, instructions, follow-up */}
            {outcome === 'DISCHARGED' && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-emerald-950">
                    Discharge Summary & Patient Instructions
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Discharge Diagnosis *
                    </label>
                    <input
                      type="text"
                      value={dischargeDiagnosis}
                      onChange={e => setDischargeDiagnosis(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Follow-up Clinic Appointment Date
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={e => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discharge Instructions & Warning Signs *
                  </label>
                  <textarea
                    rows={2}
                    value={dischargeInstructions}
                    onChange={e => setDischargeInstructions(e.target.value)}
                    placeholder="Provide medication schedule, activity limits, and red flags..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>
            )}

            {/* IF TRANSFERRED */}
            {outcome === 'TRANSFERRED' && (
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold text-amber-950">
                    Tertiary Hospital Transfer Protocol
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Receiving Specialized Center *
                    </label>
                    <input
                      type="text"
                      value={transferFacility}
                      onChange={e => setTransferFacility(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Clinical Reason for Transfer
                    </label>
                    <input
                      type="text"
                      value={transferReason}
                      onChange={e => setTransferReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* IF OBSERVATION */}
            {outcome === 'OBSERVATION' && (
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-700" />
                  <h4 className="text-xs font-bold text-blue-950">
                    ER Acute Observation Unit Monitoring
                  </h4>
                </div>
                <p className="text-xs text-slate-600">
                  Patient remains in the Emergency Observation Bay for serial cardiac biomarkers, 
                  continuous telemetry, and repeat physical evaluation within 6 hours.
                </p>
              </div>
            )}

            {/* Form Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('TREATMENT')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Back to Clinical Notes
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Disposition & Finalize
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
