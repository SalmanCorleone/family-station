'use client';

import AddRecordSection from './_components/addRecordSection';
import Record from './_components/record';
import useFinancialRecords from './useFinancialRecords';
import { useRef } from 'react';
import EditRecordDialog from './_components/editRecordDialog';
import Empty from '@/components/empty';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import PageHeader from '@/components/pageHeader';
import { cn } from '@/utils/clsx';
import { motion } from 'framer-motion';
import BreakdownChart from '@/app/app/(modules)/budget/_components/breakdownChart';
import TimelineChart from '@/app/app/(modules)/budget/_components/timelineChart';
import MonthSelector from '@/app/app/(modules)/budget/_components/monthSelector';
import TabSelector from '@/app/app/(modules)/budget/_components/tabSelector';

const Budget = () => {
  const {
    loading,
    activeMonthIndex,
    setActiveMonthIndex,
    groupedByDate,
    spendingByCategory,
    updateRecord,
    activeRecord,
    setActiveRecord,
    activeTab,
    setActiveTab,
    addRecord,
  } = useFinancialRecords();

  console.log({ groupedByDate });
  const editRecordDialogRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="">
      <PageHeader title="Budget" />
      <div className="flex flex-col gap-4">
        <MonthSelector {...{ activeMonthIndex, setActiveMonthIndex }} />
        <TabSelector {...{ activeTab, setActiveTab }} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
        <div className={cn('flex flex-col gap-4 col-span-1', { 'hidden xl:block': activeTab === 'Stats' })}>
          <AddRecordSection {...{ addRecord }} />

          <div className="flex flex-col gap-4">
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ height: '0%' }}
              animate={{ height: loading ? '100%' : '0%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <Loader className="animate-spin" />
            </motion.div>
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
                          editRecordDialogRef.current?.click();
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {Object.values(spendingByCategory || {})?.length ? (
          <div className={cn('col-span-1 flex flex-col gap-4', { 'hidden xl:flex': activeTab === 'Records' })}>
            {!!spendingByCategory && (
              <BreakdownChart activeMonthIndex={activeMonthIndex} spendingByCategory={spendingByCategory} />
            )}
            {!!groupedByDate && <TimelineChart {...{ groupedByDate, activeMonthIndex }} />}
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
        updateRecord={updateRecord}
      />
    </div>
  );
};

export default Budget;
