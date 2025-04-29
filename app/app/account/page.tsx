'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';

const Account = () => {
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.log(error.message);
        return;
      }
      console.log('user', user);
    };
    fetchUser();
  }, [supabase]);

  return <div>Account</div>;
};

export default Account;
