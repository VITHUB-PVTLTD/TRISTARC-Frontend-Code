import api from './api';
import type {
  AdminStats, User, Course, Job, JobApplication,
  ContactMessage, Notification, Resource, TeamMember,
  CourseRegistration, PaginatedResponse,
} from '@/types';

// ============================================================
// TRISTARC — Admin API Service
// ============================================================

const A = '/admin';

function pg(page = 1, limit = 20) {
  return { params: { page, limit } };
}

export const adminService = {
  // -- Stats --------------------------------------------------
  async getStats(): Promise<AdminStats> {
    const res = await api.get(`${A}/stats`);
    return res.data.data as AdminStats;
  },

  // -- Users --------------------------------------------------
  async getUsers(page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    const res = await api.get(`${A}/users`, pg(page, limit));
    return res.data as PaginatedResponse<User>;
  },

  async getUser(id: string): Promise<User> {
    const res = await api.get(`${A}/users/${id}`);
    return res.data.data as User;
  },

  async updateUserStatus(id: string, status: string): Promise<User> {
    const res = await api.patch(`${A}/users/${id}/status`, { status });
    return res.data.data as User;
  },

  async updateUserRoles(id: string, roles: string[]): Promise<User> {
    const res = await api.patch(`${A}/users/${id}/roles`, { roles });
    return res.data.data as User;
  },

  // -- Courses ------------------------------------------------
  async getCourses(page = 1, limit = 20): Promise<PaginatedResponse<Course>> {
    const res = await api.get(`${A}/courses`, pg(page, limit));
    return res.data as PaginatedResponse<Course>;
  },

  async createCourse(data: Partial<Course>): Promise<Course> {
    const res = await api.post(`${A}/courses`, data);
    return res.data.data as Course;
  },

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    const res = await api.patch(`${A}/courses/${id}`, data);
    return res.data.data as Course;
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(`${A}/courses/${id}`);
  },

  // Modules
  async createModule(courseId: string, data: { title: string; description?: string; sortOrder?: number }) {
    const res = await api.post(`${A}/courses/${courseId}/modules`, data);
    return res.data.data;
  },
  async updateModule(id: string, data: { title?: string; description?: string; sortOrder?: number }) {
    const res = await api.patch(`${A}/modules/${id}`, data);
    return res.data.data;
  },
  async deleteModule(id: string) {
    await api.delete(`${A}/modules/${id}`);
  },

  // Batches
  async createBatch(courseId: string, data: Record<string, unknown>) {
    const res = await api.post(`${A}/courses/${courseId}/batches`, data);
    return res.data.data;
  },
  async updateBatch(id: string, data: Record<string, unknown>) {
    const res = await api.patch(`${A}/batches/${id}`, data);
    return res.data.data;
  },
  async deleteBatch(id: string) {
    await api.delete(`${A}/batches/${id}`);
  },

  // -- Registrations ------------------------------------------
  async getRegistrations(page = 1, limit = 20): Promise<PaginatedResponse<CourseRegistration>> {
    const res = await api.get(`${A}/registrations`, pg(page, limit));
    return res.data as PaginatedResponse<CourseRegistration>;
  },

  async updateRegistrationStatus(id: string, status: string): Promise<CourseRegistration> {
    const res = await api.patch(`${A}/registrations/${id}/status`, { status });
    return res.data.data as CourseRegistration;
  },

  // -- Jobs ---------------------------------------------------
  async getJobs(page = 1, limit = 20): Promise<PaginatedResponse<Job>> {
    const res = await api.get(`${A}/jobs`, pg(page, limit));
    return res.data as PaginatedResponse<Job>;
  },

  async createJob(data: Partial<Job>): Promise<Job> {
    const res = await api.post(`${A}/jobs`, data);
    return res.data.data as Job;
  },

  async updateJob(id: string, data: Partial<Job>): Promise<Job> {
    const res = await api.patch(`${A}/jobs/${id}`, data);
    return res.data.data as Job;
  },

  async deleteJob(id: string): Promise<void> {
    await api.delete(`${A}/jobs/${id}`);
  },

  // -- Job Applications ---------------------------------------
  async getApplications(page = 1, limit = 20): Promise<PaginatedResponse<JobApplication>> {
    const res = await api.get(`${A}/job-applications`, pg(page, limit));
    return res.data as PaginatedResponse<JobApplication>;
  },

  async updateApplicationStatus(id: string, status: string): Promise<JobApplication> {
    const res = await api.patch(`${A}/job-applications/${id}/status`, { status });
    return res.data.data as JobApplication;
  },

  // -- Contact Messages ---------------------------------------
  async getMessages(page = 1, limit = 20): Promise<PaginatedResponse<ContactMessage>> {
    const res = await api.get(`${A}/contact-messages`, pg(page, limit));
    return res.data as PaginatedResponse<ContactMessage>;
  },

  async getMessage(id: string): Promise<ContactMessage> {
    const res = await api.get(`${A}/contact-messages/${id}`);
    return res.data.data as ContactMessage;
  },

  async updateMessageStatus(id: string, status: string): Promise<ContactMessage> {
    const res = await api.patch(`${A}/contact-messages/${id}/status`, { status });
    return res.data.data as ContactMessage;
  },

  async deleteMessage(id: string): Promise<void> {
    await api.delete(`${A}/contact-messages/${id}`);
  },

  // -- Notifications ------------------------------------------
  async getNotifications(page = 1, limit = 20): Promise<PaginatedResponse<Notification>> {
    const res = await api.get(`${A}/notifications`, pg(page, limit));
    return res.data as PaginatedResponse<Notification>;
  },

  async createNotification(data: Partial<Notification>): Promise<Notification> {
    const res = await api.post(`${A}/notifications`, data);
    return res.data.data as Notification;
  },

  async updateNotification(id: string, data: Partial<Notification>): Promise<Notification> {
    const res = await api.patch(`${A}/notifications/${id}`, data);
    return res.data.data as Notification;
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`${A}/notifications/${id}`);
  },

  // -- Resources ----------------------------------------------
  async getResources(page = 1, limit = 20): Promise<PaginatedResponse<Resource>> {
    const res = await api.get(`${A}/resources`, pg(page, limit));
    return res.data as PaginatedResponse<Resource>;
  },

  async createResource(data: Partial<Resource>): Promise<Resource> {
    const res = await api.post(`${A}/resources`, data);
    return res.data.data as Resource;
  },

  async updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
    const res = await api.patch(`${A}/resources/${id}`, data);
    return res.data.data as Resource;
  },

  async deleteResource(id: string): Promise<void> {
    await api.delete(`${A}/resources/${id}`);
  },

  // -- Team ---------------------------------------------------
  async getTeam(page = 1, limit = 50): Promise<PaginatedResponse<TeamMember>> {
    const res = await api.get(`${A}/team`, pg(page, limit));
    return res.data as PaginatedResponse<TeamMember>;
  },

  async createTeamMember(data: Partial<TeamMember>): Promise<TeamMember> {
    const res = await api.post(`${A}/team`, data);
    return res.data.data as TeamMember;
  },

  async updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember> {
    const res = await api.patch(`${A}/team/${id}`, data);
    return res.data.data as TeamMember;
  },

  async deleteTeamMember(id: string): Promise<void> {
    await api.delete(`${A}/team/${id}`);
  },

  // -- Settings -----------------------------------------------
  async getSettings(): Promise<Record<string, string>> {
    const res = await api.get(`${A}/settings`);
    return res.data.data as Record<string, string>;
  },

  async updateSettings(settings: Array<{ key: string; value: string; label?: string }>): Promise<void> {
    await api.patch(`${A}/settings`, { settings });
  },

  // -- Audit Logs ---------------------------------------------
  async getAuditLogs(page = 1, limit = 20) {
    const res = await api.get(`${A}/audit-logs`, pg(page, limit));
    return res.data;
  },
};
