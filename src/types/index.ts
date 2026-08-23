// ============================================================
// TRISTARC — TypeScript Type Definitions
// ============================================================

// Navigation
export interface NavChild {
  label: string;
  path: string;
  icon?: string;
  description?: string;
}

export interface NavItem {
  label: string;
  path?: string;
  children?: NavChild[];
}

// Services
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  path: string;
  featured?: boolean;
  keyAreas?: string[];
  whatWeProvide?: string[];
  approach?: string;
  color?: string;
}

// Courses
export type CourseCategory = 'academic-skills' | 'research';
export type CourseMode = 'Online' | 'Offline' | 'Hybrid' | 'ONLINE' | 'OFFLINE' | 'HYBRID';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface CurriculumModule {
  title: string;
  topics: string[];
}

export interface CourseBatch {
  id?: string;
  startDate: string;
  endDate?: string;
  seats?: number;
  mode: CourseMode;
  location?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  categoryId?: string | null;
  category?: CourseCategory;
  description?: string;
  shortDescription?: string;
  duration?: string;
  mode?: CourseMode;
  level?: CourseLevel;
  eligibility?: string;
  learningOutcomes?: string;
  whoShouldAttend?: string | string[];
  image?: string;
  thumbnailUrl?: string;
  isPublished?: boolean;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sortOrder?: number;
  outcomes?: string[];
  curriculum?: CurriculumModule[];
  trainer?: string;
  batches?: CourseBatch[];
  featured?: boolean;
  createdAt?: string;
}

// Resources
export type ResourceCategory =
  | 'Research Documents'
  | 'Study Materials'
  | 'Reports'
  | 'Articles'
  | 'Statistical Resources'
  | 'Guides'
  | 'PDF Resources'
  | 'Other Educational Resources';

export type FileType = 'PDF' | 'XLSX' | 'DOCX' | 'PPTX' | 'ZIP' | 'CSV';

export interface Resource {
  id: string;
  title: string;
  categoryId?: string | null;
  category?: ResourceCategory;
  description?: string;
  date?: string;
  fileType?: FileType;
  fileSize?: string;
  url?: string;       // alias kept for backward compat
  fileUrl?: string;   // actual DB field name
  thumbnailUrl?: string;
  featured?: boolean;
  isPublished?: boolean;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  slug?: string;
  createdAt?: string;
}

// Team
export type TeamCategory = 'Leadership' | 'Faculty' | 'Researchers' | 'Consultants' | 'Trainers';

export interface TeamMember {
  id: string;
  name: string;
  designation?: string;
  categoryId?: string | null;
  category?: TeamCategory;
  qualification?: string;
  specialization?: string;
  bio?: string;
  image?: string;
  photoUrl?: string;
  email?: string;
  linkedinUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
  featured?: boolean;
}

// Careers
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';

export interface Job {
  id: string;
  title: string;
  slug?: string;
  department?: string;
  location?: string;
  employmentType?: EmploymentType;
  experience?: string;
  deadline?: string;
  description?: string;
  requirements?: string | string[];
  responsibilities?: string | string[];
  featured?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  job?: { id?: string; title: string; slug?: string; department?: string; location?: string };
  fullName: string;
  email: string;
  phone?: string;
  coverMessage?: string;
  resumeUrl?: string;
  status: 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  createdAt: string;
}

// Notifications
export interface Announcement {
  id: string;
  text: string;
  link?: string;
  type?: 'info' | 'alert' | 'success';
  isNew?: boolean;
}

export interface Notification {
  id: string;
  title?: string;
  message: string;
  link?: string | null;
  type?: string;
  isActive?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  expiresAt?: string | null;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Contact Form
export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED';
  createdAt: string;
}

// Auth — matches real backend safeUser() shape
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status?: string;
  isEmailVerified?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
  roles: string[];
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

// Career Application
export interface CareerApplicationData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  coverMessage?: string;
  resume: File | null;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Admin Stats
export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  pendingRegistrations: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  unreadMessages: number;
  totalMessages: number;
  activeNotifications: number;
  totalResources?: number;
  totalTeamMembers?: number;
}

// Course Registration (admin)
export interface CourseRegistration {
  id: string;
  courseId: string;
  course?: { title: string; slug?: string };
  batchId?: string | null;
  batch?: { startDate: string; endDate?: string } | null;
  userId?: string | null;
  user?: Partial<User> | null;
  fullName: string;
  email: string;
  phone?: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
  notes?: string | null;
  createdAt: string;
}

// Site Config
export interface SiteConfig {
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  contact: {
    address: string;
    email: string;
    phone: string;
  };
  social: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  };
}

// Audit Log
export interface AuditLog {
  id: string;
  userId?: string | null;
  user?: Partial<User> | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: any | null;
  createdAt: string;
}
