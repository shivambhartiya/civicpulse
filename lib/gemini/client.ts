import { GoogleGenerativeAI } from '@google/generative-ai';
let client: GoogleGenerativeAI | null = null;
export function getGemini() { const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY; if (!key) return null; if (!client) client = new GoogleGenerativeAI(key); return client; }
export function getGeminiModel(model = process.env.GEMINI_MODEL || 'gemini-2.0-flash') { return getGemini()?.getGenerativeModel({ model, generationConfig: { responseMimeType: 'application/json' } }); }
export function parseJson<T>(text: string, fallback: T): T { try { return JSON.parse(text.trim()) as T; } catch { return fallback; } }
