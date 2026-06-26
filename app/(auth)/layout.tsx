import Link from 'next/link';
export default function AuthLayout({ children }: { children: React.ReactNode }) { return <main className="grid min-h-screen place-items-center bg-background px-4"><div className="w-full max-w-md"><Link href="/" className="mb-6 block text-center text-xl font-semibold">CivicPulse</Link>{children}</div></main>; }
