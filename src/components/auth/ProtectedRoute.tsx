import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft, Building2 } from 'lucide-react';

export const ROLE_ROUTE_MAP: Record<UserRole, string> = {
  DOCTOR: '/doctor/dashboard',
  NURSE: '/nurse/dashboard',
  HOSPITAL_ADMIN: '/hospital/dashboard',
  RECEPTIONIST: '/reception/dashboard',
  LAB_TECHNICIAN: '/laboratory/dashboard',
  PHARMACIST: '/pharmacy/dashboard',
  ACCOUNTANT: '/accounting/dashboard',
  SUPER_ADMIN: '/admin/dashboard',
};

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, currentRole, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Unauthenticated users must sign in
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 2. Role-based authorization check: smoothly redirect to designated dashboard without showing blocking banner
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    const targetDashboard = ROLE_ROUTE_MAP[currentRole] || '/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  return <Outlet />;
};
