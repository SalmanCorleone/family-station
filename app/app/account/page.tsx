// 'use cache';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getProfile } from './api';

const Account = async () => {
  const profile = await getProfile();

  if (!profile) {
    return <div>no profile</div>;
  }

  return (
    <div>
      <div>{profile.full_name}</div>
      <div>
        <Avatar>
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback>{profile.full_name?.charAt(0) ?? profile.email?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Account;
