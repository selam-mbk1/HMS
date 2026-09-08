import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LabTestRequest } from '../../types';
import { FlaskConical, CheckCircle2, Clock, FileEdit, AlertTriangle } from 'lucide-react';
import { EnterLabResultModal } from './EnterLabResultModal';

export const LabRequestsPage: React.FC = () => {
  const { labRequests, updateLabStatus } = useHospital();
  const [activeRequestForResults, setActiveRequestForResults] = useState<LabTestRequest | undefined>(undefined);

  const columns: Column<LabTestRequest>[] = [
    {
      header: 'Test Order ID',
      accessorKey: 'id',
      cell: (l) => <span className="font-mono font-bold text-slate-800 text-xs">{l.id}</span>,
    },
    {
      header: 'Diagnostic Test',
      cell: (l) => (
        <div>
          <span className="font-bold text-slate-900 block">{l.testName}</span>
          <span className="text-[11px] text-slate-500">Sample: {l.sampleType}</span>
        </div>
      ),
    },
    {
      header: 'Patient Details',
      cell: (l) => (
        <div>
          <span className="font-semibold text-slate-900 block">{l.patientName}</span>
          <span className="font-mono text-[11px] text-slate-500">{l.patientId}</span>
        </div>
      ),
    },
    {
      header: 'Ordering Doctor',
      accessorKey: 'doctorName',
      cell: (l) => <span className="text-xs text-slate-700 font-medium">{l.doctorName}</span>,
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (l) => <StatusBadge status={l.priority} />,
    },
    {
      header: 'Test Status',
      accessorKey: 'status',
      cell: (l) => <StatusBadge status={l.status} />,
    },
    {
      header: 'Actions',
      cell: (l) => (
        <div className="flex items-center gap-2">
          {l.status === 'PENDING' && (
            <button
              onClick={() => updateLabStatus(l.id, 'IN_PROGRESS')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold rounded-lg border border-amber-200 transition flex items-center gap-1"
            >
              <Clock className="w-3 h-3" /> Collect Sample
            </button>
          )}

          {l.status === 'IN_PROGRESS' && (
            <button
              onClick={() => setActiveRequestForResults(l)}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold rounded-lg shadow-2xs transition flex items-center gap-1"
            >
              <FileEdit className="w-3 h-3" /> Enter Results
            </button>
          )}

          {l.status === 'COMPLETED' && (
            <button
              onClick={() => setActiveRequestForResults(l)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg transition flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> View Report
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
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Diagnostic Laboratory Requests & Orders
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Clinical pathology, hematology, biochemistry, and microbiology specimen processing.
          </p>
        </div>
      </div>

      <DataTable
        data={labRequests}
        columns={columns}
        searchPlaceholder="Search by test name, patient, or order ID..."
        searchFilter={(l, q) =>
          l.testName.toLowerCase().includes(q) ||
          l.patientName.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.doctorName.toLowerCase().includes(q)
        }
        filterOptions={{
          label: 'Status',
          key: 'status',
          options: [
            { label: 'Pending Collection', value: 'PENDING' },
            { label: 'In Analysis', value: 'IN_PROGRESS' },
            { label: 'Completed', value: 'COMPLETED' },
          ],
          filterFn: (l, val) => l.status === val,
        }}
        pageSize={8}
        exportFileName="diagnostic_lab_requests"
      />

      <EnterLabResultModal
        isOpen={Boolean(activeRequestForResults)}
        onClose={() => setActiveRequestForResults(undefined)}
        request={activeRequestForResults}
      />
    </div>
  );
};
