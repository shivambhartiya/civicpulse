'use client';
import { mockUsers } from '@/lib/mock-data';
export function useUserProfile(id = 'user-asha') { return { profile: mockUsers.find((user) => user.id === id) ?? mockUsers[0], loading: false }; }
