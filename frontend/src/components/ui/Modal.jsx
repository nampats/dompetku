import React, { useEffect, useState } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  variant = 'info', // 'info', 'confirm', 'success', 'error'
  onConfirm,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal'
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setShow(false), 300); // Wait for exit animation
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const iconMap = {
    info: 'info',
    confirm: 'help',
    success: 'check_circle',
    error: 'error'
  };

  const iconColorMap = {
    info: 'text-primary',
    confirm: 'text-secondary',
    success: 'text-primary',
    error: 'text-error'
  };

  const btnConfirmColorMap = {
    info: 'bg-primary text-on-primary hover:bg-primary/90',
    confirm: 'bg-secondary text-on-secondary hover:bg-secondary/90',
    success: 'bg-primary text-on-primary hover:bg-primary/90',
    error: 'bg-error text-on-error hover:bg-error/90'
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className={`relative bg-surface border border-outline-variant/20 rounded-3xl w-full max-w-md shadow-2xl transition-all duration-300 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-surface-container ${iconColorMap[variant]}`}>
              <span className="material-symbols-outlined text-3xl">{iconMap[variant]}</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
          </div>
          
          <div className="font-body-md text-body-md text-on-surface-variant mb-8">
            {children}
          </div>

          <div className="flex justify-end gap-3">
            {variant === 'confirm' && (
              <button 
                onClick={onClose}
                className="px-6 py-2 rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button 
              onClick={() => {
                if (onConfirm) onConfirm();
                else onClose();
              }}
              className={`px-6 py-2 rounded-xl font-label-md text-label-md font-bold transition-all shadow-lg ${btnConfirmColorMap[variant]}`}
            >
              {variant === 'confirm' ? confirmText : 'Tutup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
