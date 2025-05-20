import Navigation from '@/components/navigation';

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  return <Navigation>{children}</Navigation>;
};

export default AppLayout;
