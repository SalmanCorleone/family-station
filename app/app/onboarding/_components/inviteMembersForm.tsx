import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface IInviteMembersFormProps {
  inviteLink: string;
  onSubmit: () => void;
}

const InviteMembersForm = ({ inviteLink }: IInviteMembersFormProps) => {
  const [copied, setCopied] = useState(false);
  // const [isGenerating, setIsGenerating] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Invite link copied to clipboard');
    } catch {
      toast.error('Please copy the link manually');
    }
  };
  return (
    <div>
      <div className="border rounded-md">
        <h2>Invite Link</h2>
        <p>Share this link to allow others to join your team.</p>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={inviteLink} readOnly className="font-mono text-sm" />
            <Button variant="outline" onClick={copyToClipboard} className="shrink-0">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy
            </Button>
          </div>
          {/* <div>
            <Button variant="ghost" size="sm" onClick={generateNewLink} disabled={isGenerating} className="text-sm">
              {isGenerating ? (
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-2" />
              )}
              Reset Invite Link
            </Button>
            <p className="text-xs text-muted-foreground mt-1">This will invalidate all previous invite links.</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InviteMembersForm;
