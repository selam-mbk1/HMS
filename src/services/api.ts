/**
 * Production-ready API service abstraction layer.
 * Currently backed by the local responsive in-memory / local storage store,
 * structured for drop-in Axios / REST backend connectivity.
 */

import { Patient, Appointment, ConsultationRecord, LabTestRequest, Medicine, PrescriptionOrder, Invoice } from '../types';

export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    return JSON.parse(localStorage.getItem('hms_patients') || '[]');
  },
  getById: async (id: string): Promise<Patient | undefined> => {
    const list: Patient[] = JSON.parse(localStorage.getItem('hms_patients') || '[]');
    return list.find(p => p.id === id);
  },
  create: async (patient: Partial<Patient>): Promise<Patient> => {
    // In production: const { data } = await axios.post('/api/v1/patients', patient);
    return patient as Patient;
  },
  update: async (id: string, updates: Partial<Patient>): Promise<Patient> => {
    // In production: const { data } = await axios.put(`/api/v1/patients/${id}`, updates);
    return { ...updates, id } as Patient;
  }
};

export const appointmentsApi = {
  getAll: async (): Promise<Appointment[]> => {
    return JSON.parse(localStorage.getItem('hms_appointments') || '[]');
  },
  create: async (appointment: Partial<Appointment>): Promise<Appointment> => {
    return appointment as Appointment;
  },
  updateStatus: async (id: string, status: Appointment['status']): Promise<void> => {
    // In production: await axios.patch(`/api/v1/appointments/${id}/status`, { status });
  }
};

export const laboratoryApi = {
  getAll: async (): Promise<LabTestRequest[]> => {
    return JSON.parse(localStorage.getItem('hms_labs') || '[]');
  },
  submitResult: async (id: string, payload: any): Promise<void> => {
    // In production: await axios.post(`/api/v1/laboratory/requests/${id}/results`, payload);
  }
};

export const pharmacyApi = {
  getMedicines: async (): Promise<Medicine[]> => {
    return JSON.parse(localStorage.getItem('hms_medicines') || '[]');
  },
  getPrescriptions: async (): Promise<PrescriptionOrder[]> => {
    return JSON.parse(localStorage.getItem('hms_prescriptions') || '[]');
  },
  dispense: async (id: string): Promise<void> => {
    // In production: await axios.post(`/api/v1/pharmacy/prescriptions/${id}/dispense`);
  }
};

export const billingApi = {
  getInvoices: async (): Promise<Invoice[]> => {
    return JSON.parse(localStorage.getItem('hms_invoices') || '[]');
  },
  recordPayment: async (id: string, paymentData: any): Promise<void> => {
    // In production: await axios.post(`/api/v1/billing/invoices/${id}/payments`, paymentData);
  }
};
