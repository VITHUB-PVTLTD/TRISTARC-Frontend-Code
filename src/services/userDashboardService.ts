import api from './api';
import type { User, Course, Resource, Notification, CourseRegistration } from '@/types';

// ============================================================
// TRISTARC   User Dashboard API Service
// ============================================================

export const userDashboardService = {
  async getProfile(): Promise<{ user: User; roles: string[] }> {
    const res = await api.get('/auth/me');
    const d = res.data.data;
    return { user: d.user ?? d, roles: d.roles ?? [] };
  },

  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string }): Promise<User> {
    const res = await api.patch('/auth/me', data);
    return res.data.data as User;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.patch('/auth/me/password', { currentPassword, newPassword });
  },

  async getPublicCourses(page = 1, limit = 12): Promise<{ data: Course[]; pagination: any }> {
    const res = await api.get('/courses', { params: { page, limit } });
    return res.data;
  },

  async getPublicResources(page = 1, limit = 10): Promise<{ data: Resource[]; pagination: any }> {
    const res = await api.get('/resources', { params: { page, limit } });
    return res.data;
  },

  async getNotifications(): Promise<Notification[]> {
    const res = await api.get('/notifications');
    return (res.data.data ?? []) as Notification[];
  },

  async getMyApplications(): Promise<any[]> {
    try {
      const res = await api.get('/careers/my/applications');
      return (res.data.data ?? []) as any[];
    } catch {
      return [];
    }
  },
};
