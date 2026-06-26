import { create } from 'zustand';
import type { ImageAnalysisResult } from '@/lib/types/agents';
import type { IssueCategory } from '@/lib/types/issue';
interface ReportDraft { title?: string; description?: string; category?: IssueCategory; severity?: number; imageFile?: File; imagePreview?: string; aiAnalysis?: ImageAnalysisResult; location?: { lat: number; lng: number; address: string; ward: string }; }
interface ReportState { formData: ReportDraft; setFormData: (data: Partial<ReportDraft>) => void; reset: () => void; }
export const useReportStore = create<ReportState>((set) => ({ formData: { location: { lat: 12.9716, lng: 77.5946, address: 'Current civic district', ward: 'Ward 12' } }, setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })), reset: () => set({ formData: {} }) }));
