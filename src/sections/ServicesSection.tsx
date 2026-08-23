import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, TrendingUp, Briefcase, Database, Shield, BarChart2, Heart, Award, Users, Vote } from 'lucide-react';
import { SectionHeading } from '@/components/common/UIElements';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { services } from '@/data/services';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe, TrendingUp, Briefcase, Database, Shield, BarChart2, Heart, Award, Users, Vote,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export const ServicesSection: React.FC = () => {
  return (
    <section className="section-py bg-white" aria-labelledby="services-heading">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            overline="What We Offer"
            title="Our Services"
            subtitle="Comprehensive research, analytics, and consulting solutions across 10 specialized domains."
          />
          <Button variant="secondary" size="md" to="/services" rightIcon={<ArrowRight size={16} />}>
            View All Services
          </Button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {services.map((service) => {
            const IconComponent = iconMap[service.icon];
            return (
              <motion.div key={service.id} variants={itemVariants}>
                <Link
                  to={service.path}
                  className="group card-hover flex flex-col p-5 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white transition-transform duration-300 group-hover:scale-110 shrink-0"
                    style={{ backgroundColor: service.color || '#154A8F' }}
                  >
                    {IconComponent && <IconComponent size={18} />}
                  </div>
                  <h3 className="text-sm font-semibold text-tristarc-text-primary group-hover:text-primary transition-colors leading-snug mb-2 flex-1">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0">
                    Learn more <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
};
