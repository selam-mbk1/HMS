import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Appointment, AppointmentStatus } from '../../types';
import { Calendar, Plus, CheckCircle2, Clock, XCircle, Stethoscope } from 'lucide-react';
import { BookAppointmentModal } from './BookAppointmentModal';

export const AppointmentListPage: React.FC = () => {
  const { appointments, updateAppointmentStatus } = useHospital();
  const navigate = useNavigate();
  const [showBookModal, setShowBookModal] = useState(false);

  const columns: Column<Appointment>[] = [
    {
      header: 'Date & Time',
      cell: (a) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{a.time}</span>
          <span className="text-[11px] text-slate-500 font-mono">{a.date}</span>
        </div>
      ),
    },
    {
      header: 'Patient Details',
      cell: (a) => (
        <div>
          <span className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer block" onClick={() => navigate(`/patients/${a.patientId}`)}>
            {a.patientName}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">{a.patientId} • {a.patientPhone}</span>
        </div>
      ),
    },
    {
      header: 'Attending Physician',
      cell: (a) => (
        <div>
          <span className="font-semibold text-slate-800 block">{a.doctorName}</span>
          <span className="text-[11px] text-slate-500">{a.department}</span>
        </div>
      ),
    },
    {
      header: 'Nature / Reason',
      cell: (a) => (
        <div className="max-w-xs">
          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
            {a.type.replace(/_/g, ' ')}
          </span>
          <p className="text-xs text-slate-500 mt-1 truncate">{a.reason}</p>
        </div>
      ),
    },
    {
      header: 'Room / Clinic',
      accessorKey: 'roomNumber',
      cell: (a) => <span className="font-mono text-xs text-slate-700">{a.roomNumber || 'Clinic 101'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (a) => <StatusBadge status={a.status} />,
    },
    {
      header: 'Queue Actions',
      cell: (a) => (
        <div className="flex items-center gap-1.5">
          {a.status === 'CONFIRMED' && (
            <button
              onClick={() => updateAppointmentStatus(a.id, 'WAITING')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold rounded-lg border border-amber-200 transition flex items-center gap-1"
              title="Patient arrived at hospital - mark checked in"
            >
              <Clock className="w-3 h-3" /> Check In
            </button>
          )}

          {a.status === 'WAITING' && (
            <button
              onClick={() => {
                updateAppointmentStatus(a.id, 'IN_PROGRESS');
                navigate(`/doctor/consultation/${a.patientId}`);
              }}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-semibold rounded-lg border border-blue-200 transition flex items-center gap-1"
              title="Call patient into consultation room"
            >
              <Stethoscope className="w-3 h-3" /> Call In
            </button>
          )}

          {a.status === 'IN_PROGRESS' && (
            <button
              onClick={() => updateAppointmentStatus(a.id, 'COMPLETED')}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-lg border border-emerald-200 transition flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" /> Complete
            </button>
          )}

          {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
            <button
              onClick={() => updateAppointmentStatus(a.id, 'CANCELLED')}
              className="p-1 text-slate-400 hover:text-rose-600 transition"
              title="Cancel appointment"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Clinical Appointments & Outpatient Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual scheduling, reception check-in desk, and physician room allocation.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Appointment</span>
        </button>
      </div>

      <DataTable
        data={appointments}
        columns={columns}
        searchPlaceholder="Search by patient name, doctor, or MRN..."
        searchFilter={(a, q) =>
          a.patientName.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.patientId.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q)
        }
        filterOptions={{
          label: 'Status',
          key: 'status',
          options: [
            { label: 'Confirmed', value: 'CONFIRMED' },
            { label: 'Waiting in Clinic', value: 'WAITING' },
            { label: 'In Consultation', value: 'IN_PROGRESS' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Cancelled', value: 'CANCELLED' },
          ],
          filterFn: (a, val) => a.status === val,
        }}
        pageSize={10}
        exportFileName="hospital_appointments_schedule"
      />

      <BookAppointmentModal isOpen={showBookModal} onClose={() => setShowBookModal(false)} />
    </div>
  );
};
