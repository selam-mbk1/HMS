export type UserRole = 
  | 'SUPER_ADMIN'
  | 'HOSPITAL_ADMIN'
  | 'RECEPTIONIST'
  | 'DOCTOR'
  | 'NURSE'
  | 'LAB_TECHNICIAN'
  | 'PHARMACIST'
  | 'ACCOUNTANT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  lastLogin: string;
  specialization?: string;
  licenseNumber?: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface VitalSignRecord {
  id: string;
  patientId: string;
  recordedAt: string;
  recordedBy: string; // nurse name
  temperature: number; // in Celsius e.g. 37.1
  bloodPressureSystolic: number; // e.g. 120
  bloodPressureDiastolic: number; // e.g. 80
  pulseRate: number; // bpm e.g. 74
  respiratoryRate: number; // breaths/min e.g. 16
  oxygenSaturation: number; // SpO2 % e.g. 98
  weight: number; // kg e.g. 68
  height?: number; // cm e.g. 175
  painScale?: number; // 0-10
  notes?: string;
}

export interface Patient {
  id: string; // e.g. PAT-001201
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  city: string;
  subCity?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'INPATIENT' | 'DISCHARGED';
  registeredAt: string;
  primaryDoctorId?: string;
  primaryDoctorName?: string;
  assignedDepartment: string;
  emergencyContact: EmergencyContact;
  allergies: string[];
  chronicConditions: string[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  currentWard?: string;
  currentBed?: string;
}

export type AppointmentStatus = 
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'ARRIVED'
  | 'CHECKED_IN'
  | 'WAITING_FOR_NURSE'
  | 'WITH_NURSE'
  | 'WAITING_FOR_DOCTOR'
  | 'WAITING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface Appointment {
  id: string; // e.g. APT-8921
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'NEW_CONSULTATION' | 'FOLLOW_UP' | 'ROUTINE_CHECKUP' | 'EMERGENCY';
  status: AppointmentStatus;
  reason: string;
  roomNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface DiagnosisItem {
  id: string;
  code?: string; // ICD-10 e.g. E11.9
  name: string;
  type: 'PRIMARY' | 'SECONDARY' | 'PROVISIONAL';
  notes?: string;
}

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string; // e.g. 500mg
  frequency: string; // e.g. 3 times daily (TID)
  route: 'ORAL' | 'IV' | 'IM' | 'TOPICAL' | 'INHALATION';
  duration: string; // e.g. 7 days
  quantity: number;
  instructions: string; // e.g. Take after meals
  isDispensed?: boolean;
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  chiefComplaint: string;
  symptoms: string[];
  vitals: {
    temp: number;
    bp: string;
    pulse: number;
    resp: number;
    spo2: number;
    weight: number;
  };
  clinicalExamination: string;
  diagnoses: DiagnosisItem[];
  labRequests: string[];
  treatmentPlan: string;
  prescriptions: PrescriptionItem[];
  followUpDate?: string;
  followUpInstructions?: string;
  status: 'DRAFT' | 'COMPLETED';
}

export type LabPriority = 'NORMAL' | 'URGENT' | 'CRITICAL';
export type LabStatus = 'PENDING' | 'COLLECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface LabParameter {
  name: string;
  result: string | number;
  unit: string;
  referenceRange: string;
  isAbnormal?: boolean;
  isCritical?: boolean;
}

export interface LabTestRequest {
  id: string; // LAB-781
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  testName: string;
  category: 'HEMATOLOGY' | 'BIOCHEMISTRY' | 'MICROBIOLOGY' | 'URINALYSIS' | 'PARASITOLOGY' | 'SEROLOGY';
  priority: LabPriority;
  status: LabStatus;
  requestedAt: string;
  collectedAt?: string;
  completedAt?: string;
  technicianName?: string;
  sampleType: string; // e.g. Whole Blood, Serum, Urine
  parameters: LabParameter[];
  clinicalNotes?: string;
  technicianRemarks?: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'ANTIBIOTIC' | 'ANALGESIC' | 'ANTIHYPERTENSIVE' | 'ANTIDIABETIC' | 'ANTIMALARIAL' | 'IV_FLUID' | 'VITAMIN';
  batchNumber: string;
  stockQuantity: number;
  reorderLevel: number;
  maxStockLevel?: number;
  unit: string; // 'Tablets', 'Vials', 'Bottles', 'Ampoules', 'Capsules'
  pricePerUnit: number; // in ETB
  expiryDate: string; // YYYY-MM-DD
  supplier: string;
  shelfLocation: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';
  // Detailed pharmacy fields & aliases
  strength?: string;
  dosageForm?: string;
  currentStock?: number;
  minimumStock?: number;
  unitPrice?: number;
}

export type PrescriptionStatus = 
  | 'PENDING' 
  | 'PENDING_REVIEW' 
  | 'READY_TO_DISPENSE' 
  | 'DISPENSING' 
  | 'PARTIALLY_DISPENSED' 
  | 'DISPENSED' 
  | 'OUT_OF_STOCK' 
  | 'CANCELLED';

export interface PrescriptionOrder {
  id: string; // e.g. RX-20260908-001 or RX-4401
  consultationId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department?: string;
  items: PrescriptionItem[];
  status: PrescriptionStatus;
  priority?: 'STAT' | 'URGENT' | 'ROUTINE';
  createdAt: string;
  dispensedAt?: string;
  pharmacistName?: string;
  dispensedBatchNumber?: string;
  notes?: string;
  clarificationRequested?: boolean;
  clarificationReason?: string;
  totalCost: number; // ETB
}

export interface MedicationBatch {
  id: string;
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  manufacturingDate?: string;
  expiryDate: string;
  quantity: number;
  initialQuantity: number;
  supplier: string;
  shelfLocation: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'DEPLETED';
}

export interface DispensingRecord {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  medicineId: string;
  medicineName: string;
  dosage?: string;
  quantity: number;
  batchNumber: string;
  pharmacistName: string;
  dispensedAt: string;
  notes?: string;
  status: 'DISPENSED' | 'PARTIALLY_DISPENSED';
}

export interface FormularyItem {
  id: string;
  medicineName: string;
  genericName: string;
  therapeuticClass: string;
  strength: string;
  dosageForm: string;
  route: string;
  status: 'ACTIVE' | 'RESTRICTED' | 'INACTIVE';
  pregnancyCategory?: string;
  indications?: string;
  controlledSubstance?: boolean;
}

export interface InvoiceItem {
  id: string;
  serviceCategory: 'CONSULTATION' | 'LABORATORY' | 'PHARMACY' | 'ADMISSION' | 'PROCEDURE' | 'NURSING';
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID' | 'VOIDED';
export type PaymentMethod = 'CASH' | 'TELEBIRR' | 'CBE_BIRR' | 'BANK_TRANSFER' | 'INSURANCE';

export interface PaymentTransaction {
  id: string; // e.g. TXN-2026-0814
  invoiceId: string;
  patientId: string;
  patientName: string;
  amount: number;
  method: PaymentMethod;
  referenceNumber: string; // e.g. TEL-TXN-9018442, CBE-TRANS-55102
  cashierName: string;
  timestamp: string; // YYYY-MM-DD HH:mm
  status: 'VERIFIED' | 'SETTLED' | 'PENDING';
  receiptNumber: string;
  notes?: string;
}

export interface Invoice {
  id: string; // INV-2026-0901
  patientId: string;
  patientName: string;
  patientPhone: string;
  issueDate: string;
  issuedDate?: string; // alias
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number; // e.g. 15% VAT
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  referenceNumber?: string;
  recordedBy?: string;
  receiptNumber?: string;
  department?: string;
  voidReason?: string;
  voidedAt?: string;
  voidedBy?: string;
}

export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';

export interface Bed {
  id: string;
  wardId: string;
  wardName: string;
  roomNumber: string;
  bedCode: string; // e.g. Bed-101A
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  admissionDate?: string;
  attendingDoctor?: string;
}

export interface Ward {
  id: string;
  name: string;
  type: 'ICU' | 'GENERAL_SURGERY' | 'INTERNAL_MEDICINE' | 'PEDIATRICS' | 'MATERNITY';
  totalBeds: number;
  occupiedBeds: number;
  headNurse: string;
}

export type EmergencyTriageLevel = 'RESUSCITATION' | 'CRITICAL' | 'URGENT' | 'OBSERVATION' | 'NORMAL';
export type TriageLevel = EmergencyTriageLevel;

export interface EmergencyCase {
  id: string; // e.g. ER-00045, ER-9102
  patientName: string;
  patientId?: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  emergencyContact?: string;
  arrivalTime?: string;
  arrivalTimestamp?: string;
  arrivalMethod?: 'Walk-in' | 'Ambulance' | 'Wheelchair' | 'Stretcher' | 'Police/Bystander' | string;
  chiefComplaint: string;
  triageLevel: EmergencyTriageLevel;
  priority?: 'CRITICAL' | 'URGENT' | 'NORMAL' | 'LESS_URGENT';
  gcsScore: number; // Glasgow Coma Scale (3-15)
  vitals?: {
    bp: string;
    pulse: number;
    spo2: number;
    temp: number;
  };
  vitalSigns?: {
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    pulseRate: number;
    oxygenSaturation: number;
    temperature: number;
    respiratoryRate?: number;
    painLevel?: number; // 0-10
    weight?: number;
    consciousnessLevel?: string; // Alert, Voice, Pain, Unresponsive
  };
  assignedDoctor?: string;
  status: 'TRIAGE' | 'TRIAGED' | 'WAITING_FOR_TRIAGE' | 'IN_TRIAGE' | 'WAITING_FOR_DOCTOR' | 'RESUSCITATION' | 'OBSERVATION' | 'IN_PROGRESS' | 'ADMITTED' | 'DISCHARGED' | 'TRANSFERRED';
  bedAssigned?: string;
  waitingMinutes?: number;

  // Nursing Emergency Triage
  triageNotes?: string;
  clinicalObservations?: string;
  immediateConcerns?: string;
  triagedBy?: string;
  triageCompletedAt?: string;

  // Clinical treatment & disposition workflow (Steps 7 & 8)
  symptoms?: string;
  examinationNotes?: string;
  diagnosis?: string;
  treatmentGiven?: string;
  laboratoryRequests?: string[];
  medicationsOrdered?: string[];
  doctorNotes?: string;
  disposition?: 'DISCHARGED' | 'ADMITTED' | 'TRANSFERRED' | 'OBSERVATION';
  dischargeInstructions?: string;
  followUpDate?: string;
  admittedWard?: string;
  admittedBed?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'LAB_RESULT' | 'PRESCRIPTION' | 'LOW_STOCK' | 'EMERGENCY' | 'BILLING';
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  timestamp: string;
  read: boolean;
  linkTo?: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  targetId: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details?: string;
}

export interface RolePermission {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
