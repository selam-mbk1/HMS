import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  FlaskConical, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileEdit,
  ArrowRight,
  Activity
} from 'lucide-react';
import { EnterLabResultModal } from './EnterLabResultModal';
import { LabTestRequest } from '../../types';

export const LabDashboard: React.FC = () => {
  const { labRequests, updateLabStatus } = useHospital();
  const navigate = useNavigate();

  const [activeRequest, setActiveRequest] = useState<LabTestRequest | undefined>(undefined);

  const pendingCollection = labRequests.filter(l => l.status === 'PENDING');
  const inAnalysis = labRequests.filter(l => l.status === 'IN_PROGRESS');
  const completedToday = labRequests.filter(l => l.status === 'COMPLETED');
  const criticalResults = labRequests.filter(l => l.priority === 'CRITICAL' || l.parameters.some(p => p.isAbnormal));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <FlaskConical className="w-5 h-5 text-purple-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Clinical Pathology & Laboratory Workstation
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Analyzers Sync Online
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Specimen accessioning, automated hematology & biochemistry analyzers, and panic value notification.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/laboratory/results')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-xs cursor-pointer"
          >
            Verified Reports Registry
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/laboratory/requests')}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl shadow-md shadow-purple-500/20 transition flex items-center gap-1.5 cursor-pointer group"
          >
            <FlaskConical className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
            <span>Test Orders ({labRequests.length})</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Awaiting Specimen"
            value={pendingCollection.length}
            icon={Clock}
            iconColor="text-amber-600 bg-amber-50"
            subtitle="Venous blood, urine, or swabs"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="In Analyzer / Processing"
            value={inAnalysis.length}
            icon={FlaskConical}
            iconColor="text-purple-600 bg-purple-50"
            subtitle="Specimens on analytical run"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Completed & Released"
            value={completedToday.length}
            icon={CheckCircle2}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="Sent to physician EMR"
          />
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <StatCard
            title="Panic / Critical Alerts"
            value={criticalResults.length}
            icon={AlertTriangle}
            iconColor="text-rose-600 bg-rose-50"
            subtitle="Out-of-range critical limits"
          />
        </motion.div>
      </div>

      {/* Grid: Pending Collection & In Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specimens awaiting collection */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Specimens Awaiting Collection / Phlebotomy</h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
              {pendingCollection.length} Pending
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingCollection.map(l => (
              <div key={l.id} className="p-4 hover:bg-blue-50/30 transition-all duration-150 flex items-center justify-between gap-3 text-xs group">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">{l.testName}</span>
                    <StatusBadge status={l.priority} />
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Patient: <strong>{l.patientName}</strong> ({l.patientId})
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Sample: {l.sampleType} • Ref: {l.doctorName}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => updateLabStatus(l.id, 'IN_PROGRESS')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                >
                  Collect Sample
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        {/* Tests in Analysis / Ready for results entry */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle hover:shadow-card-elevated transition-shadow duration-300 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active In-Run Specimens</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-purple-50 text-purple-800 rounded-full border border-purple-200">
              {inAnalysis.length} Running
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {inAnalysis.map(l => (
              <div key={l.id} className="p-4 hover:bg-blue-50/30 transition-all duration-150 flex items-center justify-between gap-3 text-xs group">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">{l.testName}</span>
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">{l.id}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">Patient: <strong>{l.patientName}</strong></p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{l.clinicalNotes}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveRequest(l)}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-xs transition shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Enter Results</span>
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EnterLabResultModal
        isOpen={Boolean(activeRequest)}
        onClose={() => setActiveRequest(undefined)}
        request={activeRequest}
      />
    </motion.div>
  );
};
