'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signUpWithEmail } from '@/lib/auth/client';
import { useAuthStore } from '@/store/authStore';

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const user = await signUpWithEmail({
        name: String(form.get('name')),
        email: String(form.get('email')),
        password: String(form.get('password')),
        ward: String(form.get('ward')),
        phone: String(form.get('phone') || ''),
      });
      setUser(user);
      router.push('/dashboard');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-card-lg">
      <CardHeader>
        <CardTitle>Create your civic profile</CardTitle>
        <CardDescription>Your account is stored by CivicPulse itself.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={submit}>
          <Input name="name" placeholder="Full name" minLength={2} required />
          <Input name="email" placeholder="Email" type="email" required />
          <Input name="password" placeholder="Password" type="password" minLength={8} required />
          <Input name="phone" placeholder="Phone (optional)" />
          <Input name="ward" placeholder="Ward or area" minLength={2} required />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Join CivicPulse
          </Button>
          {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link className="text-primary" href="/login">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
