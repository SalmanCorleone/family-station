'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/utils/context/profileContext';
import { ArrowUpRight, Banknote, ClipboardList, Heart, MessageSquareMore, User } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  const { profile, isLoading } = useProfile();

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="xl:hidden flex flex-col gap-4 p-4 xl:p-12">
        <Heart className="w-24 h-24" fill="var(--color-green" />
      </div>
      <div className="flex xl:justify-around">
        <div className="flex flex-col gap-4 xl:gap-6 p-4 xl:p-12">
          <h1 className="text-4xl xl:text-7xl font-bold">You family space</h1>
          <h1 className="text-4xl xl:text-7xl font-bold">Minus distraction</h1>
          <div className="flex items-center gap-2 xl:gap-4">
            <Banknote fill="var(--color-lightGreen)" className="h-8 w-8 xl:h-10 xl:w-10 translate-y-0.5" />
            <p className="text-xl xl:text-4xl">Budget</p>
            <MessageSquareMore fill="var(--color-pink)" className="h-8 w-8 xl:h-10 xl:w-10 translate-y-0.5" />
            <p className="text-xl xl:text-4xl">Chat</p>
            <ClipboardList fill="var(--color-lightBlue)" className="h-8 w-8 xl:h-10 xl:w-10 translate-y-0.5" />
            <p className="text-xl xl:text-4xl">To-do</p>
            {/* <p className="text-2xl xl:text-4xl">| Simple, Fast</p> */}
          </div>
          <div className="flex gap-4 justify-start mt-4">
            {!isLoading && profile?.family_id ? (
              <Link href={'/app'}>
                <Button variant={'outline'} className="text-xl xl:text-2xl px-6 py-3 h-auto">
                  <Avatar style={{ width: 40, height: 40 }}>
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>My Dashboard</div>
                  <ArrowUpRight className="translate-y-0.5 text-green" />
                </Button>
              </Link>
            ) : (
              <>
                <Button className="text-xl xl:text-2xl px-6 py-3 h-auto">Get Started</Button>
                <Button variant={'outline'} className="text-xl xl:text-2xl px-6 py-3 h-auto">
                  Try Demo
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="hidden xl:flex flex-col gap-4 p-4 xl:p-12">
          <Heart className="w-48 h-48" fill="var(--color-green" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
