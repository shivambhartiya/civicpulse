'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, LayoutDashboard, LogOut, Map, Medal, PlusCircle, Radar, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { signOutUser } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/report', label: 'Report', icon: PlusCircle },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/issues', label: 'Issues', icon: Radar },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/leaderboard', label: 'Heroes', icon: Medal },
  { href: '/profile', label: 'Profile', icon: User },
];

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, setUser } = useAuth();

  async function signOut() {
    await signOutUser();
    setUser(null);
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="hidden w-72 shrink-0 border-r bg-card/70 p-4 lg:flex lg:flex-col">
      <Link href="/dashboard" className="mb-6 flex items-center gap-3 rounded-md px-2 py-2">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground"><Radar className="h-5 w-5" /></span>
        <div><p className="font-semibold">CivicPulse</p><p className="text-xs text-muted-foreground">Your city. Your voice.</p></div>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn('flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground', active && 'bg-primary/12 text-primary')}>
              <Icon className="h-4 w-4" />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="rounded-lg border bg-background p-3">
        {loading ? <p className="text-sm text-muted-foreground">Loading profile...</p> : user ? (
          <div className="flex items-center gap-3">
            <Avatar><AvatarFallback>{initials(user.name)}</AvatarFallback></Avatar>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.points} points</p></div>
            <Button variant="ghost" size="icon" aria-label="Sign out" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
          </div>
        ) : (
          <Button asChild className="w-full" variant="outline"><Link href="/login">Sign in</Link></Button>
        )}
      </div>
    </aside>
  );
}
