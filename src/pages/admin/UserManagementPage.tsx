import React, { useState } from 'react';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { User, UserRole } from '../../types';
import { mockStaffUsers } from '../../data/mockData';
import { Users, UserPlus, Shield, Mail, CheckCircle2 } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => 
    mockStaffUsers.filter(u => u.email !== 'patient@hospital.et' && (u.role as string) !== 'PATIENT')
  );

  const columns: Column<User>[] = [
    {
      header: 'Staff Member',
      cell: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
            {u.name[0]}
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{u.name}</span>
            <span className="text-[11px] text-slate-500 font-mono">{u.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Role & Permissions',
      accessorKey: 'role',
      cell: (u) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
          {u.role.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Department / Unit',
      accessorKey: 'department',
      cell: (u) => <span className="text-xs text-slate-700 font-medium">{u.department}</span>,
    },
    {
      header: 'Email / Login',
      accessorKey: 'email',
      cell: (u) => (
        <div className="flex items-center gap-1 font-mono text-xs text-slate-600">
          <Mail className="w-3 h-3 text-slate-400" />
          <span>{u.email}</span>
        </div>
      ),
    },
    {
      header: 'Specialization',
      cell: (u) => <span className="text-xs text-slate-500">{u.specialization || 'Clinical Staff'}</span>,
    },
    {
      header: 'Account Status',
      cell: (u) => <StatusBadge status={u.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Personnel & Role-Based Access Control (RBAC)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain accounts for clinicians, nursing officers, pharmacists, laboratory technologists, and cashiers.
          </p>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Search staff by name, email, or department..."
        searchFilter={(u, q) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
        }
        filterOptions={{
          label: 'Role',
          key: 'role',
          options: [
            { label: 'Doctor / Physician', value: 'DOCTOR' },
            { label: 'Registered Nurse', value: 'NURSE' },
            { label: 'Receptionist', value: 'RECEPTIONIST' },
            { label: 'Pharmacist', value: 'PHARMACIST' },
            { label: 'Lab Technologist', value: 'LAB_TECHNICIAN' },
            { label: 'Accountant', value: 'ACCOUNTANT' },
            { label: 'Hospital Admin', value: 'HOSPITAL_ADMIN' },
          ],
          filterFn: (u, val) => u.role === val,
        }}
        pageSize={10}
        exportFileName="hospital_staff_directory"
      />
    </div>
  );
};
