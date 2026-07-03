export type Role = 'USER' | 'PRO' | 'ADMIN';
export type Plan = 'FREE' | 'PRO';
export type SubscriptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface DbUser {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatar: string | null;
  role: Role;
  plan: Plan;
  sessionId: string | null;
  banned: boolean;
  createdAt: Date;
  updatedAt: Date;
}
