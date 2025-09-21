import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/utils';
import { cn } from '@/utils/clsx';
import { Tables } from '@/utils/supabase/db';
import { ShieldQuestion, TrashIcon, User, Zap } from 'lucide-react';
import { forwardRef, Ref, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TaskType } from '@/app/app/(modules)/to-do/action';
import { DEMO_DATA } from '../../demoData';

interface IEditTaskDialogProps {
  task?: TaskType;
  onSubmit: (task: TaskType) => void;
  handleTaskDelete: () => void;
}

const { MEMBERS: members, MEMBERS_IMAGE_MAP: membersImageMap } = DEMO_DATA;

const EditTaskDialog = forwardRef(
  ({ task, onSubmit, handleTaskDelete }: IEditTaskDialogProps, ref: Ref<HTMLButtonElement>) => {
    const [open, setOpen] = useState(false);
    const activeMembers = members.filter((member) => member.status === 'active');
    const createdBy = members.find((member) => member.profile_id === task?.created_by);
    const [localTask, setLocalTask] = useState<Tables<'tasks'>>({} as Tables<'tasks'>);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
      if (!task) return;
      setLocalTask({
        ...task,
      });
    }, [task]);

    const saveChanges = useCallback(async () => {
      if (!localTask.id) return;
      setSaving(true);
      onSubmit(localTask);
      setTimeout(() => {
        toast.success('Task updated successfully!');
        setSaving(false);
        setOpen(false);
      }, 2000);
    }, [localTask, onSubmit]);

    const onkeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === 'NumpadEnter') {
        e.preventDefault();
        saveChanges();
      }
    };

    const onDeleteClick = () => {
      setDeleting(true);
      setTimeout(() => {
        setDeleting(false);
        setOpen(false);
        handleTaskDelete();
      }, 1000);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="hidden" variant={'secondary'} ref={ref} />
        </DialogTrigger>
        <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {localTask && (
            <div className="flex flex-col gap-4">
              {/* HEader Buttons */}
              <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                  <Button
                    size={'sm'}
                    variant={'secondary'}
                    onClick={() => setLocalTask((prev) => ({ ...prev, is_urgent: !prev.is_urgent }))}
                    className={cn({ 'bg-orange text-white hover:bg-orange/80': localTask?.is_urgent })}
                    title={localTask?.is_urgent ? 'Urgent' : 'Mark as Urgent'}
                    icon={<Zap />}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    loading={deleting}
                    onClick={onDeleteClick}
                    size={'sm'}
                    variant={'secondary'}
                    className="text-orange"
                    title="Delete"
                    icon={<TrashIcon />}
                  />
                </div>
              </div>

              {/* Title */}
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
                        <ShieldQuestion />
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
                        <AvatarImage
                          src={(membersImageMap as Record<string, string>)?.[member.profile_id] || undefined}
                        />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
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
  },
);

EditTaskDialog.displayName = 'EditTaskDialog';

export default EditTaskDialog;
