import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FlaskConical, 
  Stethoscope, 
  AlertTriangle, 
  ArrowRight, 
  Pill, 
  Activity,
  UserCheck,
  AlertOctagon,
  FileText,
  HeartPulse,
  ChevronRight
} from 'lucide-react';
import { BookAppointmentModal } from '../reception/BookAppointmentModal';

export const DoctorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { appointments, patients, labRequests, updateAppointmentStatus, emergencyCases, vitals } = useHospital();
  const navigate = useNavigate();

  const [showBookModal, setShowBookModal] = useState(false);

  // Filter today's doctor appointments, sorted chronologically by time
  const todayAppointments = useMemo(() => {
    return appointments
      .filter(
        a => a.doctorId === currentUser.id || a.doctorName.includes(currentUser.name.split(' ')[1] || '')
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, currentUser]);

  // Patients Waiting for Consultation: only patients who completed nurse assessment
  const waitingPatients = useMemo(() => {
    return todayAppointments.filter(
      a => a.status === 'WAITING_FOR_DOCTOR' || a.status === 'WAITING'
    );
  }, [todayAppointments]);

  const completedToday = useMemo(() => {
    return todayAppointments.filter(a => a.status === 'COMPLETED');
  }, [todayAppointments]);

  // Critical / Abnormal Labs requiring physician review
  const criticalLabs = useMemo(() => {
    return labRequests.filter(
      l => l.priority === 'CRITICAL' || (l.status === 'COMPLETED' && l.parameters?.some(p => p.isAbnormal))
    );
  }, [labRequests]);

  // Active STAT / Urgent emergency cases triaged in Emergency Department (kept separate from outpatient queue)
  const activeEmergencies = useMemo(() => {
    return (emergencyCases || []).filter(
      c => c.status !== 'DISCHARGED' && c.status !== 'ADMITTED_INPATIENT'
    );
  }, [emergencyCases]);

  // Status transition: WAITING FOR DOCTOR -> IN CONSULTATION / IN PROGRESS -> COMPLETED
  const handleStartConsultation = (patientId: string, appointmentId?: string) => {
    if (appointmentId) {
      updateAppointmentStatus(appointmentId, 'IN_PROGRESS');
    }
    navigate(`/doctor/consultation/${patientId}`);
  };

  const patientCountText = `${waitingPatients.length} ${waitingPatients.length === 1 ? 'patient' : 'patients'}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Top Welcome & Quick Actions Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Good morning, {currentUser.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
              Department: Internal Medicine
            </span>
            {/* Live Active Telemetry Pulse */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Clinical Queue Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            You have <strong className="text-blue-700 font-bold">{patientCountText}</strong> triaged by nursing staff and waiting for consultation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBookModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-xs cursor-pointer"
          >
            + Schedule Patient
          </motion.button>
          {waitingPatients.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleStartConsultation(waitingPatients[0].patientId, waitingPatients[0].id)}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer group"
            >
              <Stethoscope className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
              <span>Call Next Patient ({waitingPatients[0].patientName})</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Metric Cards with Motion Stagger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Today's Appointments"
            value={todayAppointments.length}
            icon={Calendar}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Scheduled visits for today"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Waiting for Consultation"
            value={waitingPatients.length}
            icon={UserCheck}
            iconColor="text-amber-600 bg-amber-50"
            subtitle="Nurse assessment completed"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Consultations Completed"
            value={completedToday.length}
            icon={CheckCircle2}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="Diagnosis & treatment logged"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Requires Physician Review"
            value={criticalLabs.length}
            icon={FlaskConical}
            iconColor="text-rose-600 bg-rose-50"
            subtitle="Abnormal & critical lab reports"
          />
        </motion.div>
      </div>

      {/* Critical Lab Alert Banner - Only shown for REQUIRES PHYSICIAN REVIEW */}
      {criticalLabs.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-rose-50/90 border border-rose-200 rounded-2xl flex items-start justify-between gap-3 text-xs text-rose-900 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600 animate-pulse shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 border border-rose-300 font-mono">
                  REQUIRES PHYSICIAN REVIEW
                </span>
                <span className="text-[11px] text-rose-700 font-medium">Diagnostic Alert</span>
              </div>
              <p className="text-rose-900 mt-1 font-semibold">
                Lab result for <strong>{criticalLabs[0].patientName}</strong> ({criticalLabs[0].testName}) contains out-of-range critical parameters requiring physician review.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/laboratory/requests')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shrink-0 shadow-xs transition cursor-pointer"
          >
            Review Diagnostic Report
          </motion.button>
        </motion.div>
      )}

      {/* Grid: Waiting Room Queue, Appointments Schedule & Emergency Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Clinical Queues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Queue: Patients Waiting for Consultation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Patients Waiting for Consultation</h3>
                  <p className="text-[11px] text-slate-500">Triage & vitals assessment completed by nursing staff</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                {patientCountText}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {waitingPatients.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">All triaged patients have been consulted.</p>
                  <p className="mt-0.5 text-slate-400">Next patients will appear here once intake triage is completed by nursing.</p>
                </div>
              ) : (
                waitingPatients.map((apt, index) => {
                  const pt = patients.find(p => p.id === apt.patientId);
                  const ptVitals = vitals.find(v => v.patientId === apt.patientId);
                  return (
                    <div key={apt.id} className="p-4 hover:bg-blue-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 group">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-200 transition-transform mt-0.5">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {apt.patientName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              {apt.patientId}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Nurse Assessment Complete
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-1">
                            {pt?.age}y • {pt?.gender} • Blood: {pt?.bloodGroup || 'O+'} • <span className="text-slate-800 font-medium">Chief Complaint:</span> {apt.reason}
                          </p>

                          {/* Quick Nursing Vitals Snippet */}
                          {ptVitals && (
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                              <span>BP: <strong className="text-slate-800">{ptVitals.bloodPressureSystolic}/{ptVitals.bloodPressureDiastolic}</strong></span>
                              <span>HR: <strong className="text-slate-800">{ptVitals.pulseRate} bpm</strong></span>
                              <span>Temp: <strong className="text-slate-800">{ptVitals.temperature}°C</strong></span>
                              <span>SpO2: <strong className="text-slate-800">{ptVitals.oxygenSaturation}%</strong></span>
                              <span className="text-slate-400 font-sans text-[10px]">Triage: {ptVitals.recordedBy}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleStartConsultation(apt.patientId, apt.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-end sm:self-center"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Start Consultation</span>
                      </motion.button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Today's Full Schedule Table - Strictly Chronological */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Today's Appointment Schedule</h3>
                <p className="text-[11px] text-slate-500">Chronologically ordered outpatient appointments for Internal Medicine</p>
              </div>
              <span className="text-xs text-slate-500 font-mono font-medium">{todayAppointments.length} visits total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Patient Details</th>
                    <th className="px-4 py-3">Encounter Type</th>
                    <th className="px-4 py-3">Nurse Assessment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Clinical Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayAppointments.map((a) => {
                    const hasVitals = vitals.some(v => v.patientId === a.patientId);
                    return (
                      <tr key={a.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{a.time}</td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/patients/${a.patientId}`)}>
                            {a.patientName}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{a.patientId}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-medium">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {a.type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {hasVitals ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Vitals Logged
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                              <Clock className="w-3 h-3" />
                              Scheduled
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {a.status === 'WAITING_FOR_DOCTOR' || a.status === 'WAITING' ? (
                            <button
                              onClick={() => handleStartConsultation(a.patientId, a.id)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition flex items-center gap-1 ml-auto"
                            >
                              <Stethoscope className="w-3 h-3" /> Start
                            </button>
                          ) : a.status === 'IN_PROGRESS' ? (
                            <button
                              onClick={() => handleStartConsultation(a.patientId, a.id)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 transition flex items-center gap-1 ml-auto"
                            >
                              <Activity className="w-3 h-3" /> In Session
                            </button>
                          ) : a.status === 'COMPLETED' ? (
                            <button
                              onClick={() => navigate(`/patients/${a.patientId}`)}
                              className="text-xs text-slate-500 hover:text-blue-700 font-semibold inline-flex items-center gap-1 hover:underline"
                            >
                              <FileText className="w-3 h-3" /> Review EMR
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/patients/${a.patientId}`)}
                              className="text-xs text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1"
                            >
                              View EMR <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Emergency Cases Card & Clinical Shortcuts */}
        <div className="space-y-6">
          {/* Emergency Cases Dedicated Card (Separate from outpatient queue) */}
          <div className="bg-white rounded-2xl border border-rose-200 shadow-card-subtle overflow-hidden">
            <div className="p-4 border-b border-rose-100 bg-rose-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  Emergency Cases (STAT / Critical)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-800">
                {activeEmergencies.length} Active
              </span>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Emergency department cases requiring rapid physician evaluation:
              </p>

              {activeEmergencies.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No critical emergency cases currently pending physician review.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeEmergencies.slice(0, 3).map(ec => (
                    <div 
                      key={ec.id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-rose-50/40 hover:border-rose-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                          ec.triageLevel === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {ec.triageLevel} TRIAGE
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{ec.arrivalTime || 'Just now'}</span>
                      </div>

                      <p className="text-xs font-bold text-slate-900 mt-1.5">{ec.patientName}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{ec.chiefComplaint}</p>

                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono">
                          Age: {ec.age} • GCS: {ec.gcsScore || 15}/15
                        </span>
                        <button
                          onClick={() => navigate('/emergency/dashboard')}
                          className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 inline-flex items-center gap-1 cursor-pointer"
                        >
                          Review in ED <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => navigate('/emergency/dashboard')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Open Emergency Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Patient EMR Access */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Direct EMR Lookup
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Open patient health records directly by selecting an active outpatient:
            </p>
            <div className="space-y-2">
              {patients.slice(0, 3).map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between transition group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500">{p.id} • {p.assignedDepartment}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Shortcuts (Strictly Clinical - No Admin Shortcuts) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Clinical Shortcuts
            </h3>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => navigate('/laboratory/requests')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left cursor-pointer"
              >
                <FlaskConical className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Order Diagnostic Labs</p>
                  <p className="text-[10px] text-slate-400">Hematology, Biochemistry, Microbiology</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/pharmacy/prescriptions')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left cursor-pointer"
              >
                <Pill className="w-4 h-4 text-cyan-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Digital Formulary & Prescriptions</p>
                  <p className="text-[10px] text-slate-400">Search available medications and dosages</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/inpatient/beds')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left cursor-pointer"
              >
                <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Inpatient Bed Census</p>
                  <p className="text-[10px] text-slate-400">Ward availability and patient allocations</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/patients')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Electronic Medical Records (EMR)</p>
                  <p className="text-[10px] text-slate-400">Search patient history and records</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Booking Modal */}
      <BookAppointmentModal isOpen={showBookModal} onClose={() => setShowBookModal(false)} />
    </motion.div>
  );
};
