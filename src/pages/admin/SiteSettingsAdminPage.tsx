import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Home, Info, Briefcase, GraduationCap, Phone, Share2,
  Save, CheckCircle2, AlertTriangle, RefreshCw, Layers, ChevronDown, ChevronUp, Globe,
  Plus, Trash2, Edit2, Upload, Image as ImageIcon, Eye, ArrowUp, ArrowDown, Sparkles,
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useSiteSettings } from '@/context/SiteSettingsContext';

// ============================================================
// TRISTARC – Admin Page-by-Page Content Settings Page
// Allows admins to update content section-by-section for every page.
// ============================================================

export interface DynamicHeroSlide {
  id: string;
  image: string; // Base64 string or image URL
  badge: string; // Manual text above headline/image
  title: string;
  headline: string;
  subheadline: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  isActive: boolean;
  sortOrder: number;
}

interface SettingRow {
  id?: string;
  key: string;
  value: string | null;
}

type PageTabId = 'homepage' | 'about' | 'services' | 'courses' | 'careers' | 'contact_global';

interface PageTab {
  id: PageTabId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const PAGE_TABS: PageTab[] = [
  { id: 'homepage', label: 'Home Page', icon: <Home size={17} />, description: 'Edit all content sections and manage Hero Carousel slides.' },
  { id: 'about', label: 'About Page', icon: <Info size={17} />, description: 'Manage vision, mission, director message and institute history.' },
  { id: 'services', label: 'Services Page', icon: <Briefcase size={17} />, description: 'Manage services page hero headline and consultancy CTA banner.' },
  { id: 'courses', label: 'Courses Page', icon: <GraduationCap size={17} />, description: 'Manage courses page headlines, academic skills & research section text.' },
  { id: 'careers', label: 'Careers Page', icon: <Briefcase size={17} />, description: 'Manage recruitment headlines, intro message, and HR contact info.' },
  { id: 'contact_global', label: 'Contact & Branding', icon: <Phone size={17} />, description: 'Global site name, tagline, address, phone numbers, email & social links.' },
];

interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  type?: 'text' | 'email' | 'url' | 'tel';
}

interface SectionGroup {
  id: string;
  title: string;
  description: string;
  fields: FieldDef[];
}

// ── Complete Field Schema Per Page ──────────────────────────────
const PAGE_SECTIONS: Record<PageTabId, SectionGroup[]> = {
  homepage: [
    {
      id: 'hp_hero',
      title: '1. Hero Section Headlines',
      description: 'Default text overrides for the homepage hero carousel',
      fields: [
        { key: 'homepage.heroBadge', label: 'Top Badge Overline Text', placeholder: 'Research · Analytics · Training · Consultancy', hint: 'Small text badge above the main title' },
        { key: 'homepage.heroTitle', label: 'Main Hero Title', placeholder: 'Tirupati Rao Institute of Statistical Training, Analytics, Research & Consultancy', hint: 'Main title on homepage' },
        { key: 'homepage.heroHeadline', label: 'Highlight Headline', placeholder: 'Excellence in Statistical Research & Analytics', hint: 'Primary bold headline in hero' },
        { key: 'homepage.heroSubheadline', label: 'Subheadline Description', placeholder: 'TRISTARC – Empowering professionals, academics, and organizations with world-class statistical research...', hint: 'Detailed supporting paragraph below headline', multiline: true, rows: 3 },
        { key: 'homepage.heroBtnPrimaryText', label: 'Primary Button Label', placeholder: 'Explore Services' },
        { key: 'homepage.heroBtnPrimaryLink', label: 'Primary Button URL / Path', placeholder: '/services' },
        { key: 'homepage.heroBtnSecondaryText', label: 'Secondary Button Label', placeholder: 'View Courses' },
        { key: 'homepage.heroBtnSecondaryLink', label: 'Secondary Button URL / Path', placeholder: '/courses' },
      ],
    },
    {
      id: 'hp_stats',
      title: '2. Hero Counter Stats',
      description: 'Metrics displayed in the floating hero stat bar',
      fields: [
        { key: 'homepage.stat1Value', label: 'Stat 1 Number/Value', placeholder: '15+' },
        { key: 'homepage.stat1Label', label: 'Stat 1 Label', placeholder: 'Years Experience' },
        { key: 'homepage.stat2Value', label: 'Stat 2 Number/Value', placeholder: '500+' },
        { key: 'homepage.stat2Label', label: 'Stat 2 Label', placeholder: 'Projects Completed' },
        { key: 'homepage.stat3Value', label: 'Stat 3 Number/Value', placeholder: '1000+' },
        { key: 'homepage.stat3Label', label: 'Stat 3 Label', placeholder: 'Students Trained' },
        { key: 'homepage.stat4Value', label: 'Stat 4 Number/Value', placeholder: '98%' },
        { key: 'homepage.stat4Label', label: 'Stat 4 Label', placeholder: 'Satisfaction Rate' },
      ],
    },
    {
      id: 'hp_about',
      title: '3. About Section Preview',
      description: 'Introductory about section displayed on homepage',
      fields: [
        { key: 'homepage.aboutBadge', label: 'Section Badge', placeholder: 'About TRISTARC' },
        { key: 'homepage.aboutTitle', label: 'Section Title', placeholder: 'Pioneering Excellence in Statistical Science' },
        { key: 'homepage.aboutBody1', label: 'Main Paragraph 1', placeholder: 'TRISTARC is a premier institute dedicated to advancing statistical education...', multiline: true, rows: 3 },
        { key: 'homepage.aboutBody2', label: 'Main Paragraph 2', placeholder: 'Founded with a vision to bridge the gap between academic theory and practical data analysis...', multiline: true, rows: 3 },
      ],
    },
    {
      id: 'hp_core',
      title: '4. Core Areas Section',
      description: 'Titles and subtitles for core specializations',
      fields: [
        { key: 'homepage.coreBadge', label: 'Section Badge', placeholder: 'Our Expertise' },
        { key: 'homepage.coreTitle', label: 'Section Title', placeholder: 'Our Core Specializations' },
        { key: 'homepage.coreSub', label: 'Section Subtitle', placeholder: 'Delivering statistical expertise across diverse domains', multiline: true, rows: 2 },
      ],
    },
    {
      id: 'hp_services',
      title: '5. Services Section Preview',
      description: 'Homepage services preview section text',
      fields: [
        { key: 'homepage.servicesTitle', label: 'Section Title', placeholder: 'Our Comprehensive Services' },
        { key: 'homepage.servicesSub', label: 'Section Subtitle', placeholder: 'Tailored statistical solutions for academia and industry', multiline: true, rows: 2 },
      ],
    },
    {
      id: 'hp_courses',
      title: '6. Courses Section Preview',
      description: 'Homepage featured courses section text',
      fields: [
        { key: 'homepage.coursesTitle', label: 'Section Title', placeholder: 'Featured Courses & Workshops' },
        { key: 'homepage.coursesSub', label: 'Section Subtitle', placeholder: 'Enhance your data science & statistical skills with expert-led training', multiline: true, rows: 2 },
      ],
    },
    {
      id: 'hp_why',
      title: '7. Why TRISTARC Section',
      description: 'Highlights explaining why clients choose TRISTARC',
      fields: [
        { key: 'homepage.whyBadge', label: 'Section Badge', placeholder: 'Why Choose Us' },
        { key: 'homepage.whyTitle', label: 'Section Title', placeholder: 'Why TRISTARC Stands Out' },
        { key: 'homepage.whySub', label: 'Section Subtitle', placeholder: 'Built on academic rigor, practical excellence, and proven client success', multiline: true, rows: 2 },
      ],
    },
    {
      id: 'hp_team',
      title: '8. Team Section Preview',
      description: 'Homepage team preview section headers',
      fields: [
        { key: 'homepage.teamBadge', label: 'Section Badge', placeholder: 'Our Experts' },
        { key: 'homepage.teamTitle', label: 'Section Title', placeholder: 'Meet Our Leadership & Advisory Team' },
      ],
    },
    {
      id: 'hp_resources',
      title: '9. E-Resources Section Preview',
      description: 'Homepage E-Resources section headers',
      fields: [
        { key: 'homepage.resourcesBadge', label: 'Section Badge', placeholder: 'Free Knowledge' },
        { key: 'homepage.resourcesTitle', label: 'Section Title', placeholder: 'E-Resources & Learning Materials' },
      ],
    },
    {
      id: 'hp_cta',
      title: '10. Call-To-Action Banners',
      description: 'Bottom call-to-action banners for Careers and Contact',
      fields: [
        { key: 'homepage.careersCtaTitle', label: 'Careers Banner Title', placeholder: 'Build Your Career With TRISTARC' },
        { key: 'homepage.careersCtaDesc', label: 'Careers Banner Description', placeholder: 'Join our team of expert statisticians and researchers.', multiline: true, rows: 2 },
        { key: 'homepage.contactCtaTitle', label: 'Contact Banner Title', placeholder: 'Ready to Transform Your Research or Project?' },
        { key: 'homepage.contactCtaDesc', label: 'Contact Banner Description', placeholder: 'Get in touch with our expert team for custom statistical consulting.', multiline: true, rows: 2 },
      ],
    },
  ],
  about: [
    {
      id: 'ab_hero',
      title: 'About Page Hero & Overview',
      description: 'Page title, main paragraph and background information',
      fields: [
        { key: 'about.heroTitle', label: 'Page Hero Title', placeholder: 'About TRISTARC Institute' },
        { key: 'about.heroSub', label: 'Page Hero Subtitle', placeholder: 'Empowering excellence in statistical science, analytics, and research since inception.' },
        { key: 'about.paragraph', label: 'Main About Paragraph', placeholder: 'Full institute story and detailed overview...', multiline: true, rows: 5 },
      ],
    },
    {
      id: 'ab_vision_mission',
      title: 'Vision & Mission Statements',
      description: 'Institute vision, mission and core goals',
      fields: [
        { key: 'about.vision', label: 'Vision Statement', placeholder: 'To be a globally recognized center of excellence in statistical education and research...', multiline: true, rows: 3 },
        { key: 'about.mission', label: 'Mission Statement', placeholder: 'To deliver high-impact statistical training, rigorous data analytics, and consultancy...', multiline: true, rows: 3 },
        { key: 'about.directorMessage', label: "Director's / Leader's Message", placeholder: 'Message from the leadership team...', multiline: true, rows: 4 },
      ],
    },
  ],
  services: [
    {
      id: 'serv_main',
      title: 'Services Page Content',
      description: 'Hero headlines and consultation text for the Services page',
      fields: [
        { key: 'services.heroTitle', label: 'Services Page Title', placeholder: 'Statistical Research & Analytics Services' },
        { key: 'services.heroSub', label: 'Services Page Subtitle', placeholder: 'Comprehensive statistical solutions tailored for researchers, PhD scholars, and corporate clients.' },
        { key: 'services.consultationText', label: 'Consultation Banner Text', placeholder: 'Need custom statistical analysis for your project or thesis? Talk to our experts today.', multiline: true, rows: 2 },
      ],
    },
  ],
  courses: [
    {
      id: 'crs_main',
      title: 'Courses Page Content',
      description: 'Hero text and section introductions for Academic & Research courses',
      fields: [
        { key: 'courses.heroTitle', label: 'Courses Page Title', placeholder: 'Professional Statistical Courses & Workshops' },
        { key: 'courses.heroSub', label: 'Courses Page Subtitle', placeholder: 'Master statistical tools, data science, and research methodology with hands-on training.' },
        { key: 'courses.academicIntro', label: 'Academic Skills Section Intro', placeholder: 'Tailored programs designed to boost quantitative and data skills for academic success.', multiline: true, rows: 2 },
        { key: 'courses.researchIntro', label: 'Research Courses Section Intro', placeholder: 'Advanced research methodology and statistical modeling programs.', multiline: true, rows: 2 },
      ],
    },
  ],
  careers: [
    {
      id: 'car_main',
      title: 'Careers Page Content',
      description: 'Hero text, intro message, and HR recruitment contact information',
      fields: [
        { key: 'careers.heroTitle', label: 'Careers Page Title', placeholder: 'Join the TRISTARC Team' },
        { key: 'careers.heroSub', label: 'Careers Page Subtitle', placeholder: 'Explore exciting career opportunities in statistical research, training, and data analytics.' },
        { key: 'careers.hrEmail', label: 'HR Recruitment Email', placeholder: 'careers@tristarc.in', type: 'email', hint: 'Email displayed for direct CV submissions' },
      ],
    },
  ],
  contact_global: [
    {
      id: 'cg_branding',
      title: 'Global Branding & Identity',
      description: 'Global site name, tagline and footer copy',
      fields: [
        { key: 'site.name', label: 'Institute / Site Name', placeholder: 'TRISTARC' },
        { key: 'site.tagline', label: 'Global Tagline', placeholder: 'Research | Analytics | Training | Consultancy' },
        { key: 'site.description', label: 'Global Site Description (Meta)', placeholder: 'Premier institute dedicated to statistical training and consultancy...', multiline: true, rows: 3 },
      ],
    },
    {
      id: 'cg_contact',
      title: 'Contact Details & Address',
      description: 'Official address, email, phone numbers, and office hours',
      fields: [
        { key: 'contact.address', label: 'Full Mailing Address', placeholder: '123 Main St, City, State 500001', multiline: true, rows: 2 },
        { key: 'contact.email', label: 'Primary Contact Email', placeholder: 'info@tristarc.in', type: 'email' },
        { key: 'contact.phone', label: 'Primary Contact Phone', placeholder: '+91 99999 99999', type: 'tel' },
        { key: 'contact.workingHours', label: 'Office Working Hours', placeholder: 'Mon - Sat: 9:00 AM - 6:00 PM' },
      ],
    },
    {
      id: 'cg_social',
      title: 'Social Media Profiles',
      description: 'Links to official social media channels',
      fields: [
        { key: 'social.linkedin', label: 'LinkedIn Profile URL', placeholder: 'https://linkedin.com/company/tristarc', type: 'url' },
        { key: 'social.twitter', label: 'Twitter / X Profile URL', placeholder: 'https://twitter.com/tristarc', type: 'url' },
        { key: 'social.facebook', label: 'Facebook Page URL', placeholder: 'https://facebook.com/tristarc', type: 'url' },
        { key: 'social.youtube', label: 'YouTube Channel URL', placeholder: 'https://youtube.com/@tristarc', type: 'url' },
      ],
    },
  ],
};

// ── Reusable Input Field ──────────────────────────────
const SettingInput: React.FC<{
  field: FieldDef;
  value: string;
  onChange: (key: string, val: string) => void;
}> = ({ field, value, onChange }) => (
  <div className="space-y-1.5">
    <label htmlFor={`f-${field.key}`} className="block text-xs font-bold text-tristarc-text-primary uppercase tracking-wide">
      {field.label}
    </label>
    {field.multiline ? (
      <textarea
        id={`f-${field.key}`}
        rows={field.rows ?? 3}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        className="form-input text-sm resize-y font-normal"
      />
    ) : (
      <input
        id={`f-${field.key}`}
        type={field.type ?? 'text'}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        className="form-input text-sm font-normal"
      />
    )}
    {field.hint && <p className="text-[11px] text-tristarc-text-muted">{field.hint}</p>}
  </div>
);

// ── Hero Slide Manager Component ──────────────────────
const HeroSlideManager: React.FC<{
  jsonValue: string;
  onUpdateJson: (json: string) => void;
}> = ({ jsonValue, onUpdateJson }) => {
  const [slides, setSlides] = useState<DynamicHeroSlide[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<DynamicHeroSlide | null>(null);
  const [uploadError, setUploadError] = useState('');

  // Initial Form State
  const emptySlideForm = (): DynamicHeroSlide => ({
    id: `slide-${Date.now()}`,
    image: '/images/hero/hero_analytics.jpg',
    badge: 'Research · Analytics · Training · Consultancy',
    title: 'Tirupati Rao Institute of Statistical Training, Analytics, Research & Consultancy',
    headline: 'Excellence in Statistical Research & Analytics',
    subheadline: 'TRISTARC – Empowering professionals, academics, and organizations with world-class statistical solutions.',
    primaryBtnText: 'Explore Services',
    primaryBtnLink: '/services',
    secondaryBtnText: 'View Courses',
    secondaryBtnLink: '/courses',
    isActive: true,
    sortOrder: 0,
  });

  const [form, setForm] = useState<DynamicHeroSlide>(emptySlideForm());

  // Parse JSON value into slides state
  useEffect(() => {
    if (!jsonValue) {
      setSlides([]);
      return;
    }
    try {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed)) {
        setSlides(parsed);
      }
    } catch {
      setSlides([]);
    }
  }, [jsonValue]);

  const updateAndSaveSlides = (newSlides: DynamicHeroSlide[]) => {
    setSlides(newSlides);
    onUpdateJson(JSON.stringify(newSlides));
  };

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setForm(emptySlideForm());
    setUploadError('');
    setShowModal(true);
  };

  const handleOpenEdit = (slide: DynamicHeroSlide) => {
    setEditingSlide(slide);
    setForm({ ...slide });
    setUploadError('');
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Convert file to Base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setForm((f) => ({ ...f, image: reader.result as string }));
        setUploadError('');
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSlide = () => {
    if (!form.headline.trim()) {
      setUploadError('Headline is required.');
      return;
    }
    if (!form.image.trim()) {
      setUploadError('Background image is required.');
      return;
    }

    let updated: DynamicHeroSlide[];
    if (editingSlide) {
      updated = slides.map((s) => (s.id === editingSlide.id ? form : s));
    } else {
      updated = [...slides, { ...form, id: `slide-${Date.now()}` }];
    }

    updateAndSaveSlides(updated);
    setShowModal(false);
  };

  const handleDeleteSlide = (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    const updated = slides.filter((s) => s.id !== id);
    updateAndSaveSlides(updated);
  };

  const handleToggleActive = (id: string) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    updateAndSaveSlides(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateAndSaveSlides(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-tristarc-border shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-tristarc-border">
        <div>
          <h3 className="font-bold text-base text-tristarc-text-primary flex items-center gap-2">
            <ImageIcon size={18} className="text-primary" />
            Hero Carousel Slide Manager
          </h3>
          <p className="text-xs text-tristarc-text-muted mt-0.5">
            Add custom slides with manual text overlines and uploaded Base64 background images stored in the database.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={15} /> Add New Hero Slide
        </button>
      </div>

      {/* Slide List */}
      {slides.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <ImageIcon size={28} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-tristarc-text-secondary">No custom slides added yet.</p>
          <p className="text-xs text-tristarc-text-muted mt-1 mb-4">
            The homepage is currently displaying default curated slides. Click below to add your first slide.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn-primary btn-sm inline-flex items-center gap-1.5"
          >
            <Plus size={15} /> Create Hero Slide
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${s.isActive ? 'bg-white border-tristarc-border shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
            >
              {/* Left Thumbnail & Info */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-gray-200 relative">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[9px] font-mono px-1 rounded">
                    0{idx + 1}
                  </span>
                </div>

                {/* Text Summary */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-accent-orange bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full truncate max-w-[200px]">
                      {s.badge || 'Manual Badge Text'}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {s.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-tristarc-text-primary truncate">
                    {s.title || s.headline}
                  </h4>
                  <p className="text-xs text-tristarc-text-muted truncate max-w-lg mt-0.5">
                    {s.headline}
                  </p>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                {/* Move Up/Down */}
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === slides.length - 1}
                  className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown size={15} />
                </button>

                {/* Edit & Delete */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 text-gray-600 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                  title="Edit Slide"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(s.id)}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Slide"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-tristarc-border overflow-hidden z-10 my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-base text-tristarc-text-primary flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" />
                  {editingSlide ? 'Edit Hero Carousel Slide' : 'Add New Hero Carousel Slide'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200/60"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {uploadError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertTriangle size={15} /> {uploadError}
                  </div>
                )}

                {/* Base64 File Uploader */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-tristarc-text-primary uppercase tracking-wide">
                    Slide Background Image * (Stored as Base64 in Database)
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Image Preview */}
                    <div className="w-full sm:w-44 h-28 rounded-xl bg-slate-900 border border-gray-200 overflow-hidden relative shrink-0 flex items-center justify-center">
                      {form.image ? (
                        <img src={form.image} alt="Slide Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-2 text-gray-400">
                          <ImageIcon size={24} className="mx-auto mb-1 opacity-50" />
                          <span className="text-[10px]">No Image Selected</span>
                        </div>
                      )}
                    </div>

                    {/* File Input */}
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="file"
                        accept="image/*"
                        id="slide-file-input"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="slide-file-input"
                        className="btn-outline btn-sm inline-flex items-center gap-2 cursor-pointer border-dashed border-gray-300 hover:border-primary w-full justify-center py-3"
                      >
                        <Upload size={15} className="text-primary" />
                        <span>Choose Image File to Convert to Base64</span>
                      </label>
                      <p className="text-[11px] text-tristarc-text-muted">
                        Select any PNG or JPG banner image. It will be converted into a Base64 Data URL and saved in PostgreSQL.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manual Text Above Image / Badge */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-tristarc-text-primary uppercase tracking-wide">
                    Manual Overline Badge Text (Displayed Above Headline)
                  </label>
                  <input
                    type="text"
                    className="form-input text-sm"
                    placeholder="e.g. Research · Analytics · Training · Consultancy"
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                  />
                  <p className="text-[11px] text-tristarc-text-muted">
                    This manual text pill appears prominently above the main slide title/image overlay.
                  </p>
                </div>

                {/* Slide Title */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-tristarc-text-primary uppercase tracking-wide">
                    Main Slide Title
                  </label>
                  <input
                    type="text"
                    className="form-input text-sm font-semibold"
                    placeholder="e.g. Tirupati Rao Institute of Statistical Training..."
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>

                {/* Highlight Headline */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-tristarc-text-primary uppercase tracking-wide">
                    Highlight Headline *
                  </label>
                  <input
                    type="text"
                    className="form-input text-sm"
                    placeholder="e.g. Excellence in Statistical Research & Analytics"
                    value={form.headline}
                    onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                  />
                </div>

                {/* Subheadline Paragraph */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-tristarc-text-primary uppercase tracking-wide">
                    Subheadline Description
                  </label>
                  <textarea
                    rows={3}
                    className="form-input text-sm resize-y"
                    placeholder="e.g. Empowering professionals, academics, and organizations..."
                    value={form.subheadline}
                    onChange={(e) => setForm((f) => ({ ...f, subheadline: e.target.value }))}
                  />
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-tristarc-text-primary uppercase tracking-wide">
                      Primary Button Label
                    </label>
                    <input
                      type="text"
                      className="form-input text-sm"
                      placeholder="Explore Services"
                      value={form.primaryBtnText}
                      onChange={(e) => setForm((f) => ({ ...f, primaryBtnText: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-tristarc-text-primary uppercase tracking-wide">
                      Primary Button URL / Path
                    </label>
                    <input
                      type="text"
                      className="form-input text-sm"
                      placeholder="/services"
                      value={form.primaryBtnLink}
                      onChange={(e) => setForm((f) => ({ ...f, primaryBtnLink: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-tristarc-text-primary uppercase tracking-wide">
                      Secondary Button Label
                    </label>
                    <input
                      type="text"
                      className="form-input text-sm"
                      placeholder="View Courses"
                      value={form.secondaryBtnText}
                      onChange={(e) => setForm((f) => ({ ...f, secondaryBtnText: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-tristarc-text-primary uppercase tracking-wide">
                      Secondary Button URL / Path
                    </label>
                    <input
                      type="text"
                      className="form-input text-sm"
                      placeholder="/courses"
                      value={form.secondaryBtnLink}
                      onChange={(e) => setForm((f) => ({ ...f, secondaryBtnLink: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="slideActiveToggle"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="slideActiveToggle" className="text-sm font-semibold text-tristarc-text-primary">
                    Active (Display this slide in homepage carousel)
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-5 bg-gray-50 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200/70 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSlide}
                  className="btn-primary btn-sm flex items-center gap-2"
                >
                  <Save size={15} /> {editingSlide ? 'Update Slide' : 'Add Slide'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Page Component ─────────────────────────────
const SiteSettingsAdminPage: React.FC = () => {
  const { refreshSettings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<PageTabId>('homepage');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Expand all sections by default when tab changes
  useEffect(() => {
    const initialOpen: Record<string, boolean> = {};
    PAGE_SECTIONS[activeTab].forEach((sec) => {
      initialOpen[sec.id] = true;
    });
    setOpenSections(initialOpen);
  }, [activeTab]);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const rows: SettingRow[] = (await adminService.getSettings()) as unknown as SettingRow[];
      const map: Record<string, string> = {};
      if (Array.isArray(rows)) {
        rows.forEach((r) => {
          map[r.key] = r.value ?? '';
        });
      } else if (typeof rows === 'object') {
        Object.entries(rows as Record<string, string>).forEach(([k, v]) => {
          map[k] = v ?? '';
        });
      }
      setValues(map);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load website settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (key: string, value: string) => {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSavePage = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const sections = PAGE_SECTIONS[activeTab];
      const updates: Array<{ key: string; value: string; label?: string }> = [];
      sections.forEach((sec) => {
        sec.fields.forEach((f) => {
          updates.push({
            key: f.key,
            value: values[f.key] ?? '',
            label: f.label,
          });
        });
      });

      // Also include homepage.heroSlidesJson if editing homepage
      if (activeTab === 'homepage' && values['homepage.heroSlidesJson']) {
        updates.push({
          key: 'homepage.heroSlidesJson',
          value: values['homepage.heroSlidesJson'],
          label: 'Hero Carousel Slides JSON',
        });
      }

      await adminService.updateSettings(updates);
      setSaved(true);
      await refreshSettings();
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const currentTabInfo = PAGE_TABS.find((t) => t.id === activeTab)!;
  const currentSections = PAGE_SECTIONS[activeTab];

  return (
    <>
      <Helmet>
        <title>Page Content Settings | TRISTARC Admin</title>
      </Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-tristarc-text-primary flex items-center gap-2">
              <Settings size={22} className="text-primary" />
              Website Page-by-Page Content Settings
            </h1>
            <p className="text-sm text-tristarc-text-muted mt-1">
              Select a page below to edit and customize the content of all its sections in real time.
            </p>
          </div>
          <button
            onClick={loadSettings}
            className="btn-ghost btn-sm flex items-center gap-2 self-start sm:self-auto"
            title="Reload settings"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
            >
              <AlertTriangle size={16} className="shrink-0" /> {error}
            </motion.div>
          )}
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2"
            >
              <CheckCircle2 size={16} className="shrink-0" /> Content updated successfully! Changes are live on the public website.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Layout */}
        <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden">
          {/* Page Tabs Header */}
          <div className="flex items-center border-b border-tristarc-border overflow-x-auto bg-gray-50/50">
            {PAGE_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSaved(false);
                    setError('');
                  }}
                  className={`flex items-center gap-2.5 px-5 py-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 focus-visible:outline-none cursor-pointer ${isActive
                      ? 'border-primary text-primary bg-white shadow-sm'
                      : 'border-transparent text-tristarc-text-muted hover:text-tristarc-text-primary hover:bg-gray-100/60'
                    }`}
                >
                  <span className={isActive ? 'text-primary' : 'text-gray-400'}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Tab Info Banner */}
          <div className="p-4 sm:p-6 border-b border-tristarc-border bg-gradient-to-r from-primary-light/30 to-transparent flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white text-primary shadow-sm border border-gray-100">
                {currentTabInfo.icon}
              </div>
              <div>
                <h2 className="font-bold text-tristarc-text-primary text-base sm:text-lg">
                  Editing: {currentTabInfo.label}
                </h2>
                <p className="text-xs text-tristarc-text-muted mt-0.5">{currentTabInfo.description}</p>
              </div>
            </div>

            <button
              onClick={handleSavePage}
              disabled={saving || loading}
              className="btn-primary btn-md flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving...' : `Save ${currentTabInfo.label} Content`}
            </button>
          </div>

          {/* Section Editors Accordions */}
          <div className="p-4 sm:p-6 space-y-4 bg-gray-50/30">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-white rounded-xl border border-tristarc-border animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Hero Slides Manager Panel (Visible when editing Homepage) */}
                {activeTab === 'homepage' && (
                  <HeroSlideManager
                    jsonValue={values['homepage.heroSlidesJson'] ?? ''}
                    onUpdateJson={(json) => handleChange('homepage.heroSlidesJson', json)}
                  />
                )}

                {currentSections.map((section) => {
                  const isOpen = !!openSections[section.id];
                  return (
                    <div
                      key={section.id}
                      className="bg-white rounded-xl border border-tristarc-border shadow-sm overflow-hidden transition-all"
                    >
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50/70 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100 text-tristarc-text-secondary">
                            <Layers size={16} />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-tristarc-text-primary">
                              {section.title}
                            </h3>
                            <p className="text-xs text-tristarc-text-muted mt-0.5">
                              {section.description} ({section.fields.length} fields)
                            </p>
                          </div>
                        </div>
                        <div className="text-tristarc-text-muted hover:text-tristarc-text-primary">
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </button>

                      {/* Accordion Body */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-tristarc-border p-5 bg-white space-y-4"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {section.fields.map((field) => (
                                <div
                                  key={field.key}
                                  className={field.multiline ? 'sm:col-span-2' : 'sm:col-span-1'}
                                >
                                  <SettingInput
                                    field={field}
                                    value={values[field.key] ?? ''}
                                    onChange={handleChange}
                                  />
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Bottom Save Bar */}
          <div className="px-6 py-4 bg-white border-t border-tristarc-border flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-tristarc-text-muted">
              Remember to click <strong>Save</strong> after updating fields or slides on this page.
            </p>
            <button
              onClick={handleSavePage}
              disabled={saving || loading}
              className="btn-primary btn-md flex items-center gap-2"
            >
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving...' : `Save ${currentTabInfo.label} Content`}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SiteSettingsAdminPage;
