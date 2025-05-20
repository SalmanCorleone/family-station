'use client';

import SimpleLoader from '@/components/simpleLoader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/clsx';
import { useProfile } from '@/utils/context/profileContext';
import { Check, Copy, Pencil, User, UserPlus2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const Members = () => {
  const [copied, setCopied] = useState(false);
  const { members, membersImageMap, family, isLoading } = useProfile();
  const origin = window.location.origin;
  const inviteLink = useMemo(
    () => (family ? `${origin}/app/invite/${family.invitation_token ?? ''}` : ''),
    [family, origin],
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Invite link copied to clipboard');
    } catch (e) {
      console.log(e);
      toast.error('Please copy the link manually');
    }
  };

  if (isLoading) return <SimpleLoader />;

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
              className="col-span-1 flex flex-col items-center justify-center gap-1 p-4 rounded-lg border border-gray-200 relative"
            >
              <div className="absolute top-2 right-2 rounded-md flex items-center justify-center w-8 h-8 border border-gray-200 hover:bg-muted cursor-pointer">
                <Pencil className="h-5 w-5" />
              </div>
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
              <p className="text-sm text-gray-500">{member.profiles?.email}</p>
              <div className="flex items-center gap-2 text-xs text-white">
                <div
                  className={cn('px-2 py-1 rounded-lg bg-lightBlue', {
                    'bg-blue': member.is_owner,
                  })}
                >
                  {member.is_owner ? 'Admin' : 'Member'}
                </div>
                <div
                  className={cn('px-2 py-1 rounded-lg bg-orange', {
                    'bg-green': member.status === 'active',
                  })}
                >
                  {member.status === 'active' ? 'Active' : 'Pending'}
                </div>
              </div>
            </div>
          ))}
          {/* Invite member */}
          <div className="col-span-1 flex flex-col items-center justify-center gap-1 p-4 rounded-lg border border-gray-200">
            <Avatar className="h-20 w-20">
              <AvatarFallback>
                <UserPlus2 />
              </AvatarFallback>
            </Avatar>
            <div className="text-xl font-medium">Invite family member</div>
            <div className="mt-2 mb-4 text-sm text-center">Share this link to allow others to join your team.</div>
            <div className="flex flex-col xl:flex-row gap-2 flex-1">
              <Input value={inviteLink} readOnly className="font-mono text-sm" />
              <Button variant="outline" onClick={copyToClipboard} className="border-gray-200">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Members;
