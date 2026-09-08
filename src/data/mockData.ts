import { 
  User, 
  Patient, 
  Appointment, 
  ConsultationRecord, 
  LabTestRequest, 
  Medicine, 
  PrescriptionOrder, 
  Invoice, 
  Bed, 
  Ward, 
  EmergencyCase, 
  AppNotification, 
  AuditLog, 
  RolePermission,
  VitalSignRecord,
  MedicationBatch,
  DispensingRecord,
  FormularyItem,
  PaymentTransaction
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Ato Berhanu Wolde',
    email: 'superadmin@hospital.et',
    role: 'SUPER_ADMIN',
    department: 'Hospital Executive & IT',
    phone: '+251 91 122 3344',
    status: 'ACTIVE',
    lastLogin: '2026-09-05 08:15',
  },
  {
    id: 'USR-002',
    name: 'W/ro Selamawit Basaznew',
    email: 'hospitaladmin@hospital.et',
    role: 'HOSPITAL_ADMIN',
    department: 'Hospital Administration',
    phone: '+251 91 234 5678',
    status: 'ACTIVE',
    lastLogin: '2026-09-05 08:30',
  },
  {
    id: 'USR-003',
    name: 'Dr. Hana Tesfaye, MD',
    email: 'doctor@hospital.et',
    role: 'DOCTOR',
    department: 'Internal Medicine',
    phone: '+251 91 345 6789',
    specialization: 'Senior Consultant Internist',
    licenseNumber: 'ETH-MED-84920',
    status: 'ACTIVE',
    lastLogin: '2026-09-05 08:45',
  },
  {
    id: 'USR-004',
    name: 'Dr. Dawit Mengistu, MD',
    email: 'dr.dawit@hospital.et',
    role: 'DOCTOR',
    department: 'Cardiology',
    phone: '+251 91 456 7890',
    specialization: 'Cardiologist',
    licenseNumber: 'ETH-MED-77219',
    status: 'ACTIVE',
    lastLogin: '2026-09-05 07:50',
  },
  {
    id: 'USR-005',
    name: 'Sr. Tigist Mengistu, BSc',
    email: 'nurse@hospital.et',
    role: 'NURSE',
    department: 'Inpatient Medical Ward',
    phone: '+251 92 111 2233',
    status: 'ACTIVE',
    lastLogin: '2026-09-05 07:00',
  },
  {
    id: 'USR-006',
    name: 'W/ro Marta Alemu',
    email: 'receptionist@hospital.et',
    role: 'RECEPTIONIST',
    department: 'Front Desk & Patient Admissions',
    phone: '+251 92 222 3344',
    status: 'ACTIVE',
    lastLogin: '2026-09-05 07:30',
  },
  {
    id: 'USR-007',
    name: 'Ato Yohannes Haile, BMLS',
    email: 'labtech@hospital.et',
    role: 'LAB_TECHNICIAN',
    department: 'Clinical Diagnostic Laboratory',
    phone: '+251 92 333 4455',
    status: 'ACTIVE',
    lastLogin: '2026-09-05 08:00',
  },
  {
    id: 'USR-008',
    name: 'Pharm. Almaz Tadesse, BPharm',
    email: 'pharmacist@hospital.et',
    role: 'PHARMACIST',
    department: 'Central Hospital Pharmacy',
    phone: '+251 92 444 5566',
    status: 'ACTIVE',
    lastLogin: '2026-09-05 08:10',
  },
  {
    id: 'USR-009',
    name: 'Ato Samuel Bekele',
    email: 'accountant@hospital.et',
    role: 'ACCOUNTANT',
    department: 'Finance & Medical Billing',
    phone: '+251 92 555 6677',
    status: 'ACTIVE',
    lastLogin: '2026-09-05 08:20',
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PAT-001201',
    firstName: 'Abebe',
    middleName: 'Kebede',
    lastName: 'Girma',
    dob: '1978-04-12',
    age: 48,
    gender: 'MALE',
    bloodGroup: 'O+',
    phone: '+251 91 199 8877',
    email: 'abebe.kebede@gmail.com',
    address: 'Bole Sub-City, Woreda 03, House #412',
    city: 'Addis Ababa',
    subCity: 'Bole',
    status: 'ACTIVE',
    registeredAt: '2024-03-15',
    primaryDoctorId: 'USR-003',
    primaryDoctorName: 'Dr. Hana Tesfaye, MD',
    assignedDepartment: 'Internal Medicine',
    emergencyContact: {
      name: 'Tirhas Kebede',
      relationship: 'Spouse',
      phone: '+251 91 199 8878'
    },
    allergies: ['Penicillin G', 'Sulfa drugs'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    insuranceProvider: 'Ethiopian Health Insurance Agency (EHIA)',
    insurancePolicyNumber: 'EHIA-ADD-901844'
  },
  {
    id: 'PAT-001202',
    firstName: 'Hana',
    middleName: 'Tesfaye',
    lastName: 'Assefa',
    dob: '1992-08-23',
    age: 34,
    gender: 'FEMALE',
    bloodGroup: 'A+',
    phone: '+251 92 345 8899',
    email: 'hana.t@outlook.com',
    address: 'Yeka Sub-City, Woreda 07, Megenagna',
    city: 'Addis Ababa',
    subCity: 'Yeka',
    status: 'ACTIVE',
    registeredAt: '2025-01-10',
    primaryDoctorId: 'USR-004',
    primaryDoctorName: 'Dr. Dawit Mengistu, MD',
    assignedDepartment: 'Cardiology',
    emergencyContact: {
      name: 'Tesfaye Assefa',
      relationship: 'Father',
      phone: '+251 91 223 9988'
    },
    allergies: ['Aspirin'],
    chronicConditions: ['Mild Asthma'],
    insuranceProvider: 'United Insurance Ethiopia',
    insurancePolicyNumber: 'UNIC-CORP-4819'
  },
  {
    id: 'PAT-001203',
    firstName: 'Samuel',
    middleName: 'Bekele',
    lastName: 'Desta',
    dob: '1965-11-04',
    age: 60,
    gender: 'MALE',
    bloodGroup: 'B+',
    phone: '+251 91 445 6677',
    email: 'samuel.bekele@telecom.et',
    address: 'Kirkos Sub-City, Kazanchis',
    city: 'Addis Ababa',
    subCity: 'Kirkos',
    status: 'INPATIENT',
    registeredAt: '2023-11-20',
    primaryDoctorId: 'USR-003',
    primaryDoctorName: 'Dr. Hana Tesfaye, MD',
    assignedDepartment: 'Internal Medicine',
    currentWard: 'Medical Ward A',
    currentBed: 'Bed-102A',
    emergencyContact: {
      name: 'Genet Bekele',
      relationship: 'Daughter',
      phone: '+251 91 334 5566'
    },
    allergies: ['None known'],
    chronicConditions: ['Ischemic Heart Disease', 'Hyperlipidemia'],
    insuranceProvider: 'Nyala Insurance SC',
    insurancePolicyNumber: 'NYL-HLTH-7822'
  },
  {
    id: 'PAT-001204',
    firstName: 'Marta',
    middleName: 'Alemu',
    lastName: 'Woldie',
    dob: '2001-02-18',
    age: 25,
    gender: 'FEMALE',
    bloodGroup: 'AB+',
    phone: '+251 94 556 7788',
    email: 'marta.alemu25@gmail.com',
    address: 'Arada Sub-City, Piazza',
    city: 'Addis Ababa',
    subCity: 'Arada',
    status: 'ACTIVE',
    registeredAt: '2026-02-01',
    primaryDoctorId: 'USR-003',
    primaryDoctorName: 'Dr. Hana Tesfaye, MD',
    assignedDepartment: 'Internal Medicine',
    emergencyContact: {
      name: 'Alemu Woldie',
      relationship: 'Father',
      phone: '+251 91 556 7789'
    },
    allergies: ['Ciprofloxacin'],
    chronicConditions: ['Recurrent Migraine'],
    insuranceProvider: 'Self Pay (Private)',
  },
  {
    id: 'PAT-001205',
    firstName: 'Dawit',
    middleName: 'Girma',
    lastName: 'Chernet',
    dob: '1984-06-30',
    age: 42,
    gender: 'MALE',
    bloodGroup: 'O-',
    phone: '+251 93 112 2334',
    email: 'dawit.girma@gmail.com',
    address: 'Nifas Silk-Lafto, Lebu Varnero',
    city: 'Addis Ababa',
    subCity: 'Nifas Silk-Lafto',
    status: 'ACTIVE',
    registeredAt: '2025-08-14',
    primaryDoctorId: 'USR-004',
    primaryDoctorName: 'Dr. Dawit Mengistu, MD',
    assignedDepartment: 'Cardiology',
    emergencyContact: {
      name: 'Bethelhem Girma',
      relationship: 'Sister',
      phone: '+251 91 889 9001'
    },
    allergies: ['NSAIDs', 'Ibuprofen'],
    chronicConditions: ['Hypertension Stage II'],
    insuranceProvider: 'Awash Insurance Company',
    insurancePolicyNumber: 'AIC-MED-9941'
  },
  {
    id: 'PAT-001206',
    firstName: 'Almaz',
    middleName: 'Tadesse',
    lastName: 'Bogale',
    dob: '1970-12-05',
    age: 55,
    gender: 'FEMALE',
    bloodGroup: 'A-',
    phone: '+251 91 778 8990',
    email: 'almaz.tadesse@yahoo.com',
    address: 'Kolfe Keranio, Torhailoch',
    city: 'Addis Ababa',
    subCity: 'Kolfe Keranio',
    status: 'INPATIENT',
    registeredAt: '2024-09-18',
    primaryDoctorId: 'USR-003',
    primaryDoctorName: 'Dr. Hana Tesfaye, MD',
    assignedDepartment: 'Internal Medicine',
    currentWard: 'ICU Critical Care',
    currentBed: 'Bed-ICU-02',
    emergencyContact: {
      name: 'Moges Bogale',
      relationship: 'Son',
      phone: '+251 92 778 8991'
    },
    allergies: ['Latex', 'Codeine'],
    chronicConditions: ['Chronic Kidney Disease Stage 3', 'Diabetes'],
    insuranceProvider: 'EHIA',
    insurancePolicyNumber: 'EHIA-ADD-441092'
  },
  {
    id: 'PAT-001207',
    firstName: 'Selam',
    middleName: 'Desta',
    lastName: 'DD',
    dob: '1998-04-12',
    age: 28,
    gender: 'FEMALE',
    bloodGroup: 'B+',
    phone: '+251 91 223 3445',
    email: 'selam.dd@gmail.com',
    address: 'Bole Medhanealem, House 410',
    city: 'Addis Ababa',
    subCity: 'Bole',
    status: 'ACTIVE',
    registeredAt: '2026-09-05',
    primaryDoctorId: 'USR-003',
    primaryDoctorName: 'Dr. Hana Tesfaye, MD',
    assignedDepartment: 'Internal Medicine',
    emergencyContact: {
      name: 'Daniel Desta',
      relationship: 'Brother',
      phone: '+251 91 223 3446'
    },
    allergies: ['None Reported'],
    chronicConditions: ['None'],
    insuranceProvider: 'Medhin Insurance',
    insurancePolicyNumber: 'MED-OUT-9912'
  }
];

export const INITIAL_VITALS: VitalSignRecord[] = [
  {
    id: 'VIT-001',
    patientId: 'PAT-001201',
    recordedAt: '2026-09-05 08:40',
    recordedBy: 'Sr. Tigist Mengistu, BSc',
    temperature: 36.8,
    bloodPressureSystolic: 128,
    bloodPressureDiastolic: 82,
    pulseRate: 74,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    weight: 76.5,
    height: 174,
    painScale: 1,
    notes: 'Routine clinic intake vitals. Patient calm, asymptomatic.'
  },
  {
    id: 'VIT-002',
    patientId: 'PAT-001203',
    recordedAt: '2026-09-05 06:30',
    recordedBy: 'Sr. Tigist Mengistu, BSc',
    temperature: 37.4,
    bloodPressureSystolic: 142,
    bloodPressureDiastolic: 92,
    pulseRate: 88,
    respiratoryRate: 20,
    oxygenSaturation: 95,
    weight: 84.0,
    height: 170,
    painScale: 3,
    notes: 'Inpatient morning check. Mild substernal tightness noted, notified Dr. Hana.'
  },
  {
    id: 'VIT-003',
    patientId: 'PAT-001206',
    recordedAt: '2026-09-05 08:00',
    recordedBy: 'Sr. Tigist Mengistu, BSc',
    temperature: 38.2,
    bloodPressureSystolic: 155,
    bloodPressureDiastolic: 98,
    pulseRate: 104,
    respiratoryRate: 22,
    oxygenSaturation: 93,
    weight: 62.0,
    height: 160,
    painScale: 5,
    notes: 'ICU monitor check. SpO2 93% on 2L nasal cannula. Febrile.'
  },
  {
    id: 'VIT-004',
    patientId: 'PAT-001207',
    recordedAt: '2026-09-05 08:25',
    recordedBy: 'Sr. Tigist Mengistu, BSc',
    temperature: 37.6,
    bloodPressureSystolic: 122,
    bloodPressureDiastolic: 78,
    pulseRate: 80,
    respiratoryRate: 18,
    oxygenSaturation: 98,
    weight: 59.0,
    height: 165,
    painScale: 2,
    notes: 'Nurse triage complete. Patient alert, reporting low-grade fever and mild headache. Ready for Internal Medicine physician consultation.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-8919',
    patientId: 'PAT-001203',
    patientName: 'Samuel Bekele',
    patientPhone: '+251 91 445 6677',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    date: '2026-09-05',
    time: '08:30',
    type: 'ROUTINE_CHECKUP',
    status: 'COMPLETED',
    reason: 'Pre-admission assessment for cardiac telemetry',
    roomNumber: 'Room 204',
    createdAt: '2026-08-30 16:00'
  },
  {
    id: 'APT-8926',
    patientId: 'PAT-001202',
    patientName: 'Hana Assefa',
    patientPhone: '+251 92 345 8899',
    doctorId: 'USR-004',
    doctorName: 'Dr. Dawit Mengistu, MD',
    department: 'Cardiology',
    date: '2026-09-05',
    time: '08:30',
    type: 'ROUTINE_CHECKUP',
    status: 'WAITING_FOR_NURSE',
    reason: 'Chest tightness and blood pressure elevation triage',
    roomNumber: 'Cardiology 101',
    createdAt: '2026-09-05 08:20'
  },
  {
    id: 'APT-8925',
    patientId: 'PAT-001207',
    patientName: 'Selam DD',
    patientPhone: '+251 91 223 3445',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    date: '2026-09-05',
    time: '08:45',
    type: 'NEW_CONSULTATION',
    status: 'WAITING_FOR_DOCTOR',
    reason: 'General outpatient triage and fever assessment',
    roomNumber: 'Room 204',
    createdAt: '2026-09-05 08:15'
  },
  {
    id: 'APT-8921',
    patientId: 'PAT-001201',
    patientName: 'Abebe Kebede',
    patientPhone: '+251 91 199 8877',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    date: '2026-09-05',
    time: '09:15',
    type: 'FOLLOW_UP',
    status: 'WAITING_FOR_DOCTOR',
    reason: 'Monthly follow-up for HbA1c control and hypertension titration',
    roomNumber: 'Room 204',
    createdAt: '2026-09-01 10:20'
  },
  {
    id: 'APT-8922',
    patientId: 'PAT-001205',
    patientName: 'Dawit Girma',
    patientPhone: '+251 93 112 2334',
    doctorId: 'USR-004',
    doctorName: 'Dr. Dawit Mengistu, MD',
    department: 'Cardiology',
    date: '2026-09-05',
    time: '09:30',
    type: 'ROUTINE_CHECKUP',
    status: 'IN_PROGRESS',
    reason: 'Echocardiogram follow-up and palpitations assessment',
    roomNumber: 'Cardiology 101',
    createdAt: '2026-09-02 14:15'
  },
  {
    id: 'APT-8923',
    patientId: 'PAT-001204',
    patientName: 'Marta Alemu',
    patientPhone: '+251 94 556 7788',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    date: '2026-09-05',
    time: '10:30',
    type: 'NEW_CONSULTATION',
    status: 'CONFIRMED',
    reason: 'Persistent throbbing unilateral headaches and visual auras',
    roomNumber: 'Room 204',
    createdAt: '2026-09-03 11:00'
  }
];

export const INITIAL_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'CON-5501',
    patientId: 'PAT-001201',
    patientName: 'Abebe Kebede',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    date: '2026-08-20',
    chiefComplaint: 'Mild blurred vision in the mornings and frequent urination for 2 weeks',
    symptoms: ['Polydipsia', 'Polyuria', 'Occasional morning headache', 'Fatigue'],
    vitals: {
      temp: 36.7,
      bp: '135/88 mmHg',
      pulse: 78,
      resp: 16,
      spo2: 98,
      weight: 77.0
    },
    clinicalExamination: 'Alert and oriented x4. Cardiovascular S1/S2 distinct with no murmurs. Lungs clear to auscultation bilaterally. Abdomen soft, non-tender, no organomegaly. Fundoscopic exam showed early microaneurysms without exudates.',
    diagnoses: [
      {
        id: 'DX-1',
        code: 'E11.9',
        name: 'Type 2 Diabetes Mellitus without complications',
        type: 'PRIMARY',
        notes: 'Uncontrolled glycemic level on current oral agents'
      },
      {
        id: 'DX-2',
        code: 'I10',
        name: 'Essential (Primary) Hypertension',
        type: 'SECONDARY',
        notes: 'Stage 1, adequately compensated'
      }
    ],
    labRequests: ['Complete Blood Count (CBC)', 'Fasting Blood Sugar (FBS)', 'HbA1c Glycated Hemoglobin', 'Lipid Panel'],
    treatmentPlan: '1. Up-titrate Metformin to 850mg BID.\n2. Add Enalapril 10mg daily in the morning.\n3. Referral to hospital dietary clinic for low-glycemic diabetic meal planning.\n4. Repeat laboratory tests in 3 weeks.',
    prescriptions: [
      {
        id: 'PRX-01',
        medicineId: 'MED-001',
        medicineName: 'Metformin Hydrochloride 850mg',
        dosage: '850mg',
        frequency: 'Twice daily with meals (BID)',
        route: 'ORAL',
        duration: '30 days',
        quantity: 60,
        instructions: 'Take immediately after breakfast and dinner',
        isDispensed: true
      },
      {
        id: 'PRX-02',
        medicineId: 'MED-003',
        medicineName: 'Enalapril Maleate 10mg',
        dosage: '10mg',
        frequency: 'Once daily in the morning (OD)',
        route: 'ORAL',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take in the morning with water',
        isDispensed: true
      }
    ],
    followUpDate: '2026-09-05',
    followUpInstructions: 'Return with morning fasting blood sugar logs and updated lipid/renal panel.',
    status: 'COMPLETED'
  }
];

export const INITIAL_LAB_REQUESTS: LabTestRequest[] = [
  {
    id: 'LAB-7801',
    patientId: 'PAT-001201',
    patientName: 'Abebe Kebede',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    testName: 'Complete Blood Count (CBC) with Automated Differential',
    category: 'HEMATOLOGY',
    priority: 'NORMAL',
    status: 'COMPLETED',
    requestedAt: '2026-09-04 09:15',
    collectedAt: '2026-09-04 09:45',
    completedAt: '2026-09-04 11:30',
    technicianName: 'Ato Yohannes Haile, BMLS',
    sampleType: 'Whole Blood (EDTA Vacutainer)',
    parameters: [
      { name: 'Hemoglobin (Hgb)', result: 14.8, unit: 'g/dL', referenceRange: '13.5 - 17.5', isAbnormal: false },
      { name: 'Hematocrit (Hct)', result: 43.5, unit: '%', referenceRange: '41.0 - 50.0', isAbnormal: false },
      { name: 'White Blood Cell (WBC)', result: 7.4, unit: '10^3/uL', referenceRange: '4.5 - 11.0', isAbnormal: false },
      { name: 'Platelet Count', result: 245, unit: '10^3/uL', referenceRange: '150 - 450', isAbnormal: false },
      { name: 'Neutrophils %', result: 58.2, unit: '%', referenceRange: '40.0 - 70.0', isAbnormal: false },
      { name: 'Lymphocytes %', result: 32.1, unit: '%', referenceRange: '20.0 - 40.0', isAbnormal: false }
    ],
    clinicalNotes: 'Follow-up for diabetes and routine pre-titration assessment.',
    technicianRemarks: 'Sample processed without hemolysis. All flags within normal limits.'
  },
  {
    id: 'LAB-7802',
    patientId: 'PAT-001201',
    patientName: 'Abebe Kebede',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    testName: 'Comprehensive Metabolic Panel (CMP) & HbA1c',
    category: 'BIOCHEMISTRY',
    priority: 'NORMAL',
    status: 'COMPLETED',
    requestedAt: '2026-09-04 09:15',
    collectedAt: '2026-09-04 09:45',
    completedAt: '2026-09-04 12:10',
    technicianName: 'Ato Yohannes Haile, BMLS',
    sampleType: 'Serum (SST Gel Tube)',
    parameters: [
      { name: 'Fasting Blood Glucose', result: 168, unit: 'mg/dL', referenceRange: '70 - 99', isAbnormal: true, isCritical: false },
      { name: 'HbA1c Glycated Hemoglobin', result: 8.4, unit: '%', referenceRange: '4.0 - 5.6', isAbnormal: true, isCritical: false },
      { name: 'Serum Creatinine', result: 1.05, unit: 'mg/dL', referenceRange: '0.70 - 1.30', isAbnormal: false },
      { name: 'Blood Urea Nitrogen (BUN)', result: 16, unit: 'mg/dL', referenceRange: '7 - 20', isAbnormal: false },
      { name: 'eGFR', result: 88, unit: 'mL/min/1.73m2', referenceRange: '> 60', isAbnormal: false },
      { name: 'Total Cholesterol', result: 215, unit: 'mg/dL', referenceRange: '< 200', isAbnormal: true }
    ],
    clinicalNotes: 'Assessment for glycemic target attainment.',
    technicianRemarks: 'High fasting glucose and HbA1c flagged. Normal renal function parameters.'
  },
  {
    id: 'LAB-7803',
    patientId: 'PAT-001206',
    patientName: 'Almaz Tadesse',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    testName: 'Renal Function Test & Electrolytes (STAT)',
    category: 'BIOCHEMISTRY',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    requestedAt: '2026-09-05 07:15',
    collectedAt: '2026-09-05 07:30',
    sampleType: 'Lithium Heparin Plasma',
    parameters: [
      { name: 'Serum Potassium (K+)', result: 'PENDING', unit: 'mmol/L', referenceRange: '3.5 - 5.1' },
      { name: 'Serum Sodium (Na+)', result: 'PENDING', unit: 'mmol/L', referenceRange: '136 - 145' },
      { name: 'Serum Creatinine', result: 'PENDING', unit: 'mg/dL', referenceRange: '0.6 - 1.1' }
    ],
    clinicalNotes: 'ICU Patient. Suspected hyperkalemia. Process immediately.'
  },
  {
    id: 'LAB-7804',
    patientId: 'PAT-001204',
    patientName: 'Marta Alemu',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    testName: 'Malaria Rapid Diagnostic Test (RDT) & Blood Film',
    category: 'PARASITOLOGY',
    priority: 'URGENT',
    status: 'PENDING',
    requestedAt: '2026-09-05 08:30',
    sampleType: 'Capillary / Whole Blood',
    parameters: [
      { name: 'Malaria Pan/Pf Antigen', result: 'PENDING', unit: 'Qualitative', referenceRange: 'Negative' },
      { name: 'Thick & Thin Blood Film', result: 'PENDING', unit: 'Microscopic', referenceRange: 'No parasites seen' }
    ],
    clinicalNotes: 'Rule out Plasmodium vivax / falciparum in febrile patient.'
  }
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'MED-001',
    name: 'Metformin Hydrochloride 850mg',
    genericName: 'Metformin HCl',
    category: 'ANTIDIABETIC',
    batchNumber: 'MET-2025-081',
    stockQuantity: 1450,
    reorderLevel: 300,
    unit: 'Tablets',
    pricePerUnit: 12.50, // ETB
    expiryDate: '2027-05-30',
    supplier: 'Cadila Pharmaceuticals Ethiopia',
    shelfLocation: 'Shelf D-04',
    status: 'IN_STOCK'
  },
  {
    id: 'MED-002',
    name: 'Amoxicillin + Clavulanic Acid 625mg (Augmentin)',
    genericName: 'Co-Amoxiclav',
    category: 'ANTIBIOTIC',
    batchNumber: 'AMX-2026-012',
    stockQuantity: 180,
    reorderLevel: 250,
    unit: 'Tablets',
    pricePerUnit: 48.00, // ETB
    expiryDate: '2026-11-15',
    supplier: 'Julphar Ethiopia Pharmaceuticals',
    shelfLocation: 'Shelf A-01',
    status: 'LOW_STOCK'
  },
  {
    id: 'MED-003',
    name: 'Enalapril Maleate 10mg',
    genericName: 'Enalapril',
    category: 'ANTIHYPERTENSIVE',
    batchNumber: 'ENL-2025-992',
    stockQuantity: 920,
    reorderLevel: 200,
    unit: 'Tablets',
    pricePerUnit: 8.50, // ETB
    expiryDate: '2027-08-20',
    supplier: 'EPHARM (Ethiopian Pharmaceuticals Mfg)',
    shelfLocation: 'Shelf C-03',
    status: 'IN_STOCK'
  },
  {
    id: 'MED-004',
    name: 'Artemether + Lumefantrine (Coartem 20/120mg)',
    genericName: 'Artemether / Lumefantrine',
    category: 'ANTIMALARIAL',
    batchNumber: 'CRT-2025-414',
    stockQuantity: 420,
    reorderLevel: 150,
    unit: 'Tablets',
    pricePerUnit: 35.00, // ETB
    expiryDate: '2027-01-30',
    supplier: 'Novartis Pharma AG',
    shelfLocation: 'Shelf M-02',
    status: 'IN_STOCK'
  },
  {
    id: 'MED-005',
    name: 'Normal Saline 0.9% IV Infusion 500ml',
    genericName: '0.9% Sodium Chloride',
    category: 'IV_FLUID',
    batchNumber: 'NS-2026-031',
    stockQuantity: 65,
    reorderLevel: 100,
    unit: 'Bottles',
    pricePerUnit: 120.00, // ETB
    expiryDate: '2026-10-31',
    supplier: 'Sino-Ethiopian Associates',
    shelfLocation: 'IV Storage Bay 1',
    status: 'LOW_STOCK'
  },
  {
    id: 'MED-006',
    name: 'Paracetamol 500mg Tablets',
    genericName: 'Acetaminophen',
    category: 'ANALGESIC',
    batchNumber: 'PCM-2025-104',
    stockQuantity: 3200,
    reorderLevel: 500,
    unit: 'Tablets',
    pricePerUnit: 3.50, // ETB
    expiryDate: '2028-03-10',
    supplier: 'EPHARM',
    shelfLocation: 'Shelf B-01',
    status: 'IN_STOCK',
    strength: '500mg',
    dosageForm: 'Tablet',
    currentStock: 3200,
    minimumStock: 500,
    unitPrice: 3.50
  },
  {
    id: 'MED-007',
    name: 'Ceftriaxone 1g Powder for Injection',
    genericName: 'Ceftriaxone Sodium',
    category: 'ANTIBIOTIC',
    batchNumber: 'CTX-2024-881',
    stockQuantity: 7,
    reorderLevel: 10,
    maxStockLevel: 120,
    unit: 'Vials',
    pricePerUnit: 165.00, // ETB
    expiryDate: '2026-06-30',
    supplier: 'Julphar Ethiopia',
    shelfLocation: 'Cold Chain / Room Temp',
    status: 'LOW_STOCK',
    strength: '1g',
    dosageForm: 'Injection Powder',
    currentStock: 7,
    minimumStock: 10,
    unitPrice: 165.00
  },
  {
    id: 'MED-008',
    name: 'Insulin Glargine (Lantus) 100 IU/ml 10ml',
    genericName: 'Insulin Glargine',
    category: 'ANTIDIABETIC',
    batchNumber: 'INS-2025-004',
    stockQuantity: 42,
    reorderLevel: 25,
    maxStockLevel: 100,
    unit: 'Vials',
    pricePerUnit: 680.00, // ETB
    expiryDate: '2026-12-31',
    supplier: 'Sanofi-Aventis',
    shelfLocation: 'Pharmacy Refrigerator #2 (2-8°C)',
    status: 'IN_STOCK',
    strength: '100 IU/ml',
    dosageForm: 'Injection Solution',
    currentStock: 42,
    minimumStock: 25,
    unitPrice: 680.00
  },
  {
    id: 'MED-009',
    name: 'Amoxicillin 500mg Capsules',
    genericName: 'Amoxicillin Trihydrate',
    category: 'ANTIBIOTIC',
    batchNumber: 'AMP-2026-04',
    stockQuantity: 18,
    reorderLevel: 25,
    maxStockLevel: 200,
    unit: 'Capsules',
    pricePerUnit: 18.00, // ETB
    expiryDate: '2026-11-20',
    supplier: 'Cadila Pharmaceuticals Ethiopia',
    shelfLocation: 'Shelf A-03',
    status: 'LOW_STOCK',
    strength: '500mg',
    dosageForm: 'Capsule',
    currentStock: 18,
    minimumStock: 25,
    unitPrice: 18.00
  }
];

export const INITIAL_PRESCRIPTIONS: PrescriptionOrder[] = [
  {
    id: 'RX-20260908-001',
    patientId: 'PAT-001204',
    patientName: 'Marta Woldie',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    priority: 'URGENT',
    status: 'READY_TO_DISPENSE',
    createdAt: '2026-09-08 08:15',
    items: [
      {
        id: 'PRX-001',
        medicineId: 'MED-009',
        medicineName: 'Amoxicillin 500mg Capsules',
        dosage: '500mg',
        frequency: 'Every 8 hours (TID)',
        route: 'ORAL',
        duration: '7 days',
        quantity: 21,
        instructions: 'Take 1 capsule every 8 hours with full glass of water. Complete full course.',
        isDispensed: false
      }
    ],
    notes: 'Prescription reviewed and approved by attending physician. Patient has no penicillin cross-reaction noted.',
    totalCost: 378.00
  },
  {
    id: 'RX-4402',
    patientId: 'PAT-001204',
    patientName: 'Marta Woldie',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    priority: 'ROUTINE',
    status: 'PENDING_REVIEW',
    createdAt: '2026-09-08 08:30',
    items: [
      {
        id: 'PRX-03',
        medicineId: 'MED-006',
        medicineName: 'Paracetamol 500mg Tablets',
        dosage: '1000mg (2 tabs)',
        frequency: 'Every 6 hours PRN for pain (QID PRN)',
        route: 'ORAL',
        duration: '5 days',
        quantity: 20,
        instructions: 'Do not exceed 4000mg in 24 hours. Take after meals.',
        isDispensed: false
      },
      {
        id: 'PRX-04',
        medicineId: 'MED-002',
        medicineName: 'Amoxicillin + Clavulanic Acid 625mg',
        dosage: '625mg',
        frequency: 'Every 12 hours (BID)',
        route: 'ORAL',
        duration: '7 days',
        quantity: 14,
        instructions: 'Complete full course even if symptoms improve.',
        isDispensed: false
      }
    ],
    totalCost: 742.00
  },
  {
    id: 'RX-4403',
    patientId: 'PAT-001202',
    patientName: 'Hana Assefa',
    doctorId: 'USR-004',
    doctorName: 'Dr. Dawit Mengistu, MD',
    department: 'Cardiology',
    priority: 'ROUTINE',
    status: 'READY_TO_DISPENSE',
    createdAt: '2026-09-08 09:00',
    items: [
      {
        id: 'PRX-05',
        medicineId: 'MED-003',
        medicineName: 'Enalapril Maleate 10mg',
        dosage: '10mg',
        frequency: 'Once daily in the morning (OD)',
        route: 'ORAL',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take daily in morning with water. Monitor BP weekly.',
        isDispensed: false
      }
    ],
    notes: 'Long-term antihypertensive refill approved.',
    totalCost: 255.00
  },
  {
    id: 'RX-4404',
    patientId: 'PAT-001207',
    patientName: 'Selam DD',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    priority: 'STAT',
    status: 'PENDING_REVIEW',
    createdAt: '2026-09-08 09:15',
    items: [
      {
        id: 'PRX-06',
        medicineId: 'MED-004',
        medicineName: 'Artemether + Lumefantrine (Coartem 20/120mg)',
        dosage: '4 tablets stat, then as scheduled',
        frequency: 'Twice daily with meals (BID)',
        route: 'ORAL',
        duration: '3 days',
        quantity: 24,
        instructions: 'Take strictly with milk or fatty meal for optimal absorption.',
        isDispensed: false
      }
    ],
    notes: 'STAT order following positive malaria RDT.',
    totalCost: 840.00
  },
  {
    id: 'RX-4401',
    consultationId: 'CON-5501',
    patientId: 'PAT-001201',
    patientName: 'Abebe Kebede',
    doctorId: 'USR-003',
    doctorName: 'Dr. Hana Tesfaye, MD',
    department: 'Internal Medicine',
    priority: 'ROUTINE',
    status: 'DISPENSED',
    createdAt: '2026-09-08 07:45',
    dispensedAt: '2026-09-08 08:20',
    pharmacistName: 'Pharm. Almaz Tadesse, BPharm',
    dispensedBatchNumber: 'MET-2025-081',
    items: [
      {
        id: 'PRX-01',
        medicineId: 'MED-001',
        medicineName: 'Metformin Hydrochloride 850mg',
        dosage: '850mg',
        frequency: 'Twice daily with meals (BID)',
        route: 'ORAL',
        duration: '30 days',
        quantity: 60,
        instructions: 'Take immediately after breakfast and dinner',
        isDispensed: true
      },
      {
        id: 'PRX-02',
        medicineId: 'MED-003',
        medicineName: 'Enalapril Maleate 10mg',
        dosage: '10mg',
        frequency: 'Once daily in the morning (OD)',
        route: 'ORAL',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take in the morning with water',
        isDispensed: true
      }
    ],
    notes: 'Patient educated on hypoglycemia symptoms and GI tolerance with food.',
    totalCost: 1005.00
  }
];

export const INITIAL_BATCHES: MedicationBatch[] = [
  {
    id: 'BAT-001',
    medicineId: 'MED-009',
    medicineName: 'Amoxicillin 500mg Capsules',
    batchNumber: 'AMP-2026-04',
    manufacturingDate: '2024-11-20',
    expiryDate: '2026-11-20',
    quantity: 18,
    initialQuantity: 500,
    supplier: 'Cadila Pharmaceuticals Ethiopia',
    shelfLocation: 'Shelf A-03',
    status: 'ACTIVE'
  },
  {
    id: 'BAT-002',
    medicineId: 'MED-006',
    medicineName: 'Paracetamol 500mg Tablets',
    batchNumber: 'PCM-2026-04',
    manufacturingDate: '2024-10-15',
    expiryDate: '2026-10-15',
    quantity: 120,
    initialQuantity: 1000,
    supplier: 'EPHARM',
    shelfLocation: 'Shelf B-01 (Front)',
    status: 'EXPIRING_SOON'
  },
  {
    id: 'BAT-003',
    medicineId: 'MED-006',
    medicineName: 'Paracetamol 500mg Tablets',
    batchNumber: 'PCM-2025-104',
    manufacturingDate: '2025-03-10',
    expiryDate: '2028-03-10',
    quantity: 3080,
    initialQuantity: 4000,
    supplier: 'EPHARM',
    shelfLocation: 'Shelf B-01 (Reserve)',
    status: 'ACTIVE'
  },
  {
    id: 'BAT-004',
    medicineId: 'MED-007',
    medicineName: 'Ceftriaxone 1g Powder for Injection',
    batchNumber: 'CTX-2024-881',
    manufacturingDate: '2024-06-30',
    expiryDate: '2026-06-30',
    quantity: 7,
    initialQuantity: 200,
    supplier: 'Julphar Ethiopia',
    shelfLocation: 'Quarantine / Expired Bay',
    status: 'EXPIRED'
  },
  {
    id: 'BAT-005',
    medicineId: 'MED-005',
    medicineName: 'Normal Saline 0.9% IV Infusion 500ml',
    batchNumber: 'NS-2026-031',
    manufacturingDate: '2024-10-31',
    expiryDate: '2026-10-31',
    quantity: 65,
    initialQuantity: 300,
    supplier: 'Sino-Ethiopian Associates',
    shelfLocation: 'IV Storage Bay 1',
    status: 'EXPIRING_SOON'
  },
  {
    id: 'BAT-006',
    medicineId: 'MED-002',
    medicineName: 'Amoxicillin + Clavulanic Acid 625mg',
    batchNumber: 'AMX-2026-012',
    manufacturingDate: '2024-11-15',
    expiryDate: '2026-11-15',
    quantity: 180,
    initialQuantity: 600,
    supplier: 'Julphar Ethiopia Pharmaceuticals',
    shelfLocation: 'Shelf A-01',
    status: 'ACTIVE'
  },
  {
    id: 'BAT-007',
    medicineId: 'MED-001',
    medicineName: 'Metformin Hydrochloride 850mg',
    batchNumber: 'MET-2025-081',
    manufacturingDate: '2025-05-30',
    expiryDate: '2027-05-30',
    quantity: 1450,
    initialQuantity: 2000,
    supplier: 'Cadila Pharmaceuticals Ethiopia',
    shelfLocation: 'Shelf D-04',
    status: 'ACTIVE'
  },
  {
    id: 'BAT-008',
    medicineId: 'MED-003',
    medicineName: 'Enalapril Maleate 10mg',
    batchNumber: 'ENL-2025-992',
    manufacturingDate: '2025-08-20',
    expiryDate: '2027-08-20',
    quantity: 920,
    initialQuantity: 1500,
    supplier: 'EPHARM',
    shelfLocation: 'Shelf C-03',
    status: 'ACTIVE'
  },
  {
    id: 'BAT-009',
    medicineId: 'MED-004',
    medicineName: 'Artemether + Lumefantrine (Coartem 20/120mg)',
    batchNumber: 'CRT-2025-414',
    manufacturingDate: '2025-01-30',
    expiryDate: '2027-01-30',
    quantity: 420,
    initialQuantity: 800,
    supplier: 'Novartis Pharma AG',
    shelfLocation: 'Shelf M-02',
    status: 'ACTIVE'
  },
  {
    id: 'BAT-010',
    medicineId: 'MED-008',
    medicineName: 'Insulin Glargine (Lantus) 100 IU/ml 10ml',
    batchNumber: 'INS-2025-004',
    manufacturingDate: '2025-06-15',
    expiryDate: '2026-12-31',
    quantity: 42,
    initialQuantity: 100,
    supplier: 'Sanofi-Aventis',
    shelfLocation: 'Pharmacy Refrigerator #2',
    status: 'ACTIVE'
  }
];

export const INITIAL_DISPENSING_RECORDS: DispensingRecord[] = [
  {
    id: 'DSP-20260908-01',
    prescriptionId: 'RX-4401',
    patientId: 'PAT-001201',
    patientName: 'Abebe Kebede',
    medicineId: 'MED-001',
    medicineName: 'Metformin Hydrochloride 850mg',
    dosage: '850mg BID',
    quantity: 60,
    batchNumber: 'MET-2025-081',
    pharmacistName: 'Pharm. Almaz Tadesse, BPharm',
    dispensedAt: '2026-09-08 08:20',
    notes: 'Counselled on compliance and diet.',
    status: 'DISPENSED'
  },
  {
    id: 'DSP-20260908-02',
    prescriptionId: 'RX-4401',
    patientId: 'PAT-001201',
    patientName: 'Abebe Kebede',
    medicineId: 'MED-003',
    medicineName: 'Enalapril Maleate 10mg',
    dosage: '10mg OD',
    quantity: 30,
    batchNumber: 'ENL-2025-992',
    pharmacistName: 'Pharm. Almaz Tadesse, BPharm',
    dispensedAt: '2026-09-08 08:20',
    notes: 'Advised on morning dosing.',
    status: 'DISPENSED'
  },
  {
    id: 'DSP-20260901-01',
    prescriptionId: 'RX-20260901-08',
    patientId: 'PAT-001204',
    patientName: 'Marta Woldie',
    medicineId: 'MED-009',
    medicineName: 'Amoxicillin 500mg Capsules',
    dosage: '500mg TID',
    quantity: 21,
    batchNumber: 'AMP-2026-04',
    pharmacistName: 'Pharm. Almaz Tadesse, BPharm',
    dispensedAt: '2026-09-01 11:30',
    notes: 'Previous acute episode, completed course.',
    status: 'DISPENSED'
  },
  {
    id: 'DSP-20260820-01',
    prescriptionId: 'RX-20260820-04',
    patientId: 'PAT-001204',
    patientName: 'Marta Woldie',
    medicineId: 'MED-006',
    medicineName: 'Paracetamol 500mg Tablets',
    dosage: '500mg PRN',
    quantity: 16,
    batchNumber: 'PCM-2026-04',
    pharmacistName: 'Pharm. Almaz Tadesse, BPharm',
    dispensedAt: '2026-08-20 14:15',
    notes: 'Analgesia dispensed.',
    status: 'DISPENSED'
  }
];

export const INITIAL_FORMULARY: FormularyItem[] = [
  {
    id: 'FORM-001',
    medicineName: 'Amoxicillin Trihydrate',
    genericName: 'Amoxicillin',
    therapeuticClass: 'Antibacterial / Penicillin',
    strength: '500mg',
    dosageForm: 'Capsule',
    route: 'ORAL',
    status: 'ACTIVE',
    pregnancyCategory: 'Category B',
    indications: 'Bacterial upper/lower respiratory tract infections, ENT, urinary tract infections.',
    controlledSubstance: false
  },
  {
    id: 'FORM-002',
    medicineName: 'Co-Amoxiclav (Augmentin)',
    genericName: 'Amoxicillin + Clavulanic Acid',
    therapeuticClass: 'Antibacterial / Beta-Lactamase Inhibitor',
    strength: '625mg & 1g',
    dosageForm: 'Film-coated Tablet',
    route: 'ORAL',
    status: 'ACTIVE',
    pregnancyCategory: 'Category B',
    indications: 'Beta-lactamase producing bacterial infections, complicated bronchitis, cellulitis.',
    controlledSubstance: false
  },
  {
    id: 'FORM-003',
    medicineName: 'Paracetamol',
    genericName: 'Acetaminophen',
    therapeuticClass: 'Analgesic & Antipyretic',
    strength: '500mg & 1g IV',
    dosageForm: 'Tablet, Syrup, IV Infusion',
    route: 'ORAL / IV',
    status: 'ACTIVE',
    pregnancyCategory: 'Category B',
    indications: 'Mild to moderate pain, fever management.',
    controlledSubstance: false
  },
  {
    id: 'FORM-004',
    medicineName: 'Ceftriaxone Sodium',
    genericName: 'Ceftriaxone',
    therapeuticClass: 'Third-Generation Cephalosporin',
    strength: '1g & 2g',
    dosageForm: 'Powder for Injection',
    route: 'IV / IM',
    status: 'RESTRICTED',
    pregnancyCategory: 'Category B',
    indications: 'Severe sepsis, meningitis, hospital-acquired pneumonia. Requires ID specialist countersignature.',
    controlledSubstance: false
  },
  {
    id: 'FORM-005',
    medicineName: 'Metformin Hydrochloride',
    genericName: 'Metformin',
    therapeuticClass: 'Biguanide Antidiabetic',
    strength: '500mg & 850mg',
    dosageForm: 'Tablet',
    route: 'ORAL',
    status: 'ACTIVE',
    pregnancyCategory: 'Category B',
    indications: 'First-line monotherapy for Type 2 Diabetes Mellitus.',
    controlledSubstance: false
  },
  {
    id: 'FORM-006',
    medicineName: 'Enalapril Maleate',
    genericName: 'Enalapril',
    therapeuticClass: 'ACE Inhibitor Antihypertensive',
    strength: '5mg, 10mg, 20mg',
    dosageForm: 'Tablet',
    route: 'ORAL',
    status: 'ACTIVE',
    pregnancyCategory: 'Category D',
    indications: 'Essential hypertension, heart failure with reduced ejection fraction.',
    controlledSubstance: false
  },
  {
    id: 'FORM-007',
    medicineName: 'Artemether + Lumefantrine (Coartem)',
    genericName: 'Artemether / Lumefantrine',
    therapeuticClass: 'Artemisinin-Based Combination Therapy (ACT)',
    strength: '20mg/120mg',
    dosageForm: 'Tablet',
    route: 'ORAL',
    status: 'ACTIVE',
    pregnancyCategory: 'Category C',
    indications: 'Uncomplicated Plasmodium falciparum and vivax malaria.',
    controlledSubstance: false
  },
  {
    id: 'FORM-008',
    medicineName: 'Insulin Glargine (Lantus)',
    genericName: 'Insulin Glargine recombinant',
    therapeuticClass: 'Long-Acting Basal Insulin',
    strength: '100 IU/ml',
    dosageForm: 'Subcutaneous Solution',
    route: 'SUBCUTANEOUS',
    status: 'ACTIVE',
    pregnancyCategory: 'Category C',
    indications: 'Type 1 and advanced Type 2 Diabetes Mellitus.',
    controlledSubstance: false
  },
  {
    id: 'FORM-009',
    medicineName: 'Morphine Sulfate',
    genericName: 'Morphine',
    therapeuticClass: 'Opioid Analgesic',
    strength: '10mg/ml',
    dosageForm: 'Ampoule Injection',
    route: 'IV / SC',
    status: 'RESTRICTED',
    pregnancyCategory: 'Category C',
    indications: 'Severe acute post-operative pain, palliative pain management. Strict controlled substance vault log required.',
    controlledSubstance: true
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-0901',
    patientId: 'PAT-001201',
    patientName: 'Abebe Kebede',
    patientPhone: '+251 91 199 8877',
    issueDate: '2026-08-20',
    dueDate: '2026-08-20',
    items: [
      {
        id: 'INV-ITM-1',
        serviceCategory: 'CONSULTATION',
        description: 'Specialist Physician Consultation (Dr. Hana Tesfaye)',
        unitPrice: 600.00,
        quantity: 1,
        total: 600.00
      },
      {
        id: 'INV-ITM-2',
        serviceCategory: 'LABORATORY',
        description: 'Complete Blood Count & Comprehensive Metabolic Panel',
        unitPrice: 1250.00,
        quantity: 1,
        total: 1250.00
      },
      {
        id: 'INV-ITM-3',
        serviceCategory: 'PHARMACY',
        description: 'Dispensed Rx (Metformin 850mg x 60, Enalapril 10mg x 30)',
        unitPrice: 1005.00,
        quantity: 1,
        total: 1005.00
      }
    ],
    subtotal: 2855.00,
    discount: 0,
    tax: 0, // Healthcare exempt in statutory code
    totalAmount: 2855.00,
    paidAmount: 2855.00,
    balanceDue: 0.00,
    paymentStatus: 'PAID',
    paymentMethod: 'TELEBIRR',
    referenceNumber: 'TEL-TXN-9018442',
    recordedBy: 'Ato Samuel Bekele',
    receiptNumber: 'REC-2026-7781',
    department: 'Outpatient Internal Medicine'
  },
  {
    id: 'INV-2026-0902',
    patientId: 'PAT-001203',
    patientName: 'Samuel Bekele',
    patientPhone: '+251 91 445 6677',
    issueDate: '2026-09-04',
    dueDate: '2026-09-10',
    items: [
      {
        id: 'INV-ITM-4',
        serviceCategory: 'ADMISSION',
        description: 'Inpatient Medical Ward A (Room 102) Bed Charge - 2 Days',
        unitPrice: 1500.00,
        quantity: 2,
        total: 3000.00
      },
      {
        id: 'INV-ITM-5',
        serviceCategory: 'NURSING',
        description: 'Daily Nursing & Vital Monitoring Services',
        unitPrice: 400.00,
        quantity: 2,
        total: 800.00
      },
      {
        id: 'INV-ITM-6',
        serviceCategory: 'PROCEDURE',
        description: '12-Lead Electrocardiogram (ECG) with Cardiologist Interpretation',
        unitPrice: 850.00,
        quantity: 1,
        total: 850.00
      }
    ],
    subtotal: 4650.00,
    discount: 465.00, // 10% senior citizen rebate
    tax: 0,
    totalAmount: 4185.00,
    paidAmount: 2000.00,
    balanceDue: 2185.00,
    paymentStatus: 'PARTIAL',
    paymentMethod: 'CBE_BIRR',
    referenceNumber: 'CBE-TRANS-55102',
    recordedBy: 'Ato Samuel Bekele',
    receiptNumber: 'REC-2026-7814',
    department: 'Inpatient Medical Ward'
  },
  {
    id: 'INV-2026-0903',
    patientId: 'PAT-001204',
    patientName: 'Marta Woldie',
    patientPhone: '+251 94 556 7788',
    issueDate: '2026-09-05',
    dueDate: '2026-09-08',
    items: [
      {
        id: 'INV-ITM-7',
        serviceCategory: 'CONSULTATION',
        description: 'Outpatient Clinical Consultation (Internal Medicine)',
        unitPrice: 500.00,
        quantity: 1,
        total: 500.00
      },
      {
        id: 'INV-ITM-8',
        serviceCategory: 'LABORATORY',
        description: 'Malaria Rapid Test & Blood Film',
        unitPrice: 350.00,
        quantity: 1,
        total: 350.00
      }
    ],
    subtotal: 850.00,
    discount: 0,
    tax: 0,
    totalAmount: 850.00,
    paidAmount: 0.00,
    balanceDue: 850.00,
    paymentStatus: 'UNPAID',
    department: 'Clinical Diagnostic Lab'
  },
  {
    id: 'INV-2026-0904',
    patientId: 'PAT-001202',
    patientName: 'Hana Tesfaye',
    patientPhone: '+251 92 334 5566',
    issueDate: '2026-08-30',
    dueDate: '2026-09-06',
    items: [
      {
        id: 'INV-ITM-9',
        serviceCategory: 'PROCEDURE',
        description: 'Cardiac Echocardiography with Color Doppler Analysis',
        unitPrice: 1450.00,
        quantity: 1,
        total: 1450.00
      },
      {
        id: 'INV-ITM-10',
        serviceCategory: 'CONSULTATION',
        description: 'Specialist Cardiology Follow-up Consultation',
        unitPrice: 500.00,
        quantity: 1,
        total: 500.00
      }
    ],
    subtotal: 1950.00,
    discount: 0,
    tax: 0,
    totalAmount: 1950.00,
    paidAmount: 0.00,
    balanceDue: 1950.00,
    paymentStatus: 'UNPAID',
    department: 'Cardiology'
  },
  {
    id: 'INV-2026-0881',
    patientId: 'PAT-001205',
    patientName: 'Dawit Girma',
    patientPhone: '+251 91 223 3445',
    issueDate: '2026-07-28',
    dueDate: '2026-08-10',
    items: [
      {
        id: 'INV-ITM-11',
        serviceCategory: 'PROCEDURE',
        description: 'Minor General Surgical Excising & Suturing',
        unitPrice: 4200.00,
        quantity: 1,
        total: 4200.00
      },
      {
        id: 'INV-ITM-12',
        serviceCategory: 'PHARMACY',
        description: 'Post-Op Antibiotics & Wound Dressing Pack',
        unitPrice: 2200.00,
        quantity: 1,
        total: 2200.00
      }
    ],
    subtotal: 6400.00,
    discount: 0,
    tax: 0,
    totalAmount: 6400.00,
    paidAmount: 2500.00,
    balanceDue: 3900.00,
    paymentStatus: 'PARTIAL',
    paymentMethod: 'CASH',
    referenceNumber: 'POS-CSH-40192',
    recordedBy: 'Ato Samuel Bekele',
    receiptNumber: 'REC-2026-7640',
    department: 'General Surgery'
  },
  {
    id: 'INV-2026-0842',
    patientId: 'PAT-001206',
    patientName: 'Tigist Mengistu',
    patientPhone: '+251 93 445 5667',
    issueDate: '2026-06-25',
    dueDate: '2026-07-05',
    items: [
      {
        id: 'INV-ITM-13',
        serviceCategory: 'ADMISSION',
        description: 'Emergency ICU High-Dependency Bed (3 Days)',
        unitPrice: 2400.00,
        quantity: 3,
        total: 7200.00
      },
      {
        id: 'INV-ITM-14',
        serviceCategory: 'PROCEDURE',
        description: 'Emergency Airway Intubation & Mechanical Ventilation',
        unitPrice: 2000.00,
        quantity: 1,
        total: 2000.00
      }
    ],
    subtotal: 9200.00,
    discount: 0,
    tax: 0,
    totalAmount: 9200.00,
    paidAmount: 3000.00,
    balanceDue: 6200.00,
    paymentStatus: 'PARTIAL',
    paymentMethod: 'BANK_TRANSFER',
    referenceNumber: 'BNK-AWASH-99120',
    recordedBy: 'Ato Samuel Bekele',
    receiptNumber: 'REC-2026-7512',
    department: 'Emergency & Resuscitation'
  },
  {
    id: 'INV-2026-0790',
    patientId: 'PAT-001207',
    patientName: 'Berhanu Wolde',
    patientPhone: '+251 91 112 2334',
    issueDate: '2026-05-18',
    dueDate: '2026-05-28',
    items: [
      {
        id: 'INV-ITM-15',
        serviceCategory: 'ADMISSION',
        description: 'Orthopedic Post-Operative Inpatient Stay (2 Days)',
        unitPrice: 1500.00,
        quantity: 2,
        total: 3000.00
      },
      {
        id: 'INV-ITM-16',
        serviceCategory: 'PROCEDURE',
        description: 'Closed Fracture Reduction & Plaster Cast Application',
        unitPrice: 2500.00,
        quantity: 1,
        total: 2500.00
      }
    ],
    subtotal: 5500.00,
    discount: 0,
    tax: 0,
    totalAmount: 5500.00,
    paidAmount: 0.00,
    balanceDue: 5500.00,
    paymentStatus: 'UNPAID',
    department: 'Orthopedics'
  },
  {
    id: 'INV-2026-0775',
    patientId: 'PAT-001208',
    patientName: 'Aster Gebre',
    patientPhone: '+251 92 667 7889',
    issueDate: '2026-05-02',
    dueDate: '2026-05-02',
    items: [
      {
        id: 'INV-ITM-17',
        serviceCategory: 'PHARMACY',
        description: 'Prescription Dispense (Chronic Antihypertensives & Statins)',
        unitPrice: 1450.00,
        quantity: 1,
        total: 1450.00
      }
    ],
    subtotal: 1450.00,
    discount: 0,
    tax: 0,
    totalAmount: 1450.00,
    paidAmount: 1450.00,
    balanceDue: 0.00,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    referenceNumber: 'POS-CSH-39180',
    recordedBy: 'Ato Samuel Bekele',
    receiptNumber: 'REC-2026-7489',
    department: 'Central Pharmacy'
  }
];

export const INITIAL_PAYMENT_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'TXN-2026-0814',
    invoiceId: 'INV-2026-0901',
    patientId: 'PAT-001201',
    patientName: 'Abebe Kebede',
    amount: 2855.00,
    method: 'TELEBIRR',
    referenceNumber: 'TEL-TXN-9018442',
    cashierName: 'Ato Samuel Bekele',
    timestamp: '2026-09-08 10:15',
    status: 'SETTLED',
    receiptNumber: 'REC-2026-7781',
    notes: 'Outpatient consultation and antibiotic dispensing cleared via Telebirr USSD'
  },
  {
    id: 'TXN-2026-0813',
    invoiceId: 'INV-2026-0902',
    patientId: 'PAT-001203',
    patientName: 'Samuel Bekele',
    amount: 2000.00,
    method: 'CBE_BIRR',
    referenceNumber: 'CBE-TRANS-55102',
    cashierName: 'Ato Samuel Bekele',
    timestamp: '2026-09-07 14:40',
    status: 'VERIFIED',
    receiptNumber: 'REC-2026-7814',
    notes: 'Partial payment on Inpatient Ward A deposit'
  },
  {
    id: 'TXN-2026-0812',
    invoiceId: 'INV-2026-0881',
    patientId: 'PAT-001205',
    patientName: 'Dawit Girma',
    amount: 2500.00,
    method: 'CASH',
    referenceNumber: 'POS-CSH-40192',
    cashierName: 'Ato Samuel Bekele',
    timestamp: '2026-09-06 11:20',
    status: 'SETTLED',
    receiptNumber: 'REC-2026-7640',
    notes: 'Cashier till direct cash tender verified'
  },
  {
    id: 'TXN-2026-0811',
    invoiceId: 'INV-2026-0842',
    patientId: 'PAT-001206',
    patientName: 'Tigist Mengistu',
    amount: 3000.00,
    method: 'BANK_TRANSFER',
    referenceNumber: 'BNK-AWASH-99120',
    cashierName: 'Ato Samuel Bekele',
    timestamp: '2026-09-05 16:05',
    status: 'SETTLED',
    receiptNumber: 'REC-2026-7512',
    notes: 'Awash Bank direct transfer verified against statement'
  },
  {
    id: 'TXN-2026-0810',
    invoiceId: 'INV-2026-0775',
    patientId: 'PAT-001208',
    patientName: 'Aster Gebre',
    amount: 1450.00,
    method: 'CASH',
    referenceNumber: 'POS-CSH-39180',
    cashierName: 'Ato Samuel Bekele',
    timestamp: '2026-09-04 09:30',
    status: 'SETTLED',
    receiptNumber: 'REC-2026-7489',
    notes: 'Central Pharmacy chronic prescriptions cash checkout'
  }
];

export const INITIAL_WARDS: Ward[] = [
  {
    id: 'WRD-ICU',
    name: 'Intensive Care Unit (ICU)',
    type: 'ICU',
    totalBeds: 8,
    occupiedBeds: 6,
    headNurse: 'Sr. Rahel Desta, BSc'
  },
  {
    id: 'WRD-MED',
    name: 'Medical Ward A',
    type: 'INTERNAL_MEDICINE',
    totalBeds: 24,
    occupiedBeds: 19,
    headNurse: 'Sr. Tigist Mengistu, BSc'
  },
  {
    id: 'WRD-SURG',
    name: 'Surgical Ward B',
    type: 'GENERAL_SURGERY',
    totalBeds: 20,
    occupiedBeds: 14,
    headNurse: 'Sr. Aster Kassa'
  },
  {
    id: 'WRD-PED',
    name: 'Pediatric Ward',
    type: 'PEDIATRICS',
    totalBeds: 16,
    occupiedBeds: 10,
    headNurse: 'Sr. Meseret Hailu'
  }
];

export const INITIAL_BEDS: Bed[] = [
  {
    id: 'BED-101A',
    wardId: 'WRD-MED',
    wardName: 'Medical Ward A',
    roomNumber: 'Room 204',
    bedCode: 'Bed 204-B',
    status: 'AVAILABLE'
  },
  {
    id: 'BED-101B',
    wardId: 'WRD-MED',
    wardName: 'Medical Ward A',
    roomNumber: 'Room 204',
    bedCode: 'Bed 204-A',
    status: 'OCCUPIED',
    currentPatientId: 'PAT-001202',
    currentPatientName: 'Hana Tesfaye',
    admissionDate: '2026-09-03',
    attendingDoctor: 'Dr. Hana Tesfaye, MD'
  },
  {
    id: 'BED-102A',
    wardId: 'WRD-MED',
    wardName: 'Medical Ward A',
    roomNumber: 'Room 205',
    bedCode: 'Bed 205-B',
    status: 'OCCUPIED',
    currentPatientId: 'PAT-001203',
    currentPatientName: 'Samuel Bekele',
    admissionDate: '2026-09-04',
    attendingDoctor: 'Dr. Hana Tesfaye, MD'
  },
  {
    id: 'BED-102B',
    wardId: 'WRD-MED',
    wardName: 'Medical Ward A',
    roomNumber: 'Room 205',
    bedCode: 'Bed 205-A',
    status: 'AVAILABLE'
  },
  {
    id: 'BED-103A',
    wardId: 'WRD-MED',
    wardName: 'Medical Ward A',
    roomNumber: 'Room 206',
    bedCode: 'Bed 206-A',
    status: 'CLEANING'
  },
  {
    id: 'BED-ICU-01',
    wardId: 'WRD-ICU',
    wardName: 'ICU',
    roomNumber: 'Room ICU-02',
    bedCode: 'Bed ICU-02-A',
    status: 'OCCUPIED',
    currentPatientId: 'PAT-001205',
    currentPatientName: 'Dawit Girma',
    admissionDate: '2026-09-02',
    attendingDoctor: 'Dr. Dawit Mengistu, MD'
  },
  {
    id: 'BED-ICU-02',
    wardId: 'WRD-ICU',
    wardName: 'ICU',
    roomNumber: 'Room ICU-03',
    bedCode: 'Bed ICU-03-A',
    status: 'OCCUPIED',
    currentPatientId: 'PAT-001206',
    currentPatientName: 'Almaz Tadesse',
    admissionDate: '2026-09-04',
    attendingDoctor: 'Dr. Hana Tesfaye, MD'
  },
  {
    id: 'BED-ICU-03',
    wardId: 'WRD-ICU',
    wardName: 'ICU',
    roomNumber: 'Room ICU-01',
    bedCode: 'Bed ICU-01-A',
    status: 'AVAILABLE'
  }
];

export const INITIAL_EMERGENCY_CASES: EmergencyCase[] = [
  {
    id: 'ER-9101',
    patientName: 'Tariku Kebede',
    patientId: 'PAT-001208',
    age: 38,
    gender: 'MALE',
    arrivalTime: '07:45',
    arrivalTimestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    arrivalMethod: 'Ambulance',
    chiefComplaint: 'Severe road traffic injury, compound right tibia fracture with active bleeding',
    triageLevel: 'CRITICAL',
    priority: 'CRITICAL',
    gcsScore: 13,
    vitalSigns: {
      bloodPressureSystolic: 90,
      bloodPressureDiastolic: 60,
      pulseRate: 122,
      oxygenSaturation: 94,
      temperature: 36.4,
      respiratoryRate: 24,
      painLevel: 9,
      consciousnessLevel: 'Alert to Voice'
    },
    vitals: {
      bp: '90/60 mmHg',
      pulse: 122,
      spo2: 94,
      temp: 36.4
    },
    assignedDoctor: 'Dr. Biruk Assefa, MD',
    status: 'RESUSCITATION',
    bedAssigned: 'ER Resus Bay 1'
  },
  {
    id: 'ER-9102',
    patientName: 'Helen Gebre',
    patientId: 'PAT-001209',
    age: 29,
    gender: 'FEMALE',
    arrivalTime: '08:15',
    arrivalTimestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    arrivalMethod: 'Wheelchair',
    chiefComplaint: 'Acute sudden-onset right lower quadrant abdominal pain with rebound tenderness',
    triageLevel: 'URGENT',
    priority: 'URGENT',
    gcsScore: 15,
    vitalSigns: {
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 75,
      pulseRate: 94,
      oxygenSaturation: 98,
      temperature: 38.6,
      respiratoryRate: 20,
      painLevel: 7,
      consciousnessLevel: 'Alert'
    },
    vitals: {
      bp: '118/75 mmHg',
      pulse: 94,
      spo2: 98,
      temp: 38.6
    },
    assignedDoctor: 'Dr. Hana Tesfaye, MD',
    status: 'OBSERVATION',
    bedAssigned: 'ER Bed 04'
  },
  {
    id: 'ER-9103',
    patientName: 'Kenenisa Bekele',
    patientId: 'PAT-001210',
    age: 52,
    gender: 'MALE',
    arrivalTime: '08:40',
    arrivalTimestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    arrivalMethod: 'Walk-in',
    chiefComplaint: 'Mild laceration on left forearm while handling machinery, bleeding controlled',
    triageLevel: 'NORMAL',
    priority: 'LESS_URGENT',
    gcsScore: 15,
    vitalSigns: {
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      pulseRate: 78,
      oxygenSaturation: 98,
      temperature: 36.7,
      respiratoryRate: 16,
      painLevel: 2,
      consciousnessLevel: 'Alert'
    },
    vitals: {
      bp: '120/80 mmHg',
      pulse: 78,
      spo2: 98,
      temp: 36.7
    },
    assignedDoctor: 'Dr. Hana Tesfaye, MD',
    status: 'WAITING_FOR_TRIAGE',
    bedAssigned: 'Minor Procedure Room'
  },
  {
    id: 'ER-9104',
    patientName: 'Abebech Demisse',
    patientId: 'PAT-001211',
    age: 64,
    gender: 'FEMALE',
    arrivalTime: '08:20',
    arrivalTimestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    arrivalMethod: 'Wheelchair',
    chiefComplaint: 'Sudden shortness of breath, bilateral lower limb edema, suspected acute heart failure exacerbation',
    triageLevel: 'CRITICAL',
    priority: 'CRITICAL',
    gcsScore: 15,
    vitalSigns: {
      bloodPressureSystolic: 160,
      bloodPressureDiastolic: 95,
      pulseRate: 104,
      oxygenSaturation: 91,
      temperature: 36.8,
      respiratoryRate: 26,
      painLevel: 4,
      consciousnessLevel: 'Alert'
    },
    vitals: {
      bp: '160/95 mmHg',
      pulse: 104,
      spo2: 91,
      temp: 36.8
    },
    triageNotes: 'Patient placed on 4L/min O2 via nasal cannula. Bilateral basal crackles noted. Immediate physician evaluation requested.',
    clinicalObservations: 'Severe orthopnea, tachypnea, mild peripheral cyanosis.',
    immediateConcerns: 'Acute decompensated heart failure / respiratory compromise.',
    triagedBy: 'Sr. Tigist Mengistu, BSc',
    triageCompletedAt: '08:26',
    assignedDoctor: 'Dr. Biruk Assefa, MD',
    status: 'WAITING_FOR_DOCTOR',
    bedAssigned: 'Acute Bay 02'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NTF-01',
    title: 'Critical Lab Alert',
    message: 'STAT Potassium & Electrolytes requested for Almaz Tadesse (ICU-02).',
    type: 'CRITICAL_LAB' as any,
    severity: 'CRITICAL',
    timestamp: '10 mins ago',
    read: false,
    linkTo: '/laboratory/requests'
  },
  {
    id: 'NTF-02',
    title: 'Low Medicine Inventory',
    message: 'Amoxicillin/Clavulanic 625mg has fallen below reorder point (180 tablets left).',
    type: 'LOW_STOCK',
    severity: 'WARNING',
    timestamp: '25 mins ago',
    read: false,
    linkTo: '/pharmacy/inventory'
  },
  {
    id: 'NTF-03',
    title: 'Emergency Arrival (Red Triage)',
    message: 'Trauma patient Tariku Kebede admitted to ER Resuscitation Bay 1.',
    type: 'EMERGENCY',
    severity: 'CRITICAL',
    timestamp: '45 mins ago',
    read: true,
    linkTo: '/emergency/dashboard'
  },
  {
    id: 'NTF-04',
    title: 'Appointment Waiting',
    message: 'Abebe Kebede (PAT-001201) has checked in at reception for Dr. Hana.',
    type: 'APPOINTMENT',
    severity: 'INFO',
    timestamp: '1 hour ago',
    read: true,
    linkTo: '/doctor/dashboard'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-9901',
    userName: 'Dr. Hana Tesfaye, MD',
    userRole: 'DOCTOR',
    action: 'Clinical Consultation Finalized',
    module: 'EMR / Consultations',
    targetId: 'PAT-001201 (Abebe Kebede)',
    timestamp: '2026-09-05 08:52',
    ipAddress: '192.168.10.45',
    device: 'Clinic Terminal 204 (Dell OptiPlex)',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-9902',
    userName: 'Ato Samuel Bekele',
    userRole: 'ACCOUNTANT',
    action: 'Payment Receipt Issued (Telebirr)',
    module: 'Billing & Cashier',
    targetId: 'INV-2026-0901',
    timestamp: '2026-09-05 08:35',
    ipAddress: '192.168.10.12',
    device: 'Finance Workstation 02',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-9903',
    userName: 'W/ro Marta Alemu',
    userRole: 'RECEPTIONIST',
    action: 'New Patient Registered',
    module: 'Patient Registry',
    targetId: 'PAT-001206 (Almaz Tadesse)',
    timestamp: '2026-09-05 08:10',
    ipAddress: '192.168.10.05',
    device: 'Front Desk Counter 1',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-9904',
    userName: 'Pharm. Almaz Tadesse',
    userRole: 'PHARMACIST',
    action: 'Rx Dispensation Completed',
    module: 'Pharmacy Dispensing',
    targetId: 'RX-4401',
    timestamp: '2026-09-05 07:50',
    ipAddress: '192.168.10.33',
    device: 'Pharmacy POS Terminal',
    status: 'SUCCESS'
  }
];

export const INITIAL_ROLE_PERMISSIONS: RolePermission[] = [
  { module: 'Patients Registry', canView: true, canCreate: true, canEdit: true, canDelete: false },
  { module: 'Clinical Consultations & EMR', canView: true, canCreate: true, canEdit: true, canDelete: false },
  { module: 'Appointments & Scheduling', canView: true, canCreate: true, canEdit: true, canDelete: true },
  { module: 'Laboratory Diagnostics', canView: true, canCreate: true, canEdit: true, canDelete: false },
  { module: 'Pharmacy & Drug Inventory', canView: true, canCreate: true, canEdit: true, canDelete: false },
  { module: 'Inpatient & Bed Management', canView: true, canCreate: true, canEdit: true, canDelete: false },
  { module: 'Emergency & Triage Unit', canView: true, canCreate: true, canEdit: true, canDelete: false },
  { module: 'Billing, Invoices & Cashier', canView: true, canCreate: true, canEdit: true, canDelete: false },
  { module: 'User Accounts & Roles', canView: true, canCreate: true, canEdit: true, canDelete: true },
  { module: 'Audit Logs & System Reports', canView: true, canCreate: false, canEdit: false, canDelete: false }
];

export const mockStaffUsers: User[] = INITIAL_USERS;

