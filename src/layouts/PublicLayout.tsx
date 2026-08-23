import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopHeader } from '@/components/header/TopHeader';
import { AnnouncementTicker } from '@/components/header/AnnouncementTicker';
import { MainNav } from '@/components/navigation/MainNav';
import { MobileNav } from '@/components/navigation/MobileNav';
import { Footer } from '@/components/footer/Footer';
import { useScrollPosition } from '@/hooks/useScrollPosition';

export const PublicLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isScrolled } = useScrollPosition();

  return (
    <div className="flex flex-col min-h-screen bg-tristarc-bg">
      {/* Top Branding Header — scrolls away */}
      <TopHeader />

      {/* Announcement Bar */}
      <AnnouncementTicker />

      {/* Sticky Navigation */}
      <div className={`sticky top-0 z-30 ${isScrolled ? 'shadow-nav' : ''}`}>
        <MainNav
          isScrolled={isScrolled}
          onMobileMenuOpen={() => setMobileNavOpen(true)}
        />
      </div>

      {/* Mobile Nav Drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Page Content */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
