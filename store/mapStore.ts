import { create } from 'zustand';
import type { IssueCategory, IssueStatus } from '@/lib/types/issue';
interface MapState { center: { lat: number; lng: number }; showPredicted: boolean; status?: IssueStatus; category?: IssueCategory; setCenter: (center: { lat: number; lng: number }) => void; togglePredicted: () => void; setFilter: (filter: Partial<Pick<MapState, 'status' | 'category'>>) => void; }
export const useMapStore = create<MapState>((set) => ({ center: { lat: 12.9716, lng: 77.5946 }, showPredicted: true, setCenter: (center) => set({ center }), togglePredicted: () => set((s) => ({ showPredicted: !s.showPredicted })), setFilter: (filter) => set(filter) }));
