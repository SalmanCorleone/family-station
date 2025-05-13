'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const TabSelector = () => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <Link href={'/app/settings/account'} className="flex">
          <TabsTrigger value="account">Account</TabsTrigger>
        </Link>
        <Link href={'/app/settings/family'} className="flex">
          <TabsTrigger value="workspace">Family</TabsTrigger>
        </Link>
        <Link href={'/app/settings/members'} className="flex">
          <TabsTrigger value="members">Members</TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
};

export default TabSelector;
