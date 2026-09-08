import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LabTestRequest } from '../../types';
import { FlaskConical, Printer, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

export const LabResultsPage: React.FC = () => {
  const { labRequests } = useHospital();
  const [search, setSearch] = useState('');
  const [selectedResult, setSelectedResult] = useState<LabTestRequest | null>(null);

  const completedLabs = labRequests.filter(l => l.status === 'COMPLETED');
  const filtered = completedLabs.filter(
    l =>
      l.testName.toLowerCase().includes(search.toLowerCase()) ||
      l.patientName.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase())
  );

  const active = selectedResult || completedLabs[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Diagnostic Test Results Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified clinical pathology and chemical analytical test reports.
          </p>
        </div>

        {active && (
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Official Lab Report</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: List of completed tests */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3 print:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by test or patient..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map(lab => (
              <div
                key={lab.id}
                onClick={() => setSelectedResult(lab)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  active?.id === lab.id
                    ? 'bg-purple-50/70 border-purple-300 ring-1 ring-purple-300/30'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-900">{lab.testName}</span>
                  <span className="font-mono text-[10px] text-slate-500">{lab.id}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">{lab.patientName}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                  <span>Ordered by {lab.doctorName}</span>
                  <span className="font-mono">{lab.completedAt?.split(' ')[0] || lab.requestedAt.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Printable Official Report Card */}
        <div className="lg:col-span-2">
          {active ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:shadow-none">
              {/* Hospital Official Report Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                    Bethel St. Paul Specialized Hospital
                  </h2>
                  <p className="text-xs text-slate-500">Department of Pathology & Clinical Diagnostics</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Accredited ISO-15189 Medical Laboratory</p>
                </div>
                <div className="text-right text-xs">
                  <span className="font-mono font-bold text-slate-900 text-sm block">LAB REPORT</span>
                  <span className="text-slate-500 font-mono">Order ID: {active.id}</span>
                </div>
              </div>

              {/* Patient & Sample Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 text-xs border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient Name:</span>
                  <span className="font-bold text-slate-900">{active.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Medical Record #:</span>
                  <span className="font-mono text-slate-800">{active.patientId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Referring Doctor:</span>
                  <span className="font-medium text-slate-800">{active.doctorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Specimen:</span>
                  <span className="text-slate-800">{active.sampleType}</span>
                </div>
              </div>

              {/* Analyte Results Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Test Results: {active.testName}
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="px-4 py-3">Parameter / Test Analyte</th>
                        <th className="px-4 py-3">Result</th>
                        <th className="px-4 py-3">Standard Units</th>
                        <th className="px-4 py-3">Biological Reference Interval</th>
                        <th className="px-4 py-3 text-center">Clinical Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {active.parameters.map((param, idx) => (
                        <tr key={idx} className={param.isAbnormal ? 'bg-rose-50/60' : ''}>
                          <td className="px-4 py-3 font-sans font-semibold text-slate-900">{param.name}</td>
                          <td className={`px-4 py-3 font-bold text-sm ${param.isAbnormal ? 'text-rose-600' : 'text-slate-900'}`}>
                            {param.result}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{param.unit}</td>
                          <td className="px-4 py-3 text-slate-600 text-xs">{param.referenceRange}</td>
                          <td className="px-4 py-3 text-center">
                            {param.isAbnormal ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-600 text-white shadow-2xs font-sans">
                                Out of Range
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-600 font-sans">
                                Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Technician Remarks */}
              {active.technicianRemarks && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-700 block">Pathologist / Laboratory Remarks:</span>
                  <p className="text-slate-600">{active.technicianRemarks}</p>
                </div>
              )}

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-200 flex justify-between text-xs text-slate-500">
                <div>
                  <p className="font-semibold text-slate-800">Yared Bekele, MSc</p>
                  <p className="text-[11px]">Senior Medical Laboratory Technologist</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">Electronically Verified</p>
                  <p className="text-[11px] font-mono">{active.completedAt || '2026-09-05 11:45'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select a completed test result from the list to view the official report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
