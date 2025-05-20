'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useProfile } from '@/utils/context/profileContext';
import { User } from 'lucide-react';

const Members = () => {
  const { members, membersImageMap } = useProfile();

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Family Members</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {members?.map((member) => (
            <div
              key={member.id}
              className="col-span-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-gray-300"
            >
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={membersImageMap && member?.profile_id ? membersImageMap[member.profile_id] : undefined}
                  alt={member.profiles?.full_name ?? 'Member'}
                />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <p className="text-xl font-medium">{member.profiles?.full_name}</p>
              <p className="">{member.profiles?.email}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Members;
