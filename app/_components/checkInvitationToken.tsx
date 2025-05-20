'use client';

import { storage } from '@/utils/storage';
import { useEffect } from 'react';
import { crossCheckInvitationToken } from '../(auth)/actions';
import { toast } from 'sonner';
import { useProfile } from '@/utils/context/profileContext';
import { useRouter } from 'next/navigation';

const CheckInvitationToken = () => {
  const { profile, isLoading, refetchProfile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);

  useEffect(() => {
    (async () => {
      if (isLoading) return;
      if (!profile) {
        console.log('Failed to load profile! Please log in again.');
        return;
      }
      const token = storage.get<string>(storage.STORAGE_KEYS.INVITATION_TOKEN);
      /**
       * New users goes through onboarding, create a family
       */
      if (!token && !profile.family_id) {
        router.push('/app/onboarding');
        return;
      }
      /**
       * invited users use their token, joins a family
       */
      if (!token) return;
      const res = await crossCheckInvitationToken(token);
      if (res.success) {
        storage.remove(storage.STORAGE_KEYS.INVITATION_TOKEN);
      } else {
        toast.error(res.message);
      }
    })();
  }, [isLoading, profile, router]);

  return null;
};

export default CheckInvitationToken;
