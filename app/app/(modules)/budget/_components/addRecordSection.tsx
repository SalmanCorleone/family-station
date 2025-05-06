'use client';

import { useCallback, useRef, useState } from 'react';
import { categoryList } from '@/utils/const';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tables } from '@/utils/supabase/db';
import CategorySelector from './categorySelector';
import DateSelector from './dateSelector';
import dayjs from 'dayjs';
import NoteDialog from './noteDialog';
import { useProfile } from '@/utils/context/profileContext';

interface IAddRecordSectionProps {
  onSubmit: (record: Partial<Tables<'financial_records'>>) => Promise<boolean>;
}

const AddRecordSection = ({ onSubmit }: IAddRecordSectionProps) => {
  const [activeCategory, setCategory] = useState<CategoryType>(categoryList[0]);
  const [activeDate, setActiveDate] = useState<Date>(dayjs().toDate());
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const { profile } = useProfile();
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
    };
    setLoading(true);
    const res = await onSubmit(payload);
    if (!res) {
      toast.error('Oops! Something went wrong!');
    }
    if (inputRef.current) inputRef.current.value = '';
    inputRef.current?.focus();
    setAmount(0);
    setLoading(false);
  }, [profile, activeCategory.title, activeDate, amount, note, onSubmit]);

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
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-white shadow-lg w-full xl:min-w-[35vw]">
      <div className="flex flex-col gap-4">
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
      </div>
    </div>
  );
};

export default AddRecordSection;
