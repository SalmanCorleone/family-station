'use client';

import { useState } from 'react';
import { createRecord } from '../api';
import { categoryList } from '@/utils/const';
import ReactModal from 'react-modal';
import Modal from '@/components/Modal';

ReactModal.setAppElement('.budget-screen');

const InputSection = () => {
  const [activeCategory, setCategory] = useState<CategoryType>(categoryList[0]);
  const [isCategorySelectorOpen, setCategorySelectorOpen] = useState(false);

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      e.preventDefault();
      await createRecord({
        category: 'test',
        amount: +e.currentTarget.value,
        user_id: 1234,
        note: 'test',
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded border">
      <div className="flex justify-between gap-6">
        {/* Left side */}
        <div className="flex flex-col gap-2">
          <div>Category</div>

          <div
            className="border rounded border-gray-400 p-2 flex gap-2 items-center cursor-pointer"
            onClick={() => setCategorySelectorOpen(true)}
          >
            <div>{activeCategory.icon}</div>
            <div>{activeCategory.title}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-end">
          <p>Amount</p>
          <input type="number" className="text-end p-0 border-0 m-0 text-5xl" placeholder="0" onKeyDown={onKeyDown} />
        </div>
      </div>

      <Modal isOpen={isCategorySelectorOpen} handleClose={() => setCategorySelectorOpen(false)}>
        {categoryList.map((category) => (
          <div
            key={category.title}
            className="flex gap-2 p-4 rounded border"
            onClick={() => {
              setCategory(category);
              setCategorySelectorOpen(false);
            }}
          >
            <div>{category.icon}</div>
            <div>{category.title}</div>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default InputSection;
