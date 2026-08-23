import type { SiteConfig } from '@/types';

// ============================================================
// TRISTARC — Site Configuration
// Replace placeholder values with real info when supplied
// ============================================================

export const siteConfig: SiteConfig = {
  name: 'TRISTARC',
  fullName: 'Tirupati Rao Institute of Statistical Training, Analytics, Research & Consultancy',
  tagline: 'Research | Analytics | Training | Consultancy',
  description:
    'TRISTARC is a premier institute dedicated to statistical training, analytics, research, and consultancy. We provide world-class research services and professional training programs that empower individuals and organizations to harness the power of data.',

  contact: {
    address: 'Content to be updated — Address to be supplied',
    email: 'content@tobeupated.example',
    phone: 'Content to be updated — Phone to be supplied',
  },

  social: {
    twitter: '#',
    linkedin: '#',
    facebook: '#',
    youtube: '#',
  },
};

export const coreAreas = [
  {
    id: 'ca-1',
    icon: 'BarChart3',
    title: 'Statistical Training',
    description:
      'Comprehensive training programs in statistical methods, research design, and data analysis for professionals and academics.',
    color: '#154A8F',
  },
  {
    id: 'ca-2',
    icon: 'LineChart',
    title: 'Analytics',
    description:
      'Advanced analytics services translating complex datasets into clear, actionable insights for informed decision-making.',
    color: '#F28C28',
  },
  {
    id: 'ca-3',
    icon: 'FlaskConical',
    title: 'Research',
    description:
      'Rigorous, multi-disciplinary research covering social, commercial, political, and institutional domains.',
    color: '#1E8A3A',
  },
  {
    id: 'ca-4',
    icon: 'Lightbulb',
    title: 'Consultancy',
    description:
      'Expert advisory and consulting services helping organizations design studies, interpret data, and derive value from research.',
    color: '#D43224',
  },
];

export const whyTristarc = [
  {
    id: 'why-1',
    icon: 'Award',
    title: 'Research-oriented Learning',
    description: 'Our programs are built on active research practices — not just theoretical instruction.',
  },
  {
    id: 'why-2',
    icon: 'Database',
    title: 'Data-focused Methodology',
    description: 'Every engagement is grounded in robust data collection, validation, and analysis.',
  },
  {
    id: 'why-3',
    icon: 'BarChart2',
    title: 'Statistical Expertise',
    description: 'Deep domain expertise in statistics, from foundational concepts to advanced modelling.',
  },
  {
    id: 'why-4',
    icon: 'Target',
    title: 'Practical Analytical Approach',
    description: 'We emphasize practical application of analytical skills, ensuring readiness for real-world challenges.',
  },
  {
    id: 'why-5',
    icon: 'Users',
    title: 'Professional Training',
    description: 'Structured professional development programs designed to build career-ready competencies.',
  },
  {
    id: 'why-6',
    icon: 'Lightbulb',
    title: 'Consultancy-oriented Solutions',
    description: 'Our consultancy approach ensures recommendations are actionable, evidence-based, and impactful.',
  },
];
