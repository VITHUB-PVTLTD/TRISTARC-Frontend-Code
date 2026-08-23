import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle, CheckCircle2, Info, ExternalLink, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/types';

interface NotificationDetailModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!notification) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(notification.startDate || notification.createdAt);

  const getTypeBadge = (type?: string) => {
    const t = (type || 'info').toLowerCase();
    switch (t) {
      case 'alert':
      case 'urgent':
      case 'warning':
        return {
          bg: 'bg-red-100 text-red-700 border-red-200',
          icon: <AlertTriangle size={14} className="shrink-0" />,
          label: 'Alert',
        };
      case 'success':
        return {
          bg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 size={14} className="shrink-0" />,
          label: 'Success',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Info size={14} className="shrink-0" />,
          label: 'Information',
        };
    }
  };

  const badge = getTypeBadge(notification.type);

  const handleLinkClick = () => {
    if (!notification.link) return;
    onClose();
    if (notification.link.startsWith('http://') || notification.link.startsWith('https://')) {
      window.open(notification.link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(notification.link);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-tristarc-border overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-modal-title"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Bell size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
                      {badge.icon}
                      {badge.label}
                    </span>
                    {formattedDate && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <Calendar size={12} />
                        {formattedDate}
                      </span>
                    )}
                  </div>
                  <h3
                    id="notification-modal-title"
                    className="text-lg font-bold text-tristarc-text-heading leading-snug"
                  >
                    {notification.title || 'Announcement Details'}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close notification modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-sm text-tristarc-text-body space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="whitespace-pre-wrap leading-relaxed text-gray-700 bg-gray-50/70 p-4 rounded-xl border border-gray-100 font-normal">
                {notification.message}
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200/70 rounded-xl transition-all"
              >
                Close
              </button>
              {notification.link && (
                <button
                  onClick={handleLinkClick}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <span>Learn More</span>
                  <ExternalLink size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
