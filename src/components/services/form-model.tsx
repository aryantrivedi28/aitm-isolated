// components/form-modal.tsx

'use client';

import { useEffect } from 'react';
import ContactForm from './contact-form';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FormModal({ isOpen, onClose }: FormModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6">
        {/* Modal Content */}
        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl transform overflow-hidden rounded-xl md:rounded-2xl bg-[#faf4e5] shadow-2xl transition-all">
          <div className="h-full max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-hidden">
            <ContactForm onClose={onClose} isModal />
          </div>
        </div>
      </div>
    </div>
  );
}