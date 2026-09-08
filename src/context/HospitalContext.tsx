import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Patient, 
  Appointment, 
  ConsultationRecord, 
  LabTestRequest, 
  Medicine, 
  PrescriptionOrder, 
  Invoice, 
  InvoiceItem,
  Bed, 
  Ward, 
  EmergencyCase, 
  EmergencyTriageLevel,
  AppNotification, 
  AuditLog, 
  VitalSignRecord,
  RolePermission,
  MedicationBatch,
  DispensingRecord,
  FormularyItem,
  PrescriptionStatus,
  PaymentTransaction
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_CONSULTATIONS,
  INITIAL_LAB_REQUESTS,
  INITIAL_MEDICINES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_BATCHES,
  INITIAL_DISPENSING_RECORDS,
  INITIAL_FORMULARY,
  INITIAL_INVOICES,
  INITIAL_PAYMENT_TRANSACTIONS,
  INITIAL_BEDS,
  INITIAL_WARDS,
  INITIAL_EMERGENCY_CASES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_VITALS,
  INITIAL_ROLE_PERMISSIONS
} from '../data/mockData';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface HospitalContextType {
  // Data States
  patients: Patient[];
  appointments: Appointment[];
  consultations: ConsultationRecord[];
  labRequests: LabTestRequest[];
  medicines: Medicine[];
  prescriptions: PrescriptionOrder[];
  batches: MedicationBatch[];
  dispensingRecords: DispensingRecord[];
  formularyItems: FormularyItem[];
  invoices: Invoice[];
  paymentTransactions: PaymentTransaction[];
  beds: Bed[];
  wards: Ward[];
  emergencyCases: EmergencyCase[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  vitals: VitalSignRecord[];
  rolePermissions: RolePermission[];

  // Patient Actions
  addPatient: (patient: Omit<Patient, 'id' | 'registeredAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deactivatePatient: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;

  // Vitals Actions
  recordVitals: (vitals: Omit<VitalSignRecord, 'id' | 'recordedAt'>) => void;
  getPatientVitals: (patientId: string) => VitalSignRecord[];

  // Appointment Actions
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  cancelAppointment: (id: string, reason?: string) => void;

  // Consultation Actions
  createConsultation: (consultation: Omit<ConsultationRecord, 'id'>) => ConsultationRecord;
  getPatientConsultations: (patientId: string) => ConsultationRecord[];

  // Lab Actions
  submitLabResult: (requestId: string, parameters: LabTestRequest['parameters'], technicianRemarks?: string) => void;
  updateLabStatus: (requestId: string, status: LabTestRequest['status']) => void;
  requestLabTest: (req: Omit<LabTestRequest, 'id' | 'requestedAt'>) => void;

  // Pharmacy Actions
  dispensePrescription: (prescriptionId: string, pharmacistName?: string, batchNumber?: string, notes?: string) => void;
  verifyPrescription: (prescriptionId: string, status: PrescriptionStatus, notes?: string) => void;
  requestClarification: (prescriptionId: string, reason: string) => void;
  updateMedicineStock: (medicineId: string, quantityChange: number, notes?: string) => void;
  adjustBatchStock: (batchId: string, quantityChange: number, notes?: string) => void;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  getPatientMedicationHistory: (patientId: string) => DispensingRecord[];

  // Billing Actions
  recordPayment: (
    invoiceIdOrData: string | { invoiceId: string; amount: number; method?: Invoice['paymentMethod']; referenceNumber?: string; notes?: string; cashierName?: string },
    amount?: number, 
    method?: Invoice['paymentMethod'], 
    refNumber?: string, 
    notes?: string
  ) => void;
  voidInvoice: (invoiceId: string, reason: string) => void;
  createInvoice: (invoice: Omit<Invoice, 'id'>) => Invoice;

  // Bed & Inpatient Actions
  admitPatientToBed: (patientId: string, patientName: string, bedId: string, doctorName: string) => void;
  dischargePatientFromBed: (bedId: string) => void;

  // Emergency Triage Actions
  addEmergencyCase: (caseData: Partial<EmergencyCase> & { patientName: string; chiefComplaint: string; triageLevel: EmergencyTriageLevel }) => EmergencyCase;
  updateEmergencyCase: (id: string, updates: Partial<EmergencyCase>) => void;
  updateEmergencyStatus: (id: string, status: EmergencyCase['status']) => void;
  admitEmergencyToInpatient: (emergencyId: string, bedId: string, doctorName: string) => void;
  dischargeEmergencyCase: (emergencyId: string, dischargeData: { diagnosis: string; treatmentGiven: string; instructions: string; followUpDate?: string }) => void;

  // Notifications & Audit
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateRolePermission: (moduleName: string, field: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', value: boolean) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const { currentUser } = useAuth();

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('hms_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('hms_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() => {
    const saved = localStorage.getItem('hms_consultations');
    return saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
  });

  const [labRequests, setLabRequests] = useState<LabTestRequest[]>(() => {
    const saved = localStorage.getItem('hms_labs');
    return saved ? JSON.parse(saved) : INITIAL_LAB_REQUESTS;
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('hms_medicines');
    if (!saved) return INITIAL_MEDICINES;
    try {
      const parsed: Medicine[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(m => m.id));
      const missing = INITIAL_MEDICINES.filter(m => !existingIds.has(m.id));
      return [...parsed, ...missing];
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>(() => {
    const saved = localStorage.getItem('hms_prescriptions');
    if (!saved) return INITIAL_PRESCRIPTIONS;
    try {
      const parsed: PrescriptionOrder[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(p => p.id));
      const missing = INITIAL_PRESCRIPTIONS.filter(p => !existingIds.has(p.id));
      return [...parsed, ...missing];
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  });

  const [batches, setBatches] = useState<MedicationBatch[]>(() => {
    const saved = localStorage.getItem('hms_batches');
    if (!saved) return INITIAL_BATCHES;
    try {
      const parsed: MedicationBatch[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(b => b.id));
      const missing = INITIAL_BATCHES.filter(b => !existingIds.has(b.id));
      return [...parsed, ...missing];
    } catch {
      return INITIAL_BATCHES;
    }
  });

  const [dispensingRecords, setDispensingRecords] = useState<DispensingRecord[]>(() => {
    const saved = localStorage.getItem('hms_dispensing');
    if (!saved) return INITIAL_DISPENSING_RECORDS;
    try {
      const parsed: DispensingRecord[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(d => d.id));
      const missing = INITIAL_DISPENSING_RECORDS.filter(d => !existingIds.has(d.id));
      return [...parsed, ...missing];
    } catch {
      return INITIAL_DISPENSING_RECORDS;
    }
  });

  const [formularyItems, setFormularyItems] = useState<FormularyItem[]>(() => {
    const saved = localStorage.getItem('hms_formulary');
    if (!saved) return INITIAL_FORMULARY;
    try {
      const parsed: FormularyItem[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(f => f.id));
      const missing = INITIAL_FORMULARY.filter(f => !existingIds.has(f.id));
      return [...parsed, ...missing];
    } catch {
      return INITIAL_FORMULARY;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('hms_invoices');
    if (!saved) return INITIAL_INVOICES;
    try {
      const parsed: Invoice[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(i => i.id));
      const missing = INITIAL_INVOICES.filter(i => !existingIds.has(i.id));
      const updated = parsed.map(inv => {
        if (inv.id === 'INV-2026-0903') {
          return { ...inv, patientName: 'Marta Woldie' };
        }
        return inv;
      });
      return [...updated, ...missing];
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('hms_payment_transactions');
    if (!saved) return INITIAL_PAYMENT_TRANSACTIONS;
    try {
      const parsed: PaymentTransaction[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(t => t.id));
      const missing = INITIAL_PAYMENT_TRANSACTIONS.filter(t => !existingIds.has(t.id));
      return [...parsed, ...missing];
    } catch {
      return INITIAL_PAYMENT_TRANSACTIONS;
    }
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    const saved = localStorage.getItem('hms_beds');
    return saved ? JSON.parse(saved) : INITIAL_BEDS;
  });

  const [wards, setWards] = useState<Ward[]>(() => {
    const saved = localStorage.getItem('hms_wards');
    return saved ? JSON.parse(saved) : INITIAL_WARDS;
  });

  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>(() => {
    const saved = localStorage.getItem('hms_emergency');
    if (!saved) return INITIAL_EMERGENCY_CASES;
    try {
      const parsed: EmergencyCase[] = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const existingIds = new Set(parsed.map(c => c.id));
        const missing = INITIAL_EMERGENCY_CASES.filter(c => !existingIds.has(c.id));
        // Also ensure ER-9103 has WAITING_FOR_TRIAGE status if it had obsolete TRIAGE status
        const normalized = parsed.map(c => {
          if (c.id === 'ER-9103' && c.status === 'TRIAGE') {
            return { ...c, status: 'WAITING_FOR_TRIAGE' as const };
          }
          return c;
        });
        return [...normalized, ...missing];
      }
      return INITIAL_EMERGENCY_CASES;
    } catch {
      return INITIAL_EMERGENCY_CASES;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('hms_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('hms_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [vitals, setVitals] = useState<VitalSignRecord[]>(() => {
    const saved = localStorage.getItem('hms_vitals');
    return saved ? JSON.parse(saved) : INITIAL_VITALS;
  });

  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(() => {
    const saved = localStorage.getItem('hms_role_perms');
    return saved ? JSON.parse(saved) : INITIAL_ROLE_PERMISSIONS;
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('hms_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('hms_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('hms_consultations', JSON.stringify(consultations)); }, [consultations]);
  useEffect(() => { localStorage.setItem('hms_labs', JSON.stringify(labRequests)); }, [labRequests]);
  useEffect(() => { localStorage.setItem('hms_medicines', JSON.stringify(medicines)); }, [medicines]);
  useEffect(() => { localStorage.setItem('hms_prescriptions', JSON.stringify(prescriptions)); }, [prescriptions]);
  useEffect(() => { localStorage.setItem('hms_batches', JSON.stringify(batches)); }, [batches]);
  useEffect(() => { localStorage.setItem('hms_dispensing', JSON.stringify(dispensingRecords)); }, [dispensingRecords]);
  useEffect(() => { localStorage.setItem('hms_formulary', JSON.stringify(formularyItems)); }, [formularyItems]);
  useEffect(() => { localStorage.setItem('hms_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('hms_payment_transactions', JSON.stringify(paymentTransactions)); }, [paymentTransactions]);
  useEffect(() => { localStorage.setItem('hms_beds', JSON.stringify(beds)); }, [beds]);
  useEffect(() => { localStorage.setItem('hms_emergency', JSON.stringify(emergencyCases)); }, [emergencyCases]);
  useEffect(() => { localStorage.setItem('hms_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('hms_audit', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('hms_vitals', JSON.stringify(vitals)); }, [vitals]);

  const logAudit = (action: string, module: string, targetId: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      targetId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ipAddress: '192.168.10.' + Math.floor(Math.random() * 50 + 10),
      device: 'Hospital Workstation',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Patient Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'registeredAt'>): Patient => {
    const newId = `PAT-00${patients.length + 1201}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [newPatient, ...prev]);
    logAudit('Registered New Patient', 'Patient Management', newId);
    addToast('success', 'Patient Registered', `MRN ${newId} created successfully for ${newPatient.firstName} ${newPatient.lastName}`);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logAudit('Updated Patient Demographics/Record', 'Patient Management', id);
    addToast('info', 'Patient Record Updated', `Changes to MRN ${id} have been saved.`);
  };

  const deactivatePatient = (id: string) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status: 'INACTIVE' } : p));
    logAudit('Deactivated Patient Record', 'Patient Management', id);
    addToast('warning', 'Patient Deactivated', `Patient record ${id} status set to Inactive.`);
  };

  const getPatientById = (id: string) => {
    return patients.find(p => p.id === id);
  };

  // Vitals Actions
  const recordVitals = (vitalsData: Omit<VitalSignRecord, 'id' | 'recordedAt'>) => {
    const newRecord: VitalSignRecord = {
      ...vitalsData,
      id: `VIT-${Date.now().toString().slice(-4)}`,
      recordedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setVitals(prev => [newRecord, ...prev]);
    logAudit('Recorded Patient Vitals', 'Nursing / Clinical', vitalsData.patientId);
    addToast('success', 'Vitals Recorded', `Observation saved by ${vitalsData.recordedBy}`);
  };

  const getPatientVitals = (patientId: string) => {
    return vitals.filter(v => v.patientId === patientId);
  };

  // Appointment Actions
  const bookAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAppointments(prev => [newAppointment, ...prev]);
    logAudit('Scheduled Appointment', 'Appointments', newAppointment.id);
    addToast('success', 'Appointment Booked', `Booked for ${newAppointment.patientName} with ${newAppointment.doctorName} on ${newAppointment.date} at ${newAppointment.time}`);
    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    logAudit(`Updated Appointment Status to ${status}`, 'Appointments', id);
    addToast('info', 'Appointment Updated', `Status changed to ${status}`);
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, time: newTime, status: 'CONFIRMED' } : a));
    logAudit(`Rescheduled Appointment to ${newDate} ${newTime}`, 'Appointments', id);
    addToast('info', 'Appointment Rescheduled', `Updated to ${newDate} at ${newTime}`);
  };

  const cancelAppointment = (id: string, reason?: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED', notes: reason } : a));
    logAudit('Cancelled Appointment', 'Appointments', id);
    addToast('warning', 'Appointment Cancelled', `Appointment ${id} was marked as Cancelled`);
  };

  // Consultation Actions
  const createConsultation = (consultationData: Omit<ConsultationRecord, 'id'>): ConsultationRecord => {
    const newConsultation: ConsultationRecord = {
      ...consultationData,
      id: `CON-${Math.floor(5000 + Math.random() * 4000)}`
    };
    setConsultations(prev => [newConsultation, ...prev]);

    // Automatically generate Prescription Order if medications are listed
    if (newConsultation.prescriptions && newConsultation.prescriptions.length > 0) {
      const calculatedTotal = newConsultation.prescriptions.reduce((acc, curr) => {
        const med = medicines.find(m => m.id === curr.medicineId);
        return acc + (med ? med.pricePerUnit * curr.quantity : curr.quantity * 25);
      }, 0);

      const newRx: PrescriptionOrder = {
        id: `RX-${Math.floor(4000 + Math.random() * 5000)}`,
        consultationId: newConsultation.id,
        patientId: newConsultation.patientId,
        patientName: newConsultation.patientName,
        doctorId: newConsultation.doctorId,
        doctorName: newConsultation.doctorName,
        items: newConsultation.prescriptions,
        status: 'PENDING',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        totalCost: calculatedTotal
      };
      setPrescriptions(prev => [newRx, ...prev]);
    }

    // Automatically trigger Lab Requests if ordered
    if (newConsultation.labRequests && newConsultation.labRequests.length > 0) {
      newConsultation.labRequests.forEach((labName) => {
        const newLab: LabTestRequest = {
          id: `LAB-${Math.floor(7000 + Math.random() * 2000)}`,
          patientId: newConsultation.patientId,
          patientName: newConsultation.patientName,
          doctorId: newConsultation.doctorId,
          doctorName: newConsultation.doctorName,
          department: newConsultation.department,
          testName: labName,
          category: 'BIOCHEMISTRY',
          priority: 'NORMAL',
          status: 'PENDING',
          requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          sampleType: 'Whole Blood / Serum',
          parameters: [
            { name: labName + ' Test Item', result: 'PENDING', unit: 'Standard', referenceRange: 'Normal' }
          ],
          clinicalNotes: `Generated from Consultation ${newConsultation.id}`
        };
        setLabRequests(prev => [newLab, ...prev]);
      });
    }

    logAudit('Completed Clinical Consultation', 'EMR Consultations', newConsultation.id);

    // Connect Consultation & Ordered Labs to Billing Invoice
    const consultationFeeItem: InvoiceItem = {
      id: `ITM-CON-${Date.now()}`,
      serviceCategory: 'CONSULTATION',
      description: `Clinical Consultation (${newConsultation.doctorName} - ${newConsultation.department})`,
      unitPrice: 350,
      quantity: 1,
      total: 350
    };

    const labInvoiceItems: InvoiceItem[] = (newConsultation.labRequests || []).map((labName, idx) => ({
      id: `ITM-LAB-${Date.now()}-${idx}`,
      serviceCategory: 'LABORATORY',
      description: `Diagnostic Lab: ${labName}`,
      unitPrice: 280,
      quantity: 1,
      total: 280
    }));

    const newEncounterItems = [consultationFeeItem, ...labInvoiceItems];
    const encounterItemsTotal = newEncounterItems.reduce((sum, item) => sum + item.total, 0);

    setInvoices(invList => {
      const existingOpenIndex = invList.findIndex(
        inv => inv.patientId === newConsultation.patientId && (inv.paymentStatus === 'UNPAID' || inv.paymentStatus === 'PARTIAL')
      );

      if (existingOpenIndex !== -1) {
        const existingInv = invList[existingOpenIndex];
        const updatedItems = [...existingInv.items, ...newEncounterItems];
        const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
        const newTax = Math.round(newSubtotal * 0.15);
        const newTotal = newSubtotal + newTax - (existingInv.discount || 0);
        const newBalance = Math.max(0, newTotal - existingInv.paidAmount);

        const updatedInv: Invoice = {
          ...existingInv,
          items: updatedItems,
          subtotal: newSubtotal,
          tax: newTax,
          totalAmount: newTotal,
          balanceDue: newBalance,
          paymentStatus: newBalance === 0 ? 'PAID' : (existingInv.paidAmount > 0 ? 'PARTIAL' : 'UNPAID')
        };

        const updatedList = [...invList];
        updatedList[existingOpenIndex] = updatedInv;
        return updatedList;
      } else {
        const targetPatient = patients.find(p => p.id === newConsultation.patientId);
        const subtotal = encounterItemsTotal;
        const tax = Math.round(subtotal * 0.15);
        const total = subtotal + tax;
        const newInv: Invoice = {
          id: `INV-2026-${String(invList.length + 904).padStart(4, '0')}`,
          patientId: newConsultation.patientId,
          patientName: newConsultation.patientName,
          patientPhone: targetPatient?.phone || '+251 911 234 567',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          items: newEncounterItems,
          subtotal,
          discount: 0,
          tax,
          totalAmount: total,
          paidAmount: 0,
          balanceDue: total,
          paymentStatus: 'UNPAID'
        };
        return [newInv, ...invList];
      }
    });

    addToast('success', 'Consultation Saved', `EMR updated for ${newConsultation.patientName}. Orders sent to Lab, Pharmacy & Billing.`);
    return newConsultation;
  };

  const getPatientConsultations = (patientId: string) => {
    return consultations.filter(c => c.patientId === patientId);
  };

  // Lab Actions
  const submitLabResult = (requestId: string, parameters: LabTestRequest['parameters'], technicianRemarks?: string) => {
    let targetLab: LabTestRequest | undefined;
    setLabRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        targetLab = req;
        return {
          ...req,
          status: 'COMPLETED',
          completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          technicianName: currentUser.name,
          parameters,
          technicianRemarks: technicianRemarks || req.technicianRemarks
        };
      }
      return req;
    }));
    logAudit('Submitted Diagnostic Lab Results', 'Laboratory', requestId);
    if (targetLab) {
      const newNotif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        title: 'Lab Results Ready',
        message: `Results for ${targetLab.testName} (${targetLab.patientName}) are ready and added to medical history.`,
        type: 'LAB_RESULT',
        severity: 'SUCCESS',
        timestamp: 'Just now',
        read: false,
        linkTo: `/doctor/dashboard`
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
    addToast('success', 'Lab Results Finalized', `Report signed and dispatched to attending physician & patient record.`);
  };

  const updateLabStatus = (requestId: string, status: LabTestRequest['status']) => {
    setLabRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
    logAudit(`Updated Lab Status to ${status}`, 'Laboratory', requestId);
    addToast('info', 'Status Updated', `Lab order ${requestId} set to ${status}`);
  };

  const requestLabTest = (req: Omit<LabTestRequest, 'id' | 'requestedAt'>) => {
    const newLab: LabTestRequest = {
      ...req,
      id: `LAB-${Math.floor(7000 + Math.random() * 2000)}`,
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setLabRequests(prev => [newLab, ...prev]);
    logAudit('Dispatched Lab Request', 'Laboratory', newLab.id);
    addToast('success', 'Lab Test Ordered', `${newLab.testName} ordered for ${newLab.patientName}`);
  };

  // Pharmacy Actions
  const dispensePrescription = (
    prescriptionId: string, 
    pharmacistName?: string, 
    batchNumber?: string, 
    notes?: string
  ) => {
    let targetRx: PrescriptionOrder | undefined;
    const activePharmacist = pharmacistName || (currentUser.role === 'PHARMACIST' ? currentUser.name : 'Pharm. Almaz Tadesse, BPharm');
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newDispenseRecords: DispensingRecord[] = [];

    setPrescriptions(prev => prev.map(rx => {
      if (rx.id === prescriptionId) {
        targetRx = rx;
        
        // deduct medicine quantities from inventory & batches
        rx.items.forEach((item, idx) => {
          const targetBatchNum = batchNumber || rx.dispensedBatchNumber || 'AMP-2026-04';

          setMedicines(mList => mList.map(m => {
            if (m.id === item.medicineId) {
              const newQty = Math.max(0, m.stockQuantity - item.quantity);
              const nextStatus = newQty === 0 ? 'OUT_OF_STOCK' : newQty <= m.reorderLevel ? 'LOW_STOCK' : 'IN_STOCK';
              return { ...m, stockQuantity: newQty, currentStock: newQty, status: nextStatus };
            }
            return m;
          }));

          setBatches(bList => bList.map(b => {
            if (b.medicineId === item.medicineId || (batchNumber && b.batchNumber === batchNumber)) {
              const newBQty = Math.max(0, b.quantity - item.quantity);
              const nextBStatus = newBQty === 0 ? 'DEPLETED' : b.status;
              return { ...b, quantity: newBQty, status: nextBStatus };
            }
            return b;
          }));

          newDispenseRecords.push({
            id: `DSP-${Date.now().toString().slice(-6)}-${idx}`,
            prescriptionId: rx.id,
            patientId: rx.patientId,
            patientName: rx.patientName,
            medicineId: item.medicineId,
            medicineName: item.medicineName,
            dosage: item.dosage,
            quantity: item.quantity,
            batchNumber: targetBatchNum,
            pharmacistName: activePharmacist,
            dispensedAt: nowTimestamp,
            notes: notes || rx.notes || 'Full prescription supplied per standard hospital protocol',
            status: 'DISPENSED'
          });
        });

        return {
          ...rx,
          status: 'DISPENSED',
          dispensedAt: nowTimestamp,
          pharmacistName: activePharmacist,
          dispensedBatchNumber: batchNumber || rx.dispensedBatchNumber,
          notes: notes || rx.notes,
          items: rx.items.map(i => ({ ...i, isDispensed: true }))
        };
      }
      return rx;
    }));

    if (newDispenseRecords.length > 0) {
      setDispensingRecords(prev => [...newDispenseRecords, ...prev]);
    }

    // Connect Dispensed Medicine to Billing Invoice
    if (targetRx) {
      const rxToBill: PrescriptionOrder = targetRx;
      const pharmacyInvoiceItems: InvoiceItem[] = rxToBill.items.map((item, idx) => {
        const med = medicines.find(m => m.id === item.medicineId);
        const unitPrice = med?.pricePerUnit || 35;
        return {
          id: `ITM-PHARM-${Date.now()}-${idx}`,
          serviceCategory: 'PHARMACY',
          description: `Medication: ${item.medicineName} (${item.dosage}) - ${item.quantity} units`,
          unitPrice: unitPrice,
          quantity: item.quantity,
          total: unitPrice * item.quantity
        };
      });

      const itemsTotal = pharmacyInvoiceItems.reduce((sum, item) => sum + item.total, 0);

      setInvoices(invList => {
        const existingOpenIndex = invList.findIndex(
          inv => inv.patientId === rxToBill.patientId && (inv.paymentStatus === 'UNPAID' || inv.paymentStatus === 'PARTIAL')
        );

        if (existingOpenIndex !== -1) {
          const existingInv = invList[existingOpenIndex];
          const updatedItems = [...existingInv.items, ...pharmacyInvoiceItems];
          const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
          const newTax = Math.round(newSubtotal * 0.15);
          const newTotal = newSubtotal + newTax - (existingInv.discount || 0);
          const newBalance = Math.max(0, newTotal - existingInv.paidAmount);

          const updatedInv: Invoice = {
            ...existingInv,
            items: updatedItems,
            subtotal: newSubtotal,
            tax: newTax,
            totalAmount: newTotal,
            balanceDue: newBalance,
            paymentStatus: newBalance === 0 ? 'PAID' : (existingInv.paidAmount > 0 ? 'PARTIAL' : 'UNPAID')
          };

          const updatedList = [...invList];
          updatedList[existingOpenIndex] = updatedInv;
          return updatedList;
        } else {
          const targetPatient = patients.find(p => p.id === rxToBill.patientId);
          const subtotal = itemsTotal;
          const tax = Math.round(subtotal * 0.15);
          const total = subtotal + tax;
          const newInv: Invoice = {
            id: `INV-2026-${String(invList.length + 904).padStart(4, '0')}`,
            patientId: rxToBill.patientId,
            patientName: rxToBill.patientName,
            patientPhone: targetPatient?.phone || '+251 911 234 567',
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            items: pharmacyInvoiceItems,
            subtotal,
            discount: 0,
            tax,
            totalAmount: total,
            paidAmount: 0,
            balanceDue: total,
            paymentStatus: 'UNPAID'
          };
          return [newInv, ...invList];
        }
      });
    }

    logAudit('Dispensed Prescription Medication', 'Pharmacy', prescriptionId);
    addToast('success', 'Medication Dispensed', `Rx ${prescriptionId} successfully released, inventory updated & itemized to patient invoice.`);
  };

  const verifyPrescription = (prescriptionId: string, status: PrescriptionStatus, notes?: string) => {
    setPrescriptions(prev => prev.map(rx => {
      if (rx.id === prescriptionId) {
        return {
          ...rx,
          status,
          notes: notes ? (rx.notes ? `${rx.notes} | ${notes}` : notes) : rx.notes
        };
      }
      return rx;
    }));
    logAudit(`Verified Prescription Status: ${status}`, 'Pharmacy Review', prescriptionId);
    addToast('info', 'Prescription Verified', `Prescription ${prescriptionId} status updated to ${status}.`);
  };

  const requestClarification = (prescriptionId: string, reason: string) => {
    setPrescriptions(prev => prev.map(rx => {
      if (rx.id === prescriptionId) {
        return {
          ...rx,
          status: 'PENDING_REVIEW',
          clarificationRequested: true,
          clarificationReason: reason
        };
      }
      return rx;
    }));
    logAudit(`Requested Prescriber Clarification: ${reason}`, 'Pharmacy Safety Check', prescriptionId);
    addToast('warning', 'Prescriber Clarification Requested', `Doctor notified regarding prescription safety check.`);
  };

  const updateMedicineStock = (medicineId: string, quantityChange: number, notes?: string) => {
    setMedicines(prev => prev.map(med => {
      if (med.id === medicineId) {
        const newQty = Math.max(0, med.stockQuantity + quantityChange);
        const nextStatus = newQty === 0 ? 'OUT_OF_STOCK' : newQty <= med.reorderLevel ? 'LOW_STOCK' : 'IN_STOCK';
        return { ...med, stockQuantity: newQty, currentStock: newQty, status: nextStatus };
      }
      return med;
    }));
    logAudit(`Stock Adjustment: ${quantityChange > 0 ? '+' : ''}${quantityChange} units`, 'Pharmacy Inventory', medicineId);
    addToast('info', 'Stock Adjusted', `Inventory count updated.`);
  };

  const adjustBatchStock = (batchId: string, quantityChange: number, notes?: string) => {
    let affectedMedicineId: string | undefined;
    setBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        affectedMedicineId = b.medicineId;
        const newQty = Math.max(0, b.quantity + quantityChange);
        const status = newQty === 0 ? 'DEPLETED' : b.status;
        return { ...b, quantity: newQty, status };
      }
      return b;
    }));

    if (affectedMedicineId) {
      updateMedicineStock(affectedMedicineId, quantityChange, notes);
    }
  };

  const getPatientMedicationHistory = (patientId: string): DispensingRecord[] => {
    return dispensingRecords.filter(r => r.patientId === patientId);
  };

  const addMedicine = (medData: Omit<Medicine, 'id'>) => {
    const newId = `MED-00${medicines.length + 1}`;
    const newMed: Medicine = {
      ...medData,
      id: newId
    };
    setMedicines(prev => [newMed, ...prev]);
    logAudit('Added New Drug Formulation to Formulary', 'Pharmacy Inventory', newId);
    addToast('success', 'Medicine Added', `${newMed.name} registered in hospital pharmacy catalog.`);
  };

  // Billing Actions
  const recordPayment = (
    invoiceIdOrData: string | { invoiceId: string; amount: number; method?: Invoice['paymentMethod']; referenceNumber?: string; notes?: string; cashierName?: string }, 
    amount?: number, 
    method?: Invoice['paymentMethod'], 
    refNumber?: string,
    notes?: string
  ) => {
    let invoiceId: string;
    let payAmount: number;
    let payMethod: Invoice['paymentMethod'];
    let payRef: string;
    let payNotes: string;
    let cashier: string;

    if (typeof invoiceIdOrData === 'object') {
      invoiceId = invoiceIdOrData.invoiceId;
      payAmount = Number(invoiceIdOrData.amount);
      payMethod = invoiceIdOrData.method || 'CASH';
      payRef = invoiceIdOrData.referenceNumber || `${payMethod === 'TELEBIRR' ? 'TEL-TXN' : payMethod === 'CBE_BIRR' ? 'CBE-TRANS' : payMethod === 'BANK_TRANSFER' ? 'BNK-TRF' : 'POS-CSH'}-${Math.floor(1000000 + Math.random() * 9000000)}`;
      payNotes = invoiceIdOrData.notes || 'Patient bill settlement';
      cashier = invoiceIdOrData.cashierName || currentUser.name || 'Ato Samuel Bekele';
    } else {
      invoiceId = invoiceIdOrData;
      payAmount = Number(amount) || 0;
      payMethod = method || 'CASH';
      payRef = refNumber || `${payMethod === 'TELEBIRR' ? 'TEL-TXN' : payMethod === 'CBE_BIRR' ? 'CBE-TRANS' : payMethod === 'BANK_TRANSFER' ? 'BNK-TRF' : 'POS-CSH'}-${Math.floor(1000000 + Math.random() * 9000000)}`;
      payNotes = notes || 'Patient bill settlement';
      cashier = currentUser.name || 'Ato Samuel Bekele';
    }

    let affectedPatientId = '';
    let affectedPatientName = '';
    const generatedReceipt = `REC-2026-${Math.floor(7000 + Math.random() * 2000)}`;

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        affectedPatientId = inv.patientId;
        affectedPatientName = inv.patientName;
        const newPaid = inv.paidAmount + payAmount;
        const newBalance = Math.max(0, inv.totalAmount - newPaid);
        const newStatus: Invoice['paymentStatus'] = newBalance === 0 ? 'PAID' : 'PARTIAL';
        return {
          ...inv,
          paidAmount: newPaid,
          balanceDue: newBalance,
          paymentStatus: newStatus,
          paymentMethod: payMethod,
          referenceNumber: payRef,
          receiptNumber: generatedReceipt,
          recordedBy: cashier
        };
      }
      return inv;
    }));

    const newTxn: PaymentTransaction = {
      id: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceId,
      patientId: affectedPatientId || 'PAT-001204',
      patientName: affectedPatientName || 'Hospital Patient',
      amount: payAmount,
      method: payMethod,
      referenceNumber: payRef,
      cashierName: cashier,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'VERIFIED',
      receiptNumber: generatedReceipt,
      notes: payNotes
    };

    setPaymentTransactions(prev => [newTxn, ...prev]);

    logAudit(`Recorded Payment of ${payAmount.toFixed(2)} ETB via ${payMethod} (Ref: ${payRef})`, 'Finance & Medical Billing', invoiceId);
    addToast('success', 'Payment Received', `${payAmount.toLocaleString()} ETB credited to ${invoiceId}. Receipt ${generatedReceipt} issued.`);
  };

  const voidInvoice = (invoiceId: string, reason: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          paymentStatus: 'VOIDED' as const,
          balanceDue: 0,
          voidReason: reason,
          voidedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          voidedBy: currentUser.name || 'Ato Samuel Bekele'
        };
      }
      return inv;
    }));

    logAudit(`Voided Invoice ${invoiceId}. Audit Justification: ${reason}`, 'Finance & Medical Billing', invoiceId);
    addToast('warning', 'Invoice Voided', `Invoice ${invoiceId} has been cancelled. Audit record registered.`);
  };

  const createInvoice = (invoiceData: Omit<Invoice, 'id'>): Invoice => {
    const newInv: Invoice = {
      ...invoiceData,
      id: `INV-2026-${String(invoices.length + 904).padStart(4, '0')}`
    };
    setInvoices(prev => [newInv, ...prev]);
    logAudit('Generated Inpatient/Outpatient Invoice', 'Billing', newInv.id);
    addToast('success', 'Invoice Generated', `Invoice ${newInv.id} created for ${newInv.patientName}`);
    return newInv;
  };

  // Bed & Inpatient Actions
  const admitPatientToBed = (patientId: string, patientName: string, bedId: string, doctorName: string) => {
    setBeds(prev => prev.map(bed => {
      if (bed.id === bedId) {
        return {
          ...bed,
          status: 'OCCUPIED',
          currentPatientId: patientId,
          currentPatientName: patientName,
          admissionDate: new Date().toISOString().split('T')[0],
          attendingDoctor: doctorName
        };
      }
      return bed;
    }));

    // Update patient status to INPATIENT
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, status: 'INPATIENT', currentBed: bedId };
      }
      return p;
    }));

    logAudit(`Admitted Patient to Bed ${bedId}`, 'Inpatient & Wards', bedId);
    addToast('success', 'Patient Admitted', `${patientName} assigned to ${bedId}`);
  };

  const dischargePatientFromBed = (bedId: string) => {
    const targetBed = beds.find(b => b.id === bedId);
    if (targetBed && targetBed.currentPatientId) {
      setPatients(prev => prev.map(p => {
        if (p.id === targetBed.currentPatientId) {
          return { ...p, status: 'DISCHARGED', currentBed: undefined };
        }
        return p;
      }));
    }

    setBeds(prev => prev.map(bed => {
      if (bed.id === bedId) {
        return {
          ...bed,
          status: 'CLEANING',
          currentPatientId: undefined,
          currentPatientName: undefined,
          admissionDate: undefined,
          attendingDoctor: undefined
        };
      }
      return bed;
    }));

    logAudit(`Discharged Patient from Bed ${bedId}`, 'Inpatient & Wards', bedId);
    addToast('info', 'Patient Discharged', `Bed ${bedId} marked for cleaning and sanitization.`);
  };

  // Emergency Actions
  const addEmergencyCase = (caseData: Partial<EmergencyCase> & { patientName: string; chiefComplaint: string; triageLevel: EmergencyTriageLevel }): EmergencyCase => {
    // Generate or use IDs
    const caseId = caseData.id || `ER-000${Math.floor(40 + Math.random() * 60)}`;
    const patientId = caseData.patientId || `PAT-00${Math.floor(150 + Math.random() * 50)}`;

    const newCase: EmergencyCase = {
      age: caseData.age ?? 45,
      gender: caseData.gender ?? 'MALE',
      gcsScore: caseData.gcsScore ?? 15,
      arrivalMethod: caseData.arrivalMethod ?? 'Walk-in',
      priority: (caseData.triageLevel === 'CRITICAL' || caseData.triageLevel === 'RESUSCITATION') ? 'CRITICAL' : caseData.triageLevel === 'URGENT' ? 'URGENT' : 'NORMAL',
      status: caseData.status ?? 'TRIAGED',
      waitingMinutes: caseData.waitingMinutes ?? 2,
      ...caseData,
      id: caseId,
      patientId: patientId,
      arrivalTime: caseData.arrivalTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      arrivalTimestamp: caseData.arrivalTimestamp || new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setEmergencyCases(prev => [newCase, ...prev]);

    // If new patient, register them into patients state so they have an active medical record
    setPatients(prev => {
      if (!prev.some(p => p.id === patientId)) {
        const [firstName, ...rest] = newCase.patientName.split(' ');
        const lastName = rest.join(' ') || 'Unspecified';
        const newPat: Patient = {
          id: patientId,
          firstName: firstName || 'Trauma',
          middleName: '',
          lastName: lastName || 'Patient',
          dob: new Date(Date.now() - (newCase.age || 45) * 365.25 * 86400000).toISOString().split('T')[0],
          age: newCase.age,
          gender: newCase.gender === 'OTHER' ? 'MALE' : newCase.gender,
          bloodGroup: 'O+',
          phone: newCase.phone || '+251 911 000 000',
          email: '',
          address: 'Addis Ababa',
          city: 'Addis Ababa',
          subCity: 'Emergency Dept',
          assignedDepartment: 'Emergency Department',
          status: 'ACTIVE',
          registeredAt: new Date().toISOString().split('T')[0],
          allergies: [],
          chronicConditions: [],
          emergencyContact: newCase.emergencyContact ? {
            name: newCase.emergencyContact,
            relationship: 'Contact',
            phone: newCase.phone || '+251 911 000 000'
          } : undefined
        };
        return [newPat, ...prev];
      }
      return prev;
    });

    // Send urgent notification
    const newNotif: AppNotification = {
      id: `NTF-${Date.now()}`,
      title: `🚨 Emergency Triage: ${newCase.priority || newCase.triageLevel}`,
      message: `${newCase.id}: ${newCase.patientName} (${newCase.priority || newCase.triageLevel}) arrived: ${newCase.chiefComplaint}`,
      type: 'EMERGENCY',
      severity: newCase.triageLevel === 'CRITICAL' || newCase.triageLevel === 'RESUSCITATION' ? 'CRITICAL' : newCase.triageLevel === 'URGENT' ? 'WARNING' : 'INFO',
      timestamp: 'Just now',
      read: false,
      linkTo: '/emergency/dashboard'
    };
    setNotifications(prev => [newNotif, ...prev]);

    logAudit(`Emergency Intake: ${newCase.triageLevel} Acuity (${newCase.id})`, 'Emergency', newCase.id);
    addToast(
      newCase.triageLevel === 'CRITICAL' || newCase.triageLevel === 'RESUSCITATION' ? 'error' : 'warning',
      'Emergency Patient Registered',
      `${newCase.patientName} (${newCase.id}) added to Emergency Queue with ${newCase.priority || newCase.triageLevel} priority.`
    );
    return newCase;
  };

  const updateEmergencyCase = (id: string, updates: Partial<EmergencyCase>) => {
    setEmergencyCases(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    logAudit(`Updated Emergency Case Record: ${id}`, 'Emergency', id);
    addToast('success', 'Emergency Case Updated', `Clinical notes & treatment record updated for ${id}.`);
  };

  const updateEmergencyStatus = (id: string, status: EmergencyCase['status']) => {
    setEmergencyCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    logAudit(`Updated Emergency Case Status to ${status}`, 'Emergency', id);
    addToast('info', 'Emergency Status Updated', `Case ${id} now in ${status}`);
  };

  const admitEmergencyToInpatient = (emergencyId: string, bedId: string, doctorName: string) => {
    const targetCase = emergencyCases.find(c => c.id === emergencyId);
    if (!targetCase) return;

    // Admit to bed
    const patId = targetCase.patientId || `PAT-${Date.now().toString().slice(-6)}`;
    admitPatientToBed(patId, targetCase.patientName, bedId, doctorName);

    // Update emergency case status and disposition
    const targetBed = beds.find(b => b.id === bedId);
    setEmergencyCases(prev => prev.map(c => {
      if (c.id === emergencyId) {
        return {
          ...c,
          status: 'ADMITTED',
          disposition: 'ADMITTED',
          admittedBed: bedId,
          admittedWard: targetBed?.wardName || 'Inpatient Care'
        };
      }
      return c;
    }));

    logAudit(`Admitted Emergency Case ${emergencyId} to Bed ${bedId}`, 'Emergency', emergencyId);
    addToast('success', 'Admitted to Inpatient Ward', `${targetCase.patientName} transferred from ER to ${bedId}.`);
  };

  const dischargeEmergencyCase = (emergencyId: string, dischargeData: { diagnosis: string; treatmentGiven: string; instructions: string; followUpDate?: string }) => {
    setEmergencyCases(prev => prev.map(c => {
      if (c.id === emergencyId) {
        return {
          ...c,
          status: 'DISCHARGED',
          disposition: 'DISCHARGED',
          diagnosis: dischargeData.diagnosis || c.diagnosis,
          treatmentGiven: dischargeData.treatmentGiven || c.treatmentGiven,
          dischargeInstructions: dischargeData.instructions,
          followUpDate: dischargeData.followUpDate
        };
      }
      return c;
    }));

    logAudit(`Discharged Emergency Case ${emergencyId}`, 'Emergency', emergencyId);
    addToast('info', 'Emergency Discharge Completed', `Case ${emergencyId} discharged with clinical instructions.`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('info', 'Notifications Marked Read', 'All notifications updated.');
  };

  const updateRolePermission = (moduleName: string, field: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', value: boolean) => {
    setRolePermissions(prev => prev.map(rp => rp.module === moduleName ? { ...rp, [field]: value } : rp));
    logAudit(`Permission Matrix modified for ${moduleName}`, 'Role & Security', moduleName);
  };

  return (
    <HospitalContext.Provider
      value={{
        patients,
        appointments,
        consultations,
        labRequests,
        medicines,
        prescriptions,
        batches,
        dispensingRecords,
        formularyItems,
        invoices,
        paymentTransactions,
        beds,
        wards,
        emergencyCases,
        notifications,
        auditLogs,
        vitals,
        rolePermissions,

        addPatient,
        updatePatient,
        deactivatePatient,
        getPatientById,

        recordVitals,
        getPatientVitals,

        bookAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        cancelAppointment,

        createConsultation,
        getPatientConsultations,

        submitLabResult,
        updateLabStatus,
        requestLabTest,

        dispensePrescription,
        verifyPrescription,
        requestClarification,
        updateMedicineStock,
        adjustBatchStock,
        addMedicine,
        getPatientMedicationHistory,

        recordPayment,
        voidInvoice,
        createInvoice,

        admitPatientToBed,
        dischargePatientFromBed,

        addEmergencyCase,
        updateEmergencyCase,
        updateEmergencyStatus,
        admitEmergencyToInpatient,
        dischargeEmergencyCase,

        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateRolePermission
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
