'use client';

import AddRecordSection from './_components/addRecordSection';
import BreakdownChart from './_components/breakdownChart';
import Record from './_components/record';
import useFinancialRecords from './useFinancialRecords';
import MonthSelector from './_components/monthSelector';
import { useRef } from 'react';
import EditRecordDialog from './_components/editRecordDialog';
import Empty from '@/components/empty';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';

const Budget = () => {
  const {
    loading,
    activeMonthIndex,
    setActiveMonthIndex,
    groupedByDate,
    spendingByCategory,
    refetchRecords,
    activeRecord,
    setActiveRecord,
  } = useFinancialRecords();
  const editRecordDialogRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="">
      <div className="p-4 border-b border-ash/10">
        <h1 className="text-xl font-semibold">Budget</h1>
      </div>
      <MonthSelector {...{ activeMonthIndex, setActiveMonthIndex }} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
        <div className="flex flex-col gap-4 col-span-1">
          <AddRecordSection {...{ refetchRecords }} />

          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col mt-8 items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            ) : (
              !!groupedByDate &&
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
                          editRecordDialogRef.current?.click();
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {Object.values(spendingByCategory || {})?.length ? (
          <div className="col-span-1 flex flex-col">
            {!!spendingByCategory && <BreakdownChart spendingByCategory={spendingByCategory} />}
          </div>
        ) : (
          <Card className="col-span-1">
            <Empty text="No records yet. Add some!" />
          </Card>
        )}
      </div>

      <EditRecordDialog
        ref={editRecordDialogRef}
        record={activeRecord}
        setRecord={setActiveRecord}
        onSubmit={refetchRecords}
      />
    </div>
  );
};

export default Budget;
