import { api } from './api';

export const adminService = {
  getDashboard: async () => {
    const { data } = await api.get('/admin/dashboard');
    return data.data;
  },

  getUsers: async (q?: string) => {
    const { data } = await api.get('/admin/users', { params: { q } });
    return data.data;
  },

  banUser: async (userId: string, banned = true) => {
    const { data } = await api.patch(`/admin/users/${userId}/ban`, { banned });
    return data.data;
  },

  deleteUser: async (userId: string) => {
    await api.delete(`/admin/users/${userId}`);
  },

  resetQuota: async (userId: string) => {
    await api.post(`/admin/users/${userId}/reset-quota`);
  },

  getSubscriptions: async () => {
    const { data } = await api.get('/admin/subscriptions');
    return data.data;
  },

  reviewSubscription: async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const { data } = await api.patch(`/admin/subscriptions/${id}`, { status });
    return data.data;
  },

  getLogs: async () => {
    const { data } = await api.get('/admin/logs');
    return data.data;
  },
};
