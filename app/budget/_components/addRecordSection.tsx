'use client';

import { useCallback, useRef, useState } from 'react';
import { createRecord } from '../api';
import { categoryList } from '@/utils/const';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Tables } from '@/utils/supabase/db';

const AddRecordSection = () => {
  const [activeCategory, setCategory] = useState<CategoryType>(categoryList[0]);
  const [amount, setAmount] = useState<number>(0);
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
      user_id: 1234,
      note: activeCategory.title,
    };
  }, [amount, activeCategory?.title]);

  const onKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === 'NumpadEnter') {
        e.preventDefault();
        const validatedPayload = validateData();
        if (!validatedPayload) return;
        await createRecord(validatedPayload);
      }
    },
    [validateData],
  );

  const submitRecord = useCallback(async () => {
    const validatedPayload = validateData();
    if (!validatedPayload) return;
    const res = await createRecord(validatedPayload);
    console.log({ res });
    if (res) {
      toast.success('Record added successfully!');
    } else {
      toast.error('Oops! Something went wrong!');
    }
    if (inputRef.current) inputRef.current.value = '';
    inputRef.current?.focus();
  }, [validateData]);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-white shadow-lg w-full lg:w-[35vw]">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-6">
          {/* Left side */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-400">Category</p>
            <Dialog>
              <DialogTrigger asChild>
                <div className="rounded-lg py-1 px-2 flex gap-2 items-center cursor-pointer border">
                  <div className="rounded-full flex items-center justify-center">{activeCategory.icon}</div>
                  <div className="">{activeCategory.title}</div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeCategory.color }} />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-light">
                <DialogHeader>
                  <DialogTitle>Pick a category</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  {categoryList.map((category) => (
                    <DialogClose key={category.title}>
                      <div
                        className="flex gap-2 p-4 rounded-lg shadow-xs bg-white hover:bg-blue-50"
                        onClick={() => {
                          setCategory(category);
                        }}
                      >
                        <div>{category.icon}</div>
                        <div>{category.title}</div>
                      </div>
                    </DialogClose>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right side */}
          <div className="flex flex-col gap-2 text-end">
            <p className="text-sm text-gray-400">Amount</p>
            <input
              ref={inputRef}
              autoFocus
              type="number"
              onChange={(e) => setAmount(+e.currentTarget.value)}
              className="text-end p-0 border-0 m-0 text-5xl w-full pr-2"
              placeholder="0"
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
        {/* Action button */}
        <div>
          <Button className="w-full" onClick={submitRecord}>
            + Add Record
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddRecordSection;
