import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import medicalHeroImg from '../../assets/images/medical_hero_banner_1788601991640.jpg';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  FlaskConical,
  AlertCircle,
  CheckCircle2,
  X,
  KeyRound,
  UserCheck
} from 'lucide-react';

const ROLE_ROUTES: Record<UserRole, string> = {
  DOCTOR: '/doctor/dashboard',
  NURSE: '/nurse/dashboard',
  RECEPTIONIST: '/reception/dashboard',
  PHARMACIST: '/pharmacy/dashboard',
  LAB_TECHNICIAN: '/laboratory/dashboard',
  ACCOUNTANT: '/accounting/dashboard',
  HOSPITAL_ADMIN: '/hospital/dashboard',
  SUPER_ADMIN: '/admin/dashboard',
};

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, currentRole, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmailOrId, setResetEmailOrId] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  // Check if redirected due to expired session
  const isSessionExpired = location.state?.sessionExpired || new URLSearchParams(location.search).get('expired') === 'true';

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password.trim()) {
      setError('Invalid username/email or password.');
      return;
    }

    // Explicitly reject any patient account attempts
    if (cleanIdentifier.toLowerCase().includes('patient')) {
      setError('Invalid username/email or password.');
      return;
    }

    setIsLoading(true);

    // Simulate realistic clinical authentication handshake
    setTimeout(() => {
      const user = login(cleanIdentifier, password);

      if (user) {
        setIsLoading(false);
        const destination = (location.state as any)?.from || ROLE_ROUTES[user.role] || '/dashboard';
        navigate(destination, { replace: true });
      } else {
        setIsLoading(false);
        setError('Invalid username/email or password.');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen relative bg-[#071D36] text-white font-sans overflow-x-hidden flex flex-col justify-between selection:bg-cyan-400 selection:text-slate-900">
      {/* 1. Full Screen Background Image with High Brightness & Vivid Visibility */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={medicalHeroImg}
          alt="Bethel St. Paul Hospital Clinical EMR Workspace"
          className="w-full h-full object-cover object-center filter brightness-[1.18] contrast-[1.04] saturate-[1.12]"
          referrerPolicy="no-referrer"
        />

        {/* Luminous, highly transparent clinical overlays allowing maximum background image visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03152B]/45 via-[#06203D]/30 to-[#03152B]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04162B]/55 via-transparent to-[#072445]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_35%,rgba(34,211,238,0.26),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_60%,rgba(96,165,250,0.22),transparent_60%)]" />

        {/* High-Tech Grid Lines Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Luminous Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-400/28 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/28 rounded-full blur-3xl" />
      </div>

      {/* 2. Top Header Navigation Bar */}
      <header className="relative z-20 w-full border-b border-white/20 bg-slate-950/35 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Hospital Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-[#2563EB] to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-300/40">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-white drop-shadow-sm">
                  BETHEL ST. PAUL
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/25 text-cyan-200 border border-cyan-400/40">
                  HIS / EMR v3.4
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium leading-tight">
                Specialized Hospital • Staff Clinical Portal
              </p>
            </div>
          </div>

          {/* Right Status Badges */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-semibold shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Operational • 24/7 EMR Synced</span>
            </div>

            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(ROLE_ROUTES[currentRole] || '/dashboard')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Continue as</span> {currentUser.name.split(' ')[0]}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-slate-200 text-xs font-semibold transition border border-white/20 cursor-pointer"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. Main Split-Screen Layout (Desktop: Left Hero Visuals, Right Bright Login Card) */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT SIDE: HERO VISUAL DESIGN ================= */}
          <div className="lg:col-span-7 xl:col-span-7 text-white space-y-6 lg:pr-4">
            {/* Glowing Intelligence Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-500/20 backdrop-blur-xl border border-cyan-400/50 text-cyan-200 text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span className="tracking-wide">NEXT-GEN CLINICAL INTELLIGENCE & EMR</span>
            </motion.div>

            {/* Hospital Identity & Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3"
            >
              <div className="text-cyan-300 font-bold tracking-widest text-xs sm:text-sm uppercase drop-shadow-sm">
                Bethel St. Paul Specialized Hospital
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08] drop-shadow-2xl">
                Integrated Hospital <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white drop-shadow-[0_8px_32px_rgba(6,182,212,0.55)]">
                  Management System
                </span>
              </h1>
            </motion.div>

            {/* Floating Live Telemetry Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-xs font-semibold shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Vital Telemetry Active • 74 BPM Normal</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-semibold shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>EMR & Analyzer Network Synced</span>
              </div>
            </motion.div>

            {/* Overlaid Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl"
            >
              <div className="p-3.5 rounded-2xl bg-slate-950/50 backdrop-blur-xl border border-white/20 hover:border-cyan-400/50 transition flex items-start gap-3 shadow-lg group">
                <div className="w-9 h-9 rounded-xl bg-cyan-400/25 text-cyan-300 flex items-center justify-center shrink-0 group-hover:bg-cyan-400/35 transition">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Live Telemetry</h4>
                  <p className="text-[11px] text-blue-100/90 leading-tight mt-0.5">Real-time vitals & triage</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/50 backdrop-blur-xl border border-white/20 hover:border-blue-400/50 transition flex items-start gap-3 shadow-lg group">
                <div className="w-9 h-9 rounded-xl bg-blue-400/25 text-blue-300 flex items-center justify-center shrink-0 group-hover:bg-blue-400/35 transition">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Smart Records</h4>
                  <p className="text-[11px] text-blue-100/90 leading-tight mt-0.5">Instant EMR & e-prescribing</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/50 backdrop-blur-xl border border-white/20 hover:border-teal-400/50 transition flex items-start gap-3 shadow-lg group">
                <div className="w-9 h-9 rounded-xl bg-teal-400/25 text-teal-300 flex items-center justify-center shrink-0 group-hover:bg-teal-400/35 transition">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Lab & Pharmacy</h4>
                  <p className="text-[11px] text-blue-100/90 leading-tight mt-0.5">Automated stock & test sync</p>
                </div>
              </div>
            </motion.div>

            {/* Accreditation Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-blue-100"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/50 backdrop-blur-md border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>FMoH Ethiopia Accredited</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/50 backdrop-blur-md border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Role-Based Security Protocol</span>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT SIDE: TRANSPARENT GLASS LOGIN CARD ================= */}
          <div className="lg:col-span-5 xl:col-span-5 w-full max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.35)] p-6 sm:p-8 relative text-white transition-all"
            >
              {/* Top Card Brand Accent */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/30 via-blue-600/40 to-indigo-600/40 text-cyan-300 flex items-center justify-center border border-cyan-400/40 shadow-lg shadow-cyan-500/20 backdrop-blur-sm">
                  <KeyRound className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 backdrop-blur-sm">
                    FMoH HIS TIER-1
                  </span>
                </div>
              </div>

              {/* Card Header */}
              <div className="text-left space-y-1 mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  Hospital Login
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium drop-shadow-sm">
                  Authorized clinical staff & administration
                </p>
              </div>

              {/* Session Expired Banner */}
              {isSessionExpired && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-100 text-xs flex items-start gap-2.5 backdrop-blur-sm"
                >
                  <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Session Expired</span>
                    <span className="text-amber-100">Your session has expired. Please sign in again.</span>
                  </div>
                </motion.div>
              )}

              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 p-3 rounded-xl bg-rose-500/25 border border-rose-400/50 text-rose-100 text-xs font-semibold flex items-center gap-2.5 backdrop-blur-sm shadow-md"
                >
                  <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
                  <span className="text-white font-medium">{error}</span>
                </motion.div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email / Username Field */}
                <div>
                  <label className="block text-xs font-bold text-blue-100 mb-1.5 drop-shadow-sm">
                    Email / Staff Username
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-200/70 group-focus-within:text-cyan-300 transition-colors pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="login-identifier-input"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g. doctor@hospital.et or USR-003"
                      className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm bg-slate-950/35 hover:bg-slate-950/45 focus:bg-slate-950/60 border border-white/25 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 rounded-xl text-white placeholder:text-blue-200/50 outline-none transition font-medium backdrop-blur-sm shadow-inner"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div>
                  <label className="block text-xs font-bold text-blue-100 mb-1.5 drop-shadow-sm">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-200/70 group-focus-within:text-cyan-300 transition-colors pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password-input"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your clinical password"
                      className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm bg-slate-950/35 hover:bg-slate-950/45 focus:bg-slate-950/60 border border-white/25 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 rounded-xl text-white placeholder:text-blue-200/50 outline-none transition font-medium backdrop-blur-sm shadow-inner"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      id="toggle-password-visibility-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-200/70 hover:text-white p-1 cursor-pointer transition"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 text-blue-100 hover:text-white cursor-pointer select-none transition-colors">
                    <input
                      type="checkbox"
                      id="remember-me-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-white/30 bg-slate-950/40 focus:ring-cyan-400/30"
                    />
                    <span className="font-medium drop-shadow-sm">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setResetSubmitted(false);
                      setIsForgotPasswordOpen(true);
                    }}
                    className="text-xs font-bold text-cyan-300 hover:text-cyan-100 hover:underline cursor-pointer transition-colors drop-shadow-sm"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button with Luminous Clinical Gradient */}
                <button
                  type="submit"
                  id="hospital-login-submit-btn"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-60 disabled:pointer-events-none group border border-cyan-400/30"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Portal</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
                    </>
                  )}
                </button>
              </form>

              {/* Secure Hospital Access Note */}
              <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200">
                <span className="flex items-center gap-1.5 font-medium text-blue-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Encrypted hospital gateway</span>
                </span>
                <span className="font-mono text-[10px] text-cyan-200 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-400/40 font-semibold backdrop-blur-sm">
                  Staff Only
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* 4. Footer Bar */}
      <footer className="relative z-20 w-full border-t border-white/15 bg-slate-950/40 backdrop-blur-md py-4 text-xs text-blue-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-blue-100">
            © 2026 Bethel St. Paul Hospital HIS • Federal Ministry of Health (FMoH) Accredited
          </p>
          <div className="flex items-center gap-4 text-[11px] text-blue-200">
            <span>Clinical IT Helpdesk: Ext. 5500</span>
            <span className="text-white/30">•</span>
            <span>Emergency: 907 / +251 11 275 1234</span>
          </div>
        </div>
      </footer>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      <AnimatePresence>
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 text-left relative text-slate-900"
            >
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Staff Credential Recovery
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bethel St. Paul Clinical Directory Services
                  </p>
                </div>
              </div>

              {resetSubmitted ? (
                <div className="space-y-3 py-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-emerald-900">Reset Request Dispatched</span>
                      <span>
                        A security authorization link has been forwarded to your registered hospital communication channel. For immediate urgent duty authorization, contact Clinical IT at ext. 5500.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (resetEmailOrId.trim()) {
                      setResetSubmitted(true);
                    }
                  }}
                  className="space-y-4"
                >
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hospital staff accounts are centrally managed. Enter your official hospital email or staff ID (e.g., <code className="text-blue-600 font-mono bg-blue-50 px-1 py-0.5 rounded">doctor@hospital.et</code> or <code className="text-blue-600 font-mono bg-blue-50 px-1 py-0.5 rounded">USR-003</code>) to initiate verification.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Staff Email or Employee ID
                    </label>
                    <input
                      type="text"
                      value={resetEmailOrId}
                      onChange={(e) => setResetEmailOrId(e.target.value)}
                      placeholder="e.g. nurse@hospital.et or USR-005"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition cursor-pointer"
                    >
                      Request Password Reset
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
