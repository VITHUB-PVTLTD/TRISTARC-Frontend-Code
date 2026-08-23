import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-tristarc-bg flex flex-col">
      {/* Auth Header */}
      <header className="bg-white border-b border-tristarc-border py-4">
        <div className="container-main flex items-center justify-center">
          <Link to="/" aria-label="TRISTARC Home">
            <img
              src="/images/tristarc-logo.png"
              alt="TRISTARC"
              className="h-14 w-auto object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center border-t border-tristarc-border">
        <p className="text-xs text-tristarc-text-muted">
          © {new Date().getFullYear()} TRISTARC. All Rights Reserved.
          <Link to="/privacy" className="ml-3 hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="ml-3 hover:text-primary transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  );
};
