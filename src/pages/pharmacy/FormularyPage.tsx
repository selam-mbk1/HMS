import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DataTable, Column } from '../../components/common/DataTable';
import { FormularyItem } from '../../types';
import { BookOpen, ShieldCheck, AlertCircle, CheckCircle2, Lock, Pill } from 'lucide-react';

export const FormularyPage: React.FC = () => {
  const { formularyItems } = useHospital();

  const columns: Column<FormularyItem>[] = [
    {
      header: 'Drug Name & Strength',
      cell: (f) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-xs">{f.medicineName}</span>
            <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
              {f.strength}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 italic font-mono block mt-0.5">
            Generic: {f.genericName}
          </span>
        </div>
      ),
    },
    {
      header: 'Therapeutic Class',
      accessorKey: 'therapeuticClass',
      cell: (f) => (
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-xs">
          {f.therapeuticClass}
        </span>
      ),
    },
    {
      header: 'Dosage Form & Route',
      cell: (f) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{f.dosageForm}</span>
          <span className="text-[10px] font-mono text-slate-500">Route: {f.route}</span>
        </div>
      ),
    },
    {
      header: 'Clinical Status & Policy',
      accessorKey: 'status',
      cell: (f) => {
        if (f.status === 'RESTRICTED') {
          return (
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Lock className="w-3 h-3 text-amber-600" /> Restricted Specialist
              </span>
              {f.controlledSubstance && (
                <span className="text-[10px] text-rose-600 font-bold block mt-0.5">Controlled Substance</span>
              )}
            </div>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Formulary Approved
          </span>
        );
      },
    },
    {
      header: 'Pregnancy Category',
      accessorKey: 'pregnancyCategory',
      cell: (f) => (
        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {f.pregnancyCategory || 'Category B'}
        </span>
      ),
    },
    {
      header: 'Approved Clinical Indications',
      accessorKey: 'indications',
      cell: (f) => (
        <span className="text-[11px] text-slate-600 max-w-xs block truncate" title={f.indications}>
          {f.indications || 'Standard clinical indications per Ethiopian STG'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Drug Formulary & Clinical Protocols
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standard hospital approved drug catalogue, therapeutic guidelines, and controlled substances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            {formularyItems.length} Formularies Registered
          </span>
        </div>
      </div>

      <DataTable
        data={formularyItems}
        columns={columns}
        searchPlaceholder="Search formulary by brand name, generic name, or class..."
        searchFilter={(f, q) =>
          f.medicineName.toLowerCase().includes(q) ||
          f.genericName.toLowerCase().includes(q) ||
          f.therapeuticClass.toLowerCase().includes(q) ||
          (f.indications && f.indications.toLowerCase().includes(q))
        }
        filterOptions={{
          label: 'Status',
          key: 'status',
          options: [
            { label: 'Active Approved', value: 'ACTIVE' },
            { label: 'Restricted Specialist', value: 'RESTRICTED' },
          ],
          filterFn: (f, val) => f.status === val,
        }}
        pageSize={8}
        exportFileName="hospital_formulary_guidelines"
      />
    </div>
  );
};
