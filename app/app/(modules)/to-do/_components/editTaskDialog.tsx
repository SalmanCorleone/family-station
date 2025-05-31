import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/utils';
import { cn } from '@/utils/clsx';
import { useProfile } from '@/utils/context/profileContext';
import { Tables } from '@/utils/supabase/db';
import { User, Zap } from 'lucide-react';
import { forwardRef, Ref, useCallback, useEffect, useState } from 'react';
import { updateTask } from '../action';
import { toast } from 'sonner';

interface IEditTaskDialogProps {
  task?: Tables<'tasks'>;
  onSubmit: () => void;
}

const EditTaskDialog = forwardRef(({ task, onSubmit }: IEditTaskDialogProps, ref: Ref<HTMLButtonElement>) => {
  const [open, setOpen] = useState(false);
  const { membersImageMap, members } = useProfile();
  const activeMembers = members?.filter((member) => member.status === 'active');
  const createdBy = members?.find((member) => member.profile_id === task?.created_by);
  const [localTask, setLocalTask] = useState<Tables<'tasks'>>({} as Tables<'tasks'>);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!task) return;
    setLocalTask({
      ...task,
    });
  }, [task]);

  const saveChanges = useCallback(async () => {
    if (!localTask.id) return;
    setSaving(true);
    try {
      const res = await updateTask(localTask);
      if (!res) {
        toast.error('Oops! Something went wrong!');
      } else {
        onSubmit();
        toast.success('Task updated successfully!');
      }
    } finally {
      setSaving(false);
      setOpen(false);
    }
  }, [localTask, onSubmit]);

  const onkeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      e.preventDefault();
      saveChanges();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden" variant={'secondary'} ref={ref} />
      </DialogTrigger>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        {task && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  size={'sm'}
                  variant={'secondary'}
                  onClick={() => setLocalTask((prev) => ({ ...prev, is_urgent: !prev.is_urgent }))}
                  className={cn({ 'bg-orange text-white hover:bg-orange/80': localTask?.is_urgent })}
                >
                  {localTask?.is_urgent && <Zap fill="var(--color-orange)" />}{' '}
                  {localTask?.is_urgent ? 'Urgent' : 'Mark as urgent'}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size={'sm'} variant={'secondary'} className="text-orange">
                  Delete
                </Button>
              </div>
            </div>
            <div>
              <Input
                placeholder="Title"
                className="w-full text-3xl xl:text-4xl h-min border-0 border-b pb-2"
                value={localTask.title ?? ''}
                onChange={(e) => setLocalTask((prev) => ({ ...prev, title: e.target.value }))}
                onKeyDown={onkeydown}
              />
            </div>

            <div className="">
              <p className="font-semibold">Assigned to</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <div
                  onClick={() => setLocalTask((prev) => ({ ...prev, assigned_to: null }))}
                  className={cn('border-2 border-white p-1 rounded-full cursor-pointer', {
                    'border-2 border-green': !localTask?.assigned_to,
                  })}
                >
                  <Avatar style={{ width: 32, height: 32 }}>
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </div>
                {activeMembers?.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setLocalTask((prev) => ({ ...prev, assigned_to: member.profile_id }))}
                    className={cn('border-2 border-white p-1 rounded-full cursor-pointer', {
                      'border-green': member.profile_id === localTask?.assigned_to,
                    })}
                  >
                    <Avatar style={{ width: 32, height: 32 }}>
                      <AvatarImage src={member.profile_id ? membersImageMap?.[member.profile_id] : undefined} />
                      <AvatarFallback>{member.profiles?.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <div className="flex gap-2">
                <p>Created by {createdBy?.profiles?.full_name}</p>
              </div>
              <p>Created at {formatDate(localTask.created_at ?? undefined, true)}</p>
              <p>Last updated at {formatDate(localTask.updated_at ?? undefined, true)}</p>
            </div>

            <Button loading={saving} onClick={saveChanges}>
              Save Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

EditTaskDialog.displayName = 'EditTaskDialog';

export default EditTaskDialog;
