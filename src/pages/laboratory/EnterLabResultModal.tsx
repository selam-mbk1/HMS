import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { LabTestRequest, LabParameter } from '../../types';
import { FlaskConical, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface EnterLabResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: LabTestRequest;
}

export const EnterLabResultModal: React.FC<EnterLabResultModalProps> = ({
  isOpen,
  onClose,
  request
}) => {
  const { submitLabResult } = useHospital();

  const [parameters, setParameters] = useState<LabParameter[]>(() => {
    if (!request) return [];
    return request.parameters.map(p => ({
      ...p,
      result: p.result === 'PENDING' ? '' : p.result
    }));
  });

  const [remarks, setRemarks] = useState(request?.technicianRemarks || '');

  // Reset parameters when request changes
  React.useEffect(() => {
    if (request) {
      setParameters(
        request.parameters.map(p => ({
          ...p,
          result: p.result === 'PENDING' ? '' : p.result
        }))
      );
      setRemarks(request.technicianRemarks || '');
    }
  }, [request]);

  if (!request) return null;

  const handleParamChange = (index: number, val: string) => {
    setParameters(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], result: val };
      return updated;
    });
  };

  const handleAbnormalToggle = (index: number) => {
    setParameters(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isAbnormal: !updated[index].isAbnormal };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLabResult(request.id, parameters, remarks);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Enter Diagnostic Results: ${request.testName}`}
      subtitle={`Order ID: ${request.id} • Sample: ${request.sampleType}`}
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Clinical Summary */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient Name</span>
            <span className="font-bold text-slate-900">{request.patientName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient MRN</span>
            <span className="font-mono text-slate-800">{request.patientId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ordering Physician</span>
            <span className="font-medium text-slate-800">{request.doctorName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Priority Acuity</span>
            <span className={`font-bold ${request.priority === 'CRITICAL' ? 'text-rose-600' : request.priority === 'URGENT' ? 'text-amber-600' : 'text-slate-700'}`}>
              {request.priority}
            </span>
          </div>
        </div>

        {/* Parameters Input Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
            Test Analytes & Quantitative Reference Ranges
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-2.5">Parameter / Analyte</th>
                  <th className="px-4 py-2.5">Result Value</th>
                  <th className="px-4 py-2.5">Unit</th>
                  <th className="px-4 py-2.5">Reference Range</th>
                  <th className="px-4 py-2.5 text-center">Abnormal Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parameters.map((param, idx) => (
                  <tr key={idx} className={param.isAbnormal ? 'bg-rose-50/40' : 'hover:bg-slate-50'}>
                    <td className="px-4 py-3 font-semibold text-slate-800">{param.name}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={String(param.result)}
                        onChange={e => handleParamChange(idx, e.target.value)}
                        placeholder="Enter value"
                        required
                        className="w-32 px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{param.unit}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{param.referenceRange}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleAbnormalToggle(idx)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition ${
                          param.isAbnormal
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {param.isAbnormal ? 'Flagged High/Low' : 'Normal'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technician Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Laboratory Remarks & Quality Assurance Notes
          </label>
          <textarea
            rows={2}
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder="e.g. Sample processed within 30 minutes of collection. Calibrator verification passed."
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
          />
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Sign & Submit Lab Results
          </button>
        </div>
      </form>
    </Modal>
  );
};
