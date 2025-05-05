'use client';

import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '../../actions';

const SignInWithGoogle = () => {
  const isBrowser = typeof window !== 'undefined';
  const origin = isBrowser ? window.location.origin : '';

  return (
    <Button variant="outline" type="button" className="w-full" onClick={() => signInWithGoogle(origin)}>
      Continue with Google
    </Button>
  );
};

export default SignInWithGoogle;
