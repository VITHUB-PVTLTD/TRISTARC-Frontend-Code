import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Eye } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { SectionHeading } from '@/components/common/UIElements';
import { Container } from '@/components/common/Container';
import { useSiteSettings } from '@/context/SiteSettingsContext';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export const AboutSection: React.FC = () => {
  const { settings, getSetting } = useSiteSettings();

  const aboutBadge = getSetting('homepage.aboutBadge', 'About Us');
  const aboutTitle = getSetting('homepage.aboutTitle', 'What is TRISTARC?');
  const aboutSub = getSetting('homepage.aboutBody1', 'TRISTARC — Tirupati Rao Institute of Statistical Training, Analytics, Research & Consultancy — is a dedicated institute bringing rigorous research methodology, data analytics, and professional training under one roof.');
  const aboutParagraph = getSetting('homepage.aboutBody2', settings.aboutParagraph || 'We serve academics, researchers, organizations, and professionals seeking high-quality statistical research services, capacity-building programs, and evidence-based consultancy across diverse domains.');
  const mission = getSetting('about.mission', 'To deliver high-impact statistical training, data analytics, and research consultancy across diverse academic and industrial domains.');
  const vision = getSetting('about.vision', 'To be a premier institute recognized globally for excellence in statistical education, research methodology, and evidence-based decision support.');

  return (
    <section className="section-py bg-white" aria-labelledby="about-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">
          {/* Left — Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main visual card */}
            <div className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-600 rounded-3xl p-8 overflow-hidden min-h-72 flex items-end">
              <div className="absolute inset-0 mega-menu-grid opacity-20 pointer-events-none" />
              <div className="absolute top-6 right-6">
                {/* Mini chart */}
                <div className="flex items-end gap-1.5 h-16">
                  {[30, 55, 40, 70, 60, 85, 72].map((h, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-t-sm"
                      style={{ height: `${h}%`, backgroundColor: i % 2 === 0 ? 'rgba(242,140,40,0.9)' : 'rgba(255,255,255,0.5)' }}
                    />
                  ))}
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-accent-orange text-xs font-bold uppercase tracking-widest mb-2">{aboutBadge}</p>
                <p className="text-white text-lg font-bold leading-snug max-w-xs">
                  Research &amp; Analytics Institute of Excellence
                </p>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
            </div>

            {/* Floating accent card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-card-hover p-4 max-w-[200px]"
            >
              <p className="text-xs font-bold text-primary mb-1">Areas of Expertise</p>
              <div className="flex flex-wrap gap-1">
                {['Statistics', 'Analytics', 'Research', 'Training'].map((tag) => (
                  <span key={tag} className="badge-blue text-[10px]">{tag}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <SectionHeading
              overline={aboutBadge}
              title={aboutTitle}
              subtitle={aboutSub}
            />

            <p className="text-body text-tristarc-text-secondary mt-4 mb-8">
              {aboutParagraph}
            </p>

            {/* Mission/Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-primary-light border border-primary/20">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Target size={16} className="text-white" />
                  </div>
                  <p className="font-bold text-primary text-sm">Our Mission</p>
                </div>
                <p className="text-xs text-tristarc-text-secondary leading-relaxed">
                  {mission}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-accent-orange-light border border-accent-orange/20">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-orange flex items-center justify-center">
                    <Eye size={16} className="text-white" />
                  </div>
                  <p className="font-bold text-accent-orange text-sm">Our Vision</p>
                </div>
                <p className="text-xs text-tristarc-text-secondary leading-relaxed">
                  {vision}
                </p>
              </div>
            </div>

            <Button variant="primary" size="lg" to="/about" rightIcon={<ArrowRight size={18} />}>
              Learn More About Us
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
