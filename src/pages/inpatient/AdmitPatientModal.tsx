import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { Bed } from '../../types';
import { BedDouble, CheckCircle2 } from 'lucide-react';

interface AdmitPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  bed?: Bed;
}

export const AdmitPatientModal: React.FC<AdmitPatientModalProps> = ({
  isOpen,
  onClose,
  bed
}) => {
  const { patients, updateBedStatus } = useHospital();

  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [admissionReason, setAdmissionReason] = useState('Inpatient clinical monitoring and intravenous therapy');

  if (!bed) return null;

  const selectedPatient = patients.find(p => p.id === patientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    updateBedStatus(
      bed.id,
      'OCCUPIED',
      selectedPatient.id,
      `${selectedPatient.firstName} ${selectedPatient.lastName}`
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Admit Patient to Bed: ${bed.bedNumber}`}
      subtitle={`Ward: ${bed.wardName} (${bed.department}) • Type: ${bed.type}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Patient for Inpatient Admission</label>
          <select
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.firstName} {p.middleName} {p.lastName} ({p.age}y, {p.gender})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Hospital Admission</label>
          <textarea
            rows={3}
            value={admissionReason}
            onChange={e => setAdmissionReason(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
          />
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
          <BedDouble className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            Assigning this bed will automatically update the ward census, nursing station patient board, and pharmacy order delivery destination.
          </span>
        </div>

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
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Admit to Ward Bed
          </button>
        </div>
      </form>
    </Modal>
  );
};
