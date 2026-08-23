import type { TeamMember } from '@/types';

// ============================================================
// TRISTARC — Team Mock Data (Placeholder)
// Replace with actual team information when supplied.
// ============================================================

export const teamMembers: TeamMember[] = [
  {
    id: 'tm-001',
    name: 'Sample content — Name to be updated',
    designation: 'Director & Founder',
    category: 'Leadership',
    qualification: 'Ph.D. in Statistics',
    specialization: 'Statistical Modelling, Research Methodology',
    bio: 'Sample content — biography to be updated.',
    image: '/images/team-placeholder-1.jpg',
    featured: true,
  },
  {
    id: 'tm-002',
    name: 'Sample content — Name to be updated',
    designation: 'Head of Research',
    category: 'Leadership',
    qualification: 'M.Phil. in Social Research',
    specialization: 'Qualitative Research, Development Studies',
    bio: 'Sample content — biography to be updated.',
    image: '/images/team-placeholder-2.jpg',
    featured: true,
  },
  {
    id: 'tm-003',
    name: 'Sample content — Name to be updated',
    designation: 'Senior Analytics Consultant',
    category: 'Consultants',
    qualification: 'M.Sc. in Applied Statistics',
    specialization: 'Data Analytics, Business Intelligence',
    bio: 'Sample content — biography to be updated.',
    image: '/images/team-placeholder-3.jpg',
    featured: true,
  },
  {
    id: 'tm-004',
    name: 'Sample content — Name to be updated',
    designation: 'Lead Trainer — Statistics',
    category: 'Trainers',
    qualification: 'M.Sc. in Statistics',
    specialization: 'Statistical Training, SPSS, R',
    bio: 'Sample content — biography to be updated.',
    image: '/images/team-placeholder-4.jpg',
    featured: true,
  },
  {
    id: 'tm-005',
    name: 'Sample content — Name to be updated',
    designation: 'Research Associate',
    category: 'Researchers',
    qualification: 'M.A. in Economics',
    specialization: 'Electoral Research, Political Studies',
    bio: 'Sample content — biography to be updated.',
    image: '/images/team-placeholder-5.jpg',
  },
  {
    id: 'tm-006',
    name: 'Sample content — Name to be updated',
    designation: 'Faculty — Research Methods',
    category: 'Faculty',
    qualification: 'Ph.D. in Social Sciences',
    specialization: 'Mixed Methods, Impact Evaluation',
    bio: 'Sample content — biography to be updated.',
    image: '/images/team-placeholder-6.jpg',
  },
];

export const getFeaturedTeam = (): TeamMember[] =>
  teamMembers.filter((m) => m.featured);

export const getTeamByCategory = (category: TeamMember['category']): TeamMember[] =>
  teamMembers.filter((m) => m.category === category);
