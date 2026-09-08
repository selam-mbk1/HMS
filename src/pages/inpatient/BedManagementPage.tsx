import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Bed, BedStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { 
  BedDouble, 
  UserCheck, 
  Sparkles, 
  Wrench, 
  Filter, 
  ArrowRight, 
  UserPlus, 
  LogOut,
  RefreshCw
} from 'lucide-react';
import { AdmitPatientModal } from './AdmitPatientModal';

export const BedManagementPage: React.FC = () => {
  const { beds, updateBedStatus } = useHospital();

  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeBedToAdmit, setActiveBedToAdmit] = useState<Bed | undefined>(undefined);

  // Filtered beds
  const filteredBeds = beds.filter(b => {
    const matchWard = selectedWard === 'ALL' || b.wardName === selectedWard;
    const matchStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
    return matchWard && matchStatus;
  });

  // Ward lists
  const wards = Array.from(new Set(beds.map(b => b.wardName)));

  // Metrics
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED').length;
  const availableBeds = beds.filter(b => b.status === 'AVAILABLE').length;
  const cleaningBeds = beds.filter(b => b.status === 'CLEANING').length;
  const occupancyRate = Math.round((occupiedBeds / (totalBeds || 1)) * 100);

  const handleDischarge = (bedId: string) => {
    updateBedStatus(bedId, 'CLEANING');
  };

  const handleFinishCleaning = (bedId: string) => {
    updateBedStatus(bedId, 'AVAILABLE');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Inpatient Ward & Bed Board
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time visual census across Medical, Surgical, ICU, Maternity, and Pediatric units.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Hospital Beds"
          value={totalBeds}
          icon={BedDouble}
          iconColor="text-blue-600 bg-blue-50"
          subtitle="Sanctioned inpatient capacity"
        />
        <StatCard
          title="Occupied Beds"
          value={occupiedBeds}
          icon={UserCheck}
          iconColor="text-teal-600 bg-teal-50"
          subtitle={`${occupancyRate}% ward occupancy rate`}
        />
        <StatCard
          title="Immediately Available"
          value={availableBeds}
          icon={Sparkles}
          iconColor="text-emerald-600 bg-emerald-50"
          subtitle="Ready for patient intake"
        />
        <StatCard
          title="Sanitizing / Turnover"
          value={cleaningBeds}
          icon={RefreshCw}
          iconColor="text-amber-600 bg-amber-50"
          subtitle="Undergoing terminal decontamination"
        />
      </div>

      {/* Ward Filter Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Ward:
          </span>
          <button
            onClick={() => setSelectedWard('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedWard === 'ALL'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Wards ({totalBeds})
          </button>
          {wards.map(ward => (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedWard === ward
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {ward}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-hidden"
          >
            <option value="ALL">All Bed Statuses</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="OCCUPIED">Occupied Only</option>
            <option value="CLEANING">Cleaning / Turnover</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Visual Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBeds.map(bed => {
          const isOccupied = bed.status === 'OCCUPIED';
          const isAvailable = bed.status === 'AVAILABLE';
          const isCleaning = bed.status === 'CLEANING';

          return (
            <div
              key={bed.id}
              className={`p-4 rounded-xl border transition shadow-xs flex flex-col justify-between ${
                isOccupied
                  ? 'bg-blue-50/40 border-blue-200'
                  : isAvailable
                  ? 'bg-white border-slate-200 hover:border-emerald-400'
                  : isCleaning
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-100 border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BedDouble className={`w-4 h-4 ${isOccupied ? 'text-blue-600' : isAvailable ? 'text-emerald-600' : 'text-amber-600'}`} />
                    <span className="font-mono text-sm font-bold text-slate-900">{bed.bedNumber}</span>
                  </div>
                  <StatusBadge status={bed.status} />
                </div>

                <p className="text-xs font-semibold text-slate-700">{bed.wardName}</p>
                <p className="text-[11px] text-slate-500">{bed.type} • Floor 2</p>

                {isOccupied && bed.currentPatientName && (
                  <div className="mt-3 p-2.5 bg-white rounded-lg border border-blue-100 text-xs">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Current Inpatient</span>
                    <p className="font-bold text-slate-900 truncate">{bed.currentPatientName}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">Admitted: {bed.admissionDate}</p>
                  </div>
                )}

                {isCleaning && (
                  <div className="mt-3 p-2.5 bg-white rounded-lg border border-amber-200 text-xs text-amber-900">
                    <p className="font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Housekeeping in progress
                    </p>
                  </div>
                )}
              </div>

              {/* Bed Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {isAvailable && (
                  <button
                    onClick={() => setActiveBedToAdmit(bed)}
                    className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Admit Patient</span>
                  </button>
                )}

                {isOccupied && (
                  <button
                    onClick={() => handleDischarge(bed.id)}
                    className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
                    title="Discharge patient and queue for terminal cleaning"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-500" />
                    <span>Discharge / Free Bed</span>
                  </button>
                )}

                {isCleaning && (
                  <button
                    onClick={() => handleFinishCleaning(bed.id)}
                    className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mark Ready for Intake</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admit Patient Modal */}
      <AdmitPatientModal
        isOpen={Boolean(activeBedToAdmit)}
        onClose={() => setActiveBedToAdmit(undefined)}
        bed={activeBedToAdmit}
      />
    </div>
  );
};
