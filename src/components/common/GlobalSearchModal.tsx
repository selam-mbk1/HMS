import React, { useState, useMemo } from 'react';
import { Search, User, Calendar, FileText, FlaskConical, Pill, Receipt, ArrowRight, X, BedDouble } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { patients, appointments, labRequests, prescriptions, invoices, beds } = useHospital();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const searchPlaceholder = currentUser?.role === 'NURSE'
    ? 'Search patient by name, Patient ID, or bed...'
    : currentUser?.role === 'RECEPTIONIST'
    ? 'Search patient by name, Patient ID, or phone...'
    : 'Search patients (name, MRN, phone), appointments, lab orders, prescriptions, or bills...';

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();

    const matchedPatients = patients.filter(
      p =>
        p.id.toLowerCase().includes(q) ||
        `${p.firstName} ${p.middleName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.phone.includes(q)
    ).slice(0, 4);

    const matchedAppointments = appointments.filter(
      a =>
        a.id.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedLabs = labRequests.filter(
      l =>
        l.id.toLowerCase().includes(q) ||
        l.patientName.toLowerCase().includes(q) ||
        l.testName.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedRx = prescriptions.filter(
      r =>
        r.id.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.items.some(i => i.medicineName.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedInvoices = invoices.filter(
      i =>
        i.id.toLowerCase().includes(q) ||
        i.patientName.toLowerCase().includes(q) ||
        i.referenceNumber?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedBeds = beds.filter(
      b =>
        b.bedCode.toLowerCase().includes(q) ||
        b.roomNumber.toLowerCase().includes(q) ||
        b.wardName.toLowerCase().includes(q) ||
        (b.currentPatientName && b.currentPatientName.toLowerCase().includes(q))
    ).slice(0, 3);

    const totalCount =
      matchedPatients.length +
      matchedAppointments.length +
      matchedLabs.length +
      matchedRx.length +
      matchedInvoices.length +
      matchedBeds.length;

    return {
      patients: matchedPatients,
      appointments: matchedAppointments,
      labs: matchedLabs,
      prescriptions: matchedRx,
      invoices: matchedInvoices,
      beds: matchedBeds,
      totalCount
    };
  }, [query, patients, appointments, labRequests, prescriptions, invoices, beds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center pt-16 p-4 sm:p-6 text-center">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all border border-slate-200">
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/70">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="ml-2 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200 rounded">
              ESC
            </kbd>
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-slate-100">
            {!query.trim() && (
              <div className="py-8 text-center text-slate-400 text-xs">
                <p>Type an MRN (e.g. PAT-001201), patient name, doctor, test, or invoice number.</p>
                <div className="mt-3 flex justify-center gap-2">
                  <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 text-[11px] cursor-pointer hover:bg-slate-200" onClick={() => setQuery('Abebe')}>
                    Try "Abebe"
                  </span>
                  <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 text-[11px] cursor-pointer hover:bg-slate-200" onClick={() => setQuery('CBC')}>
                    Try "CBC"
                  </span>
                  <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 text-[11px] cursor-pointer hover:bg-slate-200" onClick={() => setQuery('Metformin')}>
                    Try "Metformin"
                  </span>
                </div>
              </div>
            )}

            {query.trim() && results && results.totalCount === 0 && (
              <div className="py-12 text-center text-slate-500">
                <p className="text-sm font-medium">No records match "{query}"</p>
                <p className="text-xs text-slate-400 mt-1">Check the spelling or try searching by Patient MRN ID</p>
              </div>
            )}

            {/* Patients section */}
            {results && results.patients.length > 0 && (
              <div className="py-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Patients ({results.patients.length})
                </h4>
                <div className="space-y-1">
                  {results.patients.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onClose();
                        navigate(`/patients/${p.id}`);
                      }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50/70 cursor-pointer group transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                            {p.firstName} {p.middleName} {p.lastName}
                          </span>
                          <span className="text-xs px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono">
                            {p.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {p.age} yrs • {p.gender} • {p.phone} • {p.assignedDepartment}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appointments */}
            {results && results.appointments.length > 0 && (
              <div className="py-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" /> Appointments ({results.appointments.length})
                </h4>
                <div className="space-y-1">
                  {results.appointments.map(a => (
                    <div
                      key={a.id}
                      onClick={() => {
                        onClose();
                        navigate('/reception/appointments');
                      }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-teal-50/70 cursor-pointer group transition"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">
                          {a.patientName} with {a.doctorName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {a.date} at {a.time} • Status: {a.status} • {a.reason}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lab Requests */}
            {results && results.labs.length > 0 && (
              <div className="py-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-purple-600" /> Diagnostic Lab Tests ({results.labs.length})
                </h4>
                <div className="space-y-1">
                  {results.labs.map(l => (
                    <div
                      key={l.id}
                      onClick={() => {
                        onClose();
                        navigate('/laboratory/requests');
                      }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50/70 cursor-pointer group transition"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-purple-700">
                          {l.testName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Patient: {l.patientName} • Priority: {l.priority} • Status: {l.status}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices */}
            {results && results.invoices.length > 0 && (
              <div className="py-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-emerald-600" /> Billing Invoices ({results.invoices.length})
                </h4>
                <div className="space-y-1">
                  {results.invoices.map(i => (
                    <div
                      key={i.id}
                      onClick={() => {
                        onClose();
                        navigate(`/accounting/invoices`);
                      }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50/70 cursor-pointer group transition"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                          Invoice {i.id} — {i.patientName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Amount: {i.totalAmount.toLocaleString()} ETB • Due: {i.balanceDue.toLocaleString()} ETB ({i.paymentStatus})
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Beds */}
            {results && results.beds && results.beds.length > 0 && (
              <div className="py-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-blue-600" /> Ward Beds & Rooms ({results.beds.length})
                </h4>
                <div className="space-y-1">
                  {results.beds.map(b => (
                    <div
                      key={b.id}
                      onClick={() => {
                        onClose();
                        navigate('/inpatient/beds');
                      }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50/70 cursor-pointer group transition"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                          {b.wardName} • {b.roomNumber} • {b.bedCode}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Status: {b.status} {b.currentPatientName ? `• Occupied by: ${b.currentPatientName}` : '• Available for admission'}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Navigation hint: Click any item to jump directly to its clinical record</span>
            <span className="font-mono text-[11px]">Bethel St. Paul HMS v3.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
