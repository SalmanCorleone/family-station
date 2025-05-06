'use client';

import { Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function EmailConfirmationCard() {
  const email = useSearchParams().get('email');

  return (
    <div className="flex justify-center items-center min-h-[400px] p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto my-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-center pt-2">
            We&apos;ve sent a confirmation link to
            <span className="font-medium block">{email ?? 'your email'}</span>
          </p>
        </div>
        <div className="text-center text-muted-foreground">
          <p>Please check your email and click on the confirmation link to continue.</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-center text-muted-foreground mt-4">
            Didn&apos;t receive an email? Check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
