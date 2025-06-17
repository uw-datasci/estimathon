import React from "react";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  onClose,
  showCloseButton = false,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[350px] text-center relative">
        {children}
        {showCloseButton && onClose && (
          <button
            className="mt-6 px-6 py-2 bg-portage-700 text-white rounded hover:bg-portage-900 transition"
            onClick={onClose}
          >
            Return to player&apos;s portal
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
