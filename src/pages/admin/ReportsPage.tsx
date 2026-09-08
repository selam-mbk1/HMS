import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Users, 
  Bed, 
  DollarSign,
  Activity
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { patients, beds, appointments, invoices, emergencyCases } = useHospital();

  const [reportType, setReportType] = useState('CENSUS');
  const [dateRange, setDateRange] = useState('THIS_MONTH');

  const totalRevenue = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED').length;

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metric,Value\n" +
      `Total Registered Patients,${patients.length}\n` +
      `Bed Occupancy,${occupiedBeds} / ${beds.length}\n` +
      `Appointments Scheduled,${appointments.length}\n` +
      `Total Revenue Collected (ETB),${totalRevenue}\n` +
      `Emergency Triage Admissions,${emergencyCases.length}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hospital_executive_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Clinical Analytics & Executive Reports
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Morbidity indicators, bed turnover rates, department throughput, and operational KPIs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Category:
          </span>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-hidden"
          >
            <option value="CENSUS">Patient Census & Admissions</option>
            <option value="FINANCIAL">Financial Settlement & Revenue</option>
            <option value="CLINICAL">Morbidity & Clinical Diagnoses</option>
            <option value="EMERGENCY">Emergency Acuity Index (ESI)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Period:</span>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-hidden"
          >
            <option value="TODAY">Today (Real-Time)</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="THIS_YEAR">Year-to-Date</option>
          </select>
        </div>
      </div>

      {/* Generated Report Summary Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase">
              Bethel St. Paul Specialized Hospital — Operations Summary
            </h2>
            <p className="text-xs text-slate-500">Official Executive Report • Reporting Period: September 2026</p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
            Confidential
          </span>
        </div>

        {/* High-level operational metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Total Inpatient Admissions</span>
            <span className="text-xl font-bold text-slate-900 font-mono mt-1 block">
              {occupiedBeds} Patients
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Bed Occupancy Rate</span>
            <span className="text-xl font-bold text-teal-700 font-mono mt-1 block">
              {Math.round((occupiedBeds / beds.length) * 100)}%
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Settled Cash Revenue</span>
            <span className="text-xl font-bold text-emerald-700 font-mono mt-1 block">
              {totalRevenue.toLocaleString()} ETB
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Emergency Resuscitations</span>
            <span className="text-xl font-bold text-rose-700 font-mono mt-1 block">
              {emergencyCases.length} Cases
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Department Performance Breakdown
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Head Physician</th>
                  <th className="px-4 py-3">Outpatients</th>
                  <th className="px-4 py-3">Inpatients</th>
                  <th className="px-4 py-3 text-right">Revenue (ETB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Internal Medicine</td>
                  <td className="px-4 py-3 text-slate-600">Dr. Dawit Haile</td>
                  <td className="px-4 py-3 font-mono">142</td>
                  <td className="px-4 py-3 font-mono">18</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">84,500 ETB</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Cardiology</td>
                  <td className="px-4 py-3 text-slate-600">Dr. Frehiwot Tadesse</td>
                  <td className="px-4 py-3 font-mono">98</td>
                  <td className="px-4 py-3 font-mono">12</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">112,000 ETB</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">General Surgery</td>
                  <td className="px-4 py-3 text-slate-600">Dr. Biruk Mengistu</td>
                  <td className="px-4 py-3 font-mono">64</td>
                  <td className="px-4 py-3 font-mono">22</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">145,000 ETB</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Pediatrics</td>
                  <td className="px-4 py-3 text-slate-600">Dr. Tigist Wolde</td>
                  <td className="px-4 py-3 font-mono">115</td>
                  <td className="px-4 py-3 font-mono">14</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">42,000 ETB</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Emergency & Trauma</td>
                  <td className="px-4 py-3 text-slate-600">Dr. Ermias Bekele</td>
                  <td className="px-4 py-3 font-mono">180</td>
                  <td className="px-4 py-3 font-mono">8</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">76,000 ETB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
