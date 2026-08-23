import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Clock, Monitor, BookOpen, ArrowRight, ChevronDown, RefreshCw } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/common/UIElements';
import { Button } from '@/components/common/Button';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';

// ─── Courses Landing Page ──────────────────────────────────
export const CoursesPage: React.FC = () => (
  <>
    <Helmet>
      <title>Courses | TRISTARC</title>
      <meta name="description" content="Professional training courses at TRISTARC — Academic Skills and Research methodology programs." />
    </Helmet>
    <PageHero
      title="Our Courses"
      description="Professional development programs designed by research experts to advance your analytical and research capabilities."
      breadcrumb={[{ label: 'Courses' }]}
    />
    <section className="section-py bg-tristarc-bg">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { title: 'Academic Skills Courses', path: '/courses/academic-skills', icon: BookOpen, color: '#154A8F', desc: 'Research methodology, statistics, and academic writing programs for students and professionals.' },
            { title: 'Research Courses', path: '/courses/research', icon: BookOpen, color: '#F28C28', desc: 'Advanced statistical analysis, qualitative methods, and survey design for researchers and analysts.' },
          ].map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}>
                <Link to={cat.path} className="group card-hover flex flex-col h-full p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: cat.color }}>
                    <Icon size={26} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-tristarc-text-primary group-hover:text-primary transition-colors mb-3">{cat.title}</h2>
                  <p className="text-body text-tristarc-text-secondary leading-relaxed mb-6 flex-1">{cat.desc}</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: cat.color }}>
                    Explore <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  </>
);

// ─── Course Card ───────────────────────────────────────────
const CourseCard: React.FC<{ course: Course; index: number }> = ({ course, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.45 }}
  >
    <div className="card-hover group h-full flex flex-col">
      {/* Image / Thumbnail */}
      <div className="h-44 bg-gradient-to-br from-primary-light to-primary-light/50 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen size={48} className="text-primary/30" />
        )}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {course.level && <Badge variant="blue">{course.level}</Badge>}
          {course.mode && <Badge variant="orange">{course.mode}</Badge>}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-base font-bold text-tristarc-text-primary group-hover:text-primary transition-colors mb-2 leading-snug">
          {course.title}
        </h3>
        <p className="text-sm text-tristarc-text-secondary leading-relaxed mb-4 flex-1 line-clamp-3">
          {course.shortDescription}
        </p>
        <div className="flex items-center gap-4 text-xs text-tristarc-text-muted mb-4 border-t border-tristarc-border pt-4">
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {course.duration}
            </span>
          )}
          {course.mode && (
            <span className="flex items-center gap-1">
              <Monitor size={12} /> {course.mode}
            </span>
          )}
        </div>
        <Link
          to={`/courses/${course.slug}`}
          className="btn-primary btn-sm w-full justify-center"
        >
          View Details
        </Link>
      </div>
    </div>
  </motion.div>
);

// ─── Academic Skills Page ──────────────────────────────────
export const AcademicSkillsPage: React.FC = () => {
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    courseService.getByCategory('academic-skills').then((data) => {
      if (mounted) {
        setCoursesList(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Helmet>
        <title>Academic Skills Courses | TRISTARC</title>
        <meta name="description" content="Academic skills courses at TRISTARC — research methodology, statistics, and academic writing." />
      </Helmet>
      <PageHero
        title="Academic Skills Courses"
        description="Foundational and advanced academic skills programs for professionals, students, and researchers."
        breadcrumb={[{ label: 'Courses', path: '/courses' }, { label: 'Academic Skills Courses' }]}
      />
      <section className="section-py bg-tristarc-bg">
        <Container>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="animate-spin text-primary" size={28} />
            </div>
          ) : coursesList.length === 0 ? (
            <div className="text-center py-16 text-tristarc-text-muted">
              No academic skills courses available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesList.map((course, i) => <CourseCard key={course.id} course={course} index={i} />)}
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

// ─── Research Courses Page ──────────────────────────────────
export const ResearchCoursesPage: React.FC = () => {
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    courseService.getByCategory('research').then((data) => {
      if (mounted) {
        setCoursesList(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Helmet>
        <title>Research Courses | TRISTARC</title>
        <meta name="description" content="Advanced research courses at TRISTARC — statistical analysis, qualitative methods, survey design." />
      </Helmet>
      <PageHero
        title="Research Courses"
        description="Specialized research training programs for analysts, scholars, and research professionals."
        breadcrumb={[{ label: 'Courses', path: '/courses' }, { label: 'Research Courses' }]}
      />
      <section className="section-py bg-tristarc-bg">
        <Container>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="animate-spin text-primary" size={28} />
            </div>
          ) : coursesList.length === 0 ? (
            <div className="text-center py-16 text-tristarc-text-muted">
              No research courses available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesList.map((course, i) => <CourseCard key={course.id} course={course} index={i} />)}
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

// ─── Course Detail Page ────────────────────────────────────
export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (slug) {
      setLoading(true);
      courseService.getBySlug(slug).then((data) => {
        if (mounted) {
          setCourse(data);
          setLoading(false);
        }
      });
    }
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-20">
        <RefreshCw className="animate-spin text-primary mb-4" size={32} />
        <p className="text-tristarc-text-muted text-sm">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-20">
        <h1 className="text-2xl font-bold text-tristarc-text-primary mb-4">Course Not Found</h1>
        <Button variant="primary" to="/courses">Back to Courses</Button>
      </div>
    );
  }

  const isResearch = typeof course.category === 'string'
    ? course.category.includes('research')
    : (course.category as any)?.slug?.includes('research') || (course.category as any)?.name?.toLowerCase().includes('research');

  // Outcomes array or split string
  const outcomes = Array.isArray(course.outcomes)
    ? course.outcomes
    : typeof (course as any).learningOutcomes === 'string'
      ? (course as any).learningOutcomes.split('\n').map((s: string) => s.trim()).filter(Boolean)
      : [];

  // Who should attend array or split string
  const whoShouldAttendList = Array.isArray(course.whoShouldAttend)
    ? course.whoShouldAttend
    : typeof course.whoShouldAttend === 'string'
      ? course.whoShouldAttend.split('\n').map((s: string) => s.trim()).filter(Boolean)
      : [];

  // Modules array
  const modulesList = (course as any).modules || course.curriculum || [];

  return (
    <>
      <Helmet>
        <title>{course.title} | Courses | TRISTARC</title>
        <meta name="description" content={course.shortDescription || course.description || ''} />
      </Helmet>

      <PageHero
        title={course.title}
        description={course.shortDescription || ''}
        breadcrumb={[
          { label: 'Courses', path: '/courses' },
          { label: isResearch ? 'Research' : 'Academic Skills', path: isResearch ? '/courses/research' : '/courses/academic-skills' },
          { label: course.title },
        ]}
      />

      <section className="section-py bg-tristarc-bg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              {course.description && (
                <div className="card-p">
                  <h2 className="text-xl font-bold text-primary mb-4">Course Overview</h2>
                  <p className="text-body text-tristarc-text-secondary leading-relaxed whitespace-pre-line">{course.description}</p>
                </div>
              )}

              {/* Outcomes */}
              {outcomes.length > 0 && (
                <div className="card-p">
                  <h2 className="text-xl font-bold text-primary mb-4">Learning Outcomes</h2>
                  <ul className="space-y-2.5">
                    {outcomes.map((o: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent-green-light flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-accent-green text-xs font-bold">✓</span>
                        </div>
                        <span className="text-body-sm text-tristarc-text-secondary">{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Curriculum Accordion */}
              {modulesList.length > 0 && (
                <div className="card-p">
                  <h2 className="text-xl font-bold text-primary mb-4">Curriculum &amp; Modules</h2>
                  <div className="space-y-2">
                    {modulesList.map((mod: any, i: number) => (
                      <div key={mod.id || i} className="border border-tristarc-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenModule(openModule === i ? null : i)}
                          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-primary-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                          aria-expanded={openModule === i}
                        >
                          <span className="text-sm font-semibold text-tristarc-text-primary">{mod.title}</span>
                          <ChevronDown size={16} className={`text-primary shrink-0 transition-transform duration-200 ${openModule === i ? 'rotate-180' : ''}`} />
                        </button>
                        {openModule === i && (
                          <div className="px-5 pb-4 bg-tristarc-bg">
                            {mod.description && <p className="text-xs text-tristarc-text-secondary pt-2 leading-relaxed">{mod.description}</p>}
                            {Array.isArray(mod.topics) && mod.topics.length > 0 && (
                              <ul className="space-y-1.5 pt-2">
                                {mod.topics.map((t: string, j: number) => (
                                  <li key={j} className="flex items-center gap-2 text-sm text-tristarc-text-secondary">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-orange shrink-0" />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Who Should Attend */}
              {whoShouldAttendList.length > 0 && (
                <div className="card-p">
                  <h2 className="text-xl font-bold text-primary mb-4">Who Should Attend?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {whoShouldAttendList.map((w: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-tristarc-bg">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span className="text-sm text-tristarc-text-secondary">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Quick Info */}
              <div className="card-p sticky top-24">
                <h3 className="font-bold text-primary mb-4 pb-3 border-b border-tristarc-border">Course Details</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Duration', value: course.duration },
                    { label: 'Mode', value: course.mode },
                    { label: 'Level', value: course.level },
                    { label: 'Eligibility', value: course.eligibility },
                    { label: 'Trainer', value: (course as any).trainer },
                  ].filter((f) => f.value).map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-tristarc-text-muted uppercase tracking-wide">{label}</span>
                      <span className="text-sm text-tristarc-text-primary">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  <Button variant="accent" size="md" to="/contact" className="w-full justify-center">
                    Register Interest
                  </Button>
                  <Button variant="secondary" size="md" to="/courses" className="w-full justify-center">
                    All Courses
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
