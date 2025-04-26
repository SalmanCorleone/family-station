'use client';

import { useCallback, useRef, useState } from 'react';
import { createRecord } from '../api';
import { categoryList } from '@/utils/const';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tables } from '@/utils/supabase/db';
import CategorySelector from './categorySelector';
import DateSelector from './dateSelector';
import dayjs from 'dayjs';
import NoteDialog from './noteDialog';

const AddRecordSection = () => {
  const [activeCategory, setCategory] = useState<CategoryType>(categoryList[0]);
  const [activeDate, setActiveDate] = useState<Date>(dayjs().toDate());
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateData = useCallback((): Tables<'financial_records'> | null => {
    if (!amount) {
      toast.error('Invalid amount!');
      return null;
    } else if (!activeCategory?.title) {
      toast.error('Please select a category!');
      return null;
    }
    return {
      category: activeCategory.title,
      amount,
      user_id: 1234, // todo: fix user_id
      note,
      created_at: activeDate.toISOString(),
    };
  }, [amount, activeCategory?.title, activeDate, note]);

  const submitRecord = useCallback(async () => {
    const validatedPayload = validateData();
    if (!validatedPayload) return;
    setLoading(true);
    const res = await createRecord(validatedPayload);
    if (res) {
      toast.success('Record added successfully!');
    } else {
      toast.error('Oops! Something went wrong!');
    }
    if (inputRef.current) inputRef.current.value = '';
    inputRef.current?.focus();
    setAmount(0);
    setLoading(false);
  }, [validateData]);

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
              className="text-end p-0 border-0 m-0 text-5xl lg:w-72 w-32 pr-2"
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
