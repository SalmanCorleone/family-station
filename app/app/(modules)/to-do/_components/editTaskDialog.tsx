import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tables } from '@/utils/supabase/db';
import { forwardRef, Ref, useCallback, useState } from 'react';

const EditTaskDialog = forwardRef(({ task }: { task?: Tables<'tasks'> }, ref: Ref<HTMLButtonElement>) => {
  const [open, setOpen] = useState(false);

  const onkeydown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === 'NumpadEnter') {
        e.preventDefault();
        setOpen(false);
      }
    },
    [setOpen],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden" variant={'secondary'} ref={ref} />
      </DialogTrigger>
      <DialogContent className="bg-light max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        {task && (
          <div>
            <p>{task.title}</p>
            <p>{task.index}</p>
            <p>{task.is_completed}</p>
            <p>{task.list_id}</p>
            <p>{task.updated_at}</p>
            <p>{task.created_at}</p>
            <p>{task.created_by}</p>
            <p>{task.assigned_to}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

EditTaskDialog.displayName = 'EditTaskDialog';

export default EditTaskDialog;
