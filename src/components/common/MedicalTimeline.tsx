import React from 'react';
import { Stethoscope, FlaskConical, Pill, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { ConsultationRecord, LabTestRequest, PrescriptionOrder, Appointment } from '../../types';

interface MedicalTimelineProps {
  consultations: ConsultationRecord[];
  labs: LabTestRequest[];
  prescriptions: PrescriptionOrder[];
  appointments: Appointment[];
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({
  consultations,
  labs,
  prescriptions,
  appointments
}) => {
  // Combine all clinical events into chronological timeline
  const events = [
    ...consultations.map(c => ({
      id: c.id,
      date: c.date,
      type: 'CONSULTATION' as const,
      title: `Physician Consultation — ${c.doctorName}`,
      subtitle: `${c.department} • Chief Complaint: ${c.chiefComplaint}`,
      tags: c.diagnoses.map(d => d.name),
      details: c.treatmentPlan,
      icon: Stethoscope,
      iconBg: 'bg-blue-100 text-blue-700 border-blue-200'
    })),
    ...labs.map(l => ({
      id: l.id,
      date: l.requestedAt.split(' ')[0],
      type: 'LAB' as const,
      title: `${l.testName}`,
      subtitle: `Ordered by ${l.doctorName} • Priority: ${l.priority} • Status: ${l.status}`,
      tags: l.parameters.filter(p => p.isAbnormal).map(p => `Abnormal: ${p.name}`),
      details: l.technicianRemarks || l.clinicalNotes,
      icon: FlaskConical,
      iconBg: 'bg-purple-100 text-purple-700 border-purple-200'
    })),
    ...prescriptions.map(p => ({
      id: p.id,
      date: p.createdAt.split(' ')[0],
      type: 'PRESCRIPTION' as const,
      title: `Prescription Order (${p.id})`,
      subtitle: `Prescribed by ${p.doctorName} • ${p.items.length} Medications • Status: ${p.status}`,
      tags: p.items.map(i => `${i.medicineName} (${i.dosage})`),
      details: p.notes,
      icon: Pill,
      iconBg: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    })),
    ...appointments.map(a => ({
      id: a.id,
      date: a.date,
      type: 'APPOINTMENT' as const,
      title: `Hospital Visit: ${a.type.replace(/_/g, ' ')}`,
      subtitle: `${a.department} with ${a.doctorName} at ${a.time} (${a.status})`,
      tags: [a.status],
      details: a.reason,
      icon: Calendar,
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700">No medical timeline events recorded</p>
        <p className="text-xs text-slate-400 mt-1">Clinical consultations, lab orders, and visits will appear here.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-0.5 before:bg-slate-200 space-y-6">
      {events.map((event) => {
        const IconComponent = event.icon;
        return (
          <div key={event.id} className="relative group">
            {/* Timeline Node Pin */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shadow-2xs z-10 transition-transform group-hover:scale-110 ${event.iconBg}`}
            >
              <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

            {/* Event Card */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  {event.date}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600 w-fit">
                  {event.type}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">{event.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{event.subtitle}</p>

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {event.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`text-[11px] px-2 py-0.5 rounded-md border ${
                        tag.startsWith('Abnormal')
                          ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {event.details && (
                <p className="text-xs text-slate-500 mt-2.5 pt-2.5 border-t border-slate-100 leading-relaxed font-sans">
                  {event.details}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
