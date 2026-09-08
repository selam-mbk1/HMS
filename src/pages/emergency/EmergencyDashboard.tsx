import React, { useState, useMemo, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { EmergencyCase, EmergencyTriageLevel } from '../../types';
import { 
  AlertOctagon, 
  Activity, 
  HeartPulse, 
  Clock, 
  UserCheck, 
  Stethoscope, 
  ShieldAlert, 
  CheckCircle2, 
  User,
  Search,
  BedDouble,
  Eye,
  Edit3,
  Filter,
  CheckCircle,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { NurseTriageModal } from './NurseTriageModal';
import { NurseAssessmentViewModal } from './NurseAssessmentViewModal';
import { NurseEmergencyCaseViewModal } from './NurseEmergencyCaseViewModal';

export const EmergencyDashboard: React.FC = () => {
  const { emergencyCases, updateEmergencyCase } = useHospital();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WAITING_TRIAGE' | 'IN_TRIAGE' | 'WAITING_DOCTOR' | 'WITH_DOCTOR'>('ALL');
  
  // Modals state
  const [triageModalCase, setTriageModalCase] = useState<EmergencyCase | null>(null);
  const [assessmentViewCase, setAssessmentViewCase] = useState<EmergencyCase | null>(null);
  const [emergencyCaseViewCase, setEmergencyCaseViewCase] = useState<EmergencyCase | null>(null);

  // Dynamic waiting timer tick (re-evaluates every minute)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate dynamic waiting time in minutes from arrival timestamp / time
  const getDynamicWaitingMinutes = (ec: EmergencyCase): number => {
    if (ec.arrivalTimestamp) {
      const arrival = new Date(ec.arrivalTimestamp).getTime();
      if (!isNaN(arrival)) {
        const diff = Math.round((currentTime.getTime() - arrival) / (1000 * 60));
        return Math.max(1, diff);
      }
    }
    if (ec.arrivalTime) {
      const match = ec.arrivalTime.match(/(\d{1,2}):(\d{2})(?:\s*([AP]M))?/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const mins = parseInt(match[2], 10);
        const meridian = match[3]?.toUpperCase();
        if (meridian === 'PM' && hours < 12) hours += 12;
        if (meridian === 'AM' && hours === 12) hours = 0;
        
        const arr = new Date(currentTime);
        arr.setHours(hours, mins, 0, 0);
        let diff = Math.round((currentTime.getTime() - arr.getTime()) / (1000 * 60));
        if (diff < 0) diff += 24 * 60;
        return Math.max(1, diff % (24 * 60));
      }
    }
    return ec.waitingMinutes || 10;
  };

  // Helper to check priority acuity
  const getPriorityLevel = (ec: EmergencyCase): 'CRITICAL' | 'URGENT' | 'LESS_URGENT' => {
    if (ec.priority === 'CRITICAL' || ec.triageLevel === 'CRITICAL' || ec.triageLevel === 'RESUSCITATION') {
      return 'CRITICAL';
    }
    if (ec.priority === 'URGENT' || ec.triageLevel === 'URGENT') {
      return 'URGENT';
    }
    return 'LESS_URGENT';
  };

  // Acuity Stats Breakdown
  const criticalCount = useMemo(() => 
    emergencyCases.filter(c => getPriorityLevel(c) === 'CRITICAL').length,
    [emergencyCases]
  );
  const urgentCount = useMemo(() => 
    emergencyCases.filter(c => getPriorityLevel(c) === 'URGENT').length,
    [emergencyCases]
  );
  const lessUrgentCount = useMemo(() => 
    emergencyCases.filter(c => getPriorityLevel(c) === 'LESS_URGENT').length,
    [emergencyCases]
  );
  const inActiveCareCount = useMemo(() => 
    emergencyCases.filter(c => 
      c.status === 'RESUSCITATION' || 
      c.status === 'OBSERVATION' || 
      c.status === 'IN_PROGRESS' || 
      c.status === 'ADMITTED'
    ).length,
    [emergencyCases]
  );

  // Clinical priority sorting comparator
  const priorityRank = (ec: EmergencyCase): number => {
    const p = getPriorityLevel(ec);
    if (p === 'CRITICAL') return 1;
    if (p === 'URGENT') return 2;
    return 3;
  };

  const sortEmergencyQueue = (cases: EmergencyCase[]): EmergencyCase[] => {
    return [...cases].sort((a, b) => {
      const rankA = priorityRank(a);
      const rankB = priorityRank(b);
      if (rankA !== rankB) return rankA - rankB; // Critical first, then Urgent, then Less Urgent
      // Within same priority, sort by longest waiting time
      return getDynamicWaitingMinutes(b) - getDynamicWaitingMinutes(a);
    });
  };

  // Filtered cases by search query
  const filteredCases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return emergencyCases;
    return emergencyCases.filter(c => 
      c.patientName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.patientId && c.patientId.toLowerCase().includes(q)) ||
      c.chiefComplaint.toLowerCase().includes(q)
    );
  }, [emergencyCases, searchQuery]);

  // Segregate by workflow states
  // 1. Waiting for Triage
  const waitingForTriageCases = useMemo(() => {
    const subset = filteredCases.filter(c => 
      c.status === 'WAITING_FOR_TRIAGE' || c.status === 'TRIAGE'
    );
    return sortEmergencyQueue(subset);
  }, [filteredCases, currentTime]);

  // 2. In Triage
  const inTriageCases = useMemo(() => {
    const subset = filteredCases.filter(c => c.status === 'IN_TRIAGE');
    return sortEmergencyQueue(subset);
  }, [filteredCases, currentTime]);

  // 3. Waiting for Emergency Doctor
  const waitingForDoctorCases = useMemo(() => {
    const subset = filteredCases.filter(c => 
      c.status === 'WAITING_FOR_DOCTOR' || c.status === 'TRIAGED'
    );
    return sortEmergencyQueue(subset);
  }, [filteredCases, currentTime]);

  // 4. With Emergency Doctor / In Active Care
  const withDoctorCases = useMemo(() => {
    const subset = filteredCases.filter(c => 
      c.status === 'RESUSCITATION' || 
      c.status === 'OBSERVATION' || 
      c.status === 'IN_PROGRESS' ||
      c.status === 'ADMITTED'
    );
    return sortEmergencyQueue(subset);
  }, [filteredCases, currentTime]);

  // Handler to complete triage
  const handleCompleteTriage = (caseId: string, triageData: any) => {
    updateEmergencyCase(caseId, {
      status: 'WAITING_FOR_DOCTOR',
      priority: triageData.priority,
      triageLevel: triageData.triageLevel,
      vitalSigns: triageData.vitalSigns,
      vitals: {
        bp: `${triageData.vitalSigns.bloodPressureSystolic}/${triageData.vitalSigns.bloodPressureDiastolic} mmHg`,
        pulse: triageData.vitalSigns.pulseRate,
        spo2: triageData.vitalSigns.oxygenSaturation,
        temp: triageData.vitalSigns.temperature,
      },
      clinicalObservations: triageData.clinicalObservations,
      immediateConcerns: triageData.immediateConcerns,
      triageNotes: triageData.triageNotes,
      triagedBy: 'Sr. Tigist Mengistu, BSc',
      triageCompletedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  // Handler for draft triage save
  const handleSaveDraft = (caseId: string, draftData: any) => {
    updateEmergencyCase(caseId, {
      status: 'IN_TRIAGE',
      priority: draftData.priority,
      vitalSigns: draftData.vitalSigns,
      clinicalObservations: draftData.clinicalObservations,
      immediateConcerns: draftData.immediateConcerns,
      triageNotes: draftData.triageNotes,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Title & Nursing Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-sm shadow-rose-600/20 shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Emergency Triage
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Assess emergency patients, record vital signs, determine clinical priority, and prepare patients for emergency physician care.
            </p>
          </div>
        </div>

        {/* Logged-in Nurse Station Identity */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            TM
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-bold text-slate-900 leading-tight">Sr. Tigist Mengistu, BSc</p>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 font-mono">
              NURSE • Inpatient Medical Ward / Triage Station
            </p>
          </div>
        </div>
      </div>

      {/* 2. Priority Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Critical */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">🔴 Critical</p>
              <h3 className="text-3xl font-extrabold text-rose-950 mt-1 font-mono tracking-tight">{criticalCount}</h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-rose-900 font-semibold mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Immediate clinical attention
          </p>
        </div>

        {/* Urgent */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">🟠 Urgent</p>
              <h3 className="text-3xl font-extrabold text-amber-950 mt-1 font-mono tracking-tight">{urgentCount}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-amber-900 font-semibold mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            High-risk condition requiring prompt assessment
          </p>
        </div>

        {/* Less Urgent */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">🟢 Less Urgent</p>
              <h3 className="text-3xl font-extrabold text-emerald-950 mt-1 font-mono tracking-tight">{lessUrgentCount}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-900 font-semibold mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Stable patient requiring clinical assessment
          </p>
        </div>

        {/* In Active Care */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-2xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">⚡ In Active Care</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-1 font-mono tracking-tight">{inActiveCareCount}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-900 font-semibold mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Emergency cases in active care
          </p>
        </div>
      </div>

      {/* 3. Emergency Queue Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header with Search and Acuity Subtitle */}
        <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-slate-50/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Emergency Queue</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {emergencyCases.length} Cases
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acuity queue sorted by clinical priority (🔴 Critical → 🟠 Urgent → 🟢 Less Urgent)
                </p>
              </div>
            </div>

            {/* Search Bar with required placeholder */}
            <div className="w-full lg:w-96 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient by name, Patient ID, or emergency visit ID..."
                className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Workflow Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200/70 text-xs">
            <span className="text-slate-500 font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filter View:
            </span>
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All ({emergencyCases.length})
            </button>
            <button
              onClick={() => setActiveFilter('WAITING_TRIAGE')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'WAITING_TRIAGE'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Waiting for Triage ({waitingForTriageCases.length})
            </button>
            <button
              onClick={() => setActiveFilter('IN_TRIAGE')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'IN_TRIAGE'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              In Triage ({inTriageCases.length})
            </button>
            <button
              onClick={() => setActiveFilter('WAITING_DOCTOR')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'WAITING_DOCTOR'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Waiting for Doctor ({waitingForDoctorCases.length})
            </button>
            <button
              onClick={() => setActiveFilter('WITH_DOCTOR')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'WITH_DOCTOR'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              With Emergency Doctor ({withDoctorCases.length})
            </button>
          </div>
        </div>

        {/* 4. WORKFLOW QUEUE SECTIONS */}
        <div className="divide-y divide-slate-200">
          {/* SECTION 1: WAITING FOR TRIAGE */}
          {(activeFilter === 'ALL' || activeFilter === 'WAITING_TRIAGE') && (
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                    Waiting for Triage
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-full bg-blue-100 text-blue-800">
                    {waitingForTriageCases.length}
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                  Patients registered by reception awaiting nursing assessment
                </span>
              </div>

              {waitingForTriageCases.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No patients currently waiting for triage.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {waitingForTriageCases.map((ec) => {
                    const priority = getPriorityLevel(ec);
                    const waitingMins = getDynamicWaitingMinutes(ec);

                    return (
                      <div
                        key={ec.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition space-y-3"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <div className="space-y-1.5">
                            {/* Patient Demographics & Priority Tag */}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 text-white">
                                {ec.id}
                              </span>
                              <span className="text-sm font-bold text-slate-900">
                                {ec.patientName}
                              </span>
                              {ec.patientId && (
                                <span className="text-xs text-slate-500 font-mono">
                                  ({ec.patientId})
                                </span>
                              )}
                              <span className="text-xs text-slate-500">
                                {ec.age}y • {ec.gender}
                              </span>

                              {/* Priority Tag */}
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                                priority === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : priority === 'URGENT'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {priority === 'CRITICAL' ? '🔴 CRITICAL' : priority === 'URGENT' ? '🟠 URGENT' : '🟢 LESS URGENT'}
                              </span>

                              {/* Status Tag */}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                WAITING FOR TRIAGE
                              </span>

                              {/* Dynamic Waiting Timer */}
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1 font-semibold">
                                <Clock className="w-3 h-3 text-slate-400" />
                                Waiting: {waitingMins} min
                              </span>
                            </div>

                            {/* Chief Complaint */}
                            <p className="text-xs text-slate-800">
                              <span className="font-bold text-slate-900">Chief Complaint:</span>{' '}
                              <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                {ec.chiefComplaint}
                              </span>
                            </p>

                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-3">
                              <span>Arrival: {ec.arrivalTime || '08:40'}</span>
                              {ec.arrivalMethod && <span>• Method: {ec.arrivalMethod}</span>}
                              {ec.bedAssigned && <span>• Bay: {ec.bedAssigned}</span>}
                            </div>
                          </div>

                          {/* Action Column */}
                          <div className="shrink-0 flex items-center">
                            <button
                              type="button"
                              onClick={() => setTriageModalCase(ec)}
                              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <HeartPulse className="w-3.5 h-3.5" />
                              <span>Start Triage</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: IN TRIAGE */}
          {(activeFilter === 'ALL' || activeFilter === 'IN_TRIAGE') && (
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                    In Triage
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-full bg-amber-100 text-amber-800">
                    {inTriageCases.length}
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                  Patients currently being assessed by nursing staff
                </span>
              </div>

              {inTriageCases.length === 0 ? (
                <div className="p-5 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No patients currently in triage assessment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inTriageCases.map((ec) => {
                    const priority = getPriorityLevel(ec);
                    const waitingMins = getDynamicWaitingMinutes(ec);

                    return (
                      <div
                        key={ec.id}
                        className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 hover:bg-amber-50/40 transition space-y-3"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 text-white">
                                {ec.id}
                              </span>
                              <span className="text-sm font-bold text-slate-900">
                                {ec.patientName}
                              </span>
                              <span className="text-xs text-slate-500">
                                {ec.age}y • {ec.gender}
                              </span>

                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                priority === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : priority === 'URGENT'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {priority === 'CRITICAL' ? '🔴 CRITICAL' : priority === 'URGENT' ? '🟠 URGENT' : '🟢 LESS URGENT'}
                              </span>

                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                IN TRIAGE
                              </span>

                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1 font-semibold">
                                <Clock className="w-3 h-3 text-slate-400" />
                                Elapsed: {waitingMins} min
                              </span>
                            </div>

                            <p className="text-xs text-slate-800">
                              <span className="font-bold text-slate-900">Chief Complaint:</span> {ec.chiefComplaint}
                            </p>

                            {/* In-progress vitals preview if available */}
                            {ec.vitalSigns && (
                              <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold">
                                  BP: {ec.vitalSigns.bloodPressureSystolic}/{ec.vitalSigns.bloodPressureDiastolic}
                                </span>
                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold">
                                  Pulse: {ec.vitalSigns.pulseRate}
                                </span>
                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold">
                                  SpO2: {ec.vitalSigns.oxygenSaturation}%
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="shrink-0 flex items-center">
                            <button
                              type="button"
                              onClick={() => setTriageModalCase(ec)}
                              className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Continue Triage</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: WAITING FOR EMERGENCY DOCTOR */}
          {(activeFilter === 'ALL' || activeFilter === 'WAITING_DOCTOR') && (
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 ring-4 ring-purple-100" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                    Waiting for Emergency Doctor
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-full bg-purple-100 text-purple-800">
                    {waitingForDoctorCases.length}
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                  Triage completed — patients prioritized and prepared for physician evaluation
                </span>
              </div>

              {waitingForDoctorCases.length === 0 ? (
                <div className="p-5 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No patients currently waiting for physician evaluation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {waitingForDoctorCases.map((ec) => {
                    const priority = getPriorityLevel(ec);
                    const waitingMins = getDynamicWaitingMinutes(ec);

                    return (
                      <div
                        key={ec.id}
                        className="p-4 rounded-xl border border-purple-200/90 bg-purple-50/20 hover:bg-purple-50/40 transition space-y-3"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 text-white">
                                {ec.id}
                              </span>
                              <span className="text-sm font-bold text-slate-900">
                                {ec.patientName}
                              </span>
                              <span className="text-xs text-slate-500 font-mono">
                                {ec.patientId && `(${ec.patientId})`}
                              </span>
                              <span className="text-xs text-slate-500">
                                {ec.age}y • {ec.gender}
                              </span>

                              {/* Priority Tag */}
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                                priority === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : priority === 'URGENT'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {priority === 'CRITICAL' ? '🔴 CRITICAL' : priority === 'URGENT' ? '🟠 URGENT' : '🟢 LESS URGENT'}
                              </span>

                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                                WAITING FOR EMERGENCY DOCTOR
                              </span>

                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1 font-semibold">
                                <Clock className="w-3 h-3 text-slate-400" />
                                Waiting: {waitingMins} min
                              </span>
                            </div>

                            <p className="text-xs text-slate-800">
                              <span className="font-bold text-slate-900">Chief Complaint:</span>{' '}
                              <span className="font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {ec.chiefComplaint}
                              </span>
                            </p>

                            {/* Completed Vitals Display */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 pt-0.5 font-mono">
                              {ec.vitalSigns ? (
                                <>
                                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800">
                                    BP: {ec.vitalSigns.bloodPressureSystolic}/{ec.vitalSigns.bloodPressureDiastolic}
                                  </span>
                                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800">
                                    Pulse: {ec.vitalSigns.pulseRate} bpm
                                  </span>
                                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800">
                                    SpO2: {ec.vitalSigns.oxygenSaturation}%
                                  </span>
                                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-800">
                                    Temp: {ec.vitalSigns.temperature}°C
                                  </span>
                                  {ec.vitalSigns.painLevel !== undefined && (
                                    <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 rounded text-[11px] font-bold">
                                      Pain: {ec.vitalSigns.painLevel}/10
                                    </span>
                                  )}
                                </>
                              ) : ec.vitals ? (
                                <>
                                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold">
                                    BP: {ec.vitals.bp}
                                  </span>
                                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold">
                                    Pulse: {ec.vitals.pulse}
                                  </span>
                                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold">
                                    SpO2: {ec.vitals.spo2}%
                                  </span>
                                </>
                              ) : null}

                              <span className="text-[11px] text-blue-700 font-sans font-medium bg-blue-50 px-2 py-0.5 rounded">
                                Triaged by: {ec.triagedBy || 'Sr. Tigist Mengistu, BSc'}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center">
                            <button
                              type="button"
                              onClick={() => setAssessmentViewCase(ec)}
                              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Assessment</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: WITH EMERGENCY DOCTOR / IN TREATMENT */}
          {(activeFilter === 'ALL' || activeFilter === 'WITH_DOCTOR') && (
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-4 ring-rose-100" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                    With Emergency Doctor / In Active Care
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-full bg-rose-100 text-rose-800">
                    {withDoctorCases.length}
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                  Patients currently receiving active emergency physician care and monitoring
                </span>
              </div>

              {withDoctorCases.length === 0 ? (
                <div className="p-5 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No emergency patients currently under active physician treatment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {withDoctorCases.map((ec) => {
                    const priority = getPriorityLevel(ec);
                    const isCritical = priority === 'CRITICAL' || ec.status === 'RESUSCITATION';

                    return (
                      <div
                        key={ec.id}
                        className={`p-4 rounded-xl border transition space-y-3 ${
                          isCritical
                            ? 'border-rose-300 bg-rose-50/30 hover:bg-rose-50/50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 text-white">
                                {ec.id}
                              </span>
                              <span className="text-sm font-bold text-slate-900">
                                {ec.patientName}
                              </span>
                              {ec.patientId && (
                                <span className="text-xs text-slate-500 font-mono">
                                  ({ec.patientId})
                                </span>
                              )}
                              <span className="text-xs text-slate-500">
                                {ec.age}y • {ec.gender}
                              </span>

                              {/* Priority Tag */}
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                                priority === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : priority === 'URGENT'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {priority === 'CRITICAL' ? '🔴 CRITICAL' : priority === 'URGENT' ? '🟠 URGENT' : '🟢 LESS URGENT'}
                              </span>

                              {/* Status Tag */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                ec.status === 'RESUSCITATION'
                                  ? 'bg-rose-600 text-white shadow-2xs font-mono'
                                  : ec.status === 'OBSERVATION'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                {ec.status === 'RESUSCITATION' ? 'IN RESUSCITATION' : ec.status}
                              </span>

                              {ec.bedAssigned && (
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1">
                                  <BedDouble className="w-3 h-3 text-blue-600" />
                                  {ec.bedAssigned}
                                </span>
                              )}
                            </div>

                            {/* Chief Complaint */}
                            <p className="text-xs text-slate-800">
                              <span className="font-bold text-slate-900">Chief Complaint:</span>{' '}
                              <span className="font-medium text-rose-950 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                                {ec.chiefComplaint}
                              </span>
                            </p>

                            {/* Vitals Telemetry Bar */}
                            {(ec.vitalSigns || ec.vitals) && (
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-0.5 font-mono">
                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800">
                                  BP: {ec.vitalSigns ? `${ec.vitalSigns.bloodPressureSystolic}/${ec.vitalSigns.bloodPressureDiastolic}` : ec.vitals?.bp}
                                </span>
                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800">
                                  Pulse: {ec.vitalSigns?.pulseRate || ec.vitals?.pulse} bpm
                                </span>
                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800">
                                  SpO2: {ec.vitalSigns?.oxygenSaturation || ec.vitals?.spo2}%
                                </span>
                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-800">
                                  Temp: {ec.vitalSigns?.temperature || ec.vitals?.temp}°C
                                </span>
                              </div>
                            )}

                            {/* Assigned Doctor */}
                            <p className="text-xs text-slate-600">
                              <span className="font-bold text-slate-800">Attending Physician:</span>{' '}
                              <span className="font-bold text-blue-700">{ec.assignedDoctor || 'Dr. Biruk Assefa, MD'}</span>
                            </p>
                          </div>

                          {/* Action Column: View Emergency Case ONLY (Never Treat Patient for Nurse) */}
                          <div className="shrink-0 flex items-center">
                            <button
                              type="button"
                              onClick={() => setEmergencyCaseViewCase(ec)}
                              className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Emergency Case</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Nurse Triage Assessment (for Waiting for Triage & In Triage) */}
      <NurseTriageModal
        isOpen={!!triageModalCase}
        onClose={() => setTriageModalCase(null)}
        emergencyCase={triageModalCase}
        onCompleteTriage={handleCompleteTriage}
        onSaveDraft={handleSaveDraft}
      />

      {/* MODAL 2: Nurse Completed Triage View (for Waiting for Doctor) */}
      <NurseAssessmentViewModal
        isOpen={!!assessmentViewCase}
        onClose={() => setAssessmentViewCase(null)}
        emergencyCase={assessmentViewCase}
        onReAssess={(ec) => {
          setAssessmentViewCase(null);
          setTriageModalCase(ec);
        }}
      />

      {/* MODAL 3: Nurse Emergency Case Monitor (for With Doctor / In Active Care) */}
      <NurseEmergencyCaseViewModal
        isOpen={!!emergencyCaseViewCase}
        onClose={() => setEmergencyCaseViewCase(null)}
        emergencyCase={emergencyCaseViewCase}
      />
    </div>
  );
};
export default EmergencyDashboard;
