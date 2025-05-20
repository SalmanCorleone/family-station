import TabSelector from './_components/tabSelector';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <TabSelector />
      {children}
    </div>
  );
};

export default SettingsLayout;
