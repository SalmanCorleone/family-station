'use client';

import { cn } from '@/utils/clsx';
import { navItemList } from '@/utils/const';
import { Settings2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useProfile } from '@/utils/context/profileContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface INavigationProps {
  children: React.ReactNode;
}

const Navigation = ({ children }: INavigationProps) => {
  const pathname = usePathname();
  const [activeNavItem, setActiveNavItem] = useState<NavItemType>(navItemList[0]);
  const { profile, family } = useProfile();

  useEffect(() => {
    if (!pathname) return;
    const currentNav = navItemList.find((navItem) => pathname === navItem.href);
    if (currentNav) setActiveNavItem(currentNav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <Link href={navItem.href} key={navItem.href} onClick={() => setActiveNavItem(navItem)}>
              <div className={cn('flex flex-col gap-2 items-center justify-start p-4 rounded-lg relative')}>
                {activeNavItem.href === navItem.href && (
                  <motion.div
                    layoutId="activeNav"
                    id="activeNav"
                    className="inset-0 absolute bg-lightPale shadow-sm rounded-lg"
                  />
                )}
                <navItem.icon size={48} className="relative z-10" />
                <div className="text-md font-medium relative z-10">{navItem.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Account */}
        <div className="flex items-center justify-between gap-2 p-2 mb-2 rounded-2xl bg-white shadow-sm">
          <Link href="/app/account">
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
          <Link href="/app/settings">
            <div className="border p-2 rounded-lg border-gray-300 hover:bg-gray-50">
              <Settings2 size={16} />
            </div>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="bg-light flex-1 overflow-y-auto no-scroll shadow my-2 mr-2 xl:ml-0 ml-2 rounded-2xl">
        {children}
      </div>

      {/* Mobile nav */}
      <div className="xl:hidden flex justify-around items-center gap-2 rounded-2xl bg-light shadow-sm mx-2 mb-2">
        {navItemList.map((navItem) => (
          <Link href={navItem.href} key={navItem.href} onClick={() => setActiveNavItem(navItem)}>
            <div className={cn('flex flex-col gap-1 items-center justify-start p-2 relative')}>
              {activeNavItem.href === navItem.href && (
                <motion.div
                  layoutId="activeNavMobile"
                  id="activeNavMobile"
                  className="inset-0 absolute bg-lightPale shadow-sm rounded-lg"
                />
              )}
              <navItem.icon size={20} className="relative z-10" />
              <div className="text-xs font-medium relative z-10">{navItem.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
