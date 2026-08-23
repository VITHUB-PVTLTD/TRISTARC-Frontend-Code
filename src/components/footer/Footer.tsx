import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { siteConfig } from '@/data/site';

// Inline brand icons (removed from lucide-react v1+)
const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Our Team', path: '/team' },
  { label: 'Services', path: '/services' },
  { label: 'Courses', path: '/courses' },
  { label: 'E-Resources', path: '/e-resources' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact Us', path: '/contact' },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const { settings } = useSiteSettings();

  // Use live DB values; fall back to static siteConfig as defaults
  const description = settings.siteDescription || siteConfig.description;
  const address = settings.contactAddress || siteConfig.contact.address;
  const email = settings.contactEmail || siteConfig.contact.email;
  const phone = settings.contactPhone || siteConfig.contact.phone;
  const socialTwitter = settings.socialTwitter || siteConfig.social.twitter;
  const socialLinkedin = settings.socialLinkedin || siteConfig.social.linkedin;
  const socialFacebook = settings.socialFacebook || siteConfig.social.facebook;
  const socialYoutube = settings.socialYoutube || siteConfig.social.youtube;

  return (
    <footer className="bg-primary-dark text-white" role="contentinfo">
      {/* Main Footer */}
      <div className="container-main py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" aria-label="TRISTARC Home">
              <img
                src="/images/tristarc-logo.png"
                alt="TRISTARC Logo"
                className="h-16 w-auto object-contain mb-4 filter brightness-0 invert"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </Link>
            <p className="text-white font-bold text-base leading-tight mb-1">
              TRISTARC
            </p>
            <p className="text-white/50 text-xs leading-relaxed mb-4">
              Tirupati Rao Institute of Statistical Training, Analytics, Research &amp; Consultancy
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              {description.slice(0, 140)}...
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: XIcon, label: 'Twitter', href: socialTwitter },
                { icon: LinkedinIcon, label: 'LinkedIn', href: socialLinkedin },
                { icon: FacebookIcon, label: 'Facebook', href: socialFacebook },
                { icon: YoutubeIcon, label: 'YouTube', href: socialYoutube },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href || '#'}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent-orange flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent-orange mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/65 hover:text-white flex items-center gap-1.5 transition-colors group"
                  >
                    <ArrowRight size={12} className="text-accent-orange opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent-orange mb-5">
              Services
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Social & Development Research', path: '/services/social-development-research' },
                { label: 'Commercial Research', path: '/services/commercial-research' },
                { label: 'Business Research', path: '/services/business-research' },
                { label: 'Data Collection & Analysis', path: '/services/data-collection-analysis' },
                { label: 'Political Research', path: '/services/political-research' },
                { label: 'Electoral Research', path: '/services/electoral-research' },
                { label: 'CSR & Impact Research', path: '/services/csr-impact-research' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/65 hover:text-white flex items-center gap-1.5 transition-colors group"
                  >
                    <ArrowRight size={12} className="text-accent-orange opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent-orange mb-5">
              Contact
            </h3>
            <ul className="space-y-4">
              {address && (
                <li className="flex gap-3">
                  <MapPin size={16} className="text-accent-orange mt-1 shrink-0" />
                  <span className="text-sm text-white/65 leading-relaxed">
                    {address}
                  </span>
                </li>
              )}
              {email && (
                <li className="flex gap-3 items-center">
                  <Mail size={16} className="text-accent-orange shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-white/65 hover:text-white transition-colors"
                  >
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex gap-3 items-center">
                  <Phone size={16} className="text-accent-orange shrink-0" />
                  <span className="text-sm text-white/65">{phone}</span>
                </li>
              )}
            </ul>

            {/* Newsletter hint */}
            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/50 mb-3">Stay informed — updates coming soon</p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-orange hover:text-white transition-colors"
              >
                Get in Touch <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            &copy; {year} TRISTARC. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-white/40 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/terms" className="text-xs text-white/40 hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
