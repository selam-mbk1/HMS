import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password?: string) => User | null;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  addUser: (user: Omit<User, 'id' | 'lastLogin'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  toggleUserStatus: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Ensure local storage is completely purged of any legacy patient portal / patient@hospital.et data
if (typeof window !== 'undefined') {
  try {
    const rawUsers = localStorage.getItem('hms_users');
    if (rawUsers && (rawUsers.includes('patient@hospital.et') || rawUsers.includes('PATIENT'))) {
      const parsed = JSON.parse(rawUsers);
      const cleaned = parsed.filter((u: any) => u.email !== 'patient@hospital.et' && u.role !== 'PATIENT' && u.id !== 'USR-010');
      localStorage.setItem('hms_users', JSON.stringify(cleaned));
    }
    const rawCurrentUser = localStorage.getItem('hms_current_user');
    if (rawCurrentUser && (rawCurrentUser.includes('patient@hospital.et') || rawCurrentUser.includes('PATIENT'))) {
      localStorage.removeItem('hms_current_user');
      localStorage.removeItem('hms_auth');
    }
  } catch (e) {
    // Ignore storage parse errors
  }
}

export const ROLE_EMAIL_MAP: Record<string, UserRole> = {
  'doctor@hospital.et': 'DOCTOR',
  'nurse@hospital.et': 'NURSE',
  'hospitaladmin@hospital.et': 'HOSPITAL_ADMIN',
  'hospital.admin@hospital.et': 'HOSPITAL_ADMIN',
  'receptionist@hospital.et': 'RECEPTIONIST',
  'reception@hospital.et': 'RECEPTIONIST',
  'labtech@hospital.et': 'LAB_TECHNICIAN',
  'lab.tech@hospital.et': 'LAB_TECHNICIAN',
  'pharmacist@hospital.et': 'PHARMACIST',
  'accountant@hospital.et': 'ACCOUNTANT',
  'superadmin@hospital.et': 'SUPER_ADMIN',
  'super.admin@hospital.et': 'SUPER_ADMIN',
};

export const getRoleFromEmail = (email: string): UserRole | null => {
  const norm = email.trim().toLowerCase();
  if (norm.includes('patient')) return null;
  if (ROLE_EMAIL_MAP[norm]) return ROLE_EMAIL_MAP[norm];
  
  const userPart = norm.split('@')[0].replace(/[\._\-]/g, '');
  if (userPart === 'doctor' || userPart === 'dr' || userPart === 'physician') return 'DOCTOR';
  if (userPart === 'nurse') return 'NURSE';
  if (userPart === 'hospitaladmin' || userPart === 'adminhospital' || userPart === 'admin') return 'HOSPITAL_ADMIN';
  if (userPart === 'receptionist' || userPart === 'reception') return 'RECEPTIONIST';
  if (userPart === 'labtech' || userPart === 'laboratory' || userPart === 'lab') return 'LAB_TECHNICIAN';
  if (userPart === 'pharmacist' || userPart === 'pharmacy') return 'PHARMACIST';
  if (userPart === 'accountant' || userPart === 'billing' || userPart === 'finance') return 'ACCOUNTANT';
  if (userPart === 'superadmin') return 'SUPER_ADMIN';
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('hms_users');
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const validUsers = parsed.filter((u: any) => u.role !== 'PATIENT' && u.email !== 'patient@hospital.et' && u.id !== 'USR-010');
        return validUsers.map((u) => {
          const init = INITIAL_USERS.find((i) => i.id === u.id || i.role === u.role);
          return init ? { ...u, email: init.email } : u;
        });
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  // Default to Doctor (Dr. Hana) for clinical workflows
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('hms_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.email !== 'patient@hospital.et' && parsed.role !== 'PATIENT' && parsed.id !== 'USR-010') {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USERS.find((u) => u.role === 'DOCTOR') || INITIAL_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const isAuth = localStorage.getItem('hms_auth') === 'true';
    const savedUser = localStorage.getItem('hms_current_user');
    if (savedUser && (savedUser.includes('patient@hospital.et') || savedUser.includes('PATIENT'))) {
      return false;
    }
    return isAuth;
  });

  useEffect(() => {
    const cleanUsers = users.filter((u: any) => u.role !== 'PATIENT' && u.email !== 'patient@hospital.et' && u.id !== 'USR-010');
    localStorage.setItem('hms_users', JSON.stringify(cleanUsers));
  }, [users]);

  useEffect(() => {
    if (currentUser.email === 'patient@hospital.et' || (currentUser.role as any) === 'PATIENT') {
      const fallback = INITIAL_USERS.find((u) => u.role === 'DOCTOR') || INITIAL_USERS[0];
      setCurrentUser(fallback);
      localStorage.setItem('hms_current_user', JSON.stringify(fallback));
    } else {
      localStorage.setItem('hms_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const login = (identifier: string, _password?: string): User | null => {
    const trimmed = identifier.trim().toLowerCase();
    if (!trimmed) return null;
    
    // Explicitly reject any attempt to query or log in with patient credentials
    if (trimmed === 'patient@hospital.et' || trimmed === 'patient' || trimmed.startsWith('patient@') || trimmed === 'usr-010') {
      return null;
    }

    // 1. Exact email match in current users
    let matchedUser = users.find((u) => u.email.toLowerCase() === trimmed && u.role !== ('PATIENT' as any) && u.email !== 'patient@hospital.et');

    // 2. Staff ID match (e.g., USR-003)
    if (!matchedUser) {
      matchedUser = users.find((u) => u.id.toLowerCase() === trimmed && u.role !== ('PATIENT' as any) && u.email !== 'patient@hospital.et');
    }

    // 3. Username / email-prefix match (e.g. "doctor", "nurse", "dr.hana")
    if (!matchedUser) {
      matchedUser = users.find((u) => {
        const prefix = u.email.split('@')[0].toLowerCase();
        return prefix === trimmed && u.role !== ('PATIENT' as any) && u.email !== 'patient@hospital.et';
      });
    }

    // 4. Try role mapped from rolename or rolename@hospital.et
    if (!matchedUser) {
      const derivedRole = getRoleFromEmail(trimmed);
      if (derivedRole && (derivedRole as any) !== 'PATIENT') {
        matchedUser = users.find((u) => u.role === derivedRole) || INITIAL_USERS.find((u) => u.role === derivedRole);
      }
    }

    if (matchedUser && (matchedUser.role as any) !== 'PATIENT' && matchedUser.email !== 'patient@hospital.et') {
      setCurrentUser(matchedUser);
      setIsAuthenticated(true);
      localStorage.setItem('hms_auth', 'true');
      return matchedUser;
    }

    return null;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('hms_auth', 'false');
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || INITIAL_USERS.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      setIsAuthenticated(true);
      localStorage.setItem('hms_auth', 'true');
    }
  };

  const addUser = (userData: Omit<User, 'id' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      lastLogin: 'Never'
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        isAuthenticated,
        users,
        login,
        logout,
        switchRole,
        addUser,
        updateUser,
        toggleUserStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
