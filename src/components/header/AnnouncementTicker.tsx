import React, { useEffect, useState } from 'react';
import { Bell, Info } from 'lucide-react';
import { userDashboardService } from '@/services/userDashboardService';
import { announcements as fallbackAnnouncements } from '@/data/notifications';
import { NotificationDetailModal } from '@/components/common/NotificationDetailModal';
import type { Notification } from '@/types';

export const AnnouncementTicker: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    userDashboardService
      .getNotifications()
      .then((data: Notification[]) => {
        if (mounted) {
          if (data && data.length > 0) {
            setNotifications(data);
          } else {
            // Map fallback announcements into Notification format
            const mapped: Notification[] = fallbackAnnouncements.map((a) => ({
              id: a.id,
              title: 'Announcement',
              message: a.text,
              link: a.link,
              type: a.type,
              isActive: true,
            }));
            setNotifications(mapped);
          }
        }
      })
      .catch(() => {
        if (mounted) {
          const mapped: Notification[] = fallbackAnnouncements.map((a) => ({
            id: a.id,
            title: 'Announcement',
            message: a.text,
            link: a.link,
            type: a.type,
            isActive: true,
          }));
          setNotifications(mapped);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!notifications.length) return null;

  // Duplicate list for seamless infinite marquee scroll
  const items = [...notifications, ...notifications];

  const handleOpenDetail = (notif: Notification) => {
    setSelectedNotif(notif);
    setModalOpen(true);
  };

  return (
    <>
      <div
        className="bg-primary-dark text-white overflow-hidden border-b border-primary-light/10"
        role="region"
        aria-label="Latest announcements and updates"
      >
        <div className="flex items-stretch">
          {/* Section Header Label */}
          <div className="flex items-center gap-2 px-4 py-2 bg-accent-orange shrink-0 z-10 shadow-md">
            <Bell size={14} className="animate-pulse-glow shrink-0 text-white" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap text-white">
              Updates
            </span>
          </div>

          {/* Ticker Container — Pauses animation on hover */}
          <div className="relative overflow-hidden flex-1 group">
            <div
              className="ticker-wrapper py-2 flex items-center group-hover:[animation-play-state:paused]"
              aria-live="polite"
              aria-atomic="true"
            >
              {items.map((notif, idx) => {
                const displayText = notif.title
                  ? `${notif.title} — ${notif.message}`
                  : notif.message;

                return (
                  <span key={`${notif.id}-${idx}`} className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(notif)}
                      className="inline-flex items-center text-xs sm:text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all px-4 py-1 rounded-lg cursor-pointer whitespace-nowrap group/item focus:outline-none focus:ring-1 focus:ring-accent-orange"
                      title="Click to view complete details"
                    >
                      <span className="inline-block bg-accent-orange/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-2 uppercase tracking-wide group-hover/item:bg-accent-orange transition-colors">
                        New
                      </span>
                      <span className="truncate max-w-[450px] sm:max-w-[650px]">
                        {displayText}
                      </span>
                      <Info size={13} className="ml-1.5 text-accent-orange/80 group-hover/item:text-accent-orange shrink-0" />
                    </button>
                    <span className="text-accent-orange/70 px-3 text-xs" aria-hidden>
                      ◆
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Notification Details Modal */}
      <NotificationDetailModal
        notification={selectedNotif}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};
