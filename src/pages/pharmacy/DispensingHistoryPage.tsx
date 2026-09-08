import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { DispensingRecord } from '../../types';
import { History, CheckCircle2, Pill, Search, Download, User } from 'lucide-react';

export const DispensingHistoryPage: React.FC = () => {
  const { dispensingRecords, medicines } = useHospital();

  const columns: Column<DispensingRecord>[] = [
    {
      header: 'Dispense ID',
      accessorKey: 'id',
      cell: (r) => (
        <div>
          <span className="font-mono font-bold text-slate-800 text-xs">{r.id}</span>
          <span className="text-[10px] text-slate-400 font-mono block">Rx: {r.prescriptionId}</span>
        </div>
      ),
    },
    {
      header: 'Patient Information',
      cell: (r) => (
        <div>
          <span className="font-bold text-slate-900 block text-xs">{r.patientName}</span>
          <span className="text-[11px] font-mono text-slate-500">{r.patientId}</span>
        </div>
      ),
    },
    {
      header: 'Medication Supplied',
      cell: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-xs">{r.medicineName}</span>
            {r.dosage && (
              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 font-mono text-[10px] rounded">
                {r.dosage}
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
            Quantity: {r.quantity} units
          </span>
        </div>
      ),
    },
    {
      header: 'Batch Number',
      accessorKey: 'batchNumber',
      cell: (r) => (
        <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {r.batchNumber}
        </span>
      ),
    },
    {
      header: 'Dispensing Pharmacist',
      accessorKey: 'pharmacistName',
      cell: (r) => (
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs text-slate-800 font-medium">{r.pharmacistName}</span>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      accessorKey: 'dispensedAt',
      cell: (r) => (
        <span className="font-mono text-xs text-slate-600">{r.dispensedAt}</span>
      ),
    },
    {
      header: 'Counseling / Clinical Notes',
      accessorKey: 'notes',
      cell: (r) => (
        <span className="text-[11px] text-slate-600 italic max-w-xs truncate block" title={r.notes}>
          {r.notes || 'Routine dispensary release per hospital guidelines'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Medication Dispensing Audit Log
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete historical audit trail of all verified releases, patient medication logs, and batch assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            {dispensingRecords.length} Dispensed Entries
          </span>
        </div>
      </div>

      <DataTable
        data={dispensingRecords}
        columns={columns}
        searchPlaceholder="Search by patient name, medication, batch number, or pharmacist..."
        searchFilter={(r, q) =>
          r.patientName.toLowerCase().includes(q) ||
          r.medicineName.toLowerCase().includes(q) ||
          r.batchNumber.toLowerCase().includes(q) ||
          r.pharmacistName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.prescriptionId.toLowerCase().includes(q)
        }
        pageSize={10}
        exportFileName="hospital_dispensing_history"
      />
    </div>
  );
};
