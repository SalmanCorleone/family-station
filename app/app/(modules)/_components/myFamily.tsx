'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Badge from '@/components/ui/badge';
import { useProfile } from '@/utils/context/profileContext';

const MyFamily = () => {
  const { family, members } = useProfile();

  return (
    <div className="rounded-lg p-4 col-span-4 row-span-1">
      <p className="text-lg font-medium">Family: {family?.title}</p>

    <div className="mt-2">
        {members?.length ? (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {members.map((member) => (
              <div key={member.id} className="flex flex-col shadow-sm gap-1 p-4 rounded-lg bg-white">
                <div className="flex justify-between">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.profiles?.full_name?.charAt(0) ?? member.profiles?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex gap-2">
                    {!!member.is_owner && <Badge className="bg-blue text-light">Admin</Badge>}
                    {!!member.status && <Badge>Active</Badge>}
                  </div>
                </div>

                <p className="font-medium">{member.profiles?.full_name}</p>
                <p className="text-xs text-gray-400">{member.email}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyFamily;
