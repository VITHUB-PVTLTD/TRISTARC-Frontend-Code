import api from './api';
import type { ContactFormData } from '@/types';

export const contactService = {
  async submit(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    const res = await api.post('/contact', data);
    return res.data;
  },
};

export default contactService;
