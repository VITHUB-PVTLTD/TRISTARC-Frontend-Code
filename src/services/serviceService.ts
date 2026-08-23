import api from './api';
import type { Service } from '@/types';
import { services, getServiceBySlug } from '@/data/services';

export const serviceService = {
  async getAll(): Promise<Service[]> {
    try {
      const res = await api.get('/services');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Failed to fetch services from API, using fallback data:', err);
    }
    return services;
  },

  async getBySlug(slug: string): Promise<Service | null> {
    try {
      const res = await api.get(`/services/${slug}`);
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn(`Failed to fetch service ${slug} from API:`, err);
    }
    const all = await this.getAll();
    return all.find((s) => s.slug === slug || s.id === slug) ?? getServiceBySlug(slug) ?? null;
  },

  async getFeatured(): Promise<Service[]> {
    const all = await this.getAll();
    const featured = all.filter((s) => (s as any).featured || (s as any).isFeatured);
    return featured.length > 0 ? featured : all.slice(0, 4);
  },
};

export default serviceService;
