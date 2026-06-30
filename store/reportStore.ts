import { create } from 'zustand';
import { DEFAULT_CITY_CENTER } from '@/lib/constants/app';
import type { ImageAnalysisResult } from '@/lib/types/agents';
import type { IssueCategory } from '@/lib/types/issue';

interface ReportDraft {
  title?: string;
  description?: string;
  category?: IssueCategory;
  severity?: number;
  imageFile?: File;
  imagePreview?: string;
  aiAnalysis?: ImageAnalysisResult;
  location?: { lat: number; lng: number; address: string; ward: string };
}

interface ReportState {
  formData: ReportDraft;
  setFormData: (data: Partial<ReportDraft>) => void;
  reset: () => void;
}

function initialDraft(): ReportDraft {
  return {
    location: {
      ...DEFAULT_CITY_CENTER,
      address: 'Current civic district',
      ward: 'Ward 12',
    },
  };
}

export const useReportStore = create<ReportState>((set) => ({
  formData: initialDraft(),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  reset: () => set({ formData: initialDraft() }),
}));
