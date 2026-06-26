import { formatDistanceToNow } from 'date-fns';
export function timeAgo(value: string) { return formatDistanceToNow(new Date(value), { addSuffix: true }); }
export function compactNumber(value: number) { return Intl.NumberFormat('en', { notation: 'compact' }).format(value); }
export function issueCode(id: string) { return '#' + id.slice(-5).toUpperCase(); }
