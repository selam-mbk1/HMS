import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Building2, 
  Calendar as CalendarIcon, 
  UserCircle, 
  LogOut, 
  ShieldAlert, 
  Clock,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types';
import { GlobalSearchModal } from './GlobalSearchModal';
import { useNavigate } from 'react-router-dom';

const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', badgeColor: 'bg-slate-900 text-white' },
  HOSPITAL_ADMIN: { label: 'Hospital Admin', badgeColor: 'bg-[#1E3A8A] text-white' },
  DOCTOR: { label: 'Physician / Doctor', badgeColor: 'bg-blue-50 text-[#2563EB] border border-blue-200' },
  NURSE: { label: 'Staff Nurse', badgeColor: 'bg-teal-50 text-[#0D9488] border border-teal-200' },
  RECEPTIONIST: { label: 'Reception / Front Desk', badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
  LAB_TECHNICIAN: { label: 'Laboratory Tech', badgeColor: 'bg-amber-50 text-[#F59E0B] border border-amber-200' },
  PHARMACIST: { label: 'Clinical Pharmacist', badgeColor: 'bg-cyan-50 text-[#0891B2] border border-cyan-200' },
  ACCOUNTANT: { label: 'Billing / Finance', badgeColor: 'bg-emerald-50 text-[#16A34A] border border-emerald-200' },
};

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { currentUser, currentRole, logout } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useHospital();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const searchPlaceholder = currentRole === 'DOCTOR'
    ? 'Search patient by name, Patient ID, or diagnosis...'
    : currentRole === 'NURSE' 
    ? 'Search patient by name, Patient ID, or bed...'
    : currentRole === 'RECEPTIONIST'
    ? 'Search patient by name, Patient ID, or phone...'
    : currentRole === 'PHARMACIST'
    ? 'Search patients, prescriptions, medicines, or stock...'
    : 'Search patients, records, lab orders, prescriptions...';

  const formattedToday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  // Handle outside clicks to close popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global hotkey Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between shadow-xs transition-all duration-200">
        {/* Left: Mobile Hamburger, Brand & Search bar trigger */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl min-w-0">
          {/* Slide-out Hamburger Button for Mobile Devices */}
          <button
            type="button"
            id="mobile-nav-hamburger-btn"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 -ml-1 text-slate-600 hover:text-blue-600 hover:bg-slate-100/90 active:scale-95 rounded-xl transition-all shrink-0 cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-200"
            aria-label="Open navigation menu"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Hospital Branding icon on mobile */}
          <div className="flex md:hidden items-center shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shadow-blue-500/25">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current stroke-[2.5]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2.5 text-xs text-slate-600 font-medium pr-4 border-r border-slate-200/80 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-slate-900 tracking-tight block">Bethel St. Paul</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold font-mono tracking-tight uppercase">Main Campus</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => setShowSearchModal(true)}
            className="flex-1 flex items-center gap-2.5 px-3.5 py-2 bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-blue-400 focus:border-blue-500 rounded-xl cursor-pointer text-slate-500 text-xs transition-all duration-200 shadow-2xs hover:shadow-xs group min-w-0"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
            <span className="text-slate-400 group-hover:text-slate-600 truncate transition-colors">
              {searchPlaceholder}
            </span>
            <kbd className="hidden sm:inline-flex ml-auto items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white group-hover:bg-slate-50 border border-slate-200/90 rounded-md shadow-2xs font-mono shrink-0 transition-colors">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Date, Notification center, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Fast-Access Button - Strictly restricted to Receptionist Portal */}
          {currentRole === 'RECEPTIONIST' && (
            <button
              onClick={() => navigate('/emergency/register')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
              title="Emergency Department & Rapid Triage Registration"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <span className="hidden sm:inline">Emergency Register</span>
              <span className="sm:hidden">ER Fast</span>
            </button>
          )}

          {/* Current Date Display */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 font-medium px-3 py-1.5 bg-slate-50/80 hover:bg-slate-100/70 rounded-xl border border-slate-200/80 shadow-2xs transition-colors">
            <CalendarIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-700 tracking-tight">{formattedToday}</span>
          </div>

          {/* Notifications Center */}
          <div className="relative" ref={notifDropdownRef}>
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100/90 active:scale-95 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200/60"
              title="Hospital Alerts & Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Hospital Alerts</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60 font-mono">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No notifications at this time
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.linkTo) {
                            setShowNotifDropdown(false);
                            navigate(n.linkTo);
                          }
                        }}
                        className={`p-3.5 text-xs hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${
                          !n.read ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div
                          className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                            n.severity === 'CRITICAL'
                              ? 'bg-rose-500 ring-2 ring-rose-200'
                              : n.severity === 'WARNING'
                              ? 'bg-amber-500 ring-2 ring-amber-200'
                              : 'bg-blue-500 ring-2 ring-blue-200'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 truncate">{n.title}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0 font-mono">
                              <Clock className="w-3 h-3" /> {n.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 leading-relaxed line-clamp-2">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative pl-1 sm:pl-2 border-l border-slate-200/80" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-xl hover:bg-slate-100/90 border border-transparent hover:border-slate-200/70 transition-all duration-150 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-slate-800/10 group-hover:ring-blue-500/50 transition-all">
                  {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500/20" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px] group-hover:text-blue-600 transition-colors">
                  {currentUser.name}
                </p>
                <p className="text-[10px] font-medium text-slate-500 truncate max-w-[140px]">
                  {currentUser.department}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 group-hover:translate-y-0.5" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-700">
                      ID: {currentUser.id}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${ROLE_LABELS[currentRole]?.badgeColor}`}>
                      {ROLE_LABELS[currentRole]?.label}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/settings/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <UserCircle className="w-4 h-4 text-slate-400" />
                    <span>My Clinical Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </>
  );
};
