import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sidebar } from '../common/Sidebar';
import { Header } from '../common/Header';
import { ChevronRight, Home } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Generate breadcrumb items from URL path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { name, path };
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex font-sans">
      {/* Sidebar navigation with slide-out drawer on mobile */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main viewport area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Breadcrumbs Bar */}
        <div className="bg-slate-50/70 border-b border-slate-200/70 px-4 sm:px-6 py-1.5 text-xs text-slate-500 flex items-center gap-1 overflow-x-auto whitespace-nowrap shadow-2xs">
          <Link to="/dashboard" className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-2xs transition-all font-semibold text-slate-600">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          {breadcrumbItems.map((item, idx) => (
            <React.Fragment key={item.path}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {idx === breadcrumbItems.length - 1 ? (
                <span className="px-2 py-1 rounded-lg bg-white font-bold text-slate-900 shadow-2xs border border-slate-200/70">
                  {item.name}
                </span>
              ) : (
                <Link to={item.path} className="px-2 py-1 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-2xs transition-all text-slate-600">
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content Container with Smooth Motion Transitions for all pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
