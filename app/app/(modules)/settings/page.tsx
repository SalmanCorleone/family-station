import FamilySettings from './_components/familySettings';

const Settings = () => {
  return (
    <div className="flex flex-col p-4 gap-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="flex flex-col gap-4 items-center">
        <FamilySettings />
      </div>
    </div>
  );
};

export default Settings;
