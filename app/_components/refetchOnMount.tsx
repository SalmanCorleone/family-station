'use client';

import { useEffect } from 'react';
import { useProfile } from '@/utils/context/profileContext';

const RefetchOnMount = () => {
  const { refetchProfile } = useProfile();

  useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);

  return null;
};

export default RefetchOnMount;
