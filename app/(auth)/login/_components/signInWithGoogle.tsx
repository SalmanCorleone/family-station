'use client';

import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '../../actions';

const SignInWithGoogle = () => {
  const origin = window.location.origin;

  return (
    <Button variant="outline" type="button" className="w-full" onClick={() => signInWithGoogle(origin)}>
      Login with Google
    </Button>
  );
};

export default SignInWithGoogle;
