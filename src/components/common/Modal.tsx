import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-xs transition-opacity duration-200"
          onClick={onClose}
        />

        {/* Modal Window */}
        <div
          className={`w-full ${maxWidthClass} transform overflow-hidden rounded-2xl bg-[#FFFFFF] text-left align-middle shadow-modal-depth transition-all border border-[#E2E8F0] z-10 animate-enter`}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#E2E8F0] px-6 py-4.5 bg-[#F8FAFC]">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 interactive-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[calc(85vh-8rem)] overflow-y-auto text-[#0F172A]">{children}</div>
        </div>
      </div>
    </div>
  );
};
