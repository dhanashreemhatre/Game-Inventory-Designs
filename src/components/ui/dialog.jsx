import React from 'react';
import { X } from 'lucide-react';

const Dialog = ({ isOpen, onClose, children, maxWidth = 'lg' }) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
      />

      {/* Dialog */}
      <div 
        className={`
          fixed left-1/2 top-1/2 z-50 
          grid w-full ${maxWidthClasses[maxWidth]} 
          -translate-x-1/2 -translate-y-1/2 
          gap-4 border bg-gray-900 p-6 
          shadow-lg duration-200 
          animate-in fade-in-0 zoom-in-95 
          slide-in-from-left-1/2 slide-in-from-top-[48%] 
          sm:rounded-lg
        `}
        onClick={e => e.stopPropagation()}
      >
        {children}
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background 
                   transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 
                   focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
};

const DialogContent = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
    {children}
  </div>
);

const DialogFooter = ({ children, className = '' }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
    {children}
  </div>
);

const DialogTitle = ({ children, className = '' }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight text-gray-100 ${className}`}>
    {children}
  </h2>
);

const DialogDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-400 ${className}`}>
    {children}
  </p>
);

export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };