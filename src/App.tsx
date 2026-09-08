import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth & Hospital Welcome / Staff Login
import { LoginPage } from './pages/auth/LoginPage';

// Dashboards & Portals
import { HospitalAdminDashboard } from './pages/hospital/HospitalAdminDashboard';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorConsultationPage } from './pages/doctor/DoctorConsultationPage';
import { PatientListPage } from './pages/patients/PatientListPage';
import { PatientDetailPage } from './pages/patients/PatientDetailPage';
import { AppointmentListPage } from './pages/reception/AppointmentListPage';
import { ReceptionDashboard } from './pages/reception/ReceptionDashboard';
import { BedManagementPage } from './pages/inpatient/BedManagementPage';
import { EmergencyDashboard } from './pages/emergency/EmergencyDashboard';
import { EmergencyRegistrationPage } from './pages/emergency/EmergencyRegistrationPage';
import { NurseDashboard } from './pages/nurse/NurseDashboard';
import { LabDashboard } from './pages/laboratory/LabDashboard';
import { LabRequestsPage } from './pages/laboratory/LabRequestsPage';
import { LabResultsPage } from './pages/laboratory/LabResultsPage';
import { PharmacyDashboard } from './pages/pharmacy/PharmacyDashboard';
import { PrescriptionQueuePage } from './pages/pharmacy/PrescriptionQueuePage';
import { DrugInventoryPage } from './pages/pharmacy/DrugInventoryPage';
import { BatchExpiryPage } from './pages/pharmacy/BatchExpiryPage';
import { DispensingHistoryPage } from './pages/pharmacy/DispensingHistoryPage';
import { FormularyPage } from './pages/pharmacy/FormularyPage';
import { InvoicesPage } from './pages/billing/InvoicesPage';
import { AccountingDashboard } from './pages/billing/AccountingDashboard';
import { PaymentTransactionsPage } from './pages/billing/PaymentTransactionsPage';
import { AccountsReceivablePage } from './pages/billing/AccountsReceivablePage';
import { FinancialReportsPage } from './pages/billing/FinancialReportsPage';
import { RevenueByDepartmentPage } from './pages/billing/RevenueByDepartmentPage';
import { PaymentReconciliationPage } from './pages/billing/PaymentReconciliationPage';
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { ReportsPage } from './pages/admin/ReportsPage';

// Smart redirect based on authenticated staff role
const RoleHomeRedirect: React.FC = () => {
  const { currentRole } = useAuth();

  switch (currentRole) {
    case 'DOCTOR':
      return <Navigate to="/doctor/dashboard" replace />;
    case 'NURSE':
      return <Navigate to="/nurse/dashboard" replace />;
    case 'RECEPTIONIST':
      return <Navigate to="/reception/dashboard" replace />;
    case 'PHARMACIST':
      return <Navigate to="/pharmacy/dashboard" replace />;
    case 'LAB_TECHNICIAN':
      return <Navigate to="/laboratory/dashboard" replace />;
    case 'ACCOUNTANT':
      return <Navigate to="/accounting/dashboard" replace />;
    case 'SUPER_ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'HOSPITAL_ADMIN':
    default:
      return <Navigate to="/hospital/dashboard" replace />;
  }
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <HospitalProvider>
            <Routes>
              {/* Application Opens Directly to the Hospital Login / Welcome Page */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/landing" element={<Navigate to="/login" replace />} />

              {/* Protected Hospital Staff Layout (Authentication Required) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  {/* Smart Redirect to Staff Member's Role Dashboard */}
                  <Route path="/dashboard" element={<RoleHomeRedirect />} />
                  <Route path="/home" element={<RoleHomeRedirect />} />

                  {/* Doctor Clinical Workspace */}
                  <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'HOSPITAL_ADMIN', 'SUPER_ADMIN']} />}>
                    <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                    <Route path="/doctor/schedule" element={<AppointmentListPage />} />
                    <Route path="/doctor/waiting-room" element={<DoctorDashboard />} />
                    <Route path="/doctor/consultation/:patientId" element={<DoctorConsultationPage />} />
                  </Route>

                  {/* Patient Electronic Medical Records (Staff Access Only) */}
                  <Route path="/patients" element={<PatientListPage />} />
                  <Route path="/patients/:patientId" element={<PatientDetailPage />} />

                  {/* Reception & Outpatient Queue */}
                  <Route element={<ProtectedRoute allowedRoles={['RECEPTIONIST', 'HOSPITAL_ADMIN', 'SUPER_ADMIN']} />}>
                    <Route path="/reception" element={<ReceptionDashboard />} />
                    <Route path="/reception/dashboard" element={<ReceptionDashboard />} />
                    <Route path="/reception/appointments" element={<AppointmentListPage />} />
                    <Route path="/appointments" element={<AppointmentListPage />} />
                  </Route>

                  {/* Inpatient Wards & Beds */}
                  <Route path="/inpatient/beds" element={<BedManagementPage />} />

                  {/* Emergency Department & Clinical Triage */}
                  <Route path="/emergency" element={<EmergencyDashboard />} />
                  <Route path="/emergency/dashboard" element={<EmergencyDashboard />} />

                  {/* Emergency Registration - Strictly Restricted to Authorized Reception/Admissions Personnel */}
                  <Route element={<ProtectedRoute allowedRoles={['RECEPTIONIST', 'SUPER_ADMIN']} />}>
                    <Route path="/emergency/register" element={<EmergencyRegistrationPage />} />
                  </Route>

                  {/* Nursing Unit */}
                  <Route element={<ProtectedRoute allowedRoles={['NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN']} />}>
                    <Route path="/nurse/dashboard" element={<NurseDashboard />} />
                    <Route path="/nurse/vitals" element={<NurseDashboard />} />
                    <Route path="/nurse/care-plans" element={<NurseDashboard />} />
                  </Route>

                  {/* Diagnostic Laboratory */}
                  <Route element={<ProtectedRoute allowedRoles={['LAB_TECHNICIAN', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'DOCTOR']} />}>
                    <Route path="/laboratory/dashboard" element={<LabDashboard />} />
                    <Route path="/laboratory/requests" element={<LabRequestsPage />} />
                    <Route path="/laboratory/results" element={<LabResultsPage />} />
                    <Route path="/laboratory/quality" element={<LabResultsPage />} />
                  </Route>

                  {/* Hospital Pharmacy */}
                  <Route element={<ProtectedRoute allowedRoles={['PHARMACIST', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'DOCTOR']} />}>
                    <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
                    <Route path="/pharmacy/prescriptions" element={<PrescriptionQueuePage />} />
                    <Route path="/pharmacy/inventory" element={<DrugInventoryPage />} />
                    <Route path="/pharmacy/batches" element={<BatchExpiryPage />} />
                    <Route path="/pharmacy/dispensing-history" element={<DispensingHistoryPage />} />
                    <Route path="/pharmacy/formulary" element={<FormularyPage />} />
                  </Route>

                  {/* Finance & Medical Billing Suite - 7 Module Direct Routing */}
                  <Route element={<ProtectedRoute allowedRoles={['ACCOUNTANT', 'HOSPITAL_ADMIN', 'SUPER_ADMIN']} />}>
                    <Route path="/accounting/dashboard" element={<AccountingDashboard />} />
                    <Route path="/billing/accounting" element={<AccountingDashboard />} />
                    <Route path="/accounting/invoices" element={<InvoicesPage />} />
                    <Route path="/billing/invoices" element={<InvoicesPage />} />
                    <Route path="/accounting/transactions" element={<PaymentTransactionsPage />} />
                    <Route path="/billing/transactions" element={<PaymentTransactionsPage />} />
                    <Route path="/accounting/payments" element={<PaymentTransactionsPage />} />
                    <Route path="/accounting/receivables" element={<AccountsReceivablePage />} />
                    <Route path="/billing/receivables" element={<AccountsReceivablePage />} />
                    <Route path="/accounting/reports" element={<FinancialReportsPage />} />
                    <Route path="/billing/reports" element={<FinancialReportsPage />} />
                    <Route path="/accounting/revenue-by-department" element={<RevenueByDepartmentPage />} />
                    <Route path="/billing/revenue-by-department" element={<RevenueByDepartmentPage />} />
                    <Route path="/accounting/reconciliation" element={<PaymentReconciliationPage />} />
                    <Route path="/billing/reconciliation" element={<PaymentReconciliationPage />} />
                  </Route>

                  {/* Hospital Command Dashboard */}
                  <Route element={<ProtectedRoute allowedRoles={['HOSPITAL_ADMIN', 'SUPER_ADMIN']} />}>
                    <Route path="/hospital/dashboard" element={<HospitalAdminDashboard />} />
                  </Route>

                  {/* System & Security Admin */}
                  <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                    <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagementPage />} />
                    <Route path="/admin/roles" element={<UserManagementPage />} />
                    <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
                    <Route path="/admin/reports" element={<ReportsPage />} />
                    <Route path="/settings/system" element={<SuperAdminDashboard />} />
                  </Route>

                  {/* User Profile Settings */}
                  <Route path="/settings/profile" element={<UserManagementPage />} />

                  {/* Internal layout fallback */}
                  <Route path="*" element={<RoleHomeRedirect />} />
                </Route>
              </Route>

              {/* Public Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </HospitalProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
