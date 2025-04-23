'use client';

import { formatDate } from '@/utils';
import { categoryList } from '@/utils/const';
import { Tables } from '@/utils/supabase/db';
import { useMemo } from 'react';

interface IRecordItem {
  record: Tables<'financial_records'>;
}

const Record = ({ record }: IRecordItem) => {
  const category = useMemo(
    () => categoryList.find((category) => category.title === record.category) || categoryList[categoryList.length - 1],
    [record.category],
  );

  return (
    <div className="w-full flex gap-4 p-4 rounded-lg bg-white justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <p className="text-2xl">{category.icon}</p>
          <p className="text-2xl">{category.title}</p>
        </div>
        <div className="flex gap-2 text-gray-400 items-center">
          <div className="w-4 h-4 rounded-full bg-gray-300"></div>
          <p className="text-sm">{record.note}</p>
        </div>
      </div>
      <div className="flex flex-col justify-center pl-4 text-end">
        <p className="text-xl">{record.amount}</p>
        <p className="text-sm">{formatDate(record.created_at, true)}</p>
      </div>
    </div>
  );
};

export default Record;
