'use client';

import AddRecordSection from './_components/addRecordSection';
import BreakdownChart from './_components/breakdownChart';
import Record from './_components/record';
import useFinancialRecords from './useFinancialRecords';
import MonthSelector from './_components/monthSelector';
import { useRef } from 'react';
import EditRecordDialog from './_components/editRecordDialog';

const Budget = () => {
  const {
    activeMonthIndex,
    setActiveMonthIndex,
    groupedByDate,
    spendingByCategory,
    refetchRecords,
    activeRecord,
    setActiveRecord,
  } = useFinancialRecords();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <div className="">
      <div className="p-4 border-b border-ash/10">
        <h1 className="text-xl font-semibold">Budget</h1>
      </div>
      <MonthSelector {...{ activeMonthIndex, setActiveMonthIndex }} />

      <div className="grid grid-cols-1 xl:grid-cols-2 p-4 lg:p-12 gap-4">
        <div className="flex flex-col gap-4 col-span-1">
          <AddRecordSection {...{ refetchRecords }} />

          <div className="flex flex-col gap-4">
            {!!groupedByDate &&
              Object.keys(groupedByDate).map((dateString) => (
                <div key={dateString}>
                  <p className="text-muted-foreground pb-1 text-sm">{dateString}</p>
                  <div className="flex flex-col gap-3">
                    {groupedByDate[dateString].map((record) => (
                      <Record
                        key={record.id}
                        record={record}
                        onRecordClick={() => {
                          setActiveRecord(record);
                          ref.current?.click();
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          {!!spendingByCategory && <BreakdownChart spendingByCategory={spendingByCategory} />}
        </div>
      </div>

      <EditRecordDialog ref={ref} record={activeRecord} />
    </div>
  );
};

export default Budget;
