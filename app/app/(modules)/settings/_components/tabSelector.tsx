'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TabSelector = () => {
  const pathname = usePathname();
  const activeTab = pathname.split('/').pop();

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <Link href={'/app/settings/account'} className="flex">
          <TabsTrigger value="account">Account</TabsTrigger>
        </Link>
        <Link href={'/app/settings/family'} className="flex">
          <TabsTrigger value="family">Family</TabsTrigger>
        </Link>
        <Link href={'/app/settings/members'} className="flex">
          <TabsTrigger value="members">Members</TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
};

export default TabSelector;
