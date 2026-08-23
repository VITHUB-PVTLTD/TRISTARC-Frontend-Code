import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Phone } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/UIElements';
import { Button } from '@/components/common/Button';
import { getServiceBySlug } from '@/data/services';
import { NotFoundPage } from './NotFoundPage';

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : null;

  if (!service) return <NotFoundPage />;

  return (
    <>
      <Helmet>
        <title>{service.title} | Services | TRISTARC</title>
        <meta name="description" content={service.shortDescription} />
      </Helmet>

      <PageHero
        title={service.title}
        description={service.shortDescription}
        breadcrumb={[{ label: 'Services', path: '/services' }, { label: service.title }]}
      />

      {/* Overview */}
      <section className="section-py bg-white">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading overline="Service Overview" title={service.title} />
            <p className="text-body text-tristarc-text-secondary mt-4 leading-relaxed">{service.description}</p>
          </div>
        </Container>
      </section>

      {/* What We Provide + Key Areas */}
      <section className="section-py bg-tristarc-bg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* What We Provide */}
            {service.whatWeProvide && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <span className="w-1 h-5 bg-accent-orange rounded-full" />
                  What We Provide
                </h2>
                <ul className="space-y-3">
                  {service.whatWeProvide.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-accent-green mt-0.5 shrink-0" />
                      <span className="text-body text-tristarc-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Key Areas */}
            {service.keyAreas && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <span className="w-1 h-5 bg-accent-orange rounded-full" />
                  Key Areas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.keyAreas.map((area, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-tristarc-border hover:border-primary transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm font-medium text-tristarc-text-primary">{area}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </Container>
      </section>

      {/* Approach */}
      <section className="section-py bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-primary mb-4">Our Approach</h2>
            <p className="text-body text-tristarc-text-secondary leading-relaxed">{service.approach}</p>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-py-sm bg-gradient-to-br from-primary-dark to-primary">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Interested in {service.title}?
            </h2>
            <p className="text-white/70 mb-8">Connect with our research team to discuss your specific requirements.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="accent" size="lg" to="/contact" rightIcon={<Phone size={16} />}>
                Get In Touch
              </Button>
              <Button variant="outline-white" size="lg" to="/services" rightIcon={<ArrowRight size={16} />}>
                All Services
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ServiceDetailPage;
