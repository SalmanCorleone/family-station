'use client';

import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '../../actions';

const SignInWithGoogle = () => {
  return (
    <Button variant="outline" type="button" className="w-full" onClick={signInWithGoogle}>
      Login with Google
    </Button>
  );
};

export default SignInWithGoogle;
