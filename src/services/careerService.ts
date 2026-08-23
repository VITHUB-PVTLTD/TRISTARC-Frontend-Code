import api from './api';
import type { Job } from '@/types';
import { jobs, getFeaturedJobs } from '@/data/careers';

export const careerService = {
  async getAll(): Promise<Job[]> {
    try {
      const res = await api.get('/careers', { params: { page: 1, limit: 100 } });
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Failed to fetch jobs from API, using fallback data:', err);
      return jobs;
    }
    return [];
  },

  async getFeatured(): Promise<Job[]> {
    const all = await this.getAll();
    const featured = all.filter((j) => (j as any).featured || (j as any).isFeatured);
    return featured.length > 0 ? featured : all.slice(0, 3);
  },

  async getBySlug(slug: string): Promise<Job | null> {
    try {
      const res = await api.get(`/careers/${slug}`);
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn(`Failed to fetch job ${slug} from API:`, err);
    }
    const all = await this.getAll();
    return all.find((j) => j.slug === slug || j.id === slug) ?? null;
  },

  async apply(payload: {
    jobId: string;
    fullName: string;
    email: string;
    phone?: string;
    coverMessage?: string;
    resumeUrl?: string;
  } | FormData): Promise<{ success: boolean; message: string }> {
    if (payload instanceof FormData) {
      const res = await api.post('/careers/applications', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    }
    const res = await api.post('/careers/applications', payload);
    return res.data;
  },
};

export default careerService;
