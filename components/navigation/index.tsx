'use client';

import { cn } from '@/utils/clsx';
import { navItemList } from '@/utils/const';
import { Settings2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useProfile } from '@/utils/context/profileContext';
import Image from 'next/image';

interface INavigationProps {
  children: React.ReactNode;
}

const Navigation = ({ children }: INavigationProps) => {
  const pathname = usePathname();
  const { profile, family } = useProfile();

  return (
    <nav className="flex flex-col xl:flex-row h-screen bg-ash/10">
      <div className="hidden xl:flex flex-col bg-light px-2 m-2 shadow gap-4 rounded-2xl max-w-[14vw]">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-2 p-2 mt-2 rounded-2xl bg-white shadow-sm">
          <div className="relative w-full h-20 rounded-lg overflow-hidden border border-ash/50">
            <Image
              // src={'/family.jpg'}
              src={family?.image ?? '/family.jpg'}
              alt={family?.title ?? 'my-family'}
              fill
              className="object-cover object-center"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">{family?.title}</p>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 flex flex-col justify-center">
          {navItemList.map((navItem) => (
            <Link href={navItem.href} key={navItem.href}>
              <div
                className={cn('flex flex-col gap-2 items-center justify-start p-4 rounded-lg', {
                  'bg-lightPale shadow-sm': pathname === navItem.href,
                })}
              >
                <navItem.icon size={48} />
                <div className="text-md font-medium">{navItem.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Account */}
        <div className="flex items-center justify-between gap-2 p-2 mb-2 rounded-2xl bg-white shadow-sm">
          <Link href="/account">
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback>{profile?.full_name?.charAt(0) ?? profile?.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-xs">{profile?.full_name}</p>
              </div>
            </div>
          </Link>
          <Link href="/settings">
            <div className="border p-2 rounded-lg border-gray-300 hover:bg-gray-50">
              <Settings2 size={16} />
            </div>
          </Link>
        </div>
      </div>
      <div className="bg-light flex-1 overflow-y-auto no-scroll shadow ml-0 my-2 mr-2 rounded-2xl">{children}</div>
    </nav>
  );
};

export default Navigation;
