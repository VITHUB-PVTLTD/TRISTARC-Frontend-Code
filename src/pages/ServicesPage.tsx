import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, TrendingUp, Briefcase, Database, Shield, BarChart2, Heart, Award, Users, Vote } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/UIElements';
import { services } from '@/data/services';
import { ContactCTASection } from '@/sections/CTASections';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe, TrendingUp, Briefcase, Database, Shield, BarChart2, Heart, Award, Users, Vote,
};

const ServicesPage: React.FC = () => (
  <>
    <Helmet>
      <title>Services | TRISTARC</title>
      <meta name="description" content="Explore TRISTARC's comprehensive research, analytics, and consulting services across 10 specialized domains." />
    </Helmet>

    <PageHero
      title="Our Services"
      description="Comprehensive research, analytics, and consulting solutions designed to deliver evidence-based insights across diverse sectors."
      breadcrumb={[{ label: 'Services' }]}
    />

    <section className="section-py bg-tristarc-bg">
      <Container>
        <div className="text-center mb-12">
          <SectionHeading
            overline="Research & Analytics"
            title="10 Specialized Service Areas"
            subtitle="From social research to corporate analytics, TRISTARC delivers rigorous, data-driven solutions."
            centered
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const IconComponent = iconMap[service.icon];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <Link
                  to={service.path}
                  className="group card-hover flex flex-col h-full p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: service.color || '#154A8F' }}
                    >
                      {IconComponent && <IconComponent size={22} />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-accent-orange uppercase tracking-wider">Service {i + 1}</span>
                      <h3 className="text-base font-bold text-tristarc-text-primary group-hover:text-primary transition-colors leading-snug">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-tristarc-text-secondary leading-relaxed flex-1 mb-4">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200">
                    Learn More <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>

    <ContactCTASection />
  </>
);

export default ServicesPage;
