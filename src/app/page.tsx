'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GuardianLogo } from '@/components/icons';
import { Fingerprint, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center text-center mb-8">
        <GuardianLogo className="h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl font-bold text-foreground">Guardian Command Center</h1>
        <p className="text-muted-foreground mt-2">Limpopo Premier's Office: Real-Time. Accountable. Life-Saving.</p>
      </div>

      <Card className="w-full max-w-md border-2 border-border animate-in fade-in zoom-in-95">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Secure Access</CardTitle>
          <CardDescription>Enter your government credentials to proceed.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Government ID / Email</Label>
              <Input id="email" type="email" placeholder="user@limpopo.gov.za" required defaultValue="premier@limpopo.gov.za"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              <KeyRound className="mr-2 h-4 w-4" />
              Authenticate
            </Button>
            <Button variant="outline" className="w-full">
              <Fingerprint className="mr-2 h-4 w-4" />
              Login with Biometrics
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="text-xs text-muted-foreground mt-8">
        Access restricted to authorized personnel. All actions are logged.
      </p>
    </main>
  );
}
