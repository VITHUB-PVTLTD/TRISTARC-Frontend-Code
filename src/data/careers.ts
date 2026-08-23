import type { Job } from '@/types';

// ============================================================
// TRISTARC — Careers Mock Data
// ============================================================

export const jobs: Job[] = [
  {
    id: 'job-001',
    title: 'Research Analyst',
    department: 'Research & Analytics',
    location: 'Sample content — Location to be updated',
    employmentType: 'Full-time',
    experience: '1–3 years',
    deadline: 'Sample content — Deadline to be updated',
    description: 'We are looking for a Research Analyst to support our quantitative and qualitative research projects. The ideal candidate has a strong foundation in research methodology, data collection, and statistical analysis.',
    responsibilities: [
      'Design and administer quantitative surveys',
      'Conduct data analysis using SPSS or R',
      'Prepare research reports and presentations',
      'Coordinate fieldwork activities',
      'Literature review and secondary research',
    ],
    requirements: [
      "Master's degree in Statistics, Social Sciences, or related field",
      'Proficiency in SPSS, R, or similar statistical software',
      'Strong written and verbal communication skills',
      'Attention to detail and analytical mindset',
    ],
    featured: true,
  },
  {
    id: 'job-002',
    title: 'Statistical Trainer',
    department: 'Training & Education',
    location: 'Sample content — Location to be updated',
    employmentType: 'Full-time',
    experience: '2–5 years',
    deadline: 'Sample content — Deadline to be updated',
    description: 'TRISTARC seeks an experienced Statistical Trainer to design and deliver training programs in statistics, research methodology, and data analysis for professional and academic audiences.',
    responsibilities: [
      'Develop training curriculum and materials',
      'Deliver classroom and online training sessions',
      'Assess participant progress and provide feedback',
      'Continuously update course content',
    ],
    requirements: [
      "Master's/Ph.D. in Statistics or Mathematics",
      'Prior training or teaching experience',
      'Expertise in SPSS, R, or Python',
      'Excellent communication and presentation skills',
    ],
    featured: true,
  },
  {
    id: 'job-003',
    title: 'Qualitative Research Coordinator',
    department: 'Research & Analytics',
    location: 'Sample content — Location to be updated',
    employmentType: 'Full-time',
    experience: '2–4 years',
    deadline: 'Sample content — Deadline to be updated',
    description: 'Responsible for coordinating qualitative research activities including in-depth interviews, focus group discussions, data coding, and analysis using NVivo.',
    responsibilities: [
      'Coordinate and conduct in-depth interviews and FGDs',
      'Manage qualitative data using NVivo',
      'Perform thematic and content analysis',
      'Prepare qualitative research reports',
    ],
    requirements: [
      "Master's in Social Sciences, Anthropology, or related field",
      'Experience with qualitative data collection',
      'Proficiency in NVivo or Atlas.ti',
      'Strong interpersonal and communication skills',
    ],
  },
  {
    id: 'job-004',
    title: 'Analytics Consultant',
    department: 'Consultancy',
    location: 'Sample content — Location to be updated',
    employmentType: 'Contract',
    experience: '3–6 years',
    deadline: 'Sample content — Deadline to be updated',
    description: 'Senior analytics consultant role to deliver data-driven consulting engagements across commercial, social, and political research domains.',
    responsibilities: [
      'Lead analytics engagements for client projects',
      'Design analytical frameworks and models',
      'Present findings to senior client stakeholders',
      'Mentor junior analysts',
    ],
    requirements: [
      "Master's or Ph.D. in Statistics, Economics, or related field",
      'Strong expertise in statistical modelling and data analysis',
      'Excellent consulting and client management skills',
      'Experience in delivering analytical reports',
    ],
  },
];

export const getFeaturedJobs = (): Job[] =>
  jobs.filter((j) => j.featured);
