import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, LineChart, FlaskConical, Lightbulb } from 'lucide-react';
import { SectionHeading } from '@/components/common/UIElements';
import { Container } from '@/components/common/Container';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { coreAreas } from '@/data/site';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  BarChart3, LineChart, FlaskConical, Lightbulb,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export const CoreAreasSection: React.FC = () => {
  const { getSetting } = useSiteSettings();

  const overline = getSetting('homepage.coreBadge', 'What We Do');
  const title = getSetting('homepage.coreTitle', 'Our Core Areas');
  const subtitle = getSetting('homepage.coreSub', "Four pillars of expertise that define TRISTARC's approach to research, training, and analytics.");

  return (
    <section className="section-py bg-tristarc-bg data-pattern" aria-labelledby="core-areas-heading">
      <Container>
        <div className="text-center mb-12">
          <SectionHeading
            overline={overline}
            title={title}
            subtitle={subtitle}
            centered
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {coreAreas.map((area) => {
            const IconComponent = iconMap[area.icon];
            return (
              <motion.div key={area.id} variants={itemVariants}>
                <div className="card-p-hover group h-full text-center">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: area.color }}
                  >
                    {IconComponent && <IconComponent size={28} />}
                  </div>

                  <h3 className="text-section-title text-tristarc-text-primary mb-3 group-hover:text-primary transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-body-sm text-tristarc-text-secondary leading-relaxed">
                    {area.description}
                  </p>

                  {/* Accent line */}
                  <div
                    className="w-8 h-0.5 mx-auto mt-4 rounded-full transition-all duration-300 group-hover:w-16"
                    style={{ backgroundColor: area.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
};
