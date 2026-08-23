import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Mail } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Container } from '@/components/common/Container';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export const CareersCTASection: React.FC = () => {
  const { getSetting } = useSiteSettings();

  const title = getSetting('homepage.careersCtaTitle', 'Build Your Career With TRISTARC');
  const desc = getSetting('homepage.careersCtaDesc', 'Explore current openings and become part of a research and analytics-focused environment dedicated to evidence-based excellence.');

  return (
    <section className="section-py-sm bg-tristarc-bg-alt" aria-label="Careers CTA">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-3xl border border-tristarc-border shadow-card overflow-hidden p-10 lg:p-14"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-light/60 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <Briefcase size={12} /> Now Hiring
              </div>
              <h2 className="text-display-sm text-tristarc-text-primary font-bold mb-3">
                {title}
              </h2>
              <p className="text-body text-tristarc-text-secondary max-w-xl">
                {desc}
              </p>
            </div>
            <Button variant="primary" size="xl" to="/careers" rightIcon={<ArrowRight size={18} />} className="shrink-0">
              View Careers
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export const ContactCTASection: React.FC = () => {
  const { getSetting } = useSiteSettings();

  const title = getSetting('homepage.contactCtaTitle', 'Have a Research, Analytics or Consultancy Requirement?');
  const desc = getSetting('homepage.contactCtaDesc', "Let's connect. Our team of research and analytics experts is ready to discuss your needs.");

  return (
    <section className="section-py bg-gradient-to-br from-primary-dark via-primary to-primary-600 relative overflow-hidden" aria-label="Contact CTA">
      <div className="absolute inset-0 mega-menu-grid opacity-15 pointer-events-none" />
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-white" />
          </div>
          <h2 className="text-display-sm text-white font-bold mb-4">
            {title}
          </h2>
          <p className="text-body-lg text-white/70 max-w-xl mx-auto mb-8">
            {desc}
          </p>
          <Button variant="accent" size="xl" to="/contact" rightIcon={<ArrowRight size={18} />}>
            Contact Us
          </Button>
        </motion.div>
      </Container>
    </section>
  );
};
