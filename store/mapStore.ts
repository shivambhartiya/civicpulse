import { create } from 'zustand';
import { DEFAULT_CITY_CENTER } from '@/lib/constants/app';
import type { IssueCategory, IssueStatus } from '@/lib/types/issue';

interface MapState {
  center: { lat: number; lng: number };
  showPredicted: boolean;
  status?: IssueStatus;
  category?: IssueCategory;
  setCenter: (center: { lat: number; lng: number }) => void;
  togglePredicted: () => void;
  setFilter: (filter: Partial<Pick<MapState, 'status' | 'category'>>) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: DEFAULT_CITY_CENTER,
  showPredicted: true,
  setCenter: (center) => set({ center }),
  togglePredicted: () => set((state) => ({ showPredicted: !state.showPredicted })),
  setFilter: (filter) => set(filter),
}));
