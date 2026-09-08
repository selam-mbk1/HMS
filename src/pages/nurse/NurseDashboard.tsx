import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Appointment, Bed } from '../../types';
import { 
  HeartPulse, 
  BedDouble, 
  Clock, 
  CheckCircle2, 
  Activity, 
  UserCheck, 
  AlertTriangle,
  Plus,
  Pill,
  Calendar,
  FileText,
  Eye,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { RecordVitalsModal } from './RecordVitalsModal';
import { NurseAssessmentModal } from './NurseAssessmentModal';
import { ViewMedicationOrderModal, PendingMedicationDose } from './ViewMedicationOrderModal';

export const NurseDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { patients, beds, appointments, updateAppointmentStatus, addToast } = useHospital();
  const navigate = useNavigate();

  // Modals state
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined);

  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedAppointmentForAssessment, setSelectedAppointmentForAssessment] = useState<Appointment | null>(null);

  const [selectedMedicationDose, setSelectedMedicationDose] = useState<PendingMedicationDose | null>(null);

  // Inpatient ward patients (Occupied beds)
  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED');

  // Outpatient Nurse Queue:
  // Shows patients checked in by reception and waiting for the nurse
  const outpatientsWaiting = appointments.filter(
    a => a.status === 'WAITING_FOR_NURSE' || (a.status === 'WAITING' && a.type !== 'TELECONSULTATION')
  );

  // Pending Medication Doses (Scheduled doctor prescription orders for nursing administration)
  const [medicationDoses, setMedicationDoses] = useState<PendingMedicationDose[]>([
    {
      id: 'DOS-8801',
      patientId: 'PAT-001202',
      patientName: 'Hana Tesfaye',
      roomBed: 'Medical Ward A • Room 204 • Bed 204-A',
      scheduledTime: '08:00',
      medicineName: 'Paracetamol 500mg Tablets',
      dosage: '500mg',
      route: 'ORAL',
      frequency: 'Every 8 hours (TID)',
      prescribedBy: 'Dr. Hana Tesfaye, MD',
      instructions: 'Administer after morning meal. Monitor fever trend.',
      status: 'SCHEDULED'
    },
    {
      id: 'DOS-8802',
      patientId: 'PAT-001203',
      patientName: 'Samuel Bekele',
      roomBed: 'Medical Ward A • Room 205 • Bed 205-B',
      scheduledTime: '09:00',
      medicineName: 'Enalapril Maleate 10mg',
      dosage: '10mg',
      route: 'ORAL',
      frequency: 'Once daily morning (OD)',
      prescribedBy: 'Dr. Hana Tesfaye, MD',
      instructions: 'Check systolic BP before administration. Withhold if BP < 100/60.',
      status: 'SCHEDULED'
    },
    {
      id: 'DOS-8803',
      patientId: 'PAT-001205',
      patientName: 'Dawit Girma',
      roomBed: 'ICU • Room ICU-02 • Bed ICU-02-A',
      scheduledTime: '10:00',
      medicineName: 'Atorvastatin Calcium 20mg',
      dosage: '20mg',
      route: 'ORAL',
      frequency: 'Once daily (OD)',
      prescribedBy: 'Dr. Dawit Mengistu, MD',
      instructions: 'Post-cardiac catheterization therapy. Enter in telemetry log.',
      status: 'SCHEDULED'
    },
    {
      id: 'DOS-8804',
      patientId: 'PAT-001206',
      patientName: 'Almaz Tadesse',
      roomBed: 'ICU • Room ICU-03 • Bed ICU-03-A',
      scheduledTime: '10:30',
      medicineName: 'Ceftriaxone 1g Powder for Injection',
      dosage: '1g in 100ml NS',
      route: 'INTRAVENOUS (IV)',
      frequency: 'Once daily IV infusion over 30 mins',
      prescribedBy: 'Dr. Hana Tesfaye, MD',
      instructions: 'Flush cannula line before and after. Observe for anaphylaxis.',
      status: 'DUE_NOW'
    },
    {
      id: 'DOS-8805',
      patientId: 'PAT-001203',
      patientName: 'Samuel Bekele',
      roomBed: 'Medical Ward A • Room 205 • Bed 205-B',
      scheduledTime: '12:00',
      medicineName: 'Metformin Hydrochloride 850mg',
      dosage: '850mg',
      route: 'ORAL',
      frequency: 'Twice daily with meals (BID)',
      prescribedBy: 'Dr. Hana Tesfaye, MD',
      instructions: 'Give immediately after lunch.',
      status: 'SCHEDULED'
    },
    {
      id: 'DOS-8806',
      patientId: 'PAT-001202',
      patientName: 'Hana Tesfaye',
      roomBed: 'Medical Ward A • Room 204 • Bed 204-A',
      scheduledTime: '12:00',
      medicineName: 'Insulin Glargine (Lantus) 100 IU/ml',
      dosage: '10 IU',
      route: 'SUBCUTANEOUS (SC)',
      frequency: 'Daily at midday',
      prescribedBy: 'Dr. Dawit Mengistu, MD',
      instructions: 'Check fingerstick blood glucose before injection.',
      status: 'SCHEDULED'
    }
  ]);

  // Vitals Due schedule for ward patients
  const vitalsDueList = [
    {
      patientId: 'PAT-001202',
      patientName: 'Hana Tesfaye',
      roomBed: 'Medical Ward A • Room 204 • Bed 204-A',
      lastVitals: '04:00 AM (BP: 125/82, HR: 74, Temp: 36.8°C)',
      nextDue: 'Due Now (Q4H Round)',
      priority: 'ROUTINE',
      acuityColor: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      patientId: 'PAT-001203',
      patientName: 'Samuel Bekele',
      roomBed: 'Medical Ward A • Room 205 • Bed 205-B',
      lastVitals: '05:00 AM (BP: 142/92, HR: 88, Temp: 37.1°C)',
      nextDue: 'Due Now (BP Recheck)',
      priority: 'ATTENTION',
      acuityColor: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      patientId: 'PAT-001205',
      patientName: 'Dawit Girma',
      roomBed: 'ICU • Room ICU-02 • Bed ICU-02-A',
      lastVitals: '07:00 AM (BP: 112/72, HR: 96, SpO2: 94%)',
      nextDue: 'Due Now (Q2H ICU Telemetry)',
      priority: 'CRITICAL_MONITOR',
      acuityColor: 'text-rose-700 bg-rose-50 border-rose-200'
    },
    {
      patientId: 'PAT-001206',
      patientName: 'Almaz Tadesse',
      roomBed: 'ICU • Room ICU-03 • Bed ICU-03-A',
      lastVitals: '06:30 AM (BP: 130/84, HR: 82, SpO2: 96%)',
      nextDue: 'Due in 30 mins (Q4H Round)',
      priority: 'STABLE_CHECK',
      acuityColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    }
  ];

  const handleStartAssessment = (apt: Appointment) => {
    setSelectedAppointmentForAssessment(apt);
    setShowAssessmentModal(true);
  };

  const handleOpenVitalsForPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowVitalsModal(true);
  };

  const handleAdministerDose = (doseId: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMedicationDoses(prev => prev.map(d => {
      if (d.id === doseId) {
        return {
          ...d,
          status: 'ADMINISTERED',
          administeredAt: `Today at ${nowTime}`,
          administeredBy: currentUser.name
        };
      }
      return d;
    }));
    addToast('success', 'Medication Administered', `Dose logged successfully by ${currentUser.name}.`);
  };

  const pendingDosesCount = medicationDoses.filter(d => d.status !== 'ADMINISTERED').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* 4. Main Header: Realistic Nursing Station */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
              <HeartPulse className="w-5 h-5 text-teal-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Nursing Station & Patient Care Unit
            </h1>
            {/* Status Badge: Nursing Station Active (NOT Ward Telemetry Active) */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Nursing Station Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Nurse on Duty: <strong className="text-slate-800">{currentUser.name || 'Sr. Tigist Mengistu, BSc'}</strong> • Station: <strong className="text-blue-700">{currentUser.department || 'Inpatient Medical Ward'}</strong>
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.025, y: -1 }}
          whileTap={{ scale: 0.975 }}
          onClick={() => {
            setSelectedPatientId(undefined);
            setShowVitalsModal(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer relative z-10 group shrink-0"
        >
          <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
          <span>Record Patient Vitals</span>
        </motion.button>
      </motion.div>

      {/* 5. Quick Action / Statistics: Focus on Nursing Work */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Outpatients Waiting for Nurse"
            value={outpatientsWaiting.length}
            icon={Clock}
            iconColor="text-amber-600 bg-amber-50"
            subtitle="Check-in triage & vital assessment"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Ward Patients"
            value={occupiedBeds.length}
            icon={BedDouble}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Patients assigned to nursing care"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Medication Doses Due"
            value={`${pendingDosesCount} Scheduled`}
            icon={Pill}
            iconColor="text-teal-600 bg-teal-50"
            subtitle="Due in the next 2 hours"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Vitals Due"
            value={`${vitalsDueList.length} Patients`}
            icon={HeartPulse}
            iconColor="text-rose-600 bg-rose-50"
            subtitle="Vital signs requiring documentation"
          />
        </motion.div>
      </div>

      {/* 6. Section 1: OUTPATIENT NURSE QUEUE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Outpatient Nurse Queue</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                {outpatientsWaiting.length} waiting
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients checked in by reception awaiting vital-signs assessment and nursing triage before seeing the doctor
            </p>
          </div>
        </div>

        {outpatientsWaiting.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <UserCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No outpatient patients currently waiting for nursing assessment.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Appointment</th>
                  <th className="px-4 py-3">Doctor & Clinic</th>
                  <th className="px-4 py-3">Chief Complaint</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Nurse Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {outpatientsWaiting.map((apt) => (
                  <tr key={apt.id} className="hover:bg-blue-50/25 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {apt.patientName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {apt.patientId}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{apt.time}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{apt.date}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{apt.department}</div>
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-slate-600">
                      {apt.reason || 'General clinical review'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                        WAITING FOR NURSE
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {/* ONLY Start Assessment button - NO Check In button! */}
                      <motion.button
                        whileHover={{ scale: 1.025, y: -1 }}
                        whileTap={{ scale: 0.975 }}
                        onClick={() => handleStartAssessment(apt)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Start Assessment</span>
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 9. Section 2: MY WARD PATIENTS (Visually Distinct Inpatient Section) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">My Ward Patients</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                {occupiedBeds.length} Admitted
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients currently admitted to Inpatient Medical Ward under nursing care
            </p>
          </div>
          <button
            onClick={() => navigate('/inpatient/beds')}
            className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer flex items-center gap-1"
          >
            <span>Bed Overview</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Ward / Room / Bed Location</th>
                <th className="px-4 py-3">Admission Date</th>
                <th className="px-4 py-3">Attending Doctor</th>
                <th className="px-4 py-3">Nursing Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {occupiedBeds.map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/25 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {b.currentPatientName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {b.currentPatientId}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {/* ALWAYS SHOW ROOM AND BED */}
                    <div className="inline-flex items-center gap-1.5 font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                      <BedDouble className="w-3.5 h-3.5 text-blue-600" />
                      <span>{b.wardName} • {b.roomNumber} • {b.bedCode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    <span className="font-mono">Admitted: {b.admissionDate || '2026-09-03'}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-800">{b.attendingDoctor || 'Dr. Hana Tesfaye, MD'}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      ADMITTED • STABLE
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.975 }}
                        onClick={() => handleOpenVitalsForPatient(b.currentPatientId || 'PAT-001201')}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer flex items-center gap-1"
                      >
                        <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                        <span>Record Vitals</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.975 }}
                        onClick={() => navigate(`/patients/${b.currentPatientId || 'PAT-001201'}`)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 transition cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Patient</span>
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid for Sections 3 & 4: Pending Medication Doses and Vitals Due */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 10. SECTION 3: PENDING MEDICATION DOSES */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Pending Medication Doses</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized doctor prescription orders scheduled for nursing administration
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-teal-50 text-teal-800 rounded-full border border-teal-200">
              {pendingDosesCount} pending
            </span>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {medicationDoses.map((dose) => (
              <div 
                key={dose.id} 
                className="p-4 hover:bg-teal-50/20 flex items-center justify-between gap-3 transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-teal-700 transition-colors">
                      {dose.patientName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {dose.scheduledTime}
                    </span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      dose.status === 'ADMINISTERED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : dose.status === 'DUE_NOW'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {dose.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {dose.medicineName} • <span className="font-normal text-slate-500">{dose.dosage}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {dose.roomBed} • Dr: {dose.prescribedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedMedicationDose(dose)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer"
                  >
                    View Order
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 11. SECTION 4: VITALS DUE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Vitals Due</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Patients requiring vital-sign documentation & shift observation
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-rose-50 text-rose-800 rounded-full border border-rose-200">
              {vitalsDueList.length} Patients
            </span>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {vitalsDueList.map((item) => (
              <div 
                key={item.patientId} 
                className="p-4 hover:bg-rose-50/20 flex items-center justify-between gap-3 transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-rose-700 transition-colors">
                      {item.patientName}
                    </span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${item.acuityColor}`}>
                      {item.nextDue}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {item.roomBed}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Last: {item.lastVitals}
                  </p>
                </div>

                <div className="shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOpenVitalsForPatient(item.patientId)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition cursor-pointer flex items-center gap-1"
                  >
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Record Vitals</span>
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regular Vitals Recording Modal */}
      <RecordVitalsModal
        isOpen={showVitalsModal}
        onClose={() => setShowVitalsModal(false)}
        preSelectedPatientId={selectedPatientId}
      />

      {/* Dedicated Outpatient Nurse Assessment Modal */}
      <NurseAssessmentModal
        isOpen={showAssessmentModal}
        onClose={() => {
          setShowAssessmentModal(false);
          setSelectedAppointmentForAssessment(null);
        }}
        appointment={selectedAppointmentForAssessment}
        patient={patients.find(p => p.id === selectedAppointmentForAssessment?.patientId)}
      />

      {/* Physician Prescription Order (Read-Only) Modal */}
      <ViewMedicationOrderModal
        isOpen={!!selectedMedicationDose}
        onClose={() => setSelectedMedicationDose(null)}
        dose={selectedMedicationDose}
        onAdminister={handleAdministerDose}
      />
    </motion.div>
  );
};
