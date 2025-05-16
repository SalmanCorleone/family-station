import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { inviteFormSchema } from '@/utils/zod/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy, PlusCircle, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { motion, cubicBezier } from 'framer-motion';

interface IInviteMembersFormProps {
  inviteLink: string;
  onSubmit: () => void;
}

type FormValues = z.infer<typeof inviteFormSchema>;

const InviteMembersForm = ({ inviteLink, onSubmit }: IInviteMembersFormProps) => {
  const [copied, setCopied] = useState(false);

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      invitees: [{ email: '' }],
    },
    // mode: 'onChange',
  });
  const { fields, append, remove } = useFieldArray({
    name: 'invitees',
    control: form.control,
  });

  const handleSubmit = (data: FormValues) => {
    // Here I would send the invitations to your API
    console.log('Sending invitations to:', data.invitees);
    toast.success('Invitations sent successfully!');

    // Reset form after successful submission
    form.reset({
      invitees: [{ email: '' }],
    });
  };

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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: cubicBezier(0.77, 0, 0.175, 1), duration: 0.3 }}
      className="flex flex-col gap-4 pb-8"
    >
      <div className="bg-white shadow rounded-md p-4">
        <h2 className="font-bold text-2xl">Invite Link</h2>
        <p className="mt-2 mb-4 text-sm">Share this link to allow others to join your team.</p>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={inviteLink} readOnly className="font-mono text-sm" />
            <Button variant="outline" onClick={copyToClipboard} className="shrink-0">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow p-4 rounded-md">
        <h2 className="font-bold text-2xl">Invite Family Members</h2>
        <p className="mt-2 mb-4 text-sm">Send invitations to your family members to collaborate on this app.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`invitees.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} type="email" placeholder="colleague@example.com" className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fields.length > 1 && remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ email: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add more
              </Button>
            </div>
            <div className="mt-4 flex flex-row justify-end">
              <Button type="submit" className="ml-auto">
                <Send className="mr-2 h-4 w-4" />
                Send Invitations
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Button onClick={onSubmit}>Let&apos;s go!</Button>
    </motion.div>
  );
};

export default InviteMembersForm;
