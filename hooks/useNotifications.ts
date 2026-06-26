'use client';
import { useState } from 'react';
export function useNotifications() { const [enabled, setEnabled] = useState(false); async function subscribe() { if (typeof Notification !== 'undefined') { const permission = await Notification.requestPermission(); setEnabled(permission === 'granted'); return permission === 'granted'; } return false; } return { enabled, subscribe }; }
