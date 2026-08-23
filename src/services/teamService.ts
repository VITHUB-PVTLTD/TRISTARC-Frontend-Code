import api from './api';
import type { TeamMember } from '@/types';
import { teamMembers, getFeaturedTeam } from '@/data/team';

export const teamService = {
  async getAll(): Promise<TeamMember[]> {
    try {
      const res = await api.get('/team');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Failed to fetch team from API, using fallback data:', err);
    }
    return teamMembers;
  },

  async getFeatured(): Promise<TeamMember[]> {
    const all = await this.getAll();
    const featured = all.filter((m) => m.featured);
    return featured.length > 0 ? featured : getFeaturedTeam();
  },

  async getByCategory(category: string): Promise<TeamMember[]> {
    const all = await this.getAll();
    return all.filter((m) => {
      if (typeof m.category === 'string') return m.category === category;
      if (m.category && typeof m.category === 'object') {
        const catObj = m.category as { name?: string; slug?: string };
        return catObj.name === category || catObj.slug === category;
      }
      return false;
    });
  },
};
