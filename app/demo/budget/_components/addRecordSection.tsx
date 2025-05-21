'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { categoryList } from '@/utils/const';
import { addFinancialRecordSchema } from '@/utils/zod/schemas';
import dayjs from 'dayjs';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AddFinancialRecordPayloadType } from '@/app/app/(modules)/budget/actions';
import { DEMO_DATA } from '../../demoData';
import CategorySelector from '@/app/app/(modules)/budget/_components/categorySelector';
import NoteDialog from '@/app/app/(modules)/budget/_components/noteDialog';
import DateSelector from '@/app/app/(modules)/budget/_components/dateSelector';

const profile = DEMO_DATA.PROFILE;

interface IAddRecordSectionProps {
  addRecord: (payload: AddFinancialRecordPayloadType) => void;
}

const AddRecordSection = ({ addRecord }: IAddRecordSectionProps) => {
  const [activeCategory, setCategory] = useState<CategoryType>(categoryList[0]);
  const [activeDate, setActiveDate] = useState<Date>(dayjs().toDate());
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const submitRecord = useCallback(async () => {
    if (!profile?.id) {
      toast.error('Please try again after logging in');
      return;
    }
    const payload: AddFinancialRecordPayloadType = {
      amount,
      category: activeCategory.title,
      note,
      created_at: activeDate.toISOString(),
      profile_id: profile?.id,
      family_id: profile?.family_id,
      profiles: profile,
    };
    const validatedPayload = addFinancialRecordSchema.safeParse(payload);
    if (validatedPayload.error) {
      console.log(validatedPayload.error.flatten());
      return false;
    }
    setLoading(true);
    addRecord(payload);
    setTimeout(() => {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
      inputRef.current?.focus();
      setAmount(0);
    }, 2000);
  }, [activeCategory.title, activeDate, amount, note, addRecord]);

  const onKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === 'NumpadEnter') {
        e.preventDefault();
        submitRecord();
      }
    },
    [submitRecord],
  );

  return (
    // <div className="flex flex-col gap-4 p-4 rounded-lg bg-white shadow-lg w-full xl:min-w-[35vw] border">
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex justify-between gap-6">
        {/* Left side */}
        <div className="flex flex-col gap-4 items-start">
          <DateSelector
            activeDate={activeDate}
            setActiveDate={(date) => {
              if (date) setActiveDate(date);
            }}
          />
          <NoteDialog {...{ note, setNote }} />
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-2 text-end">
          <CategorySelector activeCategory={activeCategory} setCategory={setCategory} />

          <input
            ref={inputRef}
            autoFocus
            type="number"
            onChange={(e) => setAmount(+e.currentTarget.value)}
            className="text-end p-0 border-0 m-0 text-3xl xl:text-5xl lg:w-72 w-32 pr-2"
            placeholder="Amount"
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      {/* Action button */}
      <div>
        <Button className="w-full" onClick={submitRecord} loading={loading}>
          + Add Record
        </Button>
      </div>
    </Card>
  );
};

export default AddRecordSection;
