import api from './api';
import type { Course } from '@/types';
import { courses, getCourseBySlug } from '@/data/courses';

export const courseService = {
  async getAll(): Promise<Course[]> {
    try {
      const res = await api.get('/courses', { params: { page: 1, limit: 100 } });
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Failed to fetch public courses from API, using fallback data:', err);
    }
    return courses;
  },

  async getBySlug(slug: string): Promise<Course | null> {
    try {
      const res = await api.get(`/courses/${slug}`);
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn(`Failed to fetch course ${slug} from API, trying fallback data:`, err);
    }
    return getCourseBySlug(slug) ?? null;
  },

  async getByCategory(category: string): Promise<Course[]> {
    const all = await this.getAll();
    return all.filter((c) => {
      if (typeof c.category === 'string') {
        if (category === 'research') return c.category === 'research' || c.category.toLowerCase().includes('research');
        if (category === 'academic-skills') return c.category === 'academic-skills' || c.category.toLowerCase().includes('academic');
        return c.category === category;
      }
      if (c.category && typeof c.category === 'object') {
        const catObj = c.category as { slug?: string; name?: string };
        const catSlug = (catObj.slug || '').toLowerCase();
        const catName = (catObj.name || '').toLowerCase();
        if (category === 'research') return catSlug.includes('research') || catName.includes('research');
        if (category === 'academic-skills') return catSlug.includes('academic') || catName.includes('academic');
      }
      return false;
    });
  },
};
