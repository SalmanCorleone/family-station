'use client';

import { cn } from '@/lib/utils';
import { navItemList } from '@/utils/const';
import { CircleUserRound, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col xl:flex-row gap-4 xl:p-4 h-screen bg-pale">
      <div className="hidden xl:flex flex-col rounded-2xl">
        {/* Header */}
        <Link href="/">
          <div className="flex items-center justify-center gap-2 py-8 pr-8">
            {/* <Heart size={32} fill="var(--color-orange)" /> */}
            <p className="text-3xl">Family Station</p>
          </div>
        </Link>

        {/* Nav items */}
        <div className="flex-1 flex flex-col justify-center">
          {navItemList.map((navItem) => (
            <Link href={navItem.href} key={navItem.href}>
              <div
                className={cn('flex gap-2 items-center justify-start p-4 rounded-lg', {
                  'bg-lightPale': pathname === navItem.href,
                })}
              >
                <navItem.icon size={16} />
                <div>{navItem.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Account */}
        <div className="flex items-center justify-between gap-2 py-4 px-4">
          <Link href="/account">
            <div className="flex gap-2 items-center">
              <CircleUserRound />
              <p className="">User name</p>
            </div>
          </Link>

          <Link href="/settings">
            <div className="">
              <Settings2 />
            </div>
          </Link>
        </div>
      </div>
      <div className="bg-light flex-1 xl:rounded-2xl overflow-y-auto no-scroll">{children}</div>
    </nav>
  );
};

export default Navigation;
