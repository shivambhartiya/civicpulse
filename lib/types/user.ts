export type UserRole = 'citizen' | 'authority' | 'admin';
export interface BadgeAward { id: string; name: string; earnedAt: string; }
export interface UserProfile { id: string; name: string; email: string; phone?: string; avatarUrl?: string; ward: string; role: UserRole; points: number; level: number; badges: BadgeAward[]; reportsFiled: number; verifications: number; resolvedHelp: number; }
