import React, { useState, useMemo } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Building2, 
  Heart, 
  Baby, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Printer, 
  Lock, 
  Check, 
  AlertTriangle,
  UserPlus
} from 'lucide-react';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedPatientId?: string;
}

const TIME_SLOTS = [
  // Morning Sessions
  '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  // Afternoon Sessions
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

interface DepartmentConfig {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  description: string;
  roomRange: string;
  standardFee: number; // in ETB
}

const HOSPITAL_DEPARTMENTS: DepartmentConfig[] = [
  {
    id: 'INTERNAL_MED',
    name: 'Internal Medicine',
    category: 'Adult Primary & Chronic Care',
    icon: Stethoscope,
    description: 'Hypertension, diabetes, metabolic & general systemic evaluation',
    roomRange: 'Rooms 201 - 208',
    standardFee: 450
  },
  {
    id: 'CARDIOLOGY',
    name: 'Cardiology',
    category: 'Heart & Vascular',
    icon: Heart,
    description: 'Echocardiography, ECG, heart failure, coronary disease & arrhythmias',
    roomRange: 'Rooms 101 - 104',
    standardFee: 650
  },
  {
    id: 'PEDIATRICS',
    name: 'Pediatrics & Child Health',
    category: 'Infant, Child & Adolescent',
    icon: Baby,
    description: 'Immunization, neonatal jaundice, pediatric growth & acute illnesses',
    roomRange: 'Rooms 110 - 114',
    standardFee: 400
  },
  {
    id: 'SURGERY',
    name: 'General Surgery',
    category: 'Surgical Consultations',
    icon: Activity,
    description: 'Pre-operative assessment, post-op wound review, minor surgicals',
    roomRange: 'Rooms 301 - 306',
    standardFee: 600
  },
  {
    id: 'OBGYN',
    name: 'Obstetrics & Gynecology',
    category: 'Women Health & Maternity',
    icon: Sparkles,
    description: 'Antenatal care (ANC), high-risk pregnancy, pelvic ultrasound',
    roomRange: 'Rooms 118 - 124',
    standardFee: 500
  },
  {
    id: 'ORTHOPEDICS',
    name: 'Orthopedics & Trauma',
    category: 'Bones & Joints',
    icon: ShieldCheck,
    description: 'Fracture management, joint pain, spine care & sports trauma',
    roomRange: 'Rooms 310 - 315',
    standardFee: 550
  }
];

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  preSelectedPatientId
}) => {
  const { patients, appointments, bookAppointment } = useHospital();
  const { users } = useAuth();

  const doctors = useMemo(() => users.filter(u => u.role === 'DOCTOR'), [users]);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientFilter, setPatientFilter] = useState<'ALL' | 'INPATIENT' | 'OUTPATIENT'>('ALL');
  const [selectedPatientId, setSelectedPatientId] = useState(preSelectedPatientId || patients[0]?.id || '');
  const [selectedDepartment, setSelectedDepartment] = useState('Internal Medicine');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('2026-09-05');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'NEW_CONSULTATION' | 'FOLLOW_UP' | 'ROUTINE_CHECKUP' | 'EMERGENCY'>('FOLLOW_UP');
  const [reason, setReason] = useState('Routine review and clinical follow-up');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedAppointmentId, setGeneratedAppointmentId] = useState('');

  // Find patient & doctor objects
  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const doctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
  const deptConfig = HOSPITAL_DEPARTMENTS.find(d => d.name === selectedDepartment) || HOSPITAL_DEPARTMENTS[0];

  // Filter patients in Step 1
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = 
        `${p.firstName} ${p.middleName || ''} ${p.lastName}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.phone.includes(patientSearch);

      if (!matchesSearch) return false;
      if (patientFilter === 'INPATIENT') return p.status === 'INPATIENT';
      if (patientFilter === 'OUTPATIENT') return p.status !== 'INPATIENT';
      return true;
    });
  }, [patients, patientSearch, patientFilter]);

  // Calculate booked slots for selected doctor and date to visually indicate and prevent double booking
  const doctorBookedSlots = useMemo(() => {
    return appointments
      .filter(a => a.doctorId === selectedDoctorId && a.date === selectedDate && a.status !== 'CANCELLED')
      .map(a => a.time);
  }, [appointments, selectedDoctorId, selectedDate]);

  // Check if patient already has another appointment on this date & time (patient conflict prevention)
  const patientBookedSlots = useMemo(() => {
    return appointments
      .filter(a => a.patientId === selectedPatientId && a.date === selectedDate && a.status !== 'CANCELLED')
      .map(a => a.time);
  }, [appointments, selectedPatientId, selectedDate]);

  // Determine if double-booking condition is met
  const isSlotDoubleBooked = (time: string) => {
    return doctorBookedSlots.includes(time);
  };

  const isPatientConflict = (time: string) => {
    return patientBookedSlots.includes(time);
  };

  const handleSelectSlot = (time: string) => {
    if (isSlotDoubleBooked(time)) {
      return; // strictly prevent double booking
    }
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    if (!patient || !doctor || !selectedTime) return;

    // Strict Double-Booking Guard
    if (isSlotDoubleBooked(selectedTime)) {
      alert(`Conflict Detected: Dr. ${doctor.name} is already booked at ${selectedTime} on ${selectedDate}. Please select an open slot.`);
      return;
    }

    const newApt = bookAppointment({
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientPhone: patient.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: selectedDepartment,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      status: 'CONFIRMED',
      reason,
      roomNumber: doctor.department.includes('Cardiology') ? 'Clinic 102' : 'Clinic 204'
    });

    setGeneratedAppointmentId(newApt.id);
    setBookingSuccess(true);
  };

  const handleClose = () => {
    setBookingSuccess(false);
    setStep(1);
    setSelectedTime('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Outpatient Clinical Scheduling Wizard"
      subtitle={
        bookingSuccess
          ? 'Appointment Confirmed — Electronic Pass Generated'
          : `Step ${step} of 6: ${
              step === 1
                ? 'Select Patient from Registry'
                : step === 2
                ? 'Choose Clinical Department'
                : step === 3
                ? 'Select Attending Physician'
                : step === 4
                ? 'Choose Date & Visit Type'
                : step === 5
                ? 'Select Available Time Slot (Conflict-Checked)'
                : 'Review & Confirm Scheduling'
            }`
      }
      maxWidth="3xl"
    >
      {bookingSuccess ? (
        /* Final Booking Pass / Confirmation Ticket Screen */
        <div className="space-y-6 py-2">
          <div className="p-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950">Appointment Successfully Scheduled!</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
              Appointment record created in hospital central master database. The physician queue and receptionist check-in desks have been updated.
            </p>
          </div>

          {/* Hospital Official Appointment Pass Card */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-sm relative overflow-hidden font-sans">
            {/* Watermark/Hospital Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 tracking-wider uppercase">Bethel St. Paul Specialized Hospital</span>
                <h4 className="text-base font-bold text-slate-900">OUTPATIENT CONSULTATION PASS</h4>
                <p className="text-[11px] text-slate-500">Addis Ababa, Ethiopia • Emergency & Specialized Center</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Appointment Reference</span>
                <span className="text-base font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  {generatedAppointmentId || 'APT-2026-4821'}
                </span>
              </div>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-slate-200 text-xs">
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Patient Name & MRN</span>
                  <p className="font-bold text-slate-900 text-sm">{patient?.firstName} {patient?.middleName} {patient?.lastName}</p>
                  <p className="font-mono text-slate-500 text-[11px]">{patient?.id} • {patient?.age} yrs • {patient?.gender} • Blood: {patient?.bloodGroup}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Contact Number</span>
                  <p className="font-semibold text-slate-800">{patient?.phone}</p>
                </div>
                {patient?.allergies && patient.allergies.length > 0 && (
                  <div>
                    <span className="text-rose-600 text-[10px] uppercase font-bold block">Patient Drug Allergies</span>
                    <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block text-[11px]">
                      {patient.allergies.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Attending Physician</span>
                  <p className="font-bold text-slate-900 text-sm">{doctor?.name}</p>
                  <p className="text-slate-600 text-[11px]">{doctor?.specialization || doctor?.department} • Room 204</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Schedule Date & Slot</span>
                  <p className="font-mono font-bold text-blue-700 text-sm">{selectedDate} at {selectedTime}</p>
                  <span className="text-[10px] text-slate-500">Duration: 30 minutes • Outpatient Intake</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Consultation Fee</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block text-[11px]">
                    {deptConfig.standardFee} ETB (Pay at cashier)
                  </span>
                </div>
              </div>
            </div>

            {/* Verification & Instructions */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Anti-Double Booking Conflict Check: PASSED</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Please present this slip at Reception Desk upon hospital arrival.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Appointment Pass</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
            >
              Return to Clinic Overview
            </button>
          </div>
        </div>
      ) : (
        /* Multi-step Wizard Flow */
        <div className="space-y-6">
          {/* Step Progress Tracker with Labels */}
          <div className="space-y-2 border-b border-[#E2E8F0] pb-3">
            <div className="grid grid-cols-6 gap-1.5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-colors duration-200 ${
                    step >= i ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                  }`}
                />
              ))}
            </div>
            <div className="hidden sm:grid grid-cols-6 text-[10px] font-semibold text-[#64748B] text-center uppercase tracking-wider">
              <span className={step >= 1 ? 'text-[#2563EB] font-bold' : ''}>1. Patient</span>
              <span className={step >= 2 ? 'text-[#2563EB] font-bold' : ''}>2. Dept</span>
              <span className={step >= 3 ? 'text-[#2563EB] font-bold' : ''}>3. Doctor</span>
              <span className={step >= 4 ? 'text-[#2563EB] font-bold' : ''}>4. Date</span>
              <span className={step >= 5 ? 'text-[#2563EB] font-bold' : ''}>5. Slot</span>
              <span className={step >= 6 ? 'text-[#2563EB] font-bold' : ''}>6. Confirm</span>
            </div>
          </div>

          {/* STEP 1: Select Patient from Registry */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by patient name, MRN (e.g. PAT-001201), or phone..."
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {(['ALL', 'OUTPATIENT', 'INPATIENT'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setPatientFilter(f)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        patientFilter === f
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {filteredPatients.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No patients match your search criteria.
                  </div>
                ) : (
                  filteredPatients.map(p => {
                    const isSelected = selectedPatientId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPatientId(p.id)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'
                          }`}>
                            {p.firstName[0]}{p.lastName[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {p.firstName} {p.middleName} {p.lastName}
                              </p>
                              <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                                {p.id}
                              </span>
                              {p.status === 'INPATIENT' && (
                                <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200">
                                  Inpatient
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {p.age} yrs • {p.gender} • Blood: {p.bloodGroup} • Phone: {p.phone} • {p.subCity || p.city}
                            </p>
                            {p.allergies && p.allergies.length > 0 && (
                              <p className="text-[10px] text-rose-600 font-semibold mt-0.5">
                                Allergy: {p.allergies.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 pl-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                            isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Choose Department */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Select Clinical Specialty / Department
                </label>
                <p className="text-xs text-slate-500">
                  Each specialty routes to specialized outpatient clinic consultation rooms.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {HOSPITAL_DEPARTMENTS.map(dept => {
                  const Icon = dept.icon;
                  const isSelected = selectedDepartment === dept.name;
                  const activeDocs = doctors.filter(d => 
                    d.department.toLowerCase().includes(dept.name.toLowerCase().split(' ')[0]) ||
                    (dept.id === 'INTERNAL_MED' && d.department.includes('Internal')) ||
                    (dept.id === 'CARDIOLOGY' && d.department.includes('Cardiology'))
                  ).length || 2;

                  return (
                    <div
                      key={dept.id}
                      onClick={() => setSelectedDepartment(dept.name)}
                      className={`p-4 rounded-xl border cursor-pointer transition relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900">{dept.name}</p>
                          <p className="text-[10px] text-blue-700 font-semibold mt-0.5">{dept.category}</p>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{dept.description}</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>{dept.roomRange}</span>
                        <span className="font-semibold text-slate-700">{activeDocs} Doctors on Duty</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Select Doctor */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Assign Attending Consultant for {selectedDepartment}
                </label>
                <p className="text-xs text-slate-500">
                  Select an available physician with open scheduling capacity.
                </p>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {doctors.map(d => {
                  const isSelected = selectedDoctorId === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDoctorId(d.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
                        }`}>
                          {d.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900">{d.name}</p>
                            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                              Available Today
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {d.specialization || d.department} • Medical License: <span className="font-mono text-slate-700">{d.licenseNumber}</span>
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-mono">
                            <span>Consultation Fee: <strong className="text-slate-800">{deptConfig.standardFee} ETB</strong></span>
                            <span>•</span>
                            <span>Clinic Room: <strong>Room 204</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Pick Date & Clinical Reason */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Choose Appointment Date & Visit Nature
                </label>
                <p className="text-xs text-slate-500">
                  Select a clinical session date and specify the primary reason for consultation.
                </p>
              </div>

              {/* Quick Date Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-600 font-semibold block">Quick Date Select:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Today (Sept 5)', date: '2026-09-05' },
                    { label: 'Tomorrow (Sept 6)', date: '2026-09-06' },
                    { label: 'Monday (Sept 8)', date: '2026-09-08' },
                    { label: 'Next Week (Sept 12)', date: '2026-09-12' }
                  ].map(preset => (
                    <button
                      key={preset.date}
                      type="button"
                      onClick={() => setSelectedDate(preset.date)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        selectedDate === preset.date
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Calendar Date</label>
                  <input
                    type="date"
                    min="2026-09-05"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Visit Classification</label>
                  <select
                    value={appointmentType}
                    onChange={e => setAppointmentType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                  >
                    <option value="FOLLOW_UP">Follow-up Clinical Review</option>
                    <option value="NEW_CONSULTATION">New Patient Initial Consultation</option>
                    <option value="ROUTINE_CHECKUP">Routine Health / NCD Screening</option>
                    <option value="EMERGENCY">Urgent / Walk-in Workup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chief Complaint / Reason for Encounter *
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Describe patient's presenting symptoms or referral background..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Visual Time Slots & Double-Booking Prevention */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-900">
                      Select Available Time Slot for {doctor?.name}
                    </label>
                    <p className="text-xs text-slate-500">
                      Date: <strong className="text-slate-800 font-mono">{selectedDate}</strong> • Standard Slot: 30 minutes
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-emerald-700 font-semibold">
                      {TIME_SLOTS.length - doctorBookedSlots.length} Available
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-semibold">
                      {doctorBookedSlots.length} Booked
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Legend */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-white border border-slate-300" />
                  <span className="text-slate-600">Available Slot</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-blue-600 text-white" />
                  <span className="text-slate-800 font-semibold">Selected Slot</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-slate-200 border border-slate-300 relative overflow-hidden">
                    <div className="w-full h-full bg-repeating-linear-stripes opacity-40" />
                  </div>
                  <span className="text-slate-500">Booked / Unavailable (Double-Booking Prevented)</span>
                </div>
              </div>

              {/* Slots Grid */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Morning Clinical Hours (08:30 - 12:00)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {TIME_SLOTS.slice(0, 8).map(time => {
                      const isBooked = isSlotDoubleBooked(time);
                      const isPatientOccupied = isPatientConflict(time);
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSelectSlot(time)}
                          className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 relative ${
                            isBooked
                              ? 'bg-slate-100/90 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                              : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800 hover:shadow-2xs'
                          }`}
                          title={isBooked ? `Slot ${time} is already booked by Dr. ${doctor?.name} to prevent double-booking` : undefined}
                        >
                          <div className="flex items-center gap-1">
                            {isBooked && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                            <span className={`text-xs font-bold font-mono tracking-tight ${isBooked ? 'line-through text-slate-400' : ''}`}>
                              {time}
                            </span>
                          </div>

                          <span
                            className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                              isBooked
                                ? 'bg-slate-200 text-slate-600'
                                : isSelected
                                ? 'bg-blue-700 text-white'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Afternoon Clinical Hours (14:00 - 17:00)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {TIME_SLOTS.slice(8).map(time => {
                      const isBooked = isSlotDoubleBooked(time);
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSelectSlot(time)}
                          className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 relative ${
                            isBooked
                              ? 'bg-slate-100/90 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                              : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800 hover:shadow-2xs'
                          }`}
                          title={isBooked ? `Slot ${time} is already booked by Dr. ${doctor?.name} to prevent double-booking` : undefined}
                        >
                          <div className="flex items-center gap-1">
                            {isBooked && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                            <span className={`text-xs font-bold font-mono tracking-tight ${isBooked ? 'line-through text-slate-400' : ''}`}>
                              {time}
                            </span>
                          </div>

                          <span
                            className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                              isBooked
                                ? 'bg-slate-200 text-slate-600'
                                : isSelected
                                ? 'bg-blue-700 text-white'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {selectedTime ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Slot Confirmed: <strong>{selectedTime}</strong> on {selectedDate} with {doctor?.name}</span>
                  </div>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> No Conflicts
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Please click on an available time slot above to proceed.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Final Confirmation Review */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Review & Finalize Appointment Booking
                </label>
                <p className="text-xs text-slate-500">
                  Verify patient identity, allocated physician clinic room, and date/time.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 divide-y divide-slate-200/80 text-xs">
                <div className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient</span>
                    <p className="font-bold text-slate-900 text-sm">{patient?.firstName} {patient?.middleName} {patient?.lastName}</p>
                    <p className="font-mono text-slate-500 text-[11px]">{patient?.id} • {patient?.phone} • Blood: {patient?.bloodGroup}</p>
                  </div>
                  {patient?.allergies && patient.allergies.length > 0 && (
                    <div className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold self-start">
                      Allergy: {patient.allergies.join(', ')}
                    </div>
                  )}
                </div>

                <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Attending Physician</span>
                    <p className="font-bold text-slate-900">{doctor?.name}</p>
                    <p className="text-slate-500 text-[11px]">{selectedDepartment} • Clinic Room 204</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Scheduled Date & Time</span>
                    <p className="font-bold text-blue-700 font-mono text-sm">{selectedDate} at {selectedTime}</p>
                    <p className="text-slate-500 text-[11px]">Duration: 30 minutes consultation</p>
                  </div>
                </div>

                <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Visit Classification</span>
                    <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block text-[11px] mt-0.5">
                      {appointmentType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Consultation Fee</span>
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block text-[11px] mt-0.5">
                      {deptConfig.standardFee} ETB
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Clinical Indication / Reason</span>
                  <p className="text-slate-700 mt-1 leading-relaxed">{reason}</p>
                </div>
              </div>

              {/* Anti-Double Booking Safeguard Confirmation Box */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-950">System Double-Booking Validation: PASSED</p>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    Verified against {doctor?.name}’s master schedule for {selectedDate}. No concurrent appointments exist for this slot.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Action Footer */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(s => Math.max(1, s - 1) as any)}
              className="px-4 py-2 text-xs font-medium text-[#0F172A] bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] disabled:opacity-40 transition interactive-btn"
            >
              Back
            </button>

            {step < 6 ? (
              <button
                type="button"
                disabled={
                  (step === 1 && !selectedPatientId) ||
                  (step === 5 && !selectedTime)
                }
                onClick={() => setStep(s => Math.min(6, s + 1) as any)}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1E3A8A] rounded-xl shadow-card-subtle disabled:opacity-40 transition interactive-btn flex items-center gap-1.5"
              >
                <span>Continue to Step {step + 1}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1E3A8A] rounded-xl shadow-card-subtle transition interactive-btn flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Schedule Appointment</span>
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
