import Navigation from '@/components/navigation';
import { getProfile } from './account/api';

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const profile = await getProfile();
  if (!profile) {
    return <div>no profile</div>;
  }

  return (
    <div className="">
      <Navigation profile={profile}>{children}</Navigation>
    </div>
  );
};

export default AppLayout;
