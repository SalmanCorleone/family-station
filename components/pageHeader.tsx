'use client';

import { useProfile } from '@/utils/context/profileContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

interface IPageHeaderProps {
  title: string;
  renderLeft?: () => React.ReactNode;
  renderRight?: () => React.ReactNode;
}

const PageHeader = ({ title, renderLeft, renderRight }: IPageHeaderProps) => {
  const { profile } = useProfile();
  const { back } = useRouter();
  // const canGoBack = window.history.length > 1;

  const commonRenderRight = () => {
    return (
      <Link href={'/app/settings/account'}>
        <div className="xl:hidden flex">
          <Avatar style={{ width: 40, height: 40 }}>
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </Link>
    );
  };
  return (
    <div className="flex items-center p-4 border-b border-gray-200 justify-between">
      <div className="flex items-center gap-4">
        <Button variant={'ghost'} onClick={back} className="w-6 xl:hidden flex">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
        <div>{renderLeft?.()}</div>
      </div>
      <div>{renderRight?.() || commonRenderRight()}</div>
    </div>
  );
};

export default PageHeader;
