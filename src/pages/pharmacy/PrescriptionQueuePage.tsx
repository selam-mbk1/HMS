import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PrescriptionOrder } from '../../types';
import { PrescriptionReviewModal } from '../../components/pharmacy/PrescriptionReviewModal';
import { Pill, CheckCircle2, Clock, Eye, AlertOctagon } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export const PrescriptionQueuePage: React.FC = () => {
  const { prescriptions } = useHospital();
  const [selectedRx, setSelectedRx] = useState<PrescriptionOrder | null>(null);

  const columns: Column<PrescriptionOrder>[] = [
    {
      header: 'Prescription ID',
      accessorKey: 'id',
      cell: (p) => (
        <div>
          <span className="font-mono font-bold text-blue-700 text-xs block">{p.id}</span>
          <span className="text-[10px] text-slate-400 font-mono">{p.createdAt}</span>
        </div>
      ),
    },
    {
      header: 'Patient Details',
      cell: (p) => (
        <div>
          <span className="font-bold text-slate-900 block text-xs">{p.patientName}</span>
          <span className="font-mono text-[11px] text-slate-500">{p.patientId}</span>
        </div>
      ),
    },
    {
      header: 'Prescribing Physician',
      accessorKey: 'doctorName',
      cell: (p) => (
        <div>
          <span className="text-xs text-slate-800 font-semibold block">{p.doctorName}</span>
          <span className="text-[11px] text-slate-500">{p.department || 'Internal Medicine'}</span>
        </div>
      ),
    },
    {
      header: 'Prescribed Items',
      cell: (p) => (
        <div className="space-y-0.5 max-w-sm">
          {p.items.map((it, idx) => (
            <span key={idx} className="block text-xs text-slate-700">
              • <strong>{it.medicineName}</strong> ({it.dosage}) — {it.frequency}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (p) => {
        if (p.priority === 'STAT') {
          return (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
              STAT
            </span>
          );
        }
        if (p.priority === 'URGENT') {
          return (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              URGENT
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
            ROUTINE
          </span>
        );
      },
    },
    {
      header: 'Dispense Status',
      accessorKey: 'status',
      cell: (p) => (
        <div>
          <StatusBadge status={p.status} />
          {p.clarificationRequested && (
            <span className="text-[10px] font-bold text-amber-700 block mt-0.5">
              Clarification Sent
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Pharmacy Actions',
      cell: (p) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedRx(p)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer ${
              p.status === 'DISPENSED'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{p.status === 'DISPENSED' ? 'View Record' : 'Review & Dispense'}</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Pharmacy Prescription Queue
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Outpatient & Inpatient digital medication orders, verification review, and dispensary releasing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            {prescriptions.length} Total Orders
          </span>
        </div>
      </div>

      <DataTable
        data={prescriptions}
        columns={columns}
        searchPlaceholder="Search by patient name, prescription ID, doctor, or medication..."
        searchFilter={(p, q) =>
          p.patientName.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.doctorName.toLowerCase().includes(q) ||
          p.items.some(i => i.medicineName.toLowerCase().includes(q))
        }
        filterOptions={{
          label: 'Status',
          key: 'status',
          options: [
            { label: 'Pending Review', value: 'PENDING_REVIEW' },
            { label: 'Pending Dispensing', value: 'PENDING' },
            { label: 'Ready to Dispense', value: 'READY_TO_DISPENSE' },
            { label: 'Dispensed', value: 'DISPENSED' },
            { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
          ],
          filterFn: (p, val) => p.status === val,
        }}
        pageSize={8}
        exportFileName="hospital_prescription_queue"
      />

      <AnimatePresence>
        {selectedRx && (
          <PrescriptionReviewModal
            prescription={selectedRx}
            onClose={() => setSelectedRx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
