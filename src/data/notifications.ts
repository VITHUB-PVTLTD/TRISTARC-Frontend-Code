import type { Announcement } from '@/types';

// ============================================================
// TRISTARC — Announcement Ticker Data
// Replace with API data in Phase 2
// ============================================================

export const announcements: Announcement[] = [
  {
    id: 'ann-001',
    text: 'Will be updated soon',
    type: 'info',
    isNew: true,
  },
  {
    id: 'ann-002',
    text: 'New Academic Skills Courses launching soon — stay tuned for updates',
    type: 'info',
    isNew: true,
  },
  {
    id: 'ann-003',
    text: 'TRISTARC Research Methodology workshops — content to be updated',
    type: 'info',
  },
  {
    id: 'ann-004',
    text: 'Career opportunities at TRISTARC — explore our Careers page',
    link: '/careers',
    type: 'info',
  },
  {
    id: 'ann-005',
    text: 'E-Resources section updated with new study materials',
    link: '/e-resources',
    type: 'success',
  },
];
