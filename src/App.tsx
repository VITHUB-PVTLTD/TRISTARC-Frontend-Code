import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/context/AuthContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import AppRoutes from '@/routes';

const App: React.FC = () => (
  <HelmetProvider>
    <AuthProvider>
      <SiteSettingsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SiteSettingsProvider>
    </AuthProvider>
  </HelmetProvider>
);

export default App;
