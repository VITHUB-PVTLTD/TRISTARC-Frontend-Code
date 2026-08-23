import type { Course } from '@/types';

// ============================================================
// TRISTARC — Courses Mock Data
// ============================================================

export const courses: Course[] = [
  // ── Academic Skills Courses ──────────────────────────────
  {
    id: 'asc-001',
    title: 'Fundamentals of Research Methodology',
    slug: 'fundamentals-research-methodology',
    category: 'academic-skills',
    shortDescription: 'Learn the core principles of designing and conducting structured research.',
    description:
      'A comprehensive introductory course covering the full research lifecycle — from problem formulation and literature review to data collection, analysis, and report writing. Ideal for students and early-career professionals entering research.',
    duration: '8 Weeks',
    mode: 'Hybrid',
    level: 'Beginner',
    image: '/images/course-research-methodology.jpg',
    outcomes: [
      'Understand the research process from ideation to publication',
      'Design effective quantitative and qualitative studies',
      'Apply basic statistical analysis using SPSS or Excel',
      'Write structured research reports',
    ],
    curriculum: [
      {
        title: 'Module 1: Introduction to Research',
        topics: ['What is Research?', 'Types of Research', 'Research Process Overview'],
      },
      {
        title: 'Module 2: Problem Formulation',
        topics: ['Research Problem Definition', 'Literature Review', 'Research Questions & Hypotheses'],
      },
      {
        title: 'Module 3: Research Design',
        topics: ['Quantitative Design', 'Qualitative Design', 'Mixed Methods'],
      },
      {
        title: 'Module 4: Data Collection',
        topics: ['Survey Design', 'Sampling Methods', 'Data Collection Tools'],
      },
      {
        title: 'Module 5: Data Analysis Basics',
        topics: ['Descriptive Statistics', 'Introduction to SPSS', 'Data Interpretation'],
      },
      {
        title: 'Module 6: Report Writing',
        topics: ['Structure of Research Reports', 'Academic Writing', 'Citation & References'],
      },
    ],
    eligibility: 'Graduates or final-year students from any discipline. No prior research experience required.',
    whoShouldAttend: [
      'Final-year UG/PG students',
      'Early-career researchers',
      'NGO and development sector professionals',
      'Journalists and policy analysts',
    ],
    trainer: 'Sample content — trainer to be updated.',
    featured: true,
  },
  {
    id: 'asc-002',
    title: 'Academic Writing & Communication',
    slug: 'academic-writing-communication',
    category: 'academic-skills',
    shortDescription: 'Develop professional academic writing skills for reports, papers, and proposals.',
    description:
      'A focused skills program on academic writing, argumentation, and scholarly communication. Covers research proposal writing, academic papers, literature reviews, and presenting research findings effectively.',
    duration: '6 Weeks',
    mode: 'Online',
    level: 'Beginner',
    image: '/images/course-academic-writing.jpg',
    outcomes: [
      'Write clear, structured academic documents',
      'Develop a compelling research proposal',
      'Master citation formats (APA, MLA, Chicago)',
      'Present research findings professionally',
    ],
    curriculum: [
      {
        title: 'Module 1: Academic Writing Fundamentals',
        topics: ['Structure of Academic Documents', 'Formal vs. Informal Writing', 'Clarity and Precision'],
      },
      {
        title: 'Module 2: Literature Review',
        topics: ['Searching Academic Databases', 'Synthesizing Sources', 'Critical Analysis'],
      },
      {
        title: 'Module 3: Research Proposals',
        topics: ['Proposal Structure', 'Writing Objectives', 'Budget and Timeline'],
      },
      {
        title: 'Module 4: Citation & Referencing',
        topics: ['APA Style', 'MLA Style', 'Plagiarism and Integrity'],
      },
    ],
    eligibility: 'Students, researchers, and professionals who write or plan to write academic content.',
    whoShouldAttend: ['Graduate students', 'Research scholars', 'Academic faculty', 'Policy writers'],
    trainer: 'Sample content — trainer to be updated.',
  },
  {
    id: 'asc-003',
    title: 'Statistics for Non-Statisticians',
    slug: 'statistics-non-statisticians',
    category: 'academic-skills',
    shortDescription: 'A practical introduction to statistics for professionals from any field.',
    description:
      'Designed for professionals and researchers who need to understand and use statistics without a mathematics background. Covers descriptive statistics, probability, basic inferential tests, and practical data interpretation.',
    duration: '10 Weeks',
    mode: 'Hybrid',
    level: 'Beginner',
    image: '/images/course-statistics.jpg',
    outcomes: [
      'Understand core statistical concepts',
      'Read and interpret statistical outputs',
      'Perform basic statistical tests',
      'Communicate statistical findings to non-technical audiences',
    ],
    curriculum: [
      {
        title: 'Module 1: Introduction to Statistics',
        topics: ['Why Statistics?', 'Types of Data', 'Levels of Measurement'],
      },
      {
        title: 'Module 2: Descriptive Statistics',
        topics: ['Measures of Central Tendency', 'Measures of Dispersion', 'Data Visualization'],
      },
      {
        title: 'Module 3: Probability Basics',
        topics: ['Probability Concepts', 'Normal Distribution', 'Confidence Intervals'],
      },
      {
        title: 'Module 4: Inferential Statistics',
        topics: ['Hypothesis Testing', 't-tests', 'Chi-Square Test', 'Correlation'],
      },
    ],
    eligibility: 'Any graduate, professional, or researcher with basic numeracy skills.',
    whoShouldAttend: ['Social science researchers', 'Healthcare professionals', 'HR and management professionals', 'Journalists'],
    trainer: 'Sample content — trainer to be updated.',
  },

  // ── Research Courses ─────────────────────────────────────
  {
    id: 'rc-001',
    title: 'Advanced Statistical Analysis',
    slug: 'advanced-statistical-analysis',
    category: 'research',
    shortDescription: 'Master advanced statistical techniques for rigorous research analysis.',
    description:
      'An advanced course covering multivariate statistical methods, regression modelling, factor analysis, and structural equation modelling. Designed for researchers who already understand basic statistics and wish to deepen their analytical capabilities.',
    duration: '12 Weeks',
    mode: 'Hybrid',
    level: 'Advanced',
    image: '/images/course-advanced-stats.jpg',
    outcomes: [
      'Apply multivariate statistical techniques',
      'Build and interpret regression models',
      'Conduct factor analysis and PCA',
      'Use SEM for complex research designs',
      'Use R or SPSS for advanced analysis',
    ],
    curriculum: [
      {
        title: 'Module 1: Review of Core Statistics',
        topics: ['Parametric and Non-Parametric Tests', 'ANOVA and MANOVA'],
      },
      {
        title: 'Module 2: Multiple Regression',
        topics: ['Linear Regression', 'Logistic Regression', 'Assumptions & Diagnostics'],
      },
      {
        title: 'Module 3: Factor Analysis',
        topics: ['Exploratory Factor Analysis', 'Confirmatory Factor Analysis'],
      },
      {
        title: 'Module 4: Structural Equation Modelling',
        topics: ['SEM Concepts', 'Path Analysis', 'Model Fit Indices'],
      },
      {
        title: 'Module 5: Statistical Software',
        topics: ['R for Statistical Analysis', 'SPSS Advanced', 'Reporting Results'],
      },
    ],
    eligibility: 'Participants should have a working knowledge of basic statistics.',
    whoShouldAttend: [
      'PhD scholars',
      'Academic researchers',
      'Senior analysts',
      'Research professionals',
    ],
    trainer: 'Sample content — trainer to be updated.',
    featured: true,
  },
  {
    id: 'rc-002',
    title: 'Qualitative Research Methods',
    slug: 'qualitative-research-methods',
    category: 'research',
    shortDescription: 'Develop expertise in qualitative data collection, analysis, and reporting.',
    description:
      'A comprehensive course on qualitative research methods covering ethnography, in-depth interviews, focus group discussions, thematic analysis, and qualitative data software tools like NVivo.',
    duration: '8 Weeks',
    mode: 'Online',
    level: 'Intermediate',
    image: '/images/course-qualitative.jpg',
    outcomes: [
      'Design rigorous qualitative studies',
      'Conduct interviews and FGDs effectively',
      'Apply thematic and content analysis',
      'Use NVivo for qualitative data management',
      'Present qualitative findings professionally',
    ],
    curriculum: [
      {
        title: 'Module 1: Introduction to Qualitative Research',
        topics: ['Qualitative Paradigm', 'When to Use Qualitative Methods', 'Research Design'],
      },
      {
        title: 'Module 2: Data Collection Methods',
        topics: ['In-depth Interviews', 'Focus Group Discussions', 'Observation'],
      },
      {
        title: 'Module 3: Data Analysis',
        topics: ['Thematic Analysis', 'Content Analysis', 'Grounded Theory Basics'],
      },
      {
        title: 'Module 4: NVivo',
        topics: ['Introduction to NVivo', 'Coding and Categorization', 'Reporting'],
      },
    ],
    eligibility: 'Researchers, students, and professionals working in social sciences, health, or development.',
    whoShouldAttend: ['Social researchers', 'Development professionals', 'Healthcare researchers', 'Academic faculty'],
    trainer: 'Sample content — trainer to be updated.',
  },
  {
    id: 'rc-003',
    title: 'Survey Research & Questionnaire Design',
    slug: 'survey-research-questionnaire-design',
    category: 'research',
    shortDescription: 'Design robust surveys and questionnaires for high-quality data collection.',
    description:
      'A specialized course on the science and art of survey research — covering questionnaire design principles, scale construction, sampling strategies, pilot testing, and online survey platforms.',
    duration: '6 Weeks',
    mode: 'Online',
    level: 'Intermediate',
    image: '/images/course-survey.jpg',
    outcomes: [
      'Design valid and reliable questionnaires',
      'Construct measurement scales (Likert, Semantic Differential)',
      'Apply appropriate sampling strategies',
      'Use online platforms (Google Forms, KoBoToolbox)',
      'Pre-test and validate instruments',
    ],
    curriculum: [
      {
        title: 'Module 1: Survey Research Fundamentals',
        topics: ['Types of Surveys', 'Survey Research Design', 'Strengths and Limitations'],
      },
      {
        title: 'Module 2: Questionnaire Design',
        topics: ['Question Types', 'Wording and Sequencing', 'Response Formats'],
      },
      {
        title: 'Module 3: Scale Construction',
        topics: ['Likert Scales', 'Reliability & Validity', 'Pilot Testing'],
      },
      {
        title: 'Module 4: Sampling',
        topics: ['Probability Sampling', 'Non-Probability Sampling', 'Sample Size Determination'],
      },
    ],
    eligibility: 'Researchers, HR professionals, or anyone conducting structured surveys.',
    whoShouldAttend: ['Market researchers', 'HR professionals', 'Social scientists', 'Development researchers'],
    trainer: 'Sample content — trainer to be updated.',
  },
];

export const getCourseBySlug = (slug: string): Course | undefined =>
  courses.find((c) => c.slug === slug);

export const getCoursesByCategory = (category: Course['category']): Course[] =>
  courses.filter((c) => c.category === category);
