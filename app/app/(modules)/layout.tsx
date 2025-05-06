import Navigation from '@/components/navigation';
import { getProfile } from './account/api';

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const profile = await getProfile();
  if (!profile) {
    return <div>no profile</div>;
  }

  return <Navigation profile={profile}>{children}</Navigation>;
};

export default AppLayout;
