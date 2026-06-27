'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, LogIn, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signInAsDemo, signInWithEmail } from '@/lib/auth/client';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<'demo' | 'email' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function finish(action: () => ReturnType<typeof signInAsDemo>) {
    setError(null);
    try {
      const user = await action();
      setUser(user);
      router.push('/dashboard');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign-in failed.');
    } finally {
      setLoading(null);
    }
  }

  function handleDemo() {
    setLoading('demo');
    void finish(signInAsDemo);
  }

  function handleEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading('email');
    void finish(() => signInWithEmail(email, password));
  }

  return (
    <Card className="shadow-card-lg">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to report, verify, and track civic fixes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" variant="outline" onClick={handleDemo} disabled={loading !== null}>
          {loading === 'demo' ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserRound className="h-4 w-4" />}
          Continue with demo profile
        </Button>

        <form className="space-y-3" onSubmit={handleEmail}>
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" required />
          <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" minLength={8} required />
          <Button className="w-full" type="submit" disabled={loading !== null}>
            {loading === 'email' ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Sign in
          </Button>
        </form>

        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

        <p className="text-center text-sm text-muted-foreground">
          New here? <Link className="text-primary" href="/signup">Create account</Link>
        </p>
      </CardContent>
    </Card>
  );
}
