import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { forwardRef, Ref, useState } from 'react';
import { FinancialRecord } from '../actions';

interface IEditRecordDialogProps {
  record?: FinancialRecord;
}

const EditRecordDialog = forwardRef(({ record }: IEditRecordDialogProps, ref: Ref<HTMLButtonElement>) => {
  const [open, setOpen] = useState(false);

  // const onkeydown = useCallback(
  //   async (e: React.KeyboardEvent<HTMLInputElement>) => {
  //     if (e.key === 'Enter' || e.key === 'NumpadEnter') {
  //       e.preventDefault();
  //       setOpen(false);
  //     }
  //   },
  //   [setOpen],
  // );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden" variant={'secondary'} ref={ref} />
      </DialogTrigger>
      <DialogContent className="bg-light max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        {record && (
          <div>
            <p>{record.category}</p>
            <p>{record.amount}</p>
            <p>{record.profile_id}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

EditRecordDialog.displayName = 'EditRecordDialog';

export default EditRecordDialog;
