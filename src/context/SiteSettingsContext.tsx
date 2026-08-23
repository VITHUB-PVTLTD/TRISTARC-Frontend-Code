import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api from '@/services/api';

// ============================================================
// TRISTARC – Site Settings Context
// Loads public website settings from the backend at app startup.
// Keys match the database key convention used by the seed and SettingsService.
// ============================================================

export interface SiteSettings {
  // General
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  // Contact
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  // Social
  socialTwitter: string;
  socialLinkedin: string;
  socialFacebook: string;
  socialYoutube: string;
  // Homepage
  heroHeadline: string;
  heroSubheadline: string;
  announcementText: string;
  // About
  aboutParagraph: string;
  // Footer
  footerTagline: string;
}

const DEFAULTS: SiteSettings = {
  siteName: 'TRISTARC',
  siteTagline: 'Research | Analytics | Training | Consultancy',
  siteDescription:
    'TRISTARC is a premier institute dedicated to statistical training, analytics, research, and consultancy.',
  contactAddress: '',
  contactEmail: '',
  contactPhone: '',
  socialTwitter: '#',
  socialLinkedin: '#',
  socialFacebook: '#',
  socialYoutube: '#',
  heroHeadline: 'Excellence in Statistical Research & Analytics',
  heroSubheadline:
    'Empowering professionals and organisations through rigorous training, cutting-edge research, and expert consultancy.',
  announcementText: '',
  aboutParagraph: '',
  footerTagline: 'Empowering Research. Driving Impact.',
};

export interface SiteSettingsContextType {
  settings: SiteSettings;
  rawSettings: Record<string, string>;
  getSetting: (key: string, fallback?: string) => string;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULTS,
  rawSettings: {},
  getSetting: (_key: string, fallback = '') => fallback,
  isLoading: false,
  refreshSettings: async () => {},
});

/**
 * Map flat key-value pairs from the API to typed SiteSettings.
 */
function mapApiToSettings(raw: Record<string, string | null>): SiteSettings {
  const get = (key: string, fallback: string) => raw[key] ?? fallback;
  return {
    siteName:        get('site.name', '') || get('institute_name', DEFAULTS.siteName),
    siteTagline:     get('site.tagline', '') || get('footer_tagline', DEFAULTS.siteTagline),
    siteDescription: get('site.description', DEFAULTS.siteDescription),
    contactAddress:  get('contact.address', '') || get('address', DEFAULTS.contactAddress),
    contactEmail:    get('contact.email', '') || get('contact_email', DEFAULTS.contactEmail),
    contactPhone:    get('contact.phone', '') || get('contact_phone', DEFAULTS.contactPhone),
    socialTwitter:   get('social.twitter', '') || get('social_twitter', DEFAULTS.socialTwitter) || '#',
    socialLinkedin:  get('social.linkedin', '') || get('social_linkedin', DEFAULTS.socialLinkedin) || '#',
    socialFacebook:  get('social.facebook', '') || get('social_facebook', DEFAULTS.socialFacebook) || '#',
    socialYoutube:   get('social.youtube', '') || get('social_youtube', DEFAULTS.socialYoutube) || '#',
    heroHeadline:    get('homepage.heroHeadline', DEFAULTS.heroHeadline),
    heroSubheadline: get('homepage.heroSubheadline', DEFAULTS.heroSubheadline),
    announcementText:get('homepage.announcementText', DEFAULTS.announcementText),
    aboutParagraph:  get('about.paragraph', DEFAULTS.aboutParagraph),
    footerTagline:   get('site.tagline', '') || get('footer_tagline', DEFAULTS.footerTagline),
  };
}

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [rawSettings, setRawSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await api.get('/settings/public');
      const raw: Record<string, string | null> = res.data?.data ?? {};
      const cleanRaw: Record<string, string> = {};
      Object.entries(raw).forEach(([k, v]) => {
        if (v !== null && v !== undefined) cleanRaw[k] = v;
      });
      setRawSettings(cleanRaw);
      setSettings(mapApiToSettings(raw));
    } catch {
      // Silently fall back to defaults if the API is unavailable
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSetting = useCallback((key: string, fallback: string = ''): string => {
    const val = rawSettings[key];
    if (val !== undefined && val !== null && val.trim() !== '') {
      return val;
    }
    return fallback;
  }, [rawSettings]);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, rawSettings, getSetting, isLoading, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => useContext(SiteSettingsContext);
