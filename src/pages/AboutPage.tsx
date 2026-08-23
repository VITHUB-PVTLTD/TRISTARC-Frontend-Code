import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, Eye, CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/UIElements';
import { ContactCTASection } from '@/sections/CTASections';
import { useSiteSettings } from '@/context/SiteSettingsContext';

const objectives = [
  'To provide world-class statistical training programs for professionals and academics',
  'To conduct rigorous, evidence-based research across social, commercial, and political domains',
  'To offer expert analytics and consultancy services to organizations and institutions',
  'To build research capacity through structured training and knowledge dissemination',
  'To promote data-driven decision-making in governance, business, and civil society',
  'Content to be updated — additional objectives to be supplied by TRISTARC',
];

const AboutPage: React.FC = () => {
  const { settings } = useSiteSettings();

  // Admin-editable about paragraph; falls back to static copy when not yet set
  const aboutParagraph = settings.aboutParagraph || '';

  return (
    <>
    <Helmet>
      <title>About Us | TRISTARC</title>
      <meta name="description" content="Learn about TRISTARC — our mission, vision, and institutional objectives as a research and analytics institute." />
    </Helmet>

    <PageHero
      title="About TRISTARC"
      description="Learn about our mission, vision, and what drives us as an institution dedicated to statistical research, analytics, and training."
      breadcrumb={[{ label: 'About Us' }]}
    />

    {/* About Section */}
    <section className="section-py bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <SectionHeading
              overline="About Us"
              title="Tirupati Rao Institute of Statistical Training, Analytics, Research & Consultancy"
            />
            <div className="space-y-4 mt-6 text-body text-tristarc-text-secondary leading-relaxed">
              {aboutParagraph ? (
                // Show admin-provided content
                <p>{aboutParagraph}</p>
              ) : (
                // Default copy shown until admin fills in the About paragraph
                <>
                  <p>
                    TRISTARC is a dedicated research and training institute committed to advancing statistical knowledge, evidence-based research, and analytical excellence across diverse sectors.
                  </p>
                  <p>
                    We bring together expert researchers, statisticians, consultants, and trainers to deliver comprehensive research services and professional development programs that make a real difference.
                  </p>
                  <p className="italic text-tristarc-text-muted text-sm border-l-4 border-accent-orange pl-4">
                    Additional institutional content to be updated — to be supplied by TRISTARC.
                  </p>
                </>
              )}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="bg-gradient-to-br from-primary-dark to-primary rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute inset-0 mega-menu-grid opacity-15 pointer-events-none" />
              <p className="text-accent-orange text-xs font-bold uppercase tracking-widest mb-4">TRISTARC</p>
              <h3 className="text-white font-bold text-xl mb-6 leading-snug">Research. Analytics. Training. Consultancy.</h3>
              <div className="space-y-3">
                {['Statistical Training', 'Analytics', 'Research', 'Consultancy'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-accent-orange shrink-0" />
                    <span className="text-white/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>

    {/* Mission & Vision */}
    <section className="section-py bg-tristarc-bg">
      <Container>
        <div className="text-center mb-12">
          <SectionHeading overline="Our Direction" title="Mission & Vision" centered />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Target,
              label: 'Our Mission',
              color: '#154A8F',
              bg: '#EAF2FA',
              text: 'Content to be updated — mission statement to be supplied by TRISTARC.',
            },
            {
              icon: Eye,
              label: 'Our Vision',
              color: '#F28C28',
              bg: '#FEF3E5',
              text: 'Content to be updated — vision statement to be supplied by TRISTARC.',
            },
          ].map(({ icon: Icon, label, color, bg, text }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-p h-full">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: bg }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color }}>{label}</h3>
                <p className="text-body text-tristarc-text-secondary leading-relaxed">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>

    {/* Objectives */}
    <section className="section-py bg-white">
      <Container>
        <div className="max-w-3xl mx-auto">
          <SectionHeading overline="Institutional Direction" title="Our Objectives" centered />
          <div className="mt-10 space-y-3">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary-light transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-primary-light group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white text-xs font-bold shrink-0 transition-all duration-200">
                  {i + 1}
                </div>
                <p className="text-body text-tristarc-text-secondary group-hover:text-tristarc-text-primary transition-colors">
                  {obj}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>

    <ContactCTASection />
    </>
  );
};


export default AboutPage;
