'use client';

import { useProfile } from '@/utils/context/profileContext';

const Account = () => {
  const { profile } = useProfile();

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-2xl font-bold">My Account</h1>
      <div className="flex items-center justify-center border p-4">
        <div className="flex flex-col gap-4 bg-white rounded-lg p-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Email</p>
            <p className="text-sm">{profile?.email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm">Name</p>
            <p className="text-sm">{profile?.full_name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm">Phone</p>
            <p className="text-sm">{profile?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
