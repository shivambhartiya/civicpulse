import { z } from 'zod';
export const LocationSchema = z.object({ lat: z.number(), lng: z.number(), address: z.string().min(3), ward: z.string().min(1) });
export const IssueCreateSchema = z.object({ title: z.string().min(4), description: z.string().min(10), category: z.enum(['POTHOLE','WATER','LIGHTING','WASTE','ROAD','BUILDING','OTHER']), subcategory: z.string().default('general'), severity: z.number().min(1).max(10), images: z.array(z.string()).default([]), location: LocationSchema, aiAnalysis: z.any().optional() });
export const CommentSchema = z.object({ body: z.string().min(2).max(800) });
export const StatusUpdateSchema = z.object({ status: z.enum(['REPORTED','VERIFIED','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED']), note: z.string().optional() });
export const ChatSchema = z.object({ query: z.string().min(2), ward: z.string().optional() });
