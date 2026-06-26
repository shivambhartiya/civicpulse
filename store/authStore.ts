import { create } from 'zustand';
import type { UserProfile } from '@/lib/types/user';
import { mockUsers } from '@/lib/mock-data';
interface AuthState { user: UserProfile | null; loading: boolean; setUser: (user: UserProfile | null) => void; }
export const useAuthStore = create<AuthState>((set) => ({ user: mockUsers[0], loading: false, setUser: (user) => set({ user }) }));
