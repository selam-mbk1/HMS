import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Activity, 
  Users, 
  Calendar, 
  FileText, 
  Stethoscope, 
  HeartPulse, 
  FlaskConical, 
  Pill, 
  Receipt, 
  Bed, 
  AlertOctagon, 
  Ambulance,
  ShieldCheck, 
  FileBarChart, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  UserCheck, 
  Layers, 
  Settings, 
  History,
  ClipboardList,
  PackageCheck,
  BookOpen,
  Building2,
  Clock,
  UserPlus,
  CreditCard,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItemConfig {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { currentRole, currentUser, logout } = useAuth();
  const { appointments, emergencyCases, labRequests, medicines, prescriptions } = useHospital();
  const navigate = useNavigate();

  // Badge calculations for live counters
  const waitingAppointmentsCount = appointments.filter(a => a.status === 'WAITING').length;
  const criticalEmergencyCount = emergencyCases.filter(e => e.triageLevel === 'CRITICAL' || e.triageLevel === 'URGENT').length;
  const pendingLabsCount = labRequests.filter(l => l.status === 'PENDING' || l.status === 'IN_PROGRESS').length;
  const lowStockCount = medicines.filter(m => m.status === 'LOW_STOCK' || m.status === 'OUT_OF_STOCK').length;
  const pendingRxCount = prescriptions.filter(p => p.status === 'PENDING').length;

  const getNavItemsForRole = (role: UserRole): NavItemConfig[] => {
    switch (role) {
      case 'SUPER_ADMIN':
        return [
          { name: 'Executive Dashboard', path: '/admin/dashboard', icon: Activity },
          { name: 'User Management', path: '/admin/users', icon: Users },
          { name: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
          { name: 'Audit & Access Logs', path: '/admin/audit-logs', icon: History },
          { name: 'Hospital Performance', path: '/admin/reports', icon: FileBarChart },
          { name: 'System Settings', path: '/settings/system', icon: Settings },
        ];

      case 'HOSPITAL_ADMIN':
        return [
          { name: 'Command Dashboard', path: '/hospital/dashboard', icon: Activity },
          { name: 'Patients Registry', path: '/patients', icon: Users },
          { name: 'Appointments', path: '/reception/appointments', icon: Calendar, badge: waitingAppointmentsCount, badgeColor: 'bg-amber-100 text-amber-800' },
          { name: 'Wards & Beds', path: '/inpatient/beds', icon: Bed },
          { name: 'Emergency Center', path: '/emergency/dashboard', icon: AlertOctagon, badge: criticalEmergencyCount, badgeColor: 'bg-rose-100 text-rose-800' },
          { name: 'Laboratory Orders', path: '/laboratory/requests', icon: FlaskConical, badge: pendingLabsCount },
          { name: 'Pharmacy Inventory', path: '/pharmacy/inventory', icon: Pill, badge: lowStockCount, badgeColor: 'bg-amber-100 text-amber-800' },
          { name: 'Billing & Invoices', path: '/accounting/invoices', icon: Receipt },
          { name: 'Hospital Reports', path: '/admin/reports', icon: FileBarChart },
        ];

      case 'DOCTOR':
        return [
          { name: 'Dashboard', path: '/doctor/dashboard', icon: Activity },
          { name: 'My Schedule', path: '/doctor/schedule', icon: Calendar, badge: waitingAppointmentsCount, badgeColor: 'bg-blue-100 text-blue-800' },
          { name: 'Waiting Room', path: '/doctor/waiting-room', icon: UserCheck, badge: waitingAppointmentsCount, badgeColor: 'bg-amber-100 text-amber-800' },
          { name: 'Active Patients', path: '/patients', icon: Users },
          { name: 'Consultations', path: '/doctor/consultation/PAT-001201', icon: Stethoscope },
          { name: 'Diagnostic Results', path: '/laboratory/results', icon: FlaskConical, badge: pendingLabsCount },
          { name: 'Prescriptions', path: '/pharmacy/prescriptions', icon: Pill },
          { name: 'Emergency Cases', path: '/emergency/dashboard', icon: AlertOctagon, badge: criticalEmergencyCount, badgeColor: 'bg-rose-100 text-rose-800' },
        ];

      case 'NURSE':
        return [
          { name: 'Nursing Station', path: '/nurse/dashboard', icon: Activity },
          { name: 'Ward Patients', path: '/patients', icon: Users },
          { name: 'Vitals Recorder', path: '/nurse/vitals', icon: HeartPulse },
          { name: 'Bed Overview', path: '/inpatient/beds', icon: Bed },
          { name: 'Doctor Orders & Care', path: '/nurse/care-plans', icon: ClipboardList },
          { name: 'Emergency Triage', path: '/emergency/dashboard', icon: AlertOctagon, badge: criticalEmergencyCount, badgeColor: 'bg-rose-100 text-rose-800' },
        ];

      case 'RECEPTIONIST':
        return [
          { name: 'Dashboard', path: '/reception/dashboard', icon: Activity },
          { name: 'Patient Registration', path: '/reception/patient-registration', icon: UserPlus },
          { name: 'Patient Directory', path: '/patients', icon: Users },
          { name: 'Appointments', path: '/reception/appointments', icon: Calendar, badge: waitingAppointmentsCount, badgeColor: 'bg-amber-100 text-amber-800' },
          { name: "Today's Queue", path: '/reception/queue', icon: Clock, badge: waitingAppointmentsCount, badgeColor: 'bg-blue-100 text-blue-800' },
          { name: 'Emergency Registration', path: '/emergency/register', icon: AlertOctagon, badge: 'STAT', badgeColor: 'bg-rose-100 text-rose-800' },
          { name: 'Bed Availability', path: '/inpatient/beds', icon: Bed },
        ];

      case 'LAB_TECHNICIAN':
        return [
          { name: 'Laboratory Dashboard', path: '/laboratory/dashboard', icon: Activity },
          { name: 'Pending Lab Requests', path: '/laboratory/requests', icon: FlaskConical, badge: pendingLabsCount, badgeColor: 'bg-amber-100 text-amber-800' },
          { name: 'Test Results Registry', path: '/laboratory/results', icon: FileText },
          { name: 'Quality Controls', path: '/laboratory/quality', icon: Layers },
        ];

      case 'PHARMACIST':
        return [
          { name: 'Pharmacy Overview', path: '/pharmacy/dashboard', icon: Activity },
          { name: 'Prescription Queue', path: '/pharmacy/prescriptions', icon: ClipboardList, badge: pendingRxCount, badgeColor: 'bg-blue-100 text-blue-800' },
          { name: 'Drug Inventory', path: '/pharmacy/inventory', icon: Pill, badge: lowStockCount, badgeColor: 'bg-rose-100 text-rose-800' },
          { name: 'Batch & Expiry', path: '/pharmacy/batches', icon: PackageCheck },
          { name: 'Dispensing History', path: '/pharmacy/dispensing-history', icon: History },
          { name: 'Formulary', path: '/pharmacy/formulary', icon: BookOpen },
        ];

      case 'ACCOUNTANT':
        return [
          { name: 'Finance Dashboard', path: '/accounting/dashboard', icon: Activity },
          { name: 'Invoices & Billing', path: '/accounting/invoices', icon: Receipt },
          { name: 'Payment Transactions', path: '/accounting/transactions', icon: CreditCard },
          { name: 'Accounts Receivable', path: '/accounting/receivables', icon: Clock },
          { name: 'Financial Reports', path: '/accounting/reports', icon: FileBarChart },
          { name: 'Revenue by Department', path: '/accounting/revenue-by-department', icon: Building2 },
          { name: 'Payment Reconciliation', path: '/accounting/reconciliation', icon: ShieldCheck },
        ];

      default:
        return [
          { name: 'Dashboard', path: '/doctor/dashboard', icon: Activity },
          { name: 'Patients', path: '/patients', icon: Users },
        ];
    }
  };

  // Close mobile sidebar on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Lock body scroll on mobile when drawer is open
  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const navItems = getNavItemsForRole(currentRole);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="sidebar-mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Navigation Sidebar / Slide-out Drawer */}
      <aside
        id="app-navigation-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white text-slate-700 transition-transform duration-300 ease-in-out border-r border-slate-200/90 shadow-xl md:shadow-xs w-72 max-w-[85vw] md:max-w-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-white shrink-0">
          <div 
            className="flex items-center gap-3 overflow-hidden cursor-pointer group" 
            onClick={() => {
              onCloseMobile?.();
              navigate('/dashboard');
            }}
            title="Go to Department Dashboard"
          >
            {/* Medical Cross Hospital Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 text-white font-bold transition-all duration-200 group-hover:scale-105 group-hover:shadow-blue-500/40">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current stroke-[2.5]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className={`min-w-0 ${isCollapsed ? 'md:hidden' : 'block'}`}>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight truncate group-hover:text-blue-600 transition-colors">
                BETHEL ST. PAUL
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-teal-600 font-semibold tracking-wider uppercase font-mono">
                  Specialized Hospital
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Close button for mobile drawer */}
            <button
              type="button"
              id="close-mobile-nav-btn"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close navigation menu"
              title="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse toggle button */}
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition interactive-btn cursor-pointer border border-transparent hover:border-slate-200"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Role Banner / Department Header */}
        <div className={`mx-3 my-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs shrink-0 ${isCollapsed ? 'md:hidden' : 'block'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {currentUser.role === 'DOCTOR' || currentUser.role === 'PHARMACIST' ? 'Department' : currentUser.role === 'NURSE' ? 'Nursing Station' : currentUser.role === 'RECEPTIONIST' ? 'Reception Desk' : 'Department'}
            </span>
            {currentUser.role !== 'DOCTOR' && currentUser.role !== 'PHARMACIST' && (
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {currentUser.role === 'NURSE' ? 'Active Station' : currentUser.role === 'RECEPTIONIST' ? 'Active Desk' : 'Active Unit'}
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-900 mt-1 truncate">
            {currentUser.role === 'ACCOUNTANT'
              ? 'Department: Finance & Medical Billing'
              : currentUser.role === 'DOCTOR' 
              ? `Department: ${currentUser.department || 'Internal Medicine'}`
              : currentUser.role === 'PHARMACIST'
              ? (currentUser.department || 'Central Hospital Pharmacy')
              : currentUser.role === 'NURSE' 
              ? (currentUser.department || 'Inpatient Medical Ward') 
              : currentUser.department}
          </p>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => onCloseMobile?.()}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-2xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-blue-600 before:shadow-xs before:shadow-blue-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:translate-x-0.5 border border-transparent'
                  }`
                }
                title={isCollapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconComponent className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 text-slate-400 group-hover:text-blue-600" />
                  <span className={`truncate ${isCollapsed ? 'md:hidden' : 'block'}`}>{item.name}</span>
                </div>

                {item.badge !== undefined && Number(item.badge) > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ml-2 shrink-0 shadow-2xs border border-transparent ${isCollapsed ? 'md:hidden' : 'block'} ${
                      item.badgeColor || 'bg-blue-100 text-blue-700 border-blue-200/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Link to Department Dashboard (Hidden for Nurse, Doctor, and Accountant) */}
        {currentUser.role !== 'NURSE' && currentUser.role !== 'DOCTOR' && currentUser.role !== 'ACCOUNTANT' && (
          <div className="px-3 py-2 border-t border-slate-100 shrink-0">
            <NavLink
              to="/dashboard"
              onClick={() => onCloseMobile?.()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:translate-x-0.5 border border-transparent'
                }`
              }
              title={isCollapsed ? 'Department Dashboard' : undefined}
            >
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span className={`truncate ${isCollapsed ? 'md:hidden' : 'block'}`}>Department Dashboard</span>
            </NavLink>
          </div>
        )}

        {/* Footer / User Session Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
          {/* Expanded session card: shown on mobile, and on desktop when not collapsed */}
          <div className={`flex items-center justify-between bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all ${isCollapsed ? 'md:hidden' : 'flex'}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ring-1 ring-blue-500/20">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>
            <button
              onClick={() => {
                onCloseMobile?.();
                logout();
                navigate('/login');
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Icon-only logout for collapsed desktop mode */}
          {isCollapsed && (
            <div className="hidden md:flex justify-center">
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
