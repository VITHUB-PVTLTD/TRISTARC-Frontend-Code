import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ChevronLeft, ChevronRight, BarChart3,
  TrendingUp, Database, Sparkles, BookOpen, CheckCircle2, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { DynamicHeroSlide } from '@/pages/admin/SiteSettingsAdminPage';

interface SlideData {
  id: string;
  image: string;
  badge: string;
  title: string;
  headline: string;
  subheadline: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  stats: Array<{ icon: React.ComponentType<{ size?: number; className?: string }>; value: string; label: string }>;
}

export const HeroSection: React.FC = () => {
  const { settings, getSetting } = useSiteSettings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Dynamic default values from admin site settings
  const defaultBadge = getSetting('homepage.heroBadge', 'Research · Analytics · Training · Consultancy');
  const defaultTitle = getSetting('homepage.heroTitle', 'Tirupati Rao Institute of Statistical Training, Analytics, Research & Consultancy');
  const defaultHeadline = getSetting('homepage.heroHeadline', settings.heroHeadline || 'Excellence in Statistical Research & Analytics');
  const defaultSubheadline = getSetting('homepage.heroSubheadline', settings.heroSubheadline || 'TRISTARC – Empowering professionals, academics, and organizations with world-class statistical research, training, and analytics solutions.');

  const btn1Text = getSetting('homepage.heroBtnPrimaryText', 'Explore Services');
  const btn1Link = getSetting('homepage.heroBtnPrimaryLink', '/services');
  const btn2Text = getSetting('homepage.heroBtnSecondaryText', 'View Courses');
  const btn2Link = getSetting('homepage.heroBtnSecondaryLink', '/courses');

  const stat1Value = getSetting('homepage.stat1Value', '15+');
  const stat1Label = getSetting('homepage.stat1Label', 'Years Experience');
  const stat2Value = getSetting('homepage.stat2Value', '500+');
  const stat2Label = getSetting('homepage.stat2Label', 'Projects Completed');
  const stat3Value = getSetting('homepage.stat3Value', '1000+');
  const stat3Label = getSetting('homepage.stat3Label', 'Students Trained');

  // Curated Fallback Slides
  const defaultSlides: SlideData[] = useMemo(() => [
    {
      id: 'default-slide-analytics',
      image: '/images/hero/hero_analytics.jpg',
      badge: defaultBadge,
      title: defaultTitle,
      headline: defaultHeadline,
      subheadline: defaultSubheadline,
      primaryBtnText: btn1Text,
      primaryBtnLink: btn1Link,
      secondaryBtnText: btn2Text,
      secondaryBtnLink: btn2Link,
      stats: [
        { icon: BarChart3, value: stat1Value, label: stat1Label },
        { icon: Database, value: stat2Value, label: stat2Label },
        { icon: TrendingUp, value: stat3Value, label: stat3Label },
      ],
    },
    {
      id: 'default-slide-training',
      image: '/images/hero/hero_training.jpg',
      badge: 'Hands-On Statistical & Data Science Training',
      title: 'Master Data Analytics Tools with Expert-Led Workshops',
      headline: 'Empowering Scholars & Professionals in R, Python, SPSS & STATA',
      subheadline: 'Practical, industry-aligned training programs designed for academic researchers, PhD candidates, and corporate analytics teams.',
      primaryBtnText: 'Browse All Courses',
      primaryBtnLink: '/courses',
      secondaryBtnText: 'Academic Skills',
      secondaryBtnLink: '/courses/academic-skills',
      stats: [
        { icon: BookOpen, value: '1000+', label: 'Scholars Trained' },
        { icon: CheckCircle2, value: '98%', label: 'Positive Feedback' },
        { icon: Sparkles, value: 'Hands-on', label: 'Practical Labs' },
      ],
    },
    {
      id: 'default-slide-research',
      image: '/images/hero/hero_research.jpg',
      badge: 'Evidence-Based Academic & Corporate Research',
      title: 'End-to-End Research Support from Design to Publication',
      headline: 'Rigorous Methodology, Modeling & Statistical Consultancy',
      subheadline: 'Comprehensive guidance in study design, sample size determination, complex hypothesis testing, and top-tier journal publication assistance.',
      primaryBtnText: 'Consult Our Experts',
      primaryBtnLink: '/contact',
      secondaryBtnText: 'Research Courses',
      secondaryBtnLink: '/courses/research',
      stats: [
        { icon: ShieldCheck, value: '100%', label: 'Academic Rigor' },
        { icon: BarChart3, value: '500+', label: 'Research Projects' },
        { icon: TrendingUp, value: 'End-to-End', label: 'Consultancy' },
      ],
    },
  ], [
    defaultBadge, defaultTitle, defaultHeadline, defaultSubheadline,
    btn1Text, btn1Link, btn2Text, btn2Link,
    stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label,
  ]);

  // Parse Admin Dynamic Slides from DB Settings
  const slides: SlideData[] = useMemo(() => {
    const rawJson = getSetting('homepage.heroSlidesJson', '');
    if (!rawJson) return defaultSlides;
    try {
      const parsed: DynamicHeroSlide[] = JSON.parse(rawJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const active = parsed.filter((s) => s.isActive !== false);
        if (active.length > 0) {
          return active.map((s) => ({
            id: s.id,
            image: s.image || '/images/hero/hero_analytics.jpg',
            badge: s.badge || defaultBadge,
            title: s.title || defaultTitle,
            headline: s.headline || defaultHeadline,
            subheadline: s.subheadline || defaultSubheadline,
            primaryBtnText: s.primaryBtnText || 'Explore Services',
            primaryBtnLink: s.primaryBtnLink || '/services',
            secondaryBtnText: s.secondaryBtnText || 'View Courses',
            secondaryBtnLink: s.secondaryBtnLink || '/courses',
            stats: [
              { icon: BarChart3, value: stat1Value, label: stat1Label },
              { icon: Database, value: stat2Value, label: stat2Label },
              { icon: TrendingUp, value: stat3Value, label: stat3Label },
            ],
          }));
        }
      }
    } catch {
      // Fallback
    }
    return defaultSlides;
  }, [getSetting, defaultSlides, defaultBadge, defaultTitle, defaultHeadline, defaultSubheadline, stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label]);

  // Ensure current slide index stays within range
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay slider timer
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, slides.length]);

  const slide = slides[currentSlide] || slides[0];

  return (
    <section
      className="relative w-full bg-slate-950 text-white overflow-hidden min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] flex items-center"
      aria-label="Hero Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          {/* Slide Image (Supports Base64 data:image/... Data URLs) */}
          <img
            src={slide.image}
            alt={slide.title || slide.headline}
            className="w-full h-full object-cover object-center"
          />

          {/* Dark Overlay Gradients for Maximum Contrast */}
          <div className="absolute inset-0 bg-slate-950/70 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/40 z-10" />
          <div className="absolute inset-0 bg-primary/15 mix-blend-multiply z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 mega-menu-grid opacity-25 pointer-events-none z-10" />

      {/* Main Slide Content — Left-aligned Layout Matching Reference */}
      <div className="container-main relative z-20 py-10 sm:py-12 lg:py-14">
        <div className="max-w-2xl text-left items-start flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-5 text-left items-start flex flex-col"
            >
              {/* Badge Overline Tag (Reference style) */}
              {slide.badge && (
                <div className="flex justify-start">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-slate-900/80 border border-white/20 text-xs font-bold uppercase tracking-widest text-white shadow-md">
                    <span className="w-2 h-2 rounded-full bg-accent-orange animate-pulse" />
                    {slide.badge}
                  </span>
                </div>
              )}

              {/* Title & Headline with TRISTARC fonts & colors */}
              <div className="space-y-2 text-left">
                {slide.title && (
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                    {slide.title}
                  </h1>
                )}
                {slide.headline && (
                  <h2 className="text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-orange via-amber-300 to-amber-100">
                    {slide.headline}
                  </h2>
                )}
              </div>

              {/* Subheadline Paragraph */}
              {slide.subheadline && (
                <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal max-w-xl drop-shadow-sm text-left">
                  {slide.subheadline}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
                {slide.primaryBtnText && (
                  <Button
                    variant="accent"
                    size="xl"
                    to={slide.primaryBtnLink}
                    rightIcon={<ArrowRight size={18} />}
                    className="shadow-xl hover:shadow-2xl transition-all"
                  >
                    {slide.primaryBtnText}
                  </Button>
                )}

                {slide.secondaryBtnText && (
                  <Button
                    variant="outline-white"
                    size="xl"
                    to={slide.secondaryBtnLink}
                    rightIcon={<ArrowRight size={18} />}
                    className="bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/30 text-white"
                  >
                    {slide.secondaryBtnText}
                  </Button>
                )}
              </div>

              {/* Key Metrics / Stats Floating Row */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 sm:gap-6 max-w-xl w-full">
                {slide.stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-accent-orange shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-white leading-none">{value}</p>
                      <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 truncate">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Left Navigation Chevron Button (Reference Style) */}
      {slides.length > 1 && (
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer focus:outline-none shadow-lg group"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Right Navigation Chevron Button (Reference Style) */}
      {slides.length > 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer focus:outline-none shadow-lg group"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Bottom Hot Pink Active Slide Bar & Dot Indicators (Reference Style) */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 cursor-pointer ${currentSlide === idx
                ? 'w-8 sm:w-10 h-1.5 rounded-full bg-orange-500 shadow-md'
                : 'w-2.5 h-2.5 rounded-full bg-white/40 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Subtle Bottom Wave Gradient Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-tristarc-bg to-transparent pointer-events-none z-20" />
    </section>
  );
};
