'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Check, Loader2, LocateFixed, Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LocationPicker } from '@/components/map/LocationPicker';
import { PhotoUploader } from '@/components/shared/PhotoUploader';
import { DEFAULT_CITY_CENTER } from '@/lib/constants/app';
import { ISSUE_CATEGORIES } from '@/lib/constants/categories';
import { POINTS } from '@/lib/constants/scoring';
import type { IssueCategory } from '@/lib/types/issue';
import { useReportStore } from '@/store/reportStore';

const steps = ['Capture', 'AI verify', 'Locate'];

export function IssueForm() {
  const [step, setStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formData, setFormData, reset } = useReportStore();
  const router = useRouter();

  async function handleFile(file: File) {
    setError(null);
    setFormData({ imageFile: file, imagePreview: URL.createObjectURL(file) });
    setStep(1);
    setIsAnalyzing(true);
    try {
      const body = new FormData();
      body.append('image', file);
      body.append('description', formData.description ?? '');
      const response = await fetch('/api/ai/analyze-image', { method: 'POST', body });
      if (!response.ok) throw new Error('AI analysis could not complete.');
      const analysis = await response.json();
      setFormData({
        title: analysis.suggestedTitle,
        description: analysis.suggestedDescription,
        category: analysis.suggestedCategory,
        severity: analysis.suggestedSeverity,
        aiAnalysis: analysis,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not analyze the image.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function submit() {
    if (!formData.title || !formData.description || !formData.category || !formData.severity || !formData.location) {
      setError('Complete the report details before submitting.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      let images: string[] = [];
      if (formData.imageFile) {
        const uploadBody = new FormData();
        uploadBody.append('image', formData.imageFile);
        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: uploadBody });
        const upload = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(upload.error || 'Image upload failed.');
        images = [upload.publicUrl];
      }

      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          severity: formData.severity,
          subcategory: formData.aiAnalysis?.suggestedSubcategory || 'general',
          images,
          location: formData.location,
          aiAnalysis: formData.aiAnalysis,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.error === 'string' ? result.error : 'Could not submit issue.');
      if (formData.imagePreview) URL.revokeObjectURL(formData.imagePreview);
      reset();
      router.push(`/issues/${result.issue.id}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not submit issue.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function useCurrentLocation() {
    setError(null);
    if (!navigator.geolocation) {
      setFormData({
        location: {
          ...DEFAULT_CITY_CENTER,
          address: 'Current civic district',
          ward: formData.location?.ward ?? 'Ward 12',
        },
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'GPS adjusted location',
            ward: formData.location?.ward ?? 'Ward 12',
          },
        });
      },
      () => {
        setFormData({
          location: {
            ...DEFAULT_CITY_CENTER,
            address: 'Current civic district',
            ward: formData.location?.ward ?? 'Ward 12',
          },
        });
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
        <div className="grid grid-cols-3 gap-2 pt-3">
          {steps.map((label, index) => <div key={label} className={index <= step ? 'h-2 rounded bg-primary' : 'h-2 rounded bg-muted'} />)}
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
            {step === 0 ? <>
              <PhotoUploader onFile={handleFile} />
              <Button type="button" variant="outline" onClick={() => setFormData({ description: 'Voice note: broken road surface blocking safe commute near my lane.' })}><Mic className="h-4 w-4" /> Voice report mode</Button>
              <Textarea value={formData.description ?? ''} onChange={(event) => setFormData({ description: event.target.value })} placeholder="Optional context before AI analysis" />
            </> : null}
            {step === 1 ? <div className="space-y-4">
              {isAnalyzing ? <div className="rounded-lg border p-6 text-center"><Sparkles className="mx-auto h-8 w-8 animate-pulse text-primary" /><p className="mt-2 font-medium">Gemini agents are analyzing image, severity, routing, and duplicate risk...</p></div> : <>
                <div className="rounded-lg border bg-primary/10 p-4 text-sm"><Bot className="mb-2 h-5 w-5 text-primary" />AI categorized this as {formData.category} with severity {formData.severity}/10.</div>
                <Input value={formData.title ?? ''} onChange={(event) => setFormData({ title: event.target.value })} placeholder="Issue title" />
                <Textarea value={formData.description ?? ''} onChange={(event) => setFormData({ description: event.target.value })} />
                <Select value={formData.category} onValueChange={(value) => setFormData({ category: value as IssueCategory })}><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger><SelectContent>{ISSUE_CATEGORIES.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent></Select>
                <Button onClick={() => setStep(2)}>Continue to location</Button>
              </>}
            </div> : null}
            {step === 2 && formData.location ? <div className="space-y-4">
              <LocationPicker value={formData.location} onChange={(location) => setFormData({ location })} />
              <Button onClick={submit} className="w-full" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Submit and earn {POINTS.report} points</Button>
              <Button variant="outline" onClick={useCurrentLocation}><LocateFixed className="h-4 w-4" />Use current location</Button>
            </div> : null}
            {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
