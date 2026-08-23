import React from 'react';
import { motion } from 'framer-motion';
import { Award, Database, BarChart2, Target, Users, Lightbulb } from 'lucide-react';
import { SectionHeading } from '@/components/common/UIElements';
import { Container } from '@/components/common/Container';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { whyTristarc } from '@/data/site';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Award, Database, BarChart2, Target, Users, Lightbulb,
};

export const WhyTristarcSection: React.FC = () => {
  const { getSetting } = useSiteSettings();

  const overline = getSetting('homepage.whyBadge', 'Why Choose Us');
  const title = getSetting('homepage.whyTitle', 'Why TRISTARC?');
  const subtitle = getSetting('homepage.whySub', 'What sets TRISTARC apart as a research, analytics, and training institution.');

  return (
    <section className="section-py bg-gradient-to-br from-primary-dark to-primary relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mega-menu-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3 pointer-events-none" />

      <Container className="relative z-10">
        <div className="text-center mb-12">
          <SectionHeading
            overline={overline}
            title={title}
            subtitle={subtitle}
            centered
            light
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyTristarc.map((item, i) => {
            const IconComponent = iconMap[item.icon];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-orange/20 border border-accent-orange/30 flex items-center justify-center mb-4 text-accent-orange">
                  {IconComponent && <IconComponent size={22} />}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{item.description}</p>
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent-orange/30 to-transparent" />
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
