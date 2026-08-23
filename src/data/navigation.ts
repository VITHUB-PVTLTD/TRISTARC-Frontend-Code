import type { NavItem } from '@/types';

// ============================================================
// TRISTARC — Data-driven Navigation Configuration
// DO NOT hardcode navigation in Header.tsx
// ============================================================

export const navigation: NavItem[] = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'About Us',
    path: '/about',
  },
  {
    label: 'Our Team',
    path: '/team',
  },
  {
    label: 'Services',
    children: [
      {
        label: 'Social & Development Research',
        path: '/services/social-development-research',
        icon: 'Globe',
        description: 'Research for social programs, development sector, NGOs and policy makers.',
      },
      {
        label: 'Commercial Research',
        path: '/services/commercial-research',
        icon: 'TrendingUp',
        description: 'Market intelligence and commercial insights for business decisions.',
      },
      {
        label: 'Business Research',
        path: '/services/business-research',
        icon: 'Briefcase',
        description: 'Comprehensive research solutions for corporate strategy and growth.',
      },
      {
        label: 'Data Collection and Analysis',
        path: '/services/data-collection-analysis',
        icon: 'Database',
        description: 'Systematic data collection, processing, and statistical analysis.',
      },
      {
        label: 'Ethical Consulting',
        path: '/services/ethical-consulting',
        icon: 'Shield',
        description: 'Research ethics frameworks and consulting for compliant research.',
      },
      {
        label: 'Political Research',
        path: '/services/political-research',
        icon: 'BarChart2',
        description: 'Political landscape analysis, opinion research, and policy studies.',
      },
      {
        label: 'Electoral Research',
        path: '/services/electoral-research',
        icon: 'Vote',
        description: 'Electoral studies, voter behavior analysis, and polling research.',
      },
      {
        label: 'CSR & Impact Research',
        path: '/services/csr-impact-research',
        icon: 'Heart',
        description: 'Measuring and evaluating corporate social responsibility and impact.',
      },
      {
        label: 'Institutional reveling program',
        path: '/services/institutional-reveling-program',
        icon: 'Award',
        description: 'Comprehensive institutional assessment and evaluation programs.',
      },
      {
        label: 'Employee multiparameter evaluation framework',
        path: '/services/employee-multiparameter-evaluation-framework',
        icon: 'Users',
        description: 'Multi-dimensional employee performance assessment systems.',
      },
    ],
  },
  {
    label: 'Courses',
    children: [
      {
        label: 'Academic Skills Courses',
        path: '/courses/academic-skills',
        icon: 'BookOpen',
        description: 'Foundational and advanced academic skills for research and analysis.',
      },
      {
        label: 'Research Courses',
        path: '/courses/research',
        icon: 'FlaskConical',
        description: 'Specialized research methodology and statistical training programs.',
      },
    ],
  },
  {
    label: 'E-Resources',
    path: '/e-resources',
  },
  {
    label: 'Careers',
    path: '/careers',
  },
  {
    label: 'Contact Us',
    path: '/contact',
  },
];
