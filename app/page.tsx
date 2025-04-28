// import Image from 'next/image';

import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();

  const user = await supabase.auth.getSession();

  console.log({ user });

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-screen gap-4">
      <Link href="/chat">
        <div className="p-4 rounded border">Chat</div>
      </Link>
      <Link href="/budget">
        <div className="p-4 rounded border">Budget</div>
      </Link>
      <Link href="/todo">
        <div className="p-4 rounded border">To do</div>
      </Link>
      <Link href="/login">
        <div className="p-4 rounded border">Login</div>
      </Link>
      <Link href="/signup">
        <div className="p-4 rounded border">Sign Up</div>
      </Link>
    </div>
  );
}
