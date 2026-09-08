import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { VitalsSummary } from '../../components/common/VitalsSummary';
import { MedicalTimeline } from '../../components/common/MedicalTimeline';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Receipt, 
  Heart,
  Plus
} from 'lucide-react';
import { RecordVitalsModal } from '../nurse/RecordVitalsModal';
import { BookAppointmentModal } from '../reception/BookAppointmentModal';

export const PatientDetailPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { 
    patients, 
    vitals, 
    consultations, 
    labRequests, 
    prescriptions, 
    appointments, 
    invoices 
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TIMELINE' | 'CONSULTATIONS' | 'LABS' | 'PRESCRIPTIONS' | 'BILLING'>('OVERVIEW');
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  const patient = patients.find(p => p.id === patientId) || patients[0];

  if (!patient) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Patient record not found.</p>
        <button onClick={() => navigate('/patients')} className="mt-2 text-blue-600 underline text-xs font-semibold">
          Return to Registry
        </button>
      </div>
    );
  }

  // Patient specific clinical data
  const patientVitals = vitals.find(v => v.patientId === patient.id);
  const patientConsultations = consultations.filter(c => c.patientId === patient.id);
  const patientLabs = labRequests.filter(l => l.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientInvoices = invoices.filter(i => i.patientId === patient.id);

  return (
    <div className="space-y-6">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patients Registry</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBookModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs"
          >
            + Book Appointment
          </button>
          <button
            onClick={() => setShowVitalsModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs"
          >
            + Record Vitals
          </button>
          <button
            onClick={() => navigate(`/doctor/consultation/${patient.id}`)}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Open Consultation</span>
          </button>
        </div>
      </div>

      {/* Patient Master Demographics Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {patient.firstName} {patient.middleName} {patient.lastName}
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  {patient.id}
                </span>
                <StatusBadge status={patient.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-xs text-slate-500 mt-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Age / Sex:</span>
                  <span className="font-medium text-slate-800">{patient.age} yrs • {patient.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Blood Group:</span>
                  <span className="font-bold text-blue-700">{patient.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone Number:</span>
                  <span className="font-mono text-slate-800">{patient.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sub-City:</span>
                  <span className="text-slate-800">{patient.subCity}, Addis Ababa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Allergies & Emergency Contact */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-xs max-w-xs">
              <span className="font-bold text-rose-800 block text-[10px] uppercase">Drug & Food Allergies</span>
              <span className="text-rose-900 font-medium">{patient.allergies.join(', ') || 'No known allergies'}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs max-w-xs">
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Next of Kin Contact</span>
              <span className="font-semibold text-slate-800">{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</span>
              <span className="block text-slate-500 font-mono text-[11px] mt-0.5">{patient.emergencyContact.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 text-xs font-semibold">
        {[
          { id: 'OVERVIEW', label: 'Clinical Overview', icon: User },
          { id: 'TIMELINE', label: `Medical Timeline (${patientConsultations.length + patientLabs.length})`, icon: Calendar },
          { id: 'CONSULTATIONS', label: `Consultations (${patientConsultations.length})`, icon: Stethoscope },
          { id: 'LABS', label: `Diagnostic Labs (${patientLabs.length})`, icon: FlaskConical },
          { id: 'PRESCRIPTIONS', label: `Prescriptions (${patientPrescriptions.length})`, icon: Pill },
          { id: 'BILLING', label: `Billing & Receipts (${patientInvoices.length})`, icon: Receipt },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-bold bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <VitalsSummary vitals={patientVitals} onRecordNew={() => setShowVitalsModal(true)} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Consultations */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Physician Notes</h3>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer" onClick={() => setActiveTab('CONSULTATIONS')}>
                  View all
                </span>
              </div>

              {patientConsultations.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No consultation history recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {patientConsultations.slice(0, 2).map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5 text-xs">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{c.doctorName} ({c.department})</span>
                        <span className="font-mono text-slate-500">{c.date}</span>
                      </div>
                      <p className="text-slate-600"><strong>Chief Complaint:</strong> {c.chiefComplaint}</p>
                      <p className="text-slate-600"><strong>Plan:</strong> {c.treatmentPlan}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Prescriptions */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Medications</h3>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer" onClick={() => setActiveTab('PRESCRIPTIONS')}>
                  View all
                </span>
              </div>

              {patientPrescriptions.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No active prescriptions.</p>
              ) : (
                <div className="space-y-2.5">
                  {patientPrescriptions[0].items.map((med, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{med.medicineName} ({med.dosage})</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{med.frequency} • {med.duration}</p>
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {med.instructions}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <MedicalTimeline
          consultations={patientConsultations}
          labs={patientLabs}
          prescriptions={patientPrescriptions}
          appointments={patientAppointments}
        />
      )}

      {/* Tab 3: CONSULTATIONS */}
      {activeTab === 'CONSULTATIONS' && (
        <div className="space-y-4">
          {patientConsultations.map(c => (
            <div key={c.id} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Consultation with {c.doctorName}</h4>
                  <p className="text-slate-500">{c.department}</p>
                </div>
                <span className="font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">{c.date}</span>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block">Chief Complaint:</span>
                <p className="text-slate-600 mt-0.5">{c.chiefComplaint}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block">History of Present Illness:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{c.historyOfPresentIllness}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block">Physical Examination Findings:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{c.physicalExamination}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Diagnoses:</span>
                <div className="flex flex-wrap gap-2">
                  {c.diagnoses.map((d, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200">
                      <strong>{d.icd10}:</strong> {d.name} {d.isPrimary && '(Primary)'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>Treatment & Follow-up: {c.treatmentPlan}</span>
                {c.followUpDate && <span className="font-semibold text-blue-700">Next Review: {c.followUpDate}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: LABS */}
      {activeTab === 'LABS' && (
        <div className="space-y-4">
          {patientLabs.map(l => (
            <div key={l.id} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{l.testName}</h4>
                  <p className="text-slate-500">Ordered by {l.doctorName} • Sample: {l.sampleType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={l.priority} />
                  <StatusBadge status={l.status} />
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Parameter</th>
                      <th className="px-3 py-2">Result</th>
                      <th className="px-3 py-2">Unit</th>
                      <th className="px-3 py-2">Reference Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {l.parameters.map((p, idx) => (
                      <tr key={idx} className={p.isAbnormal ? 'bg-rose-50/50' : ''}>
                        <td className="px-3 py-2 font-medium text-slate-800">{p.name}</td>
                        <td className={`px-3 py-2 font-bold font-mono ${p.isAbnormal ? 'text-rose-600' : 'text-slate-900'}`}>
                          {p.result}
                        </td>
                        <td className="px-3 py-2 text-slate-500 font-mono">{p.unit}</td>
                        <td className="px-3 py-2 text-slate-500 font-mono">{p.referenceRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {l.technicianRemarks && (
                <p className="text-slate-500 text-[11px] pt-1">
                  <strong>Tech Remarks:</strong> {l.technicianRemarks}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: PRESCRIPTIONS */}
      {activeTab === 'PRESCRIPTIONS' && (
        <div className="space-y-4">
          {patientPrescriptions.map(p => (
            <div key={p.id} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Rx Order: {p.id}</h4>
                  <p className="text-slate-500">Prescribed by {p.doctorName} on {p.createdAt}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="space-y-2">
                {p.items.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{item.medicineName} ({item.dosage})</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.frequency} • {item.duration} • {item.route}</p>
                    </div>
                    <span className="text-[11px] text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded">
                      {item.instructions}
                    </span>
                  </div>
                ))}
              </div>

              {p.notes && <p className="text-slate-500 text-[11px]">Notes: {p.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: BILLING */}
      {activeTab === 'BILLING' && (
        <div className="space-y-4">
          {patientInvoices.map(inv => (
            <div key={inv.id} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Invoice: {inv.id}</h4>
                  <p className="text-slate-500">Issued: {inv.issuedDate}</p>
                </div>
                <StatusBadge status={inv.paymentStatus} />
              </div>

              <div className="divide-y divide-slate-100">
                {inv.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between">
                    <span className="text-slate-700">{it.description} ({it.quantity}x)</span>
                    <span className="font-mono text-slate-900 font-bold">{it.total.toLocaleString()} ETB</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-slate-900 font-mono">{inv.totalAmount.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="text-emerald-700 font-mono font-semibold">{inv.paidAmount.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold">
                <span>Balance Due:</span>
                <span className="text-rose-600 font-mono">{inv.balanceDue.toLocaleString()} ETB</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <RecordVitalsModal
        isOpen={showVitalsModal}
        onClose={() => setShowVitalsModal(false)}
        preSelectedPatientId={patient.id}
      />
      <BookAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        preSelectedPatientId={patient.id}
      />
    </div>
  );
};
