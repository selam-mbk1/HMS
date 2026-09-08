import React, { useState, useMemo } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { Patient, EmergencyTriageLevel } from '../../types';
import { 
  AlertOctagon, 
  Activity, 
  Search, 
  User, 
  UserPlus, 
  Stethoscope, 
  Clock, 
  Ambulance, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  AlertTriangle,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
  Flame,
  BadgeAlert,
  Thermometer,
  EyeOff
} from 'lucide-react';

interface EmergencyRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated?: (caseId: string) => void;
}

export const EmergencyRegistrationModal: React.FC<EmergencyRegistrationModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated
}) => {
  const { patients, addEmergencyCase } = useHospital();

  // Multi-step state (1 to 5)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Existing vs New
  const [patientType, setPatientType] = useState<'EXISTING' | 'NEW' | 'UNKNOWN'>('EXISTING');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Step 2: Quick Registration Fields
  const [patientId, setPatientId] = useState(`PAT-00${Math.floor(150 + Math.random() * 50)}`);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isUnknownPatient, setIsUnknownPatient] = useState(false);

  // Step 3: Emergency Visit Details
  const [visitId, setVisitId] = useState(`ER-000${Math.floor(40 + Math.random() * 60)}`);
  const [arrivalTime, setArrivalTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [arrivalMethod, setArrivalMethod] = useState<'Walk-in' | 'Ambulance' | 'Wheelchair' | 'Stretcher' | 'Police/Bystander'>('Walk-in');
  const [chiefComplaint, setChiefComplaint] = useState('Severe chest pain');
  const [accompaniedBy, setAccompaniedBy] = useState('');

  // Step 4: Triage & Vitals
  const [bpSystolic, setBpSystolic] = useState<number>(90);
  const [bpDiastolic, setBpDiastolic] = useState<number>(60);
  const [pulse, setPulse] = useState<number>(115);
  const [temp, setTemp] = useState<number>(37.2);
  const [spo2, setSpo2] = useState<number>(89);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(24);
  const [painLevel, setPainLevel] = useState<number>(9);
  const [gcsScore, setGcsScore] = useState<number>(15);
  const [priority, setPriority] = useState<'CRITICAL' | 'URGENT' | 'NORMAL'>('CRITICAL');

  // Step 5: Assign Doctor & Bed
  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Hana Tesfaye (Emergency Lead)');
  const [assignedBay, setAssignedBay] = useState('Resuscitation Bay 1 (Red Zone)');
  const [status, setStatus] = useState<'IN_PROGRESS' | 'TRIAGED'>('IN_PROGRESS');

  // Filter existing patients
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return patients.filter(
      p =>
        p.id.toLowerCase().includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [patients, searchQuery]);

  // One-click scenario preset loader (Abebe Kebede with severe chest pain)
  const loadAbebeScenario = () => {
    // Find Abebe Kebede or setup
    const existingAbebe = patients.find(
      p => p.firstName.toLowerCase().includes('abebe') || p.lastName.toLowerCase().includes('kebede')
    );

    if (existingAbebe) {
      setPatientType('EXISTING');
      setSelectedPatient(existingAbebe);
      setSearchQuery(existingAbebe.firstName + ' ' + existingAbebe.lastName);
      setFullName(`${existingAbebe.firstName} ${existingAbebe.lastName}`);
      setAge(existingAbebe.age || 48);
      setGender(existingAbebe.gender || 'MALE');
      setPhone(existingAbebe.phone);
      setPatientId(existingAbebe.id);
    } else {
      setPatientType('NEW');
      setFullName('Abebe Kebede');
      setAge(48);
      setGender('MALE');
      setPhone('+251 91 199 8877');
      setPatientId('PAT-00125');
    }

    setVisitId('ER-00045');
    setArrivalTime('09:35 AM');
    setArrivalMethod('Walk-in');
    setChiefComplaint('Severe chest pain');
    setBpSystolic(90);
    setBpDiastolic(60);
    setPulse(115);
    setTemp(37.2);
    setSpo2(89);
    setRespiratoryRate(24);
    setPainLevel(9);
    setPriority('CRITICAL');
    setAssignedDoctor('Dr. Hana Tesfaye (Emergency Lead)');
    setAssignedBay('Resuscitation Bay 1 (Red Zone)');
    setStatus('IN_PROGRESS');
    setCurrentStep(3);
  };

  // Unknown trauma patient preset
  const loadUnknownTraumaPreset = () => {
    setPatientType('UNKNOWN');
    setIsUnknownPatient(true);
    setFullName('Unknown Patient (Trauma/Acute)');
    setAge(45);
    setGender('MALE');
    setPhone('Unidentified');
    setEmergencyContact('Unknown / Bystander arrival');
    setChiefComplaint('Severe acute distress / Unconscious trauma');
    setArrivalMethod('Ambulance');
    setBpSystolic(85);
    setBpDiastolic(55);
    setPulse(125);
    setTemp(36.8);
    setSpo2(88);
    setPainLevel(10);
    setPriority('CRITICAL');
    setAssignedDoctor('Dr. Hana Tesfaye (Emergency Lead)');
    setAssignedBay('Trauma Resuscitation Bay A');
    setCurrentStep(3);
  };

  const handleSelectExistingPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFullName(`${patient.firstName} ${patient.lastName}`);
    setAge(patient.age);
    setGender(patient.gender);
    setPhone(patient.phone);
    setEmergencyContact(patient.emergencyContact?.name || '');
    setPatientId(patient.id);
    setCurrentStep(3); // Jump directly to Emergency Visit Info!
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activeName = isUnknownPatient
      ? 'Unknown Patient (Approx 45y M)'
      : selectedPatient
      ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
      : fullName.trim() || 'Unidentified Emergency Patient';

    const triageLevelMap: Record<string, EmergencyTriageLevel> = {
      CRITICAL: 'CRITICAL',
      URGENT: 'URGENT',
      NORMAL: 'NORMAL'
    };

    const newCase = addEmergencyCase({
      id: visitId,
      patientId: selectedPatient?.id || patientId,
      patientName: activeName,
      age: Number(age),
      gender: gender,
      phone: phone,
      emergencyContact: emergencyContact,
      arrivalTime: arrivalTime,
      arrivalMethod: arrivalMethod,
      chiefComplaint: chiefComplaint.trim() || 'Severe acute presentation',
      triageLevel: triageLevelMap[priority] || 'CRITICAL',
      priority: priority,
      gcsScore: Number(gcsScore),
      vitals: {
        bp: `${bpSystolic}/${bpDiastolic} mmHg`,
        pulse: Number(pulse),
        spo2: Number(spo2),
        temp: Number(temp)
      },
      vitalSigns: {
        bloodPressureSystolic: Number(bpSystolic),
        bloodPressureDiastolic: Number(bpDiastolic),
        pulseRate: Number(pulse),
        temperature: Number(temp),
        oxygenSaturation: Number(spo2),
        respiratoryRate: Number(respiratoryRate),
        painLevel: Number(painLevel)
      },
      assignedDoctor: assignedDoctor,
      bedAssigned: assignedBay,
      status: status,
      waitingMinutes: 2
    });

    if (onCaseCreated) {
      onCaseCreated(newCase.id);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚑 Emergency Patient Fast-Track Registration"
      subtitle="Acute emergency intake, clinical triage protocol & emergency doctor assignment"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Scenario Demo Quick-Action Bar */}
        <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="text-xs font-semibold text-rose-950">
              Scenario Preset: Severe Chest Pain Arrival (Abebe Kebede)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadAbebeScenario}
              className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              Load Abebe Scenario
            </button>
            <button
              type="button"
              onClick={loadUnknownTraumaPreset}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition flex items-center gap-1"
            >
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              Unknown Patient
            </button>
          </div>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="border border-slate-200 rounded-xl bg-slate-50 p-3">
          <div className="grid grid-cols-5 gap-2">
            {[
              { num: 1, label: 'Patient Type', icon: Search },
              { num: 2, label: 'Quick Info', icon: UserPlus },
              { num: 3, label: 'Visit Details', icon: Ambulance },
              { num: 4, label: 'Triage & Vitals', icon: Activity },
              { num: 5, label: 'Assign Doctor', icon: Stethoscope }
            ].map(step => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              const Icon = step.icon;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num as any)}
                  className={`flex flex-col items-center text-center p-2 rounded-lg transition ${
                    isCurrent
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                    <span className="text-xs font-mono font-bold">0{step.num}</span>
                  </div>
                  <span className="text-[11px] truncate max-w-full mt-0.5">
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Existing vs New Patient */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                1
              </span>
              Is this an existing patient or a new emergency arrival?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPatientType('EXISTING');
                  setIsUnknownPatient(false);
                }}
                className={`p-4 rounded-xl border text-left transition flex items-start gap-3 ${
                  patientType === 'EXISTING'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Existing Patient Record</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Search by Patient ID (e.g. PAT-00125), Phone, or Name. Re-uses existing EMR history.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPatientType('NEW');
                  setIsUnknownPatient(false);
                  setSelectedPatient(null);
                }}
                className={`p-4 rounded-xl border text-left transition flex items-start gap-3 ${
                  patientType === 'NEW'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">New Patient (Quick Registration)</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Fast-track intake with essential details only. System generates Patient ID & Visit ID.
                  </p>
                </div>
              </button>
            </div>

            {/* Existing Patient Search Section */}
            {patientType === 'EXISTING' && (
              <div className="p-4 border border-blue-200 bg-blue-50/30 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Search Patient Directory (ID, Phone, or Name)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Type 'Abebe', 'PAT-00125', or phone number..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Search Results List */}
                {searchResults.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    <p className="text-[11px] font-semibold text-slate-500">Matching Records Found:</p>
                    {searchResults.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectExistingPatient(p)}
                        className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                          selectedPatient?.id === p.id
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-md ${selectedPatient?.id === p.id ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">
                                {p.firstName} {p.middleName} {p.lastName}
                              </span>
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedPatient?.id === p.id ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                                {p.id}
                              </span>
                            </div>
                            <p className={`text-[11px] ${selectedPatient?.id === p.id ? 'text-blue-100' : 'text-slate-500'}`}>
                              {p.age} yrs • {p.gender} • Phone: {p.phone}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            selectedPatient?.id === p.id
                              ? 'bg-white text-blue-700'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          Select Patient
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
                    <span>No existing patient matching &ldquo;{searchQuery}&rdquo;.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPatientType('NEW');
                        setFullName(searchQuery);
                        setCurrentStep(2);
                      }}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs"
                    >
                      Quick Register &ldquo;{searchQuery}&rdquo;
                    </button>
                  </div>
                ) : null}

                {/* If patient already selected */}
                {selectedPatient && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-950">
                        Selected: {selectedPatient.firstName} {selectedPatient.lastName} ({selectedPatient.id})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-md hover:bg-emerald-700 flex items-center gap-1"
                    >
                      Proceed to Visit Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(patientType === 'EXISTING' && selectedPatient ? 3 : 2)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5"
              >
                Continue to Step 02 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Quick Patient Registration */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                Quick Patient Information
              </h3>
              <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Fast-Track Mode (Full registration can be finalized later)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Abebe Kebede"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Auto-Generated Patient ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={patientId}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-100 border border-slate-300 rounded-xl text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age / Approximate Age *
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  required
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other / Undetermined</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone (if available)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +251 91 199 8877"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Contact (if available)
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Tirhas Kebede (Spouse)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Step 1
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5"
              >
                Continue to Visit Info <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Record Emergency Visit Information */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                3
              </span>
              Record Emergency Visit Information
            </h3>

            {/* Patient Header Banner */}
            <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Patient File</span>
                <p className="text-xs font-bold text-slate-900">
                  {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : fullName || 'Abebe Kebede'}
                  <span className="font-mono font-normal text-slate-500 ml-2">
                    ({selectedPatient?.id || patientId})
                  </span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Emergency Visit ID</span>
                <p className="text-xs font-mono font-bold text-rose-700">{visitId}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Arrival Time *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={arrivalTime}
                    onChange={e => setArrivalTime(e.target.value)}
                    placeholder="e.g. 09:35 AM"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Arrival Method *
                </label>
                <select
                  value={arrivalMethod}
                  onChange={e => setArrivalMethod(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="Walk-in">Walk-in</option>
                  <option value="Ambulance">Ambulance (Red Siren / STAT)</option>
                  <option value="Wheelchair">Wheelchair</option>
                  <option value="Stretcher">Stretcher / Gurney</option>
                  <option value="Police/Bystander">Police / Bystander Escort</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chief Complaint & Acute Symptoms *
              </label>
              <textarea
                rows={2}
                required
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                placeholder="e.g. Severe crushing substernal chest pain radiating to left arm and jaw with diaphoresis..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />

              {/* Quick Clinical Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Quick Fill:</span>
                {[
                  'Severe chest pain',
                  'Acute dyspnea / shortness of breath',
                  'Trauma / Road Traffic Accident',
                  'Acute abdominal pain',
                  'Sudden unilateral weakness / CVA',
                  'Severe allergic anaphylaxis'
                ].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setChiefComplaint(chip)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Accompanied By / Escort Details
              </label>
              <input
                type="text"
                value={accompaniedBy}
                onChange={e => setAccompaniedBy(e.target.value)}
                placeholder="e.g. Spouse / Paramedic Unit 4 / Self"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(patientType === 'EXISTING' ? 1 : 2)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5"
              >
                Proceed to Triage Evaluation <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Triage & Vitals */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                Nurse Triage & Immediate Vital Signs
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Staff Protocol Decision
              </span>
            </div>

            {/* Triage Priority Selector */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Emergency Priority Level (Assigned by Clinical Staff) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    level: 'CRITICAL',
                    title: '🔴 CRITICAL',
                    sub: 'Immediate resuscitation / life-threatening',
                    time: '0 min wait',
                    style: 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500'
                  },
                  {
                    level: 'URGENT',
                    title: '🟠 URGENT',
                    sub: 'High risk / severe pain / rapid deterioration',
                    time: '< 15 min wait',
                    style: 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500'
                  },
                  {
                    level: 'NORMAL',
                    title: '🟢 NORMAL',
                    sub: 'Stable condition / minor emergency',
                    time: '< 60 min wait',
                    style: 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500'
                  }
                ].map(item => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setPriority(item.level as any)}
                    className={`p-3 rounded-xl border text-left transition ${
                      priority === item.level
                        ? item.style
                        : 'border-slate-200 hover:bg-slate-100 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{item.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/80 border border-slate-200">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] mt-1 text-slate-600">{item.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-white border border-slate-200 rounded-xl">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Blood Pressure (mmHg)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={bpSystolic}
                    onChange={e => setBpSystolic(Number(e.target.value))}
                    className="w-full p-2 text-xs font-mono font-bold text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="font-bold text-slate-400">/</span>
                  <input
                    type="number"
                    value={bpDiastolic}
                    onChange={e => setBpDiastolic(Number(e.target.value))}
                    className="w-full p-2 text-xs font-mono font-bold text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">e.g. 90/60 (Hypotensive)</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Pulse / HR (bpm)
                </label>
                <input
                  type="number"
                  value={pulse}
                  onChange={e => setPulse(Number(e.target.value))}
                  className="w-full p-2 text-xs font-mono font-bold text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">e.g. 115 (Tachycardia)</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={e => setTemp(Number(e.target.value))}
                  className="w-full p-2 text-xs font-mono font-bold text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">e.g. 37.2°C</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  value={spo2}
                  onChange={e => setSpo2(Number(e.target.value))}
                  className="w-full p-2 text-xs font-mono font-bold text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">e.g. 89% (Hypoxia alert)</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Pain Level (0 - 10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={e => setPainLevel(Number(e.target.value))}
                  className="w-full p-2 text-xs font-mono font-bold text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-rose-700"
                />
                <p className="text-[10px] text-rose-600 font-bold mt-1">9/10 Severe Pain</p>
              </div>
            </div>

            {/* Pain Scale Bar */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Visual Pain Intensity Gauge:</span>
                <span className="font-bold text-rose-600">{painLevel} / 10 (Severe)</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painLevel}
                onChange={e => setPainLevel(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 (No Pain)</span>
                <span>3 (Mild)</span>
                <span>6 (Moderate)</span>
                <span className="text-rose-600 font-bold">9-10 (Worst Possible)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Visit Info
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5"
              >
                Continue to Doctor Assignment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Assign Doctor & Send to Emergency Queue */}
        {currentStep === 5 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                5
              </span>
              Assign Emergency Doctor & Admit to Emergency Queue
            </h3>

            {/* Summary Card */}
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-bold text-rose-950">
                    Emergency Case Ready to Deploy: {visitId}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                  🔴 {priority} PRIORITY
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Patient</span>
                  <p className="font-bold text-slate-900">
                    {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : fullName || 'Abebe Kebede'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Arrival</span>
                  <p className="font-bold text-slate-900">{arrivalTime} • {arrivalMethod}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Vitals</span>
                  <p className="font-mono font-bold text-slate-900">{bpSystolic}/{bpDiastolic} | HR {pulse}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Oxygen / Pain</span>
                  <p className="font-mono font-bold text-rose-700">SpO2 {spo2}% | Pain {painLevel}/10</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Emergency Physician *
                </label>
                <select
                  value={assignedDoctor}
                  onChange={e => setAssignedDoctor(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                >
                  <option value="Dr. Hana Tesfaye (Emergency Lead)">Dr. Hana Tesfaye (Emergency Lead)</option>
                  <option value="Dr. Dawit Haile (Trauma Surgeon)">Dr. Dawit Haile (Trauma Surgeon)</option>
                  <option value="Dr. Sara Bekele (Cardiology Specialist)">Dr. Sara Bekele (Cardiology Specialist)</option>
                  <option value="Dr. Biruk Assefa (Acute Care)">Dr. Biruk Assefa (Acute Care)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign ER Bay / Bed *
                </label>
                <select
                  value={assignedBay}
                  onChange={e => setAssignedBay(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                >
                  <option value="Resuscitation Bay 1 (Red Zone)">Resuscitation Bay 1 (Red Zone)</option>
                  <option value="Trauma Resuscitation Bay A">Trauma Resuscitation Bay A</option>
                  <option value="Acute Cardiac Bay 2">Acute Cardiac Bay 2</option>
                  <option value="Observation Bed 4">Observation Bed 4</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Encounter Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('IN_PROGRESS')}
                  className={`p-3 rounded-xl border text-left transition ${
                    status === 'IN_PROGRESS'
                      ? 'border-rose-600 bg-rose-50 ring-2 ring-rose-600 font-bold text-rose-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">⚡ IN PROGRESS (Immediate Doctor Hand-off)</span>
                  <p className="text-[11px] font-normal text-slate-500 mt-0.5">Doctor opens consultation immediately.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('TRIAGED')}
                  className={`p-3 rounded-xl border text-left transition ${
                    status === 'TRIAGED'
                      ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600 font-bold text-amber-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">⏱️ TRIAGED (Emergency Queue)</span>
                  <p className="text-[11px] font-normal text-slate-500 mt-0.5">Queued on live ER board with 2 min wait timer.</p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Triage
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                Dispatch to Emergency Doctor & Queue
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
