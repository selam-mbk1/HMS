import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Patient } from '../../types';
import { UserPlus, Eye, Stethoscope, Phone, MapPin } from 'lucide-react';
import { AddPatientModal } from './AddPatientModal';

export const PatientListPage: React.FC = () => {
  const { patients } = useHospital();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  const columns: Column<Patient>[] = [
    {
      header: 'Patient Details',
      cell: (patient) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {patient.firstName[0]}
          </div>
          <div>
            <span className="font-bold text-slate-900 block hover:text-blue-600 transition">
              {patient.firstName} {patient.middleName} {patient.lastName}
            </span>
            <span className="text-[11px] font-mono text-slate-500">{patient.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Demographics',
      cell: (p) => (
        <div>
          <span className="font-semibold text-slate-800">{p.age} yrs</span> • {p.gender}
          <div className="text-[11px] text-slate-500">Blood: <strong className="text-slate-700">{p.bloodGroup}</strong></div>
        </div>
      ),
    },
    {
      header: 'Contact & Location',
      cell: (p) => (
        <div>
          <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{p.phone}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{p.subCity}, Addis Ababa</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Specialty / Dept',
      accessorKey: 'assignedDepartment',
      cell: (p) => (
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-xs">
          {p.assignedDepartment}
        </span>
      ),
    },
    {
      header: 'Clinical Alerts',
      cell: (p) => (
        <div className="space-y-1">
          {p.allergies.length > 0 && p.allergies[0] !== 'None known' ? (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-700 rounded border border-rose-200 block truncate max-w-[140px]">
              Allergy: {p.allergies.join(', ')}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">No known allergies</span>
          )}
          {p.chronicConditions.length > 0 && p.chronicConditions[0] !== 'None' && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 rounded border border-amber-200 block truncate max-w-[140px]">
              {p.chronicConditions.join(', ')}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'EMR Status',
      accessorKey: 'status',
      cell: (p) => <StatusBadge status={p.status} />,
    },
    {
      header: 'Actions',
      cell: (p) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/patients/${p.id}`);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="View Complete EMR"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/doctor/consultation/${p.id}`);
            }}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
            title="Start Consultation"
          >
            <Stethoscope className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Hospital Patients Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master Patient Index (MPI) with electronic medical record histories, demographics, and clinical alerts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      <DataTable
        data={patients}
        columns={columns}
        searchPlaceholder="Search patients by name, MRN ID, phone, or sub-city..."
        searchFilter={(patient, q) =>
          patient.id.toLowerCase().includes(q) ||
          `${patient.firstName} ${patient.middleName} ${patient.lastName}`.toLowerCase().includes(q) ||
          patient.phone.includes(q) ||
          patient.subCity.toLowerCase().includes(q)
        }
        filterOptions={{
          label: 'Departments',
          key: 'assignedDepartment',
          options: [
            { label: 'Internal Medicine', value: 'Internal Medicine' },
            { label: 'Cardiology', value: 'Cardiology' },
            { label: 'Pediatrics', value: 'Pediatrics' },
            { label: 'General Surgery', value: 'General Surgery' },
            { label: 'Obstetrics & Gynecology', value: 'Obstetrics & Gynecology' },
            { label: 'Emergency', value: 'Emergency' }
          ],
          filterFn: (patient, val) => patient.assignedDepartment === val,
        }}
        pageSize={8}
        exportFileName="hospital_patients_registry"
        onRowClick={(p) => navigate(`/patients/${p.id}`)}
      />

      <AddPatientModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};
