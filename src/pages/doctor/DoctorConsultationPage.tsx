import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  ArrowLeft,
  HeartPulse,
  Activity,
  Send,
  Sparkles,
  ShieldAlert,
  ClipboardList,
  Check,
  RotateCcw,
  Scale
} from 'lucide-react';
import { DiagnosisItem, PrescriptionItem } from '../../types';

interface SymptomEntry {
  name: string;
  duration: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

const COMMON_SYMPTOM_PRESETS = [
  'Fever',
  'Headache',
  'Generalized Fatigue',
  'Productive Cough',
  'Dry Cough',
  'Shortness of Breath',
  'Chest Tightness / Pain',
  'Palpitations',
  'Dizziness / Vertigo',
  'Nausea / Vomiting',
  'Ankle Edema',
  'Epigastric Pain',
  'Lower Back Pain',
  'Joint Swelling'
];

const COMMON_ICD10_PRESETS = [
  { code: 'I10', name: 'Essential (primary) hypertension' },
  { code: 'E11.9', name: 'Type 2 diabetes mellitus without complications' },
  { code: 'J06.9', name: 'Acute upper respiratory infection, unspecified' },
  { code: 'K29.7', name: 'Gastritis, unspecified' },
  { code: 'M54.5', name: 'Low back pain' },
  { code: 'R50.9', name: 'Fever, unspecified' },
  { code: 'N39.0', name: 'Urinary tract infection, site not specified' },
  { code: 'B54', name: 'Unspecified malaria' },
  { code: 'A09', name: 'Infectious gastroenteritis and colitis' },
  { code: 'E78.5', name: 'Hyperlipidemia, unspecified' }
];

const COMMON_LAB_PANELS = [
  { id: 'CBC', name: 'Complete Blood Count (CBC)', category: 'HEMATOLOGY', sample: 'Venous whole blood' },
  { id: 'FBG', name: 'Fasting Blood Glucose (FBG)', category: 'BIOCHEMISTRY', sample: 'Fluoride plasma' },
  { id: 'HBA1C', name: 'Hemoglobin A1c (HbA1c)', category: 'BIOCHEMISTRY', sample: 'Whole blood' },
  { id: 'LIPID', name: 'Lipid Profile Panel (TC, HDL, LDL, TG)', category: 'BIOCHEMISTRY', sample: 'Serum' },
  { id: 'RFT', name: 'Renal Function Test (Creatinine & BUN)', category: 'BIOCHEMISTRY', sample: 'Serum' },
  { id: 'LFT', name: 'Liver Function Test (ALT, AST, Bilirubin)', category: 'BIOCHEMISTRY', sample: 'Serum' },
  { id: 'URINE', name: 'Urinalysis (Routine & Microscopic)', category: 'URINALYSIS', sample: 'Mid-stream urine' },
  { id: 'ELECT', name: 'Serum Electrolytes (Na+, K+, Cl-)', category: 'BIOCHEMISTRY', sample: 'Serum' },
  { id: 'CXR', name: 'Chest X-Ray PA View', category: 'BIOCHEMISTRY', sample: 'Radiology' },
  { id: 'ECG', name: '12-Lead Electrocardiogram (ECG)', category: 'BIOCHEMISTRY', sample: 'Cardiology' }
];

export const DoctorConsultationPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const { 
    patients, 
    vitals, 
    medicines, 
    appointments,
    createConsultation, 
    requestLabTest, 
    recordVitals,
    updateAppointmentStatus 
  } = useHospital();

  // Find target patient
  const patient = patients.find(p => p.id === patientId) || patients[0];
  const patientVitals = vitals.find(v => v.patientId === patient?.id);

  // SECTION 1: Chief Complaint & Symptoms
  const [chiefComplaint, setChiefComplaint] = useState(
    'Persistent generalized fatigue, mild bilateral ankle swelling, and occasional palpitations for the past 2 weeks.'
  );
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([
    { name: 'Generalized Fatigue', duration: '2 weeks', severity: 'Moderate' },
    { name: 'Ankle Edema', duration: '10 days', severity: 'Mild' },
    { name: 'Palpitations', duration: '5 days', severity: 'Mild' }
  ]);
  const [customSymptomInput, setCustomSymptomInput] = useState('');
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState(
    'Patient is a known hypertensive on oral medication. Reports gradual onset of fatigue and shortness of breath upon exertion. Denies orthopnea or paroxysmal nocturnal dyspnea. No acute chest pain.'
  );

  // SECTION 2: Direct Vital Signs Inputs (Default: Read-Only Nursing Intake Vitals)
  const [isEditingVitals, setIsEditingVitals] = useState<boolean>(false);
  const [temp, setTemp] = useState<number>(patientVitals?.temperature || 36.8);
  const [systolic, setSystolic] = useState<number>(patientVitals?.bloodPressureSystolic || 138);
  const [diastolic, setDiastolic] = useState<number>(patientVitals?.bloodPressureDiastolic || 88);
  const [pulse, setPulse] = useState<number>(patientVitals?.pulseRate || 78);
  const [respRate, setRespRate] = useState<number>(patientVitals?.respiratoryRate || 18);
  const [spo2, setSpo2] = useState<number>(patientVitals?.oxygenSaturation || 98);
  const [weight, setWeight] = useState<number>(patientVitals?.weight || 72);
  const [height, setHeight] = useState<number>(patientVitals?.height || 170);

  // Automatic BMI Calculation
  const bmi = useMemo(() => {
    if (!weight || !height || height <= 0) return 0;
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }, [weight, height]);

  const bmiCategory = useMemo(() => {
    if (bmi === 0) return { label: 'N/A', color: 'text-slate-500 bg-slate-100' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Obese (Class I+)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  }, [bmi]);

  // SECTION 3: Clinical Examination (Systemic Review)
  const [examGeneral, setExamGeneral] = useState('Alert, oriented x3, comfortable at rest. No pallor, cyanosis, jaundice, or dehydration.');
  const [examHEENT, setExamHEENT] = useState('Pupils equal, round and reactive to light. Sclera anicteric, conjunctivae pink.');
  const [examCVS, setExamCVS] = useState('S1 and S2 audible, regular rhythm. No murmurs or gallops. Mild 1+ pitting bilateral ankle edema.');
  const [examRS, setExamRS] = useState('Bilateral air entry adequate. Vesicular breath sounds throughout lung fields, no crackles or rhonchi.');
  const [examAbdomen, setExamAbdomen] = useState('Soft, non-tender on palpation. Normal active bowel sounds. No organomegaly.');
  const [examMusculoskeletal, setExamMusculoskeletal] = useState('Normal range of motion in all major joints. No calf tenderness.');
  const [examNeuro, setExamNeuro] = useState('Grossly intact. Cranial nerves II-XII grossly intact. Motor power 5/5 bilateral.');

  // SECTION 4: Diagnoses (Multiple Entries allowed)
  const [diagnoses, setDiagnoses] = useState<DiagnosisItem[]>([
    { id: 'DIAG-1', code: 'I10', name: 'Essential (primary) hypertension', type: 'PRIMARY', notes: 'Uncontrolled BP' },
    { id: 'DIAG-2', code: 'E11.9', name: 'Type 2 diabetes mellitus without complications', type: 'SECONDARY', notes: 'Diet controlled' }
  ]);
  const [selectedPresetIcd, setSelectedPresetIcd] = useState('');
  const [newDiagCode, setNewDiagCode] = useState('');
  const [newDiagName, setNewDiagName] = useState('');
  const [newDiagType, setNewDiagType] = useState<'PRIMARY' | 'SECONDARY' | 'PROVISIONAL'>('SECONDARY');

  // SECTION 5: Diagnostic Laboratory Orders (Checkboxes + Priority)
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([
    'Complete Blood Count (CBC)',
    'Lipid Profile Panel (TC, HDL, LDL, TG)',
    'Renal Function Test (Creatinine & BUN)'
  ]);
  const [labPriority, setLabPriority] = useState<'NORMAL' | 'URGENT' | 'CRITICAL'>('NORMAL');
  const [labClinicalNotes, setLabClinicalNotes] = useState('Workup for suspected hypertensive end-organ involvement.');

  // SECTION 6: Electronic Prescriptions
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'RX-1',
      medicineId: medicines[0]?.id || 'MED-001',
      medicineName: medicines[0]?.name || 'Amlodipine Besylate',
      dosage: '5mg',
      frequency: 'Once Daily (Morning)',
      route: 'ORAL',
      duration: '30 days',
      quantity: 30,
      instructions: 'Take 1 tablet in the morning with water'
    }
  ]);

  // Selected drug to add
  const [selectedMedicineId, setSelectedMedicineId] = useState(medicines[0]?.id || '');
  const [rxDosage, setRxDosage] = useState('500mg');
  const [rxFrequency, setRxFrequency] = useState('Twice Daily (BID)');
  const [rxRoute, setRxRoute] = useState<'ORAL' | 'IV' | 'IM' | 'TOPICAL' | 'INHALATION'>('ORAL');
  const [rxDuration, setRxDuration] = useState('14 days');
  const [rxQuantity, setRxQuantity] = useState(28);
  const [rxInstructions, setRxInstructions] = useState('Take with or after food');

  // SECTION 7: Treatment Plan & Follow-up
  const [treatmentPlan, setTreatmentPlan] = useState(
    'Lifestyle modification: DASH diet with low sodium (<2g/day). Engage in 30 minutes of moderate aerobic exercise 5 days/week. Self-monitor blood pressure daily in the morning.'
  );
  const [followUpDate, setFollowUpDate] = useState('2026-09-19');
  const [followUpInstructions, setFollowUpInstructions] = useState('Return to clinic with home blood pressure log and fasting lab results.');

  // Draft state timestamp
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Add symptom helper
  const handleAddSymptom = (symptomName: string) => {
    if (!symptomName.trim()) return;
    if (symptoms.some(s => s.name.toLowerCase() === symptomName.toLowerCase())) return;
    setSymptoms(prev => [
      ...prev,
      { name: symptomName.trim(), duration: '3 days', severity: 'Moderate' }
    ]);
    setCustomSymptomInput('');
  };

  const handleRemoveSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  // Add diagnosis helper
  const handleAddDiagnosis = () => {
    if (!newDiagName.trim()) return;
    setDiagnoses(prev => [
      ...prev,
      {
        id: `DIAG-${Date.now()}`,
        code: newDiagCode.trim() || 'R69',
        name: newDiagName.trim(),
        type: newDiagType,
        notes: 'Assessed during consultation'
      }
    ]);
    setNewDiagCode('');
    setNewDiagName('');
  };

  const handleRemoveDiagnosis = (id: string) => {
    setDiagnoses(diagnoses.filter(d => d.id !== id));
  };

  // Laboratory checkbox toggle
  const handleToggleLabTest = (testName: string) => {
    if (selectedLabTests.includes(testName)) {
      setSelectedLabTests(selectedLabTests.filter(t => t !== testName));
    } else {
      setSelectedLabTests([...selectedLabTests, testName]);
    }
  };

  // Prescription builder helpers
  const handleAddPrescriptionItem = () => {
    const med = medicines.find(m => m.id === selectedMedicineId) || medicines[0];
    if (!med) return;

    setPrescriptions(prev => [
      ...prev,
      {
        id: `RX-${Date.now()}`,
        medicineId: med.id,
        medicineName: med.name,
        dosage: rxDosage || med.strength,
        frequency: rxFrequency,
        route: rxRoute,
        duration: rxDuration,
        quantity: rxQuantity,
        instructions: rxInstructions
      }
    ]);
  };

  const handleRemovePrescriptionItem = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  // Normal Systemic Exam Template Filler
  const handleFillNormalExam = () => {
    setExamGeneral('Alert, oriented x3, comfortable at rest. No pallor, cyanosis, jaundice, or lymphadenopathy. Well hydrated.');
    setExamHEENT('Normocephalic, pupils equal round reactive to light, moist oral mucosa, clear pharynx.');
    setExamCVS('S1 and S2 normal. Regular rate and rhythm. No murmurs, rubs, or gallops. Peripheral pulses intact, no peripheral edema.');
    setExamRS('Clear to auscultation bilaterally. Normal vesicular breath sounds. No wheezes, rhonchi, or rales.');
    setExamAbdomen('Abdomen soft, non-tender, non-distended. Bowel sounds normoactive. No palpable masses or organomegaly.');
    setExamMusculoskeletal('Full active and passive range of motion in all limbs. No deformity, warmth, or erythema.');
    setExamNeuro('Alert and fully oriented. Cranial nerves II-XII intact. Motor strength 5/5 in all extremities, sensations symmetric.');
    addToast('info', 'Exam Template Applied', 'Standard normal physical examination template loaded.');
  };

  // Action: Save Draft
  const handleSaveDraft = () => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(timeString);
    addToast('success', 'Draft Saved', `Clinical notes draft saved at ${timeString}.`);
  };

  // Action: Send Lab Request
  const handleSendLabRequest = () => {
    if (selectedLabTests.length === 0) {
      addToast('warning', 'No Tests Selected', 'Please check at least one laboratory test to request.');
      return;
    }

    selectedLabTests.forEach(testName => {
      requestLabTest({
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorId: currentUser.id,
        doctorName: currentUser.name,
        department: currentUser.department,
        testName,
        category: 'BIOCHEMISTRY',
        priority: labPriority,
        status: 'PENDING',
        sampleType: testName.includes('Urine') ? 'Mid-stream urine' : 'Venous whole blood',
        parameters: [
          { name: `${testName} Panel Item`, result: 'PENDING', unit: 'Standard', referenceRange: 'Normal' }
        ],
        clinicalNotes: `${labClinicalNotes} (Priority: ${labPriority})`
      });
    });

    addToast('success', 'Lab Orders Dispatched', `${selectedLabTests.length} diagnostic laboratory request(s) sent to central hospital lab with ${labPriority} priority.`);
  };

  // Action: Create Prescription
  const handleCreatePrescription = () => {
    if (prescriptions.length === 0) {
      addToast('warning', 'No Medications', 'Please add at least one prescription drug item.');
      return;
    }

    addToast('success', 'e-Prescription Dispatched', `${prescriptions.length} medication(s) sent directly to the central pharmacy dispensing queue.`);
  };

  // Action: Complete & Sign Consultation
  const handleCompleteConsultation = () => {
    if (!chiefComplaint.trim()) {
      addToast('error', 'Missing Information', 'Chief complaint is mandatory before signing consultation.');
      return;
    }

    if (diagnoses.length === 0) {
      addToast('error', 'Missing Diagnosis', 'At least one clinical diagnosis must be entered.');
      return;
    }

    // 1. Record vital signs
    recordVitals({
      patientId: patient.id,
      recordedBy: currentUser.name,
      temperature: temp,
      bloodPressureSystolic: systolic,
      bloodPressureDiastolic: diastolic,
      pulseRate: pulse,
      respiratoryRate: respRate,
      oxygenSaturation: spo2,
      weight,
      height
    });

    // 2. Aggregate clinical exam string
    const consolidatedExam = [
      `General: ${examGeneral}`,
      `HEENT: ${examHEENT}`,
      `CVS: ${examCVS}`,
      `RS: ${examRS}`,
      `Abdomen: ${examAbdomen}`,
      `Musculoskeletal: ${examMusculoskeletal}`,
      `Neurological: ${examNeuro}`
    ].join('\n');

    // 3. Create Consultation Record
    createConsultation({
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      department: currentUser.department,
      date: new Date().toISOString().slice(0, 10),
      chiefComplaint,
      symptoms: symptoms.map(s => `${s.name} (${s.severity}, ${s.duration})`),
      vitals: {
        temp,
        bp: `${systolic}/${diastolic}`,
        pulse,
        resp: respRate,
        spo2,
        weight
      },
      clinicalExamination: consolidatedExam,
      diagnoses,
      labRequests: selectedLabTests,
      treatmentPlan,
      prescriptions,
      followUpDate,
      followUpInstructions,
      status: 'COMPLETED'
    });

    // 4. If an appointment exists for this patient today, mark it completed
    const todayApt = appointments.find(a => a.patientId === patient.id && (a.status === 'IN_PROGRESS' || a.status === 'WAITING'));
    if (todayApt) {
      updateAppointmentStatus(todayApt.id, 'COMPLETED');
    }

    navigate('/doctor/dashboard');
  };

  if (!patient) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-sm font-semibold">Patient record could not be loaded.</p>
        <button onClick={() => navigate('/patients')} className="mt-3 text-xs text-blue-600 font-bold underline">
          Return to Patients Registry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Return to clinic queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Clinical Encounter Workspace</h1>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                Dr. {currentUser.name}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Electronic Medical Record documentation, systematic physical exam, laboratory orders, and formulary e-prescriptions.
            </p>
          </div>
        </div>

        {/* Global Consultation Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {lastSavedTime && (
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Draft saved at {lastSavedTime}
            </span>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2 text-xs font-semibold text-[#0F172A] bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] shadow-2xs transition interactive-btn flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-[#64748B]" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleSendLabRequest}
            className="px-3.5 py-2 text-xs font-semibold text-[#0D9488] bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition interactive-btn flex items-center gap-1.5"
          >
            <FlaskConical className="w-4 h-4 text-[#0D9488]" />
            <span>Send Lab Request</span>
          </button>

          <button
            type="button"
            onClick={handleCreatePrescription}
            className="px-3.5 py-2 text-xs font-semibold text-[#0891B2] bg-cyan-50 border border-cyan-200 rounded-xl hover:bg-cyan-100 transition interactive-btn flex items-center gap-1.5"
          >
            <Pill className="w-4 h-4 text-[#0891B2]" />
            <span>Create Prescription</span>
          </button>

          <button
            type="button"
            onClick={handleCompleteConsultation}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1E3A8A] rounded-xl shadow-card-subtle transition interactive-btn flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Consultation</span>
          </button>
        </div>
      </div>

      {/* Patient Clinical Information & Allergies Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight truncate">
                  {patient.firstName} {patient.middleName} {patient.lastName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  MRN: {patient.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  Blood Group: {patient.bloodGroup}
                </span>
                {patient.status === 'INPATIENT' && (
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                    Inpatient ({patient.currentWard || 'Ward 2B'} • Bed {patient.currentBed || 'B-04'})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {patient.age} years old • {patient.gender} • Phone: {patient.phone} • Residence: {patient.subCity || patient.city}
              </p>
            </div>
          </div>

          {/* Clinical Alerts / Allergies Alert Badge */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Allergies Alert - Prominent High-Contrast Red Warning */}
            <div className="px-4 py-2 rounded-xl bg-rose-50 border-2 border-rose-300 text-xs shadow-2xs">
              <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[10px] uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Drug & Food Allergies</span>
              </div>
              <p className="font-bold text-rose-950 text-xs mt-0.5">
                {patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'No Known Drug Allergies (NKDA)'}
              </p>
            </div>

            {/* Chronic Conditions Banner */}
            <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <span className="text-amber-700 font-bold block text-[10px] uppercase tracking-wider">Chronic Conditions</span>
              <p className="font-semibold text-amber-950 text-xs mt-0.5">
                {patient.chronicConditions && patient.chronicConditions.length > 0 ? patient.chronicConditions.join(', ') : 'None documented'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Nursing Intake Vital Signs (Read-Only by Default) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Triage Vital Signs & Anthropometry
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Read-Only Nursing Intake
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Recorded by: <strong className="text-slate-700">{patientVitals?.recordedBy || 'Sr. Tigist Mengistu, BSc'}</strong> • {patientVitals?.recordedAt || 'Intake Triage Station'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${bmiCategory.color}`}>
              BMI: {bmi > 0 ? `${bmi} kg/m² • ${bmiCategory.label}` : 'Enter Ht & Wt'}
            </span>
            <button
              type="button"
              onClick={() => setIsEditingVitals(!isEditingVitals)}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-50 transition cursor-pointer"
            >
              {isEditingVitals ? 'Done Rechecking' : 'Recheck Vitals'}
            </button>
          </div>
        </div>

        {!isEditingVitals ? (
          /* READ-ONLY NURSING VITALS PRESENTATION */
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Temperature */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Temp</span>
                <p className="text-base font-bold font-mono text-slate-900">{temp}°C</p>
                <span className={`text-[10px] block font-semibold ${temp > 37.5 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {temp > 37.5 ? 'Febrile' : 'Normal Range'}
                </span>
              </div>

              {/* Blood Pressure Systolic */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BP Systolic</span>
                <p className="text-base font-bold font-mono text-slate-900">{systolic} <span className="text-[10px] text-slate-400 font-sans">mmHg</span></p>
                <span className={`text-[10px] block font-semibold ${systolic >= 140 ? 'text-rose-600' : systolic >= 130 ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {systolic >= 140 ? 'Stage 2 HTN' : systolic >= 130 ? 'Stage 1 HTN' : 'Normal (<120)'}
                </span>
              </div>

              {/* Blood Pressure Diastolic */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BP Diastolic</span>
                <p className="text-base font-bold font-mono text-slate-900">{diastolic} <span className="text-[10px] text-slate-400 font-sans">mmHg</span></p>
                <span className={`text-[10px] block font-semibold ${diastolic >= 90 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {diastolic >= 90 ? 'Elevated' : 'Normal (<80)'}
                </span>
              </div>

              {/* Pulse Rate */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Heart / Pulse</span>
                <p className="text-base font-bold font-mono text-slate-900">{pulse} <span className="text-[10px] text-slate-400 font-sans">bpm</span></p>
                <span className={`text-[10px] block font-semibold ${pulse > 100 ? 'text-rose-600' : pulse < 60 ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {pulse > 100 ? 'Tachycardia' : pulse < 60 ? 'Bradycardia' : 'Normal (60-100)'}
                </span>
              </div>

              {/* Respiratory Rate */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resp Rate</span>
                <p className="text-base font-bold font-mono text-slate-900">{respRate} <span className="text-[10px] text-slate-400 font-sans">/min</span></p>
                <span className="text-[10px] block text-emerald-700 font-semibold">Normal (12-20)</span>
              </div>

              {/* SpO2 */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SpO2 (Room Air)</span>
                <p className="text-base font-bold font-mono text-slate-900">{spo2}%</p>
                <span className={`text-[10px] block font-semibold ${spo2 < 95 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {spo2 < 95 ? 'Hypoxia Warning' : 'Adequate (>95%)'}
                </span>
              </div>

              {/* Weight & Height */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Anthropometry</span>
                <p className="text-xs font-bold font-mono text-slate-900">{weight} kg • {height} cm</p>
                <span className="text-[10px] block text-slate-500 font-medium">BMI: {bmi} kg/m²</span>
              </div>
            </div>

            {patientVitals?.notes && (
              <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/70 text-xs text-blue-900 flex items-start gap-2">
                <span className="font-bold text-blue-800 text-[11px] shrink-0">Nurse Triage Note:</span>
                <span className="text-blue-950 font-normal">{patientVitals.notes}</span>
              </div>
            )}
          </div>
        ) : (
          /* OPTIONAL RECHECK EDITING FORM */
          <div className="space-y-3">
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
              <span>Physician Recheck Mode: You are recording an in-consultation re-evaluation of patient vitals.</span>
              <button
                type="button"
                onClick={() => setIsEditingVitals(false)}
                className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 font-bold text-amber-900 rounded text-[11px]"
              >
                Done
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Temp (°C)</span>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={e => setTemp(parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">BP Systolic</span>
                <input
                  type="number"
                  value={systolic}
                  onChange={e => setSystolic(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">BP Diastolic</span>
                <input
                  type="number"
                  value={diastolic}
                  onChange={e => setDiastolic(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Pulse (bpm)</span>
                <input
                  type="number"
                  value={pulse}
                  onChange={e => setPulse(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Resp Rate (/min)</span>
                <input
                  type="number"
                  value={respRate}
                  onChange={e => setRespRate(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">SpO2 (%)</span>
                <input
                  type="number"
                  value={spo2}
                  onChange={e => setSpo2(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Weight / Height</span>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                    placeholder="kg"
                    className="w-1/2 text-xs font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded-lg px-1.5 py-1"
                  />
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(parseFloat(e.target.value) || 0)}
                    placeholder="cm"
                    className="w-1/2 text-xs font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded-lg px-1.5 py-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): History, Physical Exam, Assessment */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: Chief Complaint & Symptoms */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">1. Chief Complaint & Symptoms</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Subjective History</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Primary Chief Complaint *
              </label>
              <input
                type="text"
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                placeholder="State the primary reason patient presented to clinic..."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden font-medium text-slate-900"
              />
            </div>

            {/* Active Symptoms Tags Table */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Documented Symptoms ({symptoms.length})
              </label>

              <div className="space-y-2">
                {symptoms.map((sym, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      <span className="font-bold text-slate-900">{sym.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">Duration:</span>
                        <input
                          type="text"
                          value={sym.duration}
                          onChange={e => {
                            const copy = [...symptoms];
                            copy[idx].duration = e.target.value;
                            setSymptoms(copy);
                          }}
                          className="w-20 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded-md font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">Severity:</span>
                        <select
                          value={sym.severity}
                          onChange={e => {
                            const copy = [...symptoms];
                            copy[idx].severity = e.target.value as any;
                            setSymptoms(copy);
                          }}
                          className="px-2 py-0.5 text-xs bg-white border border-slate-200 rounded-md font-semibold text-slate-700"
                        >
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Severe">Severe</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Preset Chips */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Click to add clinical symptom preset:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SYMPTOM_PRESETS.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddSymptom(preset)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 rounded-lg transition"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom symptom input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Or enter other symptom..."
                  value={customSymptomInput}
                  onChange={e => setCustomSymptomInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSymptom(customSymptomInput);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleAddSymptom(customSymptomInput)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* History of Present Illness */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                History of Present Illness (HPI) & Chronology
              </label>
              <textarea
                rows={4}
                value={historyOfPresentIllness}
                onChange={e => setHistoryOfPresentIllness(e.target.value)}
                placeholder="Include onset, character, radiation, relieving factors, and pertinent negatives..."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden text-slate-800 leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 3: Systematic Clinical Physical Examination */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  2. Clinical Examination (Systematic Review)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleFillNormalExam}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition flex items-center gap-1 w-fit"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Normal Exam Template</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* General & HEENT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">General Appearance</label>
                  <textarea
                    rows={2}
                    value={examGeneral}
                    onChange={e => setExamGeneral(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">HEENT & Mucosa</label>
                  <textarea
                    rows={2}
                    value={examHEENT}
                    onChange={e => setExamHEENT(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Cardiovascular & Respiratory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cardiovascular System (CVS)</label>
                  <textarea
                    rows={2}
                    value={examCVS}
                    onChange={e => setExamCVS(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Respiratory System (RS)</label>
                  <textarea
                    rows={2}
                    value={examRS}
                    onChange={e => setExamRS(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Abdomen & Musculoskeletal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Abdomen & Pelvis</label>
                  <textarea
                    rows={2}
                    value={examAbdomen}
                    onChange={e => setExamAbdomen(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Musculoskeletal & Extremities</label>
                  <textarea
                    rows={2}
                    value={examMusculoskeletal}
                    onChange={e => setExamMusculoskeletal(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Neurological */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Central & Peripheral Neurological</label>
                <textarea
                  rows={2}
                  value={examNeuro}
                  onChange={e => setExamNeuro(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Diagnoses & ICD-10 Coding */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  3. Clinical Diagnoses & ICD-10 Coding
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {diagnoses.length} Assessment(s) Logged
              </span>
            </div>

            {/* List of active diagnoses */}
            <div className="space-y-2">
              {diagnoses.map(d => (
                <div
                  key={d.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200">
                      {d.code}
                    </span>
                    <span className="font-bold text-slate-900 truncate">{d.name}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      d.type === 'PRIMARY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : d.type === 'SECONDARY'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.type}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDiagnosis(d.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick preset ICD-10 selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-semibold text-slate-600">
                Select from common hospital diagnosis presets:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_ICD10_PRESETS.map(icd => (
                  <button
                    key={icd.code}
                    type="button"
                    onClick={() => {
                      setNewDiagCode(icd.code);
                      setNewDiagName(icd.name);
                    }}
                    className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-slate-200 text-slate-700 font-mono transition"
                  >
                    {icd.code}: {icd.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Add Diagnosis Row */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                placeholder="ICD Code (e.g. I10)"
                value={newDiagCode}
                onChange={e => setNewDiagCode(e.target.value)}
                className="w-full sm:w-28 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden font-mono"
              />
              <input
                type="text"
                placeholder="Diagnosis Description (e.g. Essential Hypertension)"
                value={newDiagName}
                onChange={e => setNewDiagName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden font-medium"
              />
              <select
                value={newDiagType}
                onChange={e => setNewDiagType(e.target.value as any)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden font-semibold text-slate-700"
              >
                <option value="PRIMARY">PRIMARY</option>
                <option value="SECONDARY">SECONDARY</option>
                <option value="PROVISIONAL">PROVISIONAL</option>
              </select>
              <button
                type="button"
                onClick={handleAddDiagnosis}
                className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Orders, Prescriptions, Follow-Up */}
        <div className="space-y-6">
          {/* SECTION 5: Diagnostic Laboratory Requests (Checkboxes + Priority) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  4. Diagnostic Lab Requests
                </h3>
              </div>
              <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                {selectedLabTests.length} Selected
              </span>
            </div>

            {/* Priority Selector */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <span className="font-semibold text-slate-700">Order Priority:</span>
              <div className="flex items-center gap-1">
                {(['NORMAL', 'URGENT', 'CRITICAL'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setLabPriority(p)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                      labPriority === p
                        ? p === 'CRITICAL'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : p === 'URGENT'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Lab Test Checkboxes */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {COMMON_LAB_PANELS.map(panel => {
                const isChecked = selectedLabTests.includes(panel.name);
                return (
                  <div
                    key={panel.id}
                    onClick={() => handleToggleLabTest(panel.name)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition text-xs ${
                      isChecked
                        ? 'bg-purple-50/70 border-purple-300 ring-1 ring-purple-500/20'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                        isChecked ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="font-semibold text-slate-900">{panel.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{panel.sample}</span>
                  </div>
                );
              })}
            </div>

            {/* Clinical indication textarea */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Clinical Indication for Laboratory:
              </label>
              <input
                type="text"
                value={labClinicalNotes}
                onChange={e => setLabClinicalNotes(e.target.value)}
                placeholder="Reason for diagnostic request..."
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Dedicated Send Lab Request Button */}
            <button
              type="button"
              onClick={handleSendLabRequest}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Lab Request Now</span>
            </button>
          </div>

          {/* SECTION 6: Electronic Prescription Builder */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  5. Electronic Prescription (e-Rx)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-bold">
                {prescriptions.length} Drug(s)
              </span>
            </div>

            {/* Prescribed Items List */}
            <div className="space-y-2.5">
              {prescriptions.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{item.medicineName}</p>
                      <p className="text-[11px] text-slate-600">
                        {item.dosage} • {item.frequency} • {item.route} • {item.duration}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePrescriptionItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="pt-1 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Instructions: <strong className="text-slate-700">{item.instructions}</strong></span>
                    <span className="font-mono font-semibold">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Drug Selector & Fields */}
            <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5 text-xs">
              <span className="font-bold text-slate-800 block">Add Medication to Formulary</span>

              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Medicine Name</label>
                <select
                  value={selectedMedicineId}
                  onChange={e => setSelectedMedicineId(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  {medicines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.strength}) • Stock: {m.stockQuantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Dosage / Strength</label>
                  <input
                    type="text"
                    value={rxDosage}
                    onChange={e => setRxDosage(e.target.value)}
                    placeholder="e.g. 500mg"
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Frequency</label>
                  <select
                    value={rxFrequency}
                    onChange={e => setRxFrequency(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Once Daily (OD)">Once Daily (OD)</option>
                    <option value="Twice Daily (BID)">Twice Daily (BID)</option>
                    <option value="Three Times Daily (TID)">Three Times Daily (TID)</option>
                    <option value="Four Times Daily (QID)">Four Times Daily (QID)</option>
                    <option value="As Needed (PRN)">As Needed (PRN)</option>
                    <option value="Immediate (STAT)">Immediate (STAT)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Route</label>
                  <select
                    value={rxRoute}
                    onChange={e => setRxRoute(e.target.value as any)}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="ORAL">Oral</option>
                    <option value="IV">IV</option>
                    <option value="IM">IM</option>
                    <option value="TOPICAL">Topical</option>
                    <option value="INHALATION">Inhalation</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Duration</label>
                  <input
                    type="text"
                    value={rxDuration}
                    onChange={e => setRxDuration(e.target.value)}
                    placeholder="14 days"
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Dispense Qty</label>
                  <input
                    type="number"
                    value={rxQuantity}
                    onChange={e => setRxQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Patient Instructions</label>
                <input
                  type="text"
                  value={rxInstructions}
                  onChange={e => setRxInstructions(e.target.value)}
                  placeholder="Take after food with water..."
                  className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <button
                type="button"
                onClick={handleAddPrescriptionItem}
                className="w-full py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medication to Prescription</span>
              </button>
            </div>

            {/* Dedicated Create Prescription Button */}
            <button
              type="button"
              onClick={handleCreatePrescription}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Create & Dispatch Prescription</span>
            </button>
          </div>

          {/* SECTION 7: Treatment Plan & Follow-Up Advice */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                6. Treatment Plan & Follow-Up
              </h3>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Recommended Return Review Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Lifestyle & Dietary Recommendations
              </label>
              <textarea
                rows={3}
                value={treatmentPlan}
                onChange={e => setTreatmentPlan(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Patient Instructions / Warning Signs
              </label>
              <textarea
                rows={2}
                value={followUpInstructions}
                onChange={e => setFollowUpInstructions(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Quick Execution */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E2E8F0] px-6 py-3 shadow-modal-depth flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#0F172A] font-semibold hidden sm:inline">
            Active Encounter: <strong>{patient.firstName} {patient.lastName}</strong> ({patient.id})
          </span>
          <span className="text-[11px] text-[#64748B] font-mono">
            BP: {systolic}/{diastolic} mmHg • BMI: {bmi > 0 ? `${bmi}` : '-'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 text-xs font-semibold text-[#0F172A] bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition interactive-btn"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleCompleteConsultation}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1E3A8A] rounded-xl shadow-card-subtle transition interactive-btn flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete & Sign Encounter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
