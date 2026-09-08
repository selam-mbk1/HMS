import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Users, 
  Calendar, 
  Clock, 
  UserPlus, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { AddPatientModal } from '../patients/AddPatientModal';
import { BookAppointmentModal } from './BookAppointmentModal';

export const ReceptionDashboard: React.FC = () => {
  const { patients, appointments, updateAppointmentStatus } = useHospital();
  const navigate = useNavigate();

  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  // Today's appointments
  const waitingCount = appointments.filter(a => a.status === 'WAITING').length;
  const confirmedCount = appointments.filter(a => a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Top Welcome & Quick Front Desk Actions */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Front Desk & Patient Reception
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Reception Desk Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Outpatient registration, patient verification, appointment check-in, and clinic queueing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <motion.button
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.975 }}
            onClick={() => setShowAddPatient(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer group"
          >
            <UserPlus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            <span>Register New Patient</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBookModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-xs cursor-pointer"
          >
            + Schedule Appointment
          </motion.button>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Today's Appointments"
            value={appointments.length}
            icon={Calendar}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Total scheduled appointments"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Checked-In & Waiting"
            value={waitingCount}
            icon={Clock}
            iconColor="text-amber-600 bg-amber-50"
            subtitle="Patients in waiting lounges"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Awaiting Arrival"
            value={confirmedCount}
            icon={PhoneCall}
            iconColor="text-teal-600 bg-teal-50"
            subtitle="Upcoming slots for today"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Total Registered Patients"
            value={patients.length}
            icon={Users}
            iconColor="text-purple-600 bg-purple-50"
            subtitle="Hospital master records"
          />
        </motion.div>
      </div>

      {/* Main Front Desk Appointments Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Today's Appointment Schedule & Check-in Desk</h3>
            <p className="text-xs text-slate-500 mt-0.5">Mark patients checked in as they arrive at the hospital</p>
          </div>
          <button
            onClick={() => navigate('/appointments')}
            className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            Full Appointment List →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor & Clinic</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Check-in Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-blue-50/25 transition-colors group">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">{a.time}</td>
                  <td className="px-4 py-3">
                    <span
                      onClick={() => navigate(`/patients/${a.patientId}`)}
                      className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer block"
                    >
                      {a.patientName}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{a.patientId} • {a.patientPhone}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800 block">{a.doctorName}</span>
                    <span className="text-[11px] text-slate-500">{a.department} • Room {a.roomNumber || '101'}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{a.type.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.status === 'CONFIRMED' && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => updateAppointmentStatus(a.id, 'WAITING')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Check In Patient
                      </motion.button>
                    )}
                    {a.status === 'WAITING' && (
                      <span className="text-amber-800 font-semibold text-[11px] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                        In Waiting Room
                      </span>
                    )}
                    {a.status === 'COMPLETED' && (
                      <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Visit Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddPatientModal isOpen={showAddPatient} onClose={() => setShowAddPatient(false)} />
      <BookAppointmentModal isOpen={showBookModal} onClose={() => setShowBookModal(false)} />
    </motion.div>
  );
};
