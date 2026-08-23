import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '@/components/common/UIElements';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

const courseCategories = [
  {
    icon: BookOpen,
    title: 'Academic Skills Courses',
    description: 'Foundational and advanced academic skills programs covering research methodology, statistics, academic writing, and data literacy for professionals and students.',
    path: '/courses/academic-skills',
    color: '#154A8F',
    bg: '#EAF2FA',
    tags: ['Research Methodology', 'Statistics', 'Academic Writing'],
  },
  {
    icon: FlaskConical,
    title: 'Research Courses',
    description: 'Specialized research training programs in advanced statistical analysis, qualitative methods, survey design, and data science for researchers and analysts.',
    path: '/courses/research',
    color: '#F28C28',
    bg: '#FEF3E5',
    tags: ['Advanced Stats', 'Qualitative Methods', 'Survey Design'],
  },
];

export const CoursesSection: React.FC = () => {
  return (
    <section className="section-py bg-tristarc-bg-alt" aria-labelledby="courses-heading">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            overline="Learn & Grow"
            title="Our Courses"
            subtitle="Professional training programs designed by research experts for career advancement."
          />
          <Button variant="secondary" size="md" to="/courses" rightIcon={<ArrowRight size={16} />}>
            View All Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courseCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Link
                  to={cat.path}
                  className="group card-hover flex flex-col h-full p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: cat.color }}
                  >
                    <Icon size={28} className="text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-tristarc-text-primary group-hover:text-primary transition-colors mb-3">
                    {cat.title}
                  </h3>
                  <p className="text-body text-tristarc-text-secondary mb-5 flex-1 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {cat.tags.map((tag) => (
                      <span key={tag} className="badge-blue text-xs">{tag}</span>
                    ))}
                  </div>

                  <div
                    className="flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
                    style={{ color: cat.color }}
                  >
                    Explore Courses
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
