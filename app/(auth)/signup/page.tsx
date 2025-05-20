'use client';

import SignupForm from './_components/signupForm';
import { useEffect } from 'react';
import { storage } from '@/utils/storage';
import { useSearchParams } from 'next/navigation';
import { Heart } from 'lucide-react';

const Signup = () => {
  const params = useSearchParams();
  const invitationToken = params.get('invitationToken');

  useEffect(() => {
    if (!invitationToken) return;
    storage.set('invitationToken', invitationToken);
  }, [invitationToken]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <Heart className="w-24 h-24" fill="var(--color-green)" />
      </div>
      <div className="bg-white flex flex-col items-center justify-center p-4 xl:p-8 rounded-xl">
        <div className="xl:w-sm w-full">
          <div>
            <h2 className="text-2xl font-bold">Sign Up</h2>
            <p className="mt-2 text-sm">Enter your information to create an account</p>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
