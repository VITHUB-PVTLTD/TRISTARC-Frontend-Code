import api from './api';
import type { User, LoginFormData, SignupFormData } from '@/types';

// ============================================================
// TRISTARC   Auth Service (Phase 2   Real API)
// ============================================================

function buildUser(raw: any): User {
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phone: raw.phone ?? null,
    status: raw.status,
    isEmailVerified: raw.isEmailVerified,
    lastLoginAt: raw.lastLoginAt ?? null,
    createdAt: raw.createdAt,
    roles: raw.roles ?? [],
  };
}

function saveSession(token: string, user: User, remember: boolean) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('tristarc_token', token);
  storage.setItem('tristarc_user', JSON.stringify(user));
}

export const authService = {
  async login(data: LoginFormData): Promise<{ user: User; token: string }> {
    const res = await api.post('/auth/login', {
      email: data.email,
      password: data.password,
    });
    const { user: raw, roles, accessToken } = res.data.data;
    const user = buildUser({ ...raw, roles });
    saveSession(accessToken, user, !!data.rememberMe);
    return { user, token: accessToken };
  },

  async signup(data: SignupFormData): Promise<{ user: User; token: string }> {
    const res = await api.post('/auth/signup', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || undefined,
      password: data.password,
    });
    const { user: raw, roles, accessToken } = res.data.data;
    const user = buildUser({ ...raw, roles });
    saveSession(accessToken, user, false);
    return { user, token: accessToken };
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore errors   clear storage regardless
    }
    localStorage.removeItem('tristarc_token');
    localStorage.removeItem('tristarc_user');
    sessionStorage.removeItem('tristarc_token');
    sessionStorage.removeItem('tristarc_user');
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await api.get('/auth/me');
      // /auth/me returns: { success: true, data: { id, email, firstName, lastName, roles, ... } }
      const raw = res.data.data;
      if (!raw) return null;
      return buildUser({ ...raw, roles: raw.roles ?? [] });
    } catch {
      return null;
    }
  },

  getCurrentUser(): User | null {
    try {
      const stored =
        localStorage.getItem('tristarc_user') ||
        sessionStorage.getItem('tristarc_user');
      if (!stored) return null;
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return (
      localStorage.getItem('tristarc_token') ||
      sessionStorage.getItem('tristarc_token')
    );
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
