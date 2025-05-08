'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RefetchOnMount = () => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return null;
};

export default RefetchOnMount;
