'use client';

import { storage } from '@/utils/storage';
import { useEffect } from 'react';
import { crossCheckInvitationToken } from '../(auth)/actions';
import { toast } from 'sonner';

const CheckInvitationToken = () => {
  useEffect(() => {
    (async () => {
      const token = storage.get<string>(storage.STORAGE_KEYS.INVITATION_TOKEN);
      if (!token) return;
      const res = await crossCheckInvitationToken(token);
      if (res.success) {
        storage.remove(storage.STORAGE_KEYS.INVITATION_TOKEN);
      } else {
        toast.error(res.message);
      }
    })();
  }, []);

  return null;
};

export default CheckInvitationToken;
