// import Image from 'next/image';

import Link from 'next/link';
import CheckInvitationToken from './_components/checkInvitationToken';
import ProfileCard from './_components/profileCard';
import RefetchOnMount from './_components/refetchOnMount';

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <ProfileCard />
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
        <Link href="/login">
          <div className="p-4 rounded border">Login</div>
        </Link>
        <Link href="/signup">
          <div className="p-4 rounded border">Sign Up</div>
        </Link>
        <Link href="/auth/logout">
          <div className="p-4 rounded border">Log Out</div>
        </Link>
        <Link href="/account">
          <div className="p-4 rounded border">Account</div>
        </Link>
        <Link href="/app">
          <div className="p-4 rounded border">Go to app</div>
        </Link>
        <CheckInvitationToken />
        <RefetchOnMount />
      </div>
    </div>
  );
}
