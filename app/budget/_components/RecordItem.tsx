'use client';

import { formatDate } from '@/utils';
import { Tables } from '@/utils/supabase/db';

interface IRecordItem {
  record: Tables<'financial_records'>;
}

const RecordItem = ({ record }: IRecordItem) => {
  return (
    <div className="w-full flex gap-4 p-4 rounded-lg border justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-2xl">{record.category}</p>
        <p className="text-sm">{record.note}</p>
        <p className="text-sm">{formatDate(record.created_at, true)}</p>
      </div>

      <div className="flex flex-col justify-center pl-4">
        <p className="text-xl">{record.amount}</p>
      </div>
    </div>
  );
};

export default RecordItem;
