'use client';

import { ChatMessageType } from '@/app/app/(modules)/chat/actions';
import { cn } from '@/utils/clsx';
import { navItemList } from '@/utils/const';
import { useProfile } from '@/utils/context/profileContext';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface INavigationProps {
  children: React.ReactNode;
}

const Navigation = ({ children }: INavigationProps) => {
  const pathname = usePathname();
  const [activeNavItem, setActiveNavItem] = useState<NavItemType>();
  const [notificationCount, setNotificationCount] = useState(0);
  const { profile, family, isLoading } = useProfile();

  useEffect(() => {
    if (!pathname) return;
    const currentNav = navItemList.find((navItem) => pathname === navItem.href);
    if (currentNav) setActiveNavItem(currentNav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('chat-history')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_history',
        },
        (payload: { new: ChatMessageType }) => {
          if (payload.new.family_id !== profile?.family_id) return;
          if (pathname === '/app/chat') return;
          setNotificationCount((c) => c + 1);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.family_id, pathname]);

  return (
    <nav className="flex flex-col xl:flex-row h-screen bg-ash/10">
      <div className="hidden xl:flex flex-col bg-light px-2 m-2 shadow gap-4 rounded-2xl max-w-[14vw] min-w-[12vw]">
        {/* Header */}

        <Link href={'/app/settings/family'} onClick={() => setActiveNavItem(undefined)}>
          <div className="flex flex-col items-center justify-center gap-1 p-2 mt-2 rounded-2xl bg-white shadow-sm">
            <div className="relative w-full h-20 rounded-lg overflow-hidden border border-ash/50">
              <Image
                src={family?.image ?? '/family.png'}
                alt={family?.title ?? 'my-family'}
                fill
                className="object-cover object-center"
              />
            </div>
            <div>
              <p className="text-md font-semibold">{family?.title}</p>
            </div>
          </div>
        </Link>

        {/* Nav items */}
        <div className="flex-1 flex flex-col justify-center">
          {navItemList.map((navItem) => (
            <Link
              href={navItem.href}
              key={navItem.href}
              onClick={() => {
                if (navItem.name === 'Chat') setNotificationCount(0);
                setActiveNavItem(navItem);
              }}
            >
              <div className={cn('flex flex-col gap-2 items-center justify-start p-4 rounded-lg relative')}>
                {activeNavItem?.href === navItem.href && (
                  <motion.div
                    layoutId="activeNav"
                    id="activeNav"
                    className="inset-0 absolute bg-lightPale shadow-sm rounded-lg"
                  />
                )}
                <div className="z-10 relative">
                  {navItem.name === 'Chat' && notificationCount > 0 && (
                    <motion.div
                      animate={{ scale: [0, 1] }}
                      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange z-20 flex items-center justify-center"
                    >
                      <div className="text-xs font-medium text-white">{notificationCount}</div>
                    </motion.div>
                  )}
                  <navItem.icon size={48} className="relative z-10" />
                </div>
                <div className="text-md font-medium relative z-10">{navItem.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Account */}
        <div className="flex items-center justify-between gap-2 p-2 mb-2 rounded-2xl bg-white shadow-sm">
          <Link href="/app/settings/account" onClick={() => setActiveNavItem(undefined)}>
            <div className="flex gap-2 items-center">
              {isLoading ? (
                <div className="w-10 h-10 flex items-center justify-center bg-ash/10 rounded-full">
                  <Loader className="animate-spin" size={16} />
                </div>
              ) : (
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback>{profile?.full_name?.charAt(0) ?? profile?.email?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className="font-medium text-xs">{profile?.full_name}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="bg-light flex-1 overflow-y-auto overflow-x-auto xl:overflow-x-hidden no-scroll shadow my-2 mr-2 xl:ml-0 ml-2 rounded-2xl">
        {children}
      </div>

      {/* Mobile nav */}
      <div className="xl:hidden flex justify-around items-center gap-2 rounded-2xl bg-light shadow-sm mx-2 mb-2">
        {navItemList.map((navItem) => (
          <Link href={navItem.href} key={navItem.href} onClick={() => setActiveNavItem(navItem)}>
            <div className={cn('flex flex-col gap-1 items-center justify-start p-2 relative')}>
              {activeNavItem?.href === navItem.href && (
                <motion.div
                  layoutId="activeNavMobile"
                  id="activeNavMobile"
                  className="inset-0 absolute bg-lightPale shadow-sm rounded-lg"
                />
              )}
              <div className="z-10 relative">
                {navItem.name === 'Chat' && notificationCount > 0 && (
                  <motion.div
                    animate={{ scale: [0, 1] }}
                    transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange z-20 flex items-center justify-center"
                  >
                    <div className="text-xs font-medium text-white">{notificationCount}</div>
                  </motion.div>
                )}
                <navItem.icon size={20} className="relative z-10" />
              </div>
              <div className="text-xs font-medium relative z-10">{navItem.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
