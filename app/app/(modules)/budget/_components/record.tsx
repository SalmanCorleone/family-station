'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { categoryList } from '@/utils/const';
import { useMemo } from 'react';
import { useProfile } from '@/utils/context/profileContext';

interface IRecordItem {
  record: FinancialRecordType;
  onRecordClick: () => void;
}

const Record = ({ record, onRecordClick }: IRecordItem) => {
  const { membersImageMap } = useProfile();
  const avatarURLFromContext = useMemo(
    () => (record.profile_id ? membersImageMap?.[record.profile_id] : undefined),
    [record.profile_id, membersImageMap],
  );
  const category = useMemo(
    () => categoryList.find((category) => category.title === record.category) || categoryList[categoryList.length - 1],
    [record.category],
  );

  return (
    <div
      className="w-full flex gap-4 p-4 rounded-lg bg-white justify-between shadow-xs cursor-pointer"
      onClick={onRecordClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <p className="text-2xl">{category.icon()}</p>
          <p className="text-2xl">{category.title}</p>
          <Avatar style={{ width: 24, height: 24 }}>
            <AvatarImage src={avatarURLFromContext || undefined} />
            <AvatarFallback>{record.profiles?.full_name?.charAt(0) ?? '😊'}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex gap-2 text-gray-400 items-center">
          {record.note && <p className="text-sm">&quot;{record.note}&quot;</p>}
        </div>
      </div>
      <div className="flex flex-col justify-center pl-4 text-end">
        <p className="text-3xl font-medium">${record.amount}</p>
      </div>
    </div>
  );
};

export default Record;
