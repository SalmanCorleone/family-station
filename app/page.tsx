// import Image from 'next/image';

import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import UserGreetText from './tempComp';

export default async function Home() {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();

  console.log({ user });

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-screen gap-4">
      <Link href="/login">
        <div className="p-4 rounded border">Login</div>
      </Link>
      <Link href="/signup">
        <div className="p-4 rounded border">Sign Up</div>
      </Link>
      <Link href="/signup">
        <div className="p-4 rounded border">Log Out</div>
      </Link>
      <Link href="/account">
        <div className="p-4 rounded border">Account</div>
      </Link>
      <Link href="/app">
        <div className="p-4 rounded border">Go to app</div>
      </Link>

      <UserGreetText />
    </div>
  );
}
