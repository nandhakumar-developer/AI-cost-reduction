import { api } from './api';
import type { PaymentInstructions, SubscriptionRecord } from '../types';

export const subscriptionService = {
  getInfo: async (): Promise<{
    plan: string;
    role: string;
    paymentInstructions: PaymentInstructions;
    subscriptions: SubscriptionRecord[];
  }> => {
    const { data } = await api.get('/subscription');
    return data.data;
  },

  submitRequest: async (transactionId: string, screenshot?: string) => {
    const { data } = await api.post('/subscription/request', {
      transactionId,
      screenshot,
    });
    return data.data;
  },
};
