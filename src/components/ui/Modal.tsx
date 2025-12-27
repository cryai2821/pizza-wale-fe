'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-0"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={cn(
        "relative w-full max-w-lg transform bg-white shadow-xl transition-all flex flex-col z-10 pointer-events-auto",
        "rounded-t-2xl sm:rounded-2xl", // Bottom sheet on mobile, centered on desktop
        "max-h-[95vh] sm:max-h-[90vh]", // Scrollable content
        "animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 fade-in-0",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
