import React from 'react';
import { VitalSignRecord } from '../../types';
import { Activity, Thermometer, Heart, Wind, Droplet, Weight } from 'lucide-react';

interface VitalsSummaryProps {
  vitals?: VitalSignRecord;
  onRecordNew?: () => void;
}

export const VitalsSummary: React.FC<VitalsSummaryProps> = ({ vitals, onRecordNew }) => {
  if (!vitals) {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
        <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700">No baseline vitals recorded yet</p>
        <p className="text-xs text-slate-400 mt-1 mb-4">Patient has not undergone intake triage today.</p>
        {onRecordNew && (
          <button
            onClick={onRecordNew}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            Record Vitals Now
          </button>
        )}
      </div>
    );
  }

  // Normal range helpers
  const isBpElevated = vitals.bloodPressureSystolic >= 130 || vitals.bloodPressureDiastolic >= 85;
  const isTempFever = vitals.temperature >= 37.8;
  const isPulseHigh = vitals.pulseRate > 100 || vitals.pulseRate < 60;
  const isSpo2Low = vitals.oxygenSaturation < 95;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Latest Vital Signs</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Recorded: {vitals.recordedAt} by <span className="text-slate-600 font-medium">{vitals.recordedBy}</span>
          </p>
        </div>
        {onRecordNew && (
          <button
            onClick={onRecordNew}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-50 transition"
          >
            + Update Vitals
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Blood Pressure */}
        <div className={`p-3 rounded-xl border ${isBpElevated ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Blood Pressure</span>
            <Activity className={`w-3.5 h-3.5 ${isBpElevated ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900 tracking-tight font-mono">
              {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}
            </span>
            <span className="text-[10px] text-slate-500">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Normal: &lt;120/80</span>
        </div>

        {/* Heart Rate / Pulse */}
        <div className={`p-3 rounded-xl border ${isPulseHigh ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Heart Rate</span>
            <Heart className={`w-3.5 h-3.5 ${isPulseHigh ? 'text-amber-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900 tracking-tight font-mono">
              {vitals.pulseRate}
            </span>
            <span className="text-[10px] text-slate-500">bpm</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Normal: 60 - 100</span>
        </div>

        {/* Temperature */}
        <div className={`p-3 rounded-xl border ${isTempFever ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Temperature</span>
            <Thermometer className={`w-3.5 h-3.5 ${isTempFever ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900 tracking-tight font-mono">
              {vitals.temperature}
            </span>
            <span className="text-[10px] text-slate-500">°C</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Normal: 36.5 - 37.5</span>
        </div>

        {/* Oxygen Saturation */}
        <div className={`p-3 rounded-xl border ${isSpo2Low ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">SpO2 Oxygen</span>
            <Droplet className={`w-3.5 h-3.5 ${isSpo2Low ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900 tracking-tight font-mono">
              {vitals.oxygenSaturation}
            </span>
            <span className="text-[10px] text-slate-500">%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Normal: 95 - 100%</span>
        </div>

        {/* Respiratory Rate */}
        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Resp. Rate</span>
            <Wind className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900 tracking-tight font-mono">
              {vitals.respiratoryRate}
            </span>
            <span className="text-[10px] text-slate-500">/min</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Normal: 12 - 20</span>
        </div>

        {/* Weight */}
        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Body Weight</span>
            <Weight className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900 tracking-tight font-mono">
              {vitals.weight}
            </span>
            <span className="text-[10px] text-slate-500">kg</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Pain Scale: {vitals.painScale ?? 0}/10</span>
        </div>
      </div>
    </div>
  );
};
