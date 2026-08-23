import api from './api';
import type { Resource } from '@/types';
import { resources, getFeaturedResources } from '@/data/resources';

export const resourceService = {
  async getAll(): Promise<Resource[]> {
    try {
      const res = await api.get('/resources', { params: { page: 1, limit: 100 } });
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Failed to fetch resources from API, using fallback data:', err);
    }
    return resources;
  },

  async getFeatured(): Promise<Resource[]> {
    const all = await this.getAll();
    const featured = all.filter((r) => r.featured);
    return featured.length > 0 ? featured : getFeaturedResources();
  },

  async getByCategory(category?: string): Promise<Resource[]> {
    const all = await this.getAll();
    if (!category || category === 'All') return all;
    return all.filter((r) => {
      if (typeof r.category === 'string') return r.category === category;
      if (r.category && typeof r.category === 'object') {
        const catObj = r.category as { name?: string; slug?: string };
        return catObj.name === category || catObj.slug === category;
      }
      return false;
    });
  },
};
