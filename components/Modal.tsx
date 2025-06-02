
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-40 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-neutral-200">
          <h2 id="modal-title" className="text-xl font-semibold text-neutral-800">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-neutral-400 hover:text-neutral-600 transition-colors" 
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-4 md:p-6">
          {children}
        </div>
        {footer && (
          <div className="px-4 md:px-6 py-3 bg-neutral-50 border-t border-neutral-200 rounded-b-lg flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
      <style>{`
        @keyframes modalShow {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalShow {
          animation: modalShow 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;
