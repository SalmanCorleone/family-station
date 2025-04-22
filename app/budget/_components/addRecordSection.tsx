'use client';

import { useCallback, useState } from 'react';
import { createRecord } from '../api';
import { categoryList } from '@/utils/const';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AddRecordSection = () => {
  const [activeCategory, setCategory] = useState<CategoryType>(categoryList[0]);
  const [amount, setAmount] = useState<number>(0);

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      e.preventDefault();
      await createRecord({
        category: activeCategory.title,
        amount: +e.currentTarget.value,
        user_id: 1234,
        note: activeCategory.title,
      });
    }
  };

  const submitRecord = useCallback(async () => {
    const res = await createRecord({
      category: activeCategory.title,
      amount,
      user_id: 1234,
      note: 'note time',
    });
    if (res) {
    }
  }, [activeCategory, amount]);

  return (
    <div className="flex flex-col gap-4 p-4 rounded bg-light shadow-lg w-full lg:w-[35vw]">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-6">
          {/* Left side */}
          <div className="flex flex-col gap-2">
            <div>Category</div>
            <Dialog>
              <DialogTrigger asChild>
                <div className="rounded py-1  flex gap-2 items-center cursor-pointer">
                  <div
                    className="rounded-full pb-0.5 w-8 h-8 flex items-center justify-center"
                    style={{ backgroundColor: activeCategory.color }}
                  >
                    {activeCategory.icon}
                  </div>
                  <div>{activeCategory.title}</div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Pick a category</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  {categoryList.map((category) => (
                    <DialogClose key={category.title}>
                      <div
                        className="flex gap-2 p-4 rounded-lg shadow-xs hover:bg-lightBlue"
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
            <p>Amount</p>
            <input
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

      {/* <Modal isOpen={isCategorySelectorOpen} handleClose={() => setCategorySelectorOpen(false)}>
        <div className="flex flex-col gap-4">
          <p>Pick a category</p>
          {categoryList.map((category) => (
            <div
              key={category.title}
              className="flex gap-2 p-4 rounded-lg border"
              onClick={() => {
                setCategory(category);
                setCategorySelectorOpen(false);
              }}
            >
              <div>{category.icon}</div>
              <div>{category.title}</div>
            </div>
          ))}
        </div>
      </Modal> */}

      {/* Category selector Dialog */}
    </div>
  );
};

export default AddRecordSection;
