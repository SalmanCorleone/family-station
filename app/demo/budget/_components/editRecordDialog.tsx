import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { categoryList } from '@/utils/const';
import dayjs from 'dayjs';
import { forwardRef, Ref, useCallback, useEffect, useState } from 'react';
import NoteDialog from '@/app/app/(modules)/budget/_components/noteDialog';
import CategorySelector from '@/app/app/(modules)/budget/_components/categorySelector';
import DateSelector from '@/app/app/(modules)/budget/_components/dateSelector';

interface IEditRecordDialogProps {
  record?: FinancialRecordType;
  setRecord: (record?: FinancialRecordType) => void;
  updateRecord: (id: FinancialRecordType['id'], payload: AddFinancialRecordPayloadType) => void;
}

const EditRecordDialog = forwardRef(
  ({ record, setRecord, updateRecord }: IEditRecordDialogProps, ref: Ref<HTMLButtonElement>) => {
    const [open, setOpen] = useState(false);
    const [localRecord, setLocalRecord] = useState<FinancialRecordType>({} as FinancialRecordType);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
      if (!record) return;
      setLocalRecord({
        ...record,
      });
    }, [record]);

    const onOpenChange = (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        setRecord(undefined);
        setOpen(false);
        setLocalRecord({} as FinancialRecordType);
      }
    };

    const handleUpdate = useCallback(() => {
      if (!record) return;
      setLoading(true);
      const payload: AddFinancialRecordPayloadType = {
        ...localRecord,
        amount: localRecord?.amount,
        category: localRecord?.category,
        note: localRecord?.note,
        created_at: localRecord?.created_at,
        profile_id: localRecord?.profile_id,
        family_id: localRecord?.family_id,
      };
      updateRecord(record.id, payload);
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 2000);
    }, [record, localRecord, updateRecord]);

    /**
     * Enter key listener, Saves changes on enter
     */
    useEffect(() => {
      const listener = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
          e.preventDefault();
          handleUpdate();
        }
      };
      document.addEventListener('keydown', listener);
      return () => {
        document.removeEventListener('keydown', listener);
      };
    }, [handleUpdate]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button className="hidden" variant={'secondary'} ref={ref} />
        </DialogTrigger>
        <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex justify-between gap-6">
              {/* Left side */}
              <div className="flex flex-col gap-4 items-start">
                <DateSelector
                  activeDate={dayjs(localRecord?.created_at).toDate()}
                  setActiveDate={(date) => {
                    if (date) setLocalRecord({ ...localRecord, created_at: dayjs(date).toISOString() });
                  }}
                />
                <NoteDialog
                  note={localRecord?.note ?? ''}
                  setNote={(note) => setLocalRecord((prev) => ({ ...prev, note }))}
                />
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-2 text-end">
                <CategorySelector
                  activeCategory={categoryList.find((c) => c.title === localRecord?.category) ?? categoryList[0]}
                  setCategory={(category) => setLocalRecord((prev) => ({ ...prev, category: category.title }))}
                />

                <input
                  type="number"
                  defaultValue={localRecord?.amount || 0}
                  onChange={(e) => setLocalRecord((prev) => ({ ...prev, amount: +e.currentTarget.value }))}
                  className="text-end p-0 border-0 m-0 text-3xl xl:text-5xl lg:w-72 w-32 pr-2"
                  placeholder="Amount"
                />
              </div>
            </div>

            <Button
              disabled={!localRecord?.amount || loading}
              loading={loading}
              className="w-full"
              onClick={handleUpdate}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

EditRecordDialog.displayName = 'EditRecordDialog';

export default EditRecordDialog;
