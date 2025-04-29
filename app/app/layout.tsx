import Navigation from '@/components/navigation';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Navigation>{children}</Navigation>
    </div>
  );
};

export default AppLayout;
