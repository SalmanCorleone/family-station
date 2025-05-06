'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/utils/context/profileContext';
import { Loader } from 'lucide-react';
import Link from 'next/link';

const ProfileCard = () => {
  const { profile, isLoading } = useProfile();

  return (
    <div className="flex flex-col gap-3 items-center justify-center p-4 rounded-lg bg-white shadow-lg">
      {isLoading ? (
        <Loader className="animate-spin" />
      ) : profile ? (
        <>
          <Avatar style={{ width: 80, height: 80 }}>
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>{profile.full_name?.charAt(0) ?? profile.email?.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-2xl">{profile.full_name}</p>
          <p className="text-sm">{profile.email}</p>
          <Link href="/app">
            <Button>Go to dashboard</Button>
          </Link>
        </>
      ) : (
        <p className="text-2xl font-medium">Not Logged in</p>
      )}
    </div>
  );
};

export default ProfileCard;
